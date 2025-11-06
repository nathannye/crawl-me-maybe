# Locale Support Examples

## Example 1: Prefix Mode (Default)

```typescript
import sitemapPlugin from "@crawl-me-maybe/sitemap";

export default {
  plugins: [
    sitemapPlugin({
      domain: "https://example.com",
      locales: [
        { code: "en", default: true },
        { code: "fr" },
        { code: "es" },
      ],
      localeMode: "prefix", // or omit, as this is the default
      sitemaps: async () => [
        { url: "/about" },
        { url: "/products" },
        { url: "/contact" },
      ],
    }),
  ],
};
```

**Generated sitemap will include:**
- `https://example.com/about` (English - default, no prefix)
- `https://example.com/fr/about` (French)
- `https://example.com/es/about` (Spanish)
- `https://example.com/products` (English)
- `https://example.com/fr/products` (French)
- ... and so on

Each URL will have `<xhtml:link>` tags with `hreflang` attributes pointing to all language variants, plus an `x-default` tag.

## Example 2: Subdomain Mode

```typescript
import sitemapPlugin from "@crawl-me-maybe/sitemap";

export default {
  plugins: [
    sitemapPlugin({
      domain: "https://www.example.com",
      locales: [
        { code: "en", default: true },
        { code: "de" },
        { code: "ja" },
      ],
      localeMode: "subdomain",
      sitemaps: async () => [
        { url: "/about" },
        { url: "/pricing" },
      ],
    }),
  ],
};
```

**Generated sitemap will include:**
- `https://www.example.com/about` (English - default)
- `https://de.example.com/about` (German - note: www is removed)
- `https://ja.example.com/about` (Japanese)
- `https://www.example.com/pricing` (English)
- ... and so on

## Example 3: Skip Localization for Specific Pages

```typescript
sitemapPlugin({
  domain: "https://example.com",
  locales: [
    { code: "en", default: true },
    { code: "fr" },
  ],
  sitemaps: async () => [
    { url: "/about" }, // Will be localized
    { url: "/products" }, // Will be localized
    { url: "/sitemap.xml", skipLocalization: true }, // Won't be localized
    { url: "/feed.xml", skipLocalization: true }, // Won't be localized
    { url: "/api/health", skipLocalization: true }, // Won't be localized
  ],
});
```

## Example 4: Multi-Sitemap with Locales

```typescript
sitemapPlugin({
  domain: "https://example.com",
  locales: [
    { code: "en", default: true },
    { code: "fr" },
    { code: "de" },
  ],
  localeMode: "prefix",
  sitemaps: {
    pages: async () => [
      { url: "/" },
      { url: "/about" },
      { url: "/contact" },
    ],
    blog: async () => [
      { url: "/blog/post-1" },
      { url: "/blog/post-2" },
    ],
    products: async () => [
      { url: "/products/item-1" },
      { url: "/products/item-2" },
    ],
  },
});
```

**Will generate:**
- `sitemap-pages.xml` (with all locale variants of pages)
- `sitemap-blog.xml` (with all locale variants of blog posts)
- `sitemap-products.xml` (with all locale variants of products)
- `sitemap.xml` (index file pointing to all sitemaps)
- `robots.txt`

## Example XML Output

For a URL `/about` with English (default), French, and Spanish locales:

```xml
<url>
  <loc>https://example.com/about</loc>
  <lastmod>2025-11-06T12:00:00.000Z</lastmod>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
  <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/about" />
  <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/about" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
</url>
```

Each locale variant will be a separate `<url>` entry in the sitemap with the same alternates, ensuring search engines understand the relationship between all language versions.

