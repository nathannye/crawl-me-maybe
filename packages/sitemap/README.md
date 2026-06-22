# @crawl-me-maybe/sitemap

Generate `sitemap.xml` and `robots.txt` from your own route data. Does not scan the filesystem — you provide paths/slugs and the package resolves them against your `domain`.

## Install

```bash
pnpm add -D @crawl-me-maybe/sitemap
```

```ts
import {
  vitePluginSitemap,
  generateSitemap,
  generateRobotsTxt,
} from "@crawl-me-maybe/sitemap";
```

## SitemapEntry

Entries use a site-relative `path`. The domain is applied at generation time.

```ts
{ path: "/about", lastmod: "2025-01-01" }
{ path: "blog/post-1", skipLocalization: true }
```

---

## Vite plugin

Runs on `closeBundle` and writes files to `outDir` (default: `dist`).

### Single sitemap

```ts
// vite.config.ts
import { vitePluginSitemap } from "@crawl-me-maybe/sitemap";

export default {
  plugins: [
    vitePluginSitemap({
      domain: "https://example.com",
      outDir: "dist",
      sitemaps: async () => [
        { path: "/" },
        { path: "/about" },
      ],
    }),
  ],
};
```

Writes `dist/sitemap.xml` and `dist/robots.txt`.

### Multiple sitemaps

Split by content type when you exceed ~50k URLs per file. The plugin writes `sitemap-{name}.xml` for each key and a `sitemap.xml` index.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  sitemaps: {
    pages: async () => [{ path: "/" }, { path: "/about" }],
    blog: async () => [{ path: "/blog/hello" }],
    products: async () => [{ path: "/products/widget" }],
  },
});
```

### Localized sitemaps

Add `locales` to generate hreflang alternates. Default locale has no prefix unless `prefixDefault: true`.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  locales: [
    { code: "en", default: true },
    { code: "fr" },
    { code: "es" },
  ],
  localeMode: "prefix", // or "subdomain"
  sitemaps: async () => [
    { path: "/about" },
    { path: "/feed.xml", skipLocalization: true },
  ],
});
```

### Custom robots rules

Same shape as Next.js `MetadataRoute.Robots` rules. The sitemap line is appended automatically.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  robots: [
    { userAgent: "Googlebot", allow: ["/"], disallow: "/private/" },
    { userAgent: ["Applebot", "Bingbot"], disallow: ["/"] },
  ],
  sitemaps: async () => [{ path: "/" }],
});
```

---

## `generateSitemap`

Build sitemap XML as a string (no file write). Useful in API routes, build scripts, or SSR.

```ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

const xml = await generateSitemap({
  domain: "https://example.com",
  entries: [{ path: "/" }, { path: "/about" }],
});
```

With locales:

```ts
const xml = await generateSitemap({
  domain: "https://example.com",
  entries: [{ path: "/about" }],
  locales: [{ code: "en", default: true }, { code: "fr" }],
  localeMode: "prefix",
});
```

---

## `generateRobotsTxt`

Build `robots.txt` as a string. Pass the sitemap **filename only** (no domain) — e.g. `"sitemap.xml"`.

```ts
import { generateRobotsTxt } from "@crawl-me-maybe/sitemap";

const robots = await generateRobotsTxt(
  "https://example.com",
  "sitemap.xml",
);

const robotsWithRules = await generateRobotsTxt(
  "https://example.com",
  "sitemap.xml",
  [
    { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
  ],
);
```

---

## Config reference

| Option | Type | Description |
|--------|------|-------------|
| `domain` | `string` | Site origin, e.g. `https://example.com` |
| `outDir` | `string` | Output directory (default: `dist`) |
| `sitemaps` | fn or object | Entry callback(s) |
| `robots` | `RobotsRule` or array | Crawler rules |
| `locales` | `LocaleConfig[]` | Locale list for hreflang |
| `localeMode` | `"prefix"` \| `"subdomain"` | URL strategy (default: `prefix`) |
| `prefixDefault` | `boolean` | Prefix the default locale too (default: `false`) |

## License

MIT
