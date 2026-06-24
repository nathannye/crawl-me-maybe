# @crawl-me-maybe/sitemap

Most sitemap generators either crawl your built site, scan your filesystem, or expect you to be using a specific framework.

This package takes a simpler approach. You provide routes, it generates sitemap.xml and robots.txt. Build-time with Vite, runtime from an API route, or both. No crawling, no filesystem scanning, and no strong opinions about where your content lives.

## Features

- Framework agnostic sitemap generation
- Build-time generation with Vite
- Runtime generation for ISR and SSR applications
- Localized sitemaps with hreflang alternates
- robots.txt generation with sitemap link

## How this package is meant to be used

`@crawl-me-maybe/sitemap` supports two output modes:

- **Build-time generation** with the Vite plugin, which writes `sitemap.xml` and `robots.txt` to disk during your build
- **Runtime generation** with `generateSitemap`, `generateIndexSitemap`, and `generateRobotsTxt`, which lets you return XML from a route handler or API endpoint for ISR, SSR, or CMS-backed routes

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
- [Locale modes](#locale-modes)
- [Vite plugin](#vite-plugin)
- [Runtime generation](#runtime-generation)
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
  skipLocalization?: boolean
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
- `skipLocalization: true` prevents locale variants from being generated for that entry

---

## Locale modes

Pass `locales` to the Vite plugin or `generateSitemap` to emit hreflang alternates. Set `localeMode` to control how localized URLs are built (default: `"prefix"`).

**`prefix`** — locale code as a path segment. The default locale has no prefix unless `prefixDefault: true`.

| Locale | `/about` |
|--------|----------|
| `en` (default) | `https://example.com/about` |
| `fr` | `https://example.com/fr/about` |

**`subdomain`** — locale code as a subdomain (`www` is stripped from the domain).

| Locale | `/about` |
|--------|----------|
| `en` (default) | `https://example.com/about` |
| `fr` | `https://fr.example.com/about` |

```ts
locales: [
  { code: "en", default: true },
  { code: "fr" },
],
localeMode: "prefix", // or "subdomain"
prefixDefault: false,  // prefix the default locale too when true
```

Use `skipLocalization: true` on entries that should not get locale variants (feeds, static assets, etc.).

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

Writes `dist/sitemap.xml` and `dist/robots.txt`.

### b. Multiple sitemaps

Split by content type when you exceed ~50k URLs per file. Writes `sitemap-{name}.xml` per key and a `sitemap.xml` index.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  sitemaps: {
    pages: async () => [
      { path: "/", changefreq: "daily", priority: 1 },
      { path: "/about", lastmod: "2025-01-01", changefreq: "monthly", priority: 0.8 },
    ],
    blog: async () => [
      {
        path: "/blog/hello",
        lastmod: "2025-06-01",
        changefreq: "weekly",
        imageUrls: ["https://example.com/images/hello.jpg"],
      },
    ],
    products: async () => [
      {
        path: "/products/widget",
        lastmod: "2025-05-15",
        changefreq: "weekly",
        priority: 0.9,
        videoUrls: ["https://example.com/videos/widget.mp4"],
      },
    ],
  },
});
```

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

See [Locale modes](#locale-modes). Works with single or multiple sitemap configs.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  locales: [
    { code: "en", default: true },
    { code: "fr" },
    { code: "es" },
  ],
  sitemaps: async () => [
    { path: "/about" },
    { path: "/feed.xml", skipLocalization: true },
  ],
});
```

---

## Runtime generation

Return XML from a route handler or API endpoint. This uses the same entry shape as the Vite plugin, but does not write files to disk.

### a. Single sitemap

```ts
// app/sitemap.xml/route.ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const xml = generateSitemap("https://example.com", {
    entries: [{ path: "/" }, { path: "/about" }],
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### b. Multiple sitemaps

When generating multiple sitemaps at runtime, the sitemap index needs to know the filenames of the child sitemap routes. In most apps this is a small shared list such as `pages`, `blog`, or `products`.

Serve a sitemap index at `/sitemap.xml` and child sitemaps at `/sitemap-{name}.xml`.

```ts
// lib/sitemap-names.ts
export const SITEMAP_NAMES = ["pages", "blog"] as const;
```

```ts
// app/sitemap.xml/route.ts
import { generateIndexSitemap } from "@crawl-me-maybe/sitemap";
import { SITEMAP_NAMES } from "@/lib/sitemap-names";

export async function GET() {
  const xml = generateIndexSitemap("https://example.com", {
    childSitemapNames: SITEMAP_NAMES.map((name) => `sitemap-${name}.xml`),
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

```ts
// app/sitemap-pages.xml/route.ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const xml = generateSitemap("https://example.com", {
    entries: [{ path: "/" }, { path: "/about" }],
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### c. Localized

See [Locale modes](#locale-modes).

```ts
// app/sitemap.xml/route.ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const xml = generateSitemap("https://example.com", {
    entries: [{ path: "/about" }, { path: "/contact" }],
    locales: [
      { code: "en", default: true },
      { code: "fr" },
    ],
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
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

| Option | Type | Applies to | Description |
|--------|------|------------|-------------|
| `domain` | `string` | Vite + runtime | Site origin, e.g. `https://example.com`. First argument to `generateSitemap`, `generateIndexSitemap`, and `generateRobotsTxt`. |
| `outDir` | `string` | Vite | Output directory (default: `dist`) |
| `sitemaps` | fn or object | Vite | Entry callback(s) for one or more sitemap files |
| `entries` | `SitemapEntry[]` | Runtime (`GenerateSitemapOptions`) | Entries for a single generated sitemap |
| `childSitemapNames` | `string[]` | Runtime (`GenerateIndexSitemapOptions`) | Child sitemap filenames for `generateIndexSitemap` |
| `robots` | `RobotsRule` or array | Vite | Crawler rules used when writing `robots.txt` |
| `locales` | `LocaleConfig[]` | Vite + runtime | Locale list for hreflang generation |
| `localeMode` | `"prefix"` \| `"subdomain"` | Vite + runtime | URL strategy (default: `prefix`) |
| `prefixDefault` | `boolean` | Vite + runtime | Prefix the default locale too (default: `false`) |

### Exported types

- `GenerateSitemapOptions` — options object for `generateSitemap(domain, options)`
- `GenerateIndexSitemapOptions` — options object for `generateIndexSitemap(domain, options)`

## License

MIT
