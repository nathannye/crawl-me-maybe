# Crawl me maybe

A suite of framework-agnostic tools for CMS-driven SEO.

Other plugins place most of the work on editors, schema markup and metadata that users must fill in by hand, usually duplicating content that already exists. These libaries flip this and advocate for passing that content once in your template and saving editors the effort.

---

## Packages

### Sanity Plugin

[See docs](./packages/sanity-plugin-seo)

Sanity Studio plugin with SEO fields, global defaults, and social/search preview cards.

- `globalSeoSettings` singleton document with site title, page title template, default OG image, favicon, and robots rules
- `pageMetadata` object type — add to any document; each field shows the active global default when empty
- Social preview cards for Facebook, Twitter/X, LinkedIn, and Google Search
- Favicon browser-tab preview with light/dark toggle
- `robots.txt` rule builder with live preview tab

```bash
npm install @crawl-me-maybe/sanity-plugin-seo
pnpm add @crawl-me-maybe/sanity-plugin-seo
bun add @crawl-me-maybe/sanity-plugin-seo
yarn add @crawl-me-maybe/sanity-plugin-seo
```

---

### Frontend Metadata Transformer

Runtime helpers to merge page and global SEO metadata, generate meta titles, and build Sanity image URLs.

- Merge page-level and global SEO defaults
- Meta title templates (`{pageTitle} - {siteTitle}`)
- Multi-format favicon generation from Sanity assets
- Sanity image URL helpers
- Explicit Nuxt and Next helpers, with generic HTML tag helper for other frameworks

```bash
npm install @crawl-me-maybe/meta
pnpm add @crawl-me-maybe/meta
bun add @crawl-me-maybe/meta
yarn add @crawl-me-maybe/meta
```

---

### Sitemap

Minimal sitemap generator. Query your CMS, pass the result, done. Supports localization and multiple sitemaps.

[See docs](./packages/sitemap)

```bash
npm install @crawl-me-maybe/sitemap
pnpm add @crawl-me-maybe/sitemap
bun add @crawl-me-maybe/sitemap
yarn add @crawl-me-maybe/sitemap
```

---

## Schema Markup (JSON-LD)

Builds Schema.org JSON-LD from Sanity content. Derive structured data from your existing content model — no extra editor fields required.

Supports all non-deprecated Google rich result types including `Article`, `Product`, `Event`, `FAQPage`, `LocalBusiness`, `Organization`, `WebPage`, `WebSite`, and more.

[See docs](./packages/schema-markup)

```bash
npm install @crawl-me-maybe/schema-markup
pnpm add @crawl-me-maybe/schema-markup
bun add @crawl-me-maybe/schema-markup
yarn add @crawl-me-maybe/schema-markup
```

---

## How the packages fit together

```
Sanity Studio
  └── @crawl-me-maybe/sanity-plugin-seo   ← editors fill in SEO fields

Your app / site
  ├── @crawl-me-maybe/meta                ← merge page + global metadata
  ├── @crawl-me-maybe/schema-markup       ← derive JSON-LD from Sanity content
  └── @crawl-me-maybe/sitemap             ← generate sitemap.xml and robots.txt
```
