# Splitting and named sitemaps

← [Package README](../README.md)

Two separate ideas:

- **Named sitemap families** — logical separation (pages, blog, products) as distinct sitemaps under one index
- **Automatic file splitting** — a single sitemap definition exceeds `maxUrls` and is split into numbered child files

Both work in the Vite plugin and `createSitemapManifest`. For runtime route handlers, see [Runtime routes](./runtime-routes.md).

## Vite: multiple named sitemaps

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
        videos: [
          {
            title: "Widget demo",
            description: "Product overview video",
            thumbnailUrl: "https://example.com/images/widget-thumb.jpg",
            contentUrl: "https://example.com/videos/widget.mp4",
          },
        ],
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

## Build output

If the sitemap resolves to a single file, `sitemap.xml` contains the full `<urlset>`. If it resolves to multiple files, `sitemap.xml` becomes a `<sitemapindex>` and the numbered child files are written alongside it.

| Files written | `sitemap.xml` contains | Child files on disk |
|---|---|---|
| 1 | Full `<urlset>` | None — `sitemap-0.xml` is not written |
| 2+ | `<sitemapindex>` | All child files (`sitemap-0.xml`, `sitemap-pages-0.xml`, etc.) |

Child sitemap filenames always include a numeric suffix (`-0`, `-1`, …) once the sitemap is split or part of a named sitemap family. Child files are only written when `sitemap.xml` is a sitemap index.

## Runtime: named sitemap manifest

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

Route handlers for this manifest are in [runtime-routes.md](./runtime-routes.md).
