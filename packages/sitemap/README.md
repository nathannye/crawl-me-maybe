# @crawl-me-maybe/sitemap

Most sitemap generators either crawl your built site, scan your filesystem, or expect you to be using a specific framework.

This package takes a simpler approach. You provide routes, it generates sitemap.xml and robots.txt. Build-time with Vite, runtime from an API route, or both. No crawling, no filesystem scanning, and no strong opinions about where your content lives.

## Features

- Framework agnostic
- Build-time generation with Vite
- Runtime generation for ISR and SSR applications
- Localized sitemaps with hreflang alternates
- Split large sitemaps into numbered child files
- Google image and video sitemap extensions
- robots.txt generation with sitemap link

## Install

```bash
npm install @crawl-me-maybe/sitemap
pnpm add @crawl-me-maybe/sitemap
bun add @crawl-me-maybe/sitemap
yarn add @crawl-me-maybe/sitemap
```

## Choose a mode

| Goal | Use |
|---|---|
| Build-time output | `vitePluginSitemap` |
| Runtime / ISR / SSR | `createSitemapManifest` |
| One-off XML generation | `generateSitemap` / `generateSitemapIndex` |
| `robots.txt` | `generateRobotsTxt` or Vite `robots` |

Use a **single sitemap** when all URLs belong to one logical sitemap. Use **multiple named sitemaps** when you want separate families like pages, blog, or products. Large sitemaps are split automatically into numbered child files when they exceed `maxUrls`. See [Splitting and named sitemaps](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/splitting.md).

## Quick start

### Vite

```ts
// vite.config.ts
import { vitePluginSitemap } from "@crawl-me-maybe/sitemap/vite";

export default {
  plugins: [
    vitePluginSitemap({
      domain: "https://example.com",
      sitemaps: async () => [
        { path: "/" },
        { path: "/about" },
      ],
    }),
  ],
};
```

Writes `dist/sitemap.xml` and `dist/robots.txt` during the build.

### Runtime

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

For route patterns covering split and named sitemaps, see [Runtime routes](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/runtime-routes.md).

### Named sitemaps

```ts
createSitemapManifest({
  domain: "https://example.com",
  entries: {
    pages: getPageEntries,
    blog: getBlogEntries,
  },
});
```

See [Splitting and named sitemaps](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/splitting.md) for Vite setup, build output, and `maxUrls` overrides.

## Sitemap entry shape

Every entry's `path` must be a site-relative path (e.g. `/about`). The site origin is supplied separately via `domain` — entries never embed a host.

This applies in all modes, including manual locale handling. Absolute URLs and cross-domain paths are not supported on `path`. If locales live on separate domains, use one manifest or Vite plugin instance per domain.

```ts
type SitemapEntry = {
  path: string
  lastmod?: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
  imageUrls?: string[]
  videos?: SitemapVideo[]
  locales?: string[]
  localePaths?: Record<string, string>
}

type SitemapVideo = {
  title: string
  description: string
  thumbnailUrl: string
  contentUrl?: string
  playerUrl?: string
  duration?: number
  publicationDate?: string
}
```

- `path` must be site-relative, e.g. `/about` — not an absolute URL
- `imageUrls` must be absolute image URLs — see [Image and video](#image-and-video)
- `videos` uses absolute media URLs; `contentUrl` or `playerUrl` is required per video
- `locales` limits which configured locales a page exists in (when locale expansion is enabled)
- `localePaths` overrides the slug for specific locales

See [Locales](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/locales.md) for locale expansion patterns.

## Locale support

Pass a `localization` config to opt into automatic expansion and hreflang alternates. Omit it to control paths yourself.

**Automatic prefix mode:**

```ts
vitePluginSitemap({
  domain: "https://example.com",
  localization: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    mode: "prefix",
  },
  sitemaps: async () => [{ path: "/about" }],
});
```

**Manual mode** — omit `localization` and emit prefixed paths yourself:

```ts
vitePluginSitemap({
  domain: "https://example.com",
  sitemaps: async () => [
    { path: "/about" },
    { path: "/fr/a-propos" },
  ],
});
```

More locale patterns: see [locales.md](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/locales.md).

## Robots

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

See [robots.md](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/robots.md) for array rules, Vite plugin config, and Sanity integration.

## Low-level primitives

If you already know which XML file you need, use the primitives directly. If you need stable route handling for split or named sitemaps, use `createSitemapManifest` instead.

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

## Image and video

**Images** — pass absolute URLs on `imageUrls`. The package emits `<image:loc>` inside the normal urlset.

**Videos** — pass a `videos` array with Google-required metadata. URLs are absolute (CDN, Mux, YouTube embed, etc.) and are not joined with `domain`.

```ts
{
  path: "/blog/hello-world",
  lastmod: "2025-06-01",
  imageUrls: ["https://cdn.example.com/images/hello-world.jpg"],
  videos: [
    {
      title: "Hello World",
      description: "A short intro video",
      thumbnailUrl: "https://cdn.example.com/thumb.jpg",
      contentUrl: "https://cdn.example.com/video.mp4",
      duration: 183,
      publicationDate: "2025-06-01T12:00:00+00:00",
    },
  ],
}
```

Each video requires `title`, `description`, and `thumbnailUrl`, plus `contentUrl` or `playerUrl`. `duration` and `publicationDate` are optional.

### Locale alternates and videos

Videos are attached to the sitemap entry, not per locale variant. If a page has locale alternates, the same video metadata is emitted for each localized URL in that alternate set.

If localized pages need different videos, model them as separate entries or separate sitemaps.

## API overview

- `vitePluginSitemap` — Vite plugin for build-time output (`@crawl-me-maybe/sitemap/vite`)
- `createSitemapManifest` — runtime manifest for route handlers
- `generateSitemap` / `generateSitemapIndex` — one-off XML generation
- `generateRobotsTxt` — `robots.txt` string generation

See [docs/api.md](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/api.md) for full config reference and types.

## Further reading

- [Runtime routes](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/runtime-routes.md)
- [Locales](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/locales.md)
- [Splitting and named sitemaps](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/splitting.md)
- [Robots](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/robots.md)
- [API reference](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/api.md)

## License

MIT
