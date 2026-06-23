# Crawl me maybe

Framework-agnostic tools for CMS-driven SEO.

Other plugins place most of the work on editors, schema markup and metadata that users must fill in by hand, usually duplicating content that already exists. These libraries flip this and advocate for passing that content once in your template and saving editors the effort.

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


## Packages

### Sanity Plugin


Sanity Studio plugin with SEO fields, global defaults, and social/search preview cards.

[See docs](./packages/sanity-plugin-seo)

```bash
npm install @crawl-me-maybe/sanity-plugin-seo
pnpm add @crawl-me-maybe/sanity-plugin-seo
bun add @crawl-me-maybe/sanity-plugin-seo
yarn add @crawl-me-maybe/sanity-plugin-seo
```

---

### Frontend Metadata Transformer

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

Minimal sitemap generator. Query your CMS, pass the result, done. Ships with Vite-Plugin and API-route friendly helpers that support localization and multiple sitemaps.

[See docs](./packages/sitemap)

```bash
npm install @crawl-me-maybe/sitemap
pnpm add @crawl-me-maybe/sitemap
bun add @crawl-me-maybe/sitemap
yarn add @crawl-me-maybe/sitemap
```

---

## Schema.org Markup (JSON-LD)

Builds Schema.org JSON-LD from Sanity content. Derive structured data from your existing content model — no extra editor fields required.

Includes typed builders for many Google-supported rich result schemas, including `Article`, `Product`, `Event`, `FAQPage`, `LocalBusiness`, `Organization`, `WebPage`, `WebSite`, and more.

[See docs](./packages/schema-markup)

```bash
npm install @crawl-me-maybe/schema-markup
pnpm add @crawl-me-maybe/schema-markup
bun add @crawl-me-maybe/schema-markup
yarn add @crawl-me-maybe/schema-markup
```

---

