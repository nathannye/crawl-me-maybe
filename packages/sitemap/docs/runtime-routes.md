# Runtime routes

← [Package README](../README.md)

Use `createSitemapManifest` when a route needs to stay stable as content grows. The manifest lazily resolves the sitemap(s) needed for the current request and gives you the root route plus child files from the same shared config.

For named sitemap configuration (`entries: { pages, blog, … }`) and automatic file splitting, see [Splitting and named sitemaps](./splitting.md).

## Route shapes

| Scenario | Routes |
|---|---|
| Single sitemap, no split support | `/sitemap.xml` |
| Single sitemap with split support | `/sitemap.xml`, `/sitemap-[index].xml` |
| Multiple named sitemaps | `/sitemap.xml`, `/sitemap-[sitemap]-[index].xml` |

## `getSitemap()` selectors

- Single sitemap manifest → `getSitemap({ index })`
- Multiple named sitemaps → `getSitemap({ sitemap, index })`

## Single sitemap, unsplit

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

## Single sitemap with split support

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

## Multiple named sitemaps

Named sitemaps can be a raw source or a definition with a sitemap-specific `maxUrls` override. See [splitting.md](./splitting.md) for the manifest config shape.

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

## Localized runtime sitemaps

`createSitemapManifest` accepts the same `locales` config as the Vite plugin and `generateSitemap`, so alternates stay consistent across root and child routes. See [locales.md](./locales.md).
