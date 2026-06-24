<img width="1590" height="408" alt="crawl-me-maybe-thumb" src="https://github.com/user-attachments/assets/2f2cd647-3726-426b-8677-0c77bdbae20f" />
<br/>

# Crawl me maybe

Framework-agnostic tools for CMS-driven SEO.

Most SEO tooling pushes the work onto editors: extra schema fields, repeated metadata, and a pile of content that already exists somewhere else in the CMS.

Crawl me maybe takes the opposite approach. Editors fill in the few things that actually need editorial control, and the rest is derived from your existing content model in the frontend.

---


## How the packages fit together

```
Sanity Studio
  └── @crawl-me-maybe/sanity-plugin-seo   ← editors fill in SEO fields

Your app / site
  ├── @crawl-me-maybe/meta                ← merge page + global metadata
  ├── @crawl-me-maybe/schema              ← derive JSON-LD from Sanity content
  └── @crawl-me-maybe/sitemap             ← generate sitemap.xml and robots.txt
```

> 🧠 Note: Use the whole stack together, or just the pieces you need. The packages are designed to work together, but can be used independently.

## Packages

### Sanity Plugin

Sanity Studio plugin with SEO fields, global defaults, and social/search preview cards.

[See docs](./packages/sanity-plugin-seo)

- Global `globalSeoSettings` defaults with per-page `pageMetadata` overrides
- Live social previews for Facebook, Twitter/X, LinkedIn, and Google Search
- Favicon preview and robots.txt rule builder in Studio

```bash
npm install @crawl-me-maybe/sanity-plugin-seo
pnpm add @crawl-me-maybe/sanity-plugin-seo
bun add @crawl-me-maybe/sanity-plugin-seo
yarn add @crawl-me-maybe/sanity-plugin-seo
```

---

### Metadata

Runtime helpers to merge page and global SEO metadata and generate meta titles.

[See docs](./packages/meta)

- Merge page-level and global SEO defaults
- Meta title templates (`{pageTitle} - {siteTitle}`)
- Explicit Nuxt and Next helpers, with generic HTML tag helper for other frameworks

```bash
npm install @crawl-me-maybe/meta
pnpm add @crawl-me-maybe/meta
bun add @crawl-me-maybe/meta
yarn add @crawl-me-maybe/meta
```

---

### Sitemap

Minimal sitemap generator. Query your CMS, pass the result, done.

[See docs](./packages/sitemap)

- Build-time generation with a Vite plugin, or runtime output from API routes
- Localized sitemaps with hreflang alternates and multi-sitemap indexes
- `robots.txt` generation with sitemap link — pairs with `sanity-plugin-seo` robots rules

```bash
npm install @crawl-me-maybe/sitemap
pnpm add @crawl-me-maybe/sitemap
bun add @crawl-me-maybe/sitemap
yarn add @crawl-me-maybe/sitemap
```

---

## Schema.org Markup (JSON-LD)

Builds Schema.org JSON-LD from Sanity content. Derive structured data from your existing content model — no extra editor fields required.

[See docs](./packages/schema)

- `buildSchemaMarkup` emits a JSON-LD graph for site identity, `WebSite`, and `WebPage`
- Typed builders for Article, Product, Event, FAQPage, LocalBusiness, and more
- Entity de-duping by `@id` when nested nodes reference the same thing

```bash
npm install @crawl-me-maybe/schema
pnpm add @crawl-me-maybe/schema
bun add @crawl-me-maybe/schema
yarn add @crawl-me-maybe/schema
```

---

