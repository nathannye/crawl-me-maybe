# @crawl-me-maybe/sitemap

Most sitemap generators either crawl your built site, scan your filesystem, or expect you to be using a specific framework.

This package takes a simpler approach. You provide routes, it generates sitemap.xml and robots.txt. Build-time with Vite, runtime from an API route, or both. No crawling, no filesystem scanning, and no strong opinions about where your content lives.

## Features

- Framework agnostic sitemap generation
- Build-time generation with Vite
- Runtime generation for ISR and SSR applications
- Localized sitemaps with hreflang alternates
- Split large sitemaps into numbered child files
- robots.txt generation with sitemap link

## How this package is meant to be used

`@crawl-me-maybe/sitemap` supports two output modes:

- **Build-time generation** with the Vite plugin, which writes `sitemap.xml` and `robots.txt` to disk during your build
- **Runtime generation** with `createSitemapManifest`, `generateSitemap`, `generateSitemapIndex`, and `generateRobotsTxt`, which lets you return XML from a route handler or API endpoint for ISR, SSR, or CMS-backed routes

Both modes use the same sitemap entry shape, so route generation logic can be shared between them.

Use a **single sitemap** when all routes can live in one file. Use **multiple sitemaps** when you want to split by content type or expect to exceed sitemap size limits.

| Situation | Use |
|---|---|
| Static site or known routes at build time | `vitePluginSitemap` |
| ISR / SSR / CMS-backed routes that can change after build | `generateSitemap` in a route handler |
| More than ~50k URLs or separate route families | multiple sitemaps + sitemap index |
| Need `robots.txt` output | `generateRobotsTxt` or Vite plugin `robots` config |

## Table of contents

