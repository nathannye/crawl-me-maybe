# @crawl-me-maybe/sitemap

Most sitemap generators either crawl your built site, scan your filesystem, or expect you to be using a specific framework.

That's fine until your routes come from a CMS, database, API, or an ISR/SSR application where new pages can appear long after the last build finishes.

In those situations, you usually already know what URLs exist. Generating a sitemap shouldn't require rediscovering them.

This package takes a simpler approach. You provide routes, it generates sitemap.xml and robots.txt. Build-time with Vite, runtime from an API route, or both. No crawling, no filesystem scanning, and no strong opinions about where your content lives.

## Features
- Framework agnostic sitemap generation
- Build-time generation with Vite
- Runtime generation for ISR and SSR applications
- Localized sitemaps with hreflang alternates
- robots.txt generation with sitemap link

## Table of contents

- [Install](#install)
- [Locale modes](#locale-modes)
- [Sitemap Vite plugin](#vite-plugin)
- [Sitemap with API route](#api-route)
- [Robots](#robots)
- [Config reference](#config-reference)
- [License](#license)

## Install

```bash
bun add @crawl-me-maybe/sitemap
npm install @crawl-me-maybe/sitemap
pnpm add @crawl-me-maybe/sitemap
yarn add @crawl-me-maybe/sitemap
```

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
import { vitePluginSitemap } from "@crawl-me-maybe/sitemap";

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

### c. Localized

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

## API route

Return XML from a route handler. Same entry shape as the Vite plugin — no file writes.

### a. Single sitemap

```ts
// app/sitemap.xml/route.ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const xml = generateSitemap({
    domain: "https://example.com",
    entries: [{ path: "/" }, { path: "/about" }],
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### b. Multiple sitemaps

Serve a sitemap index at `/sitemap.xml` and child sitemaps at `/sitemap-{name}.xml`.

```ts
// app/sitemap.xml/route.ts
import { generateIndexSitemap } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const xml = generateIndexSitemap(
    ["sitemap-pages.xml", "sitemap-blog.xml"],
    "https://example.com",
  );

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

```ts
// app/sitemap-pages.xml/route.ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const xml = generateSitemap({
    domain: "https://example.com",
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
  const xml = generateSitemap({
    domain: "https://example.com",
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

---

## Config reference

| Option | Type | Description |
|--------|------|-------------|
| `domain` | `string` | Site origin, e.g. `https://example.com` |
| `outDir` | `string` | Output directory (default: `dist`) |
| `sitemaps` | fn or object | Entry callback(s) |
| `robots` | `RobotsRule` or array | Crawler rules (Vite plugin only) |
| `locales` | `LocaleConfig[]` | Locale list for hreflang |
| `localeMode` | `"prefix"` \| `"subdomain"` | URL strategy (default: `prefix`) |
| `prefixDefault` | `boolean` | Prefix the default locale too (default: `false`) |

## License

MIT
