# API reference

← [Package README](../README.md)

Full TypeScript types ship with the package in `dist/*.d.ts`. Source definitions live in [`src/types.ts`](../src/types.ts).

## Core types

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

type SitemapLocaleConfig = {
  locales: string[]
  defaultLocale: string
  mode?: "prefix" | "subdomain" | "domain"
  prefixDefault?: boolean
  domainByLocale?: Record<string, string>
  alternates?: boolean
  xDefault?: boolean | string
}
```

Every entry's `path` must be site-relative (e.g. `/about`). The site origin is supplied separately via `domain`.

## Manifest options (`createSitemapManifest`)

| Option | Type | Description |
|--------|------|-------------|
| `domain` | `string` | Site origin used for absolute URLs. |
| `basePath` | `string` | Stable child route base path, defaulting to `/sitemap`. |
| `maxUrls` | `number` | Default maximum URLs per child sitemap file, defaulting to `50_000`. |
| `entries` | `SitemapEntrySource` or `Record<string, SitemapDefinition>` | Single sitemap source or a named sitemap map. |
| `locales` | `SitemapLocaleConfig` | Locale expansion rules for automatic hreflang generation. |

## Vite plugin options (`vitePluginSitemap`)

| Option | Type | Description |
|--------|------|-------------|
| `domain` | `string` | Site origin used for absolute URLs. |
| `outDir` | `string` | Output directory (default: `dist`). |
| `sitemaps` | source or object | A single sitemap source, or named sitemap definitions with optional per-sitemap `maxUrls`. |
| `maxUrls` | `number` | Default split threshold used when a named sitemap definition omits `maxUrls`. |
| `robots` | `RobotsRule` or array | Crawler rules used when writing `robots.txt`. |
| `locales` | `SitemapLocaleConfig` | Locale expansion rules for automatic hreflang generation. |

## Low-level primitives

- `GenerateSitemapOptions` — options object for `await generateSitemap(domain, options)`
- `GenerateSitemapIndexOptions` — options object for `generateSitemapIndex(domain, options)`
- `SitemapDefinition` — per-sitemap manifest definition
- `SitemapFile` — concrete child sitemap metadata from `getSitemapFiles()`
- `SitemapManifest` — manifest interface from `createSitemapManifest()`
- `SitemapSelector` — selector passed to `getSitemap()`; use `{ index }` for a single sitemap manifest and `{ sitemap, index }` for multiple named sitemaps
- `SitemapNotFoundError` — thrown when a named sitemap does not exist
- `SitemapPartNotFoundError` — thrown when the requested child index does not exist
- `SitemapEntrySource` — array or callback returning sitemap entries

## Exports

| Export | Description |
|--------|-------------|
| `vitePluginSitemap` | Vite plugin (`@crawl-me-maybe/sitemap/vite`) |
| `createSitemapManifest` | Runtime manifest for route handlers |
| `generateSitemap` | Generate a single sitemap XML string |
| `generateSitemapIndex` | Generate a sitemap index XML string |
| `generateRobotsTxt` | Generate a `robots.txt` string |