- [Install](#install)
- [Sitemap entry shape](#sitemap-entry-shape)
- [Locale configuration](#locale-configuration)
- [Vite plugin](#vite-plugin)
- [Runtime generation](#runtime-generation)
- [Low-level primitives](#low-level-primitives)
- [Robots](#robots)
- [Config reference](#config-reference)
- [License](#license)

## Install

```bash
npm install @crawl-me-maybe/sitemap
pnpm add @crawl-me-maybe/sitemap
bun add @crawl-me-maybe/sitemap
yarn add @crawl-me-maybe/sitemap
```

---

## Sitemap entry shape

Sitemap entries are always defined as site-relative paths. The domain is supplied separately via the `domain` option.

```ts
type SitemapEntry = {
  path: string
  lastmod?: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
  imageUrls?: string[]
  videoUrls?: string[]
  locales?: string[]
  localePaths?: Record<string, string>
}
```

Example:

```ts
{
  path: "/blog/hello-world",
  lastmod: "2025-06-01",
  changefreq: "weekly",
  imageUrls: ["https://example.com/images/hello-world.jpg"],
}
```

- `path` should be relative, e.g. `/about`
- the domain is always configured separately via `domain`
- `locales` limits which configured locales a page exists in
- `localePaths` overrides the slug for specific locales when it differs from the default path

---

## Locale configuration

Pass a `SitemapLocaleConfig` object to the Vite plugin, `createSitemapManifest`, or `generateSitemap` to enable automatic locale expansion and hreflang alternates. When `locales` is omitted, the package stays in manual mode and does not expand entries.

```ts
const locales = {
  locales: ["en", "fr"],
  defaultLocale: "en",
  mode: "prefix", // "prefix" | "subdomain" | "domain"
  prefixDefault: false,
  alternates: true,
  xDefault: "en",
  domainByLocale: {
    en: "https://example.com",
    fr: "https://fr.example.com",
  },
};
```

Use `locales` on an individual entry to limit which configured locales it appears in, and `localePaths` to override localized slugs for selected locales.

---

## Vite plugin

Runs on `closeBundle` and writes files to `outDir` (default: `dist`).

### a. Single sitemap

```ts
// vite.config.ts
import { vitePluginSitemap } from "@crawl-me-maybe/sitemap/vite";

export default {
  plugins: [
    vitePluginSitemap({
      domain: "https://example.com",
      outDir: "dist",
      sitemaps: async () => [
        { path: "/", changefreq: "daily", priority: 1 },
        {
          path: "/about",
          lastmod: "2025-01-01",
          changefreq: "monthly",
          priority: 0.8,
        },
        {
          path: "/blog/hello-world",
          lastmod: "2025-06-01",
          changefreq: "weekly",
          imageUrls: ["https://example.com/images/hello-world.jpg"],
          videoUrls: ["https://example.com/videos/hello-world.mp4"],
        },
      ],
    }),
  ],
};
```

Writes `dist/sitemap.xml` and `dist/robots.txt`. When the sitemap fits in a single file, only those two are written — child files like `sitemap-0.xml` are omitted because `sitemap.xml` already contains the full `<urlset>`. Child files are written when the manifest splits into multiple concrete files (see [Build output](#build-output)).

### b. Multiple sitemaps

Split by content type when you want separate route families or expect a sitemap to grow past the default limit. Named sitemap definitions can override `maxUrls` individually, and the plugin will still write the child files and root index automatically.

```ts
// lib/sitemaps.ts
export const sitemaps = {
  pages: {
    entries: async () => [
      { path: "/", changefreq: "daily", priority: 1 },
      { path: "/about", lastmod: "2025-01-01", changefreq: "monthly", priority: 0.8 },
    ],
  },
  blog: async () => [
    {
      path: "/blog/hello",
      lastmod: "2025-06-01",
      changefreq: "weekly",
      imageUrls: ["https://example.com/images/hello.jpg"],
    },
  ],
  products: {
    entries: async () => [
      {
        path: "/products/widget",
        lastmod: "2025-05-15",
        changefreq: "weekly",
        priority: 0.9,
        videoUrls: ["https://example.com/videos/widget.mp4"],
      },
    ],
    maxUrls: 10_000,
  },
} as const;
```

```ts
// vite.config.ts
import { sitemaps } from "@/lib/sitemaps";
import { vitePluginSitemap } from "@crawl-me-maybe/sitemap/vite";

export default {
  plugins: [
    vitePluginSitemap({
      domain: "https://example.com",
      sitemaps,
    }),
  ],
};
```

This writes `sitemap.xml` plus child files like `sitemap-pages-0.xml` and `sitemap-products-0.xml` under `dist/`, along with `robots.txt`.

### Build output

The plugin mirrors `getRootSitemap()` behavior from the runtime manifest:

| Concrete files | `sitemap.xml` | Child files on disk |
|---|---|---|
| 1 (unsplit) | Full `<urlset>` | None — `sitemap-0.xml` is not written |
| 2+ (split or multiple named sitemaps) | `<sitemapindex>` | All child files (`sitemap-0.xml`, `sitemap-pages-0.xml`, etc.) |

Child paths always use the index-always format (`-0`, `-1`, …) so runtime routes stay stable when a sitemap later grows and splits. For static builds, child files are only materialized when the root is a sitemap index.

Register the plugin under `vite.plugins` in `astro.config.mjs` (or `vite.config.ts`), not `integrations`.

### c. With robots

When using the Vite plugin, `robots.txt` is written alongside your sitemap files during the build.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  robots: {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/api/"],
  },
  sitemaps: async () => [{ path: "/" }],
});
```

### d. Localized

See [Locale configuration](#locale-configuration). Works with single or multiple sitemap configs.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  locales: {
    locales: ["en", "fr", "es"],
    defaultLocale: "en",
    mode: "prefix",
  },
  sitemaps: async () => [
    {
      path: "/about",
      locales: ["en", "fr"],
      localePaths: { fr: "/a-propos" },
    },
    { path: "/feed.xml" },
  ],
});
```

---

## Runtime generation

Use `createSitemapManifest` when a route needs to stay stable as content grows. The manifest lazily resolves the sitemap(s) needed for the current request and gives you the root route plus child files from the same shared config.

### `getSitemap()` selectors

- `getSitemap({ index })` — works for any single-definition manifest, named or unnamed.
- `getSitemap({ sitemap, index })` — works when `sitemap` matches a configured key, including when there is only one named sitemap (e.g. `{ pages: ... }` with `{ sitemap: "pages", index: 0 }`).
- When multiple named sitemaps are configured, `sitemap` is required in the selector.

### a. Single sitemap, unsplit

```ts
// app/sitemap.xml/route.ts
import { createSitemapManifest } from "@crawl-me-maybe/sitemap";
import { getSitemapEntries } from "@/lib/sitemap";

const manifest = createSitemapManifest({
  domain: "https://example.com",
  entries: getSitemapEntries,
});

export async function GET() {
  const xml = await manifest.getRootSitemap();

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### b. Single sitemap with split support

Keep the root route stable and add a child route for numbered parts. If the sitemap stays small, `/sitemap.xml` serves the actual sitemap XML directly. If it grows later, the child route already exists.

```ts
// app/sitemap.xml/route.ts
import { createSitemapManifest } from "@crawl-me-maybe/sitemap";
import { getSitemapEntries } from "@/lib/sitemap";

const manifest = createSitemapManifest({
  domain: "https://example.com",
  entries: getSitemapEntries,
});

export async function GET() {
  const xml = await manifest.getRootSitemap();

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

```ts
// app/sitemap-[index].xml/route.ts
import { createSitemapManifest } from "@crawl-me-maybe/sitemap";
import { getSitemapEntries } from "@/lib/sitemap";

const manifest = createSitemapManifest({
  domain: "https://example.com",
  entries: getSitemapEntries,
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ index: string }> },
) {
  const { index } = await params;
  const xml = await manifest.getSitemap({
    index: Number(index),
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### c. Multiple named sitemaps

Named sitemaps can be a raw source or a definition with a sitemap-specific `maxUrls` override.

```ts
// lib/sitemaps.ts
import { createSitemapManifest } from "@crawl-me-maybe/sitemap";
import { getBlogEntries } from "@/lib/sitemap/blog";
import { getPageEntries } from "@/lib/sitemap/pages";
import { getProductEntries } from "@/lib/sitemap/products";

export const manifest = createSitemapManifest({
  domain: "https://example.com",
  entries: {
    pages: getPageEntries,
    blog: getBlogEntries,
    products: {
      entries: getProductEntries,
      maxUrls: 10_000,
    },
  },
});
```

```ts
// app/sitemap.xml/route.ts
import { manifest } from "@/lib/sitemaps";

export async function GET() {
  const xml = await manifest.getRootSitemap();

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

```ts
// app/sitemap-[sitemap]-[index].xml/route.ts
import { manifest } from "@/lib/sitemaps";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sitemap: string; index: string }> },
) {
  const { sitemap, index } = await params;
  const xml = await manifest.getSitemap({
    sitemap,
    index: Number(index),
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### d. Localized manifests

`createSitemapManifest` accepts the same locale options as the low-level XML generator, so alternates stay consistent across root and child routes.

```ts
createSitemapManifest({
  domain: "https://example.com",
  locales: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    mode: "prefix",
  },
  entries: getSitemapEntries,
});
```

---

## Low-level primitives

If you already know which XML file you need, use the primitives directly.

```ts
import {
  generateSitemap,
  generateSitemapIndex,
} from "@crawl-me-maybe/sitemap";

const sitemapXml = await generateSitemap("https://example.com", {
  entries: [{ path: "/" }, { path: "/about" }],
});

const indexXml = generateSitemapIndex("https://example.com", {
  sitemaps: ["/sitemap-0.xml", "/sitemap-1.xml"],
});
```

---

## Robots

Build `robots.txt` as a string. Pass the sitemap **filename only** (no domain) — e.g. `"sitemap.xml"`.

If you're generating multiple sitemaps, pass the sitemap index filename (usually `sitemap.xml`) rather than a child sitemap filename.

### a. Array of rules

Same shape as Next.js `MetadataRoute.Robots` rules. The sitemap line is appended automatically.

```ts
// app/robots.txt/route.ts
import { generateRobotsTxt } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const robots = generateRobotsTxt(
    "https://example.com",
    "sitemap.xml",
    [
      { userAgent: "Googlebot", allow: ["/"], disallow: "/private/" },
      { userAgent: ["Applebot", "Bingbot"], disallow: ["/"] },
    ],
  );

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

### b. Single rule

```ts
// app/robots.txt/route.ts
import { generateRobotsTxt } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const robots = generateRobotsTxt(
    "https://example.com",
    "sitemap.xml",
    { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
  );

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

### c. With @crawl-me-maybe/sanity-plugin-seo

If you use [`@crawl-me-maybe/sanity-plugin-seo`](../sanity-plugin-seo), the robots rules stored in `globalSeoSettings.advanced.robots` share the same shape as `RobotsRule`. Fetch them from Sanity and pass them directly — no mapping needed.

```ts
// app/robots.txt/route.ts
import { generateRobotsTxt, type RobotsRule } from "@crawl-me-maybe/sitemap";
import { client } from "@/lib/sanityClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await client.fetch<{
    siteUrl?: string;
    advanced?: { robots?: RobotsRule[] };
  }>(`*[_type == "globalSeoSettings"][0]{ siteUrl, advanced }`);

  const domain = settings?.siteUrl ?? "https://example.com";
  const rules = settings?.advanced?.robots;

  const robots = generateRobotsTxt(domain, "sitemap.xml", rules);

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

If `rules` is `undefined` (not configured in Studio), `generateRobotsTxt` falls back to `DEFAULT_ROBOTS_RULES` automatically.

---

## Config reference

### Manifest options

| Option | Type | Description |
|--------|------|-------------|
| `domain` | `string` | Site origin used for absolute URLs. |
| `basePath` | `string` | Stable child route base path, defaulting to `/sitemap`. |
| `maxUrls` | `number` | Default maximum URLs per child sitemap file, defaulting to `50_000`. |
| `entries` | `SitemapEntrySource` or `Record<string, SitemapDefinition>` | Single sitemap source or a named sitemap map. |
| `locales` | `SitemapLocaleConfig` | Locale expansion rules for automatic hreflang generation. |

### Vite plugin options

| Option | Type | Description |
|--------|------|-------------|
| `domain` | `string` | Site origin used for absolute URLs. |
| `outDir` | `string` | Output directory (default: `dist`). |
| `sitemaps` | source or object | A single sitemap source, or named sitemap definitions with optional per-sitemap `maxUrls`. |
| `maxUrls` | `number` | Default split threshold used when a named sitemap definition omits `maxUrls`. |
| `robots` | `RobotsRule` or array | Crawler rules used when writing `robots.txt`. |
| `locales` | `SitemapLocaleConfig` | Locale expansion rules for automatic hreflang generation. |

### Low-level primitives

- `GenerateSitemapOptions` - options object for `await generateSitemap(domain, options)`
- `GenerateSitemapIndexOptions` - options object for `generateSitemapIndex(domain, options)`
- `SitemapDefinition` - per-sitemap manifest definition
- `SitemapFile` - concrete child sitemap metadata from `getSitemapFiles()`
- `SitemapManifest` - manifest interface from `createSitemapManifest()`
- `SitemapSelector` - selector passed to `getSitemap()`; `sitemap` is optional for single-definition manifests and required when multiple named sitemaps are configured
- `SitemapNotFoundError` - thrown when a named sitemap does not exist
- `SitemapPartNotFoundError` - thrown when the requested child index does not exist
- `SitemapEntrySource` - array or callback returning sitemap entries

## License

MIT
