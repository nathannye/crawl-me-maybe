> 🚨 These libraries are still under heavy active development, they are not ready for primetime usage.

# Crawl me maybe
A suite of framework-agnostic tools for CMS-driven SEO.



## Web (SEO runtime)
`@crawl-me-maybe/web`

The runtime helpers you use in your app/site to merge SEO metadata and generate Schema.org JSON‑LD.

### buildSeoPayload
Builds a complete SEO payload for a page by merging your global defaults, page metadata, and optional schema config. Dependant upon field names in the `@crawl-me-maybe/sanity` package

Returns:
- `meta`: merged title/description/canonical, favicons, robots string, twitter handle, etc.
- `schemas`: an array of JSON‑LD objects (`schema-dts` `Thing[]`) ready to render.

Inputs (selected):
- `projectId`, `dataset` (required for Sanity image URLs/favicons)
- `globalSeoDefaults` (site-wide defaults: title, description, favicon, siteUrl, etc.)
- `pageMetadata` (page-specific SEO block; field name via `seoFieldName`, default `metadata`)
- `schemaDefaults` (global schema settings: organization/publisher/logo, automapping, etc.)
- `pageSchemaType` (e.g. `WebPage`, `Article`, `Product`)
- `extraSchemaData` (optional per-type fields like authors, brand, organizer)
- `isHomepage` (boolean; adds `WebSite` schema when true or when configured)

Typical usage flow:
1) Provide `projectId` and `dataset` so images/favicons resolve.
2) Pass `globalSeoDefaults` and the page’s `pageMetadata`.
3) Optionally pass `schemaDefaults` and `pageSchemaType` to emit JSON‑LD.
4) Render `schemas` as `<script type="application/ld+json">` and apply `meta` to the page head.

Notes:
- If only defaults are provided, a minimal payload is returned.
- If only a page object is provided, the page data is used as-is.
- `schemaDefaults.organization` and `publisher` are emitted as entities and referenced where appropriate.
- `extraSchemaData` allows passing authors, brand, organizer/performer, etc., which are included and deduped.


## Sitemap
`@crawl-me-maybe/sitemap`

A stupid-simple sitemap generator, query your CMS and pass the result, done. Supports minification.

**Supported properties**
- url
- changefreq
- priority
- images
- videos

## Sanity SEO
`@crawl-me-maybe/sanity-seo`


## Schema Markup
`@crawl-me-maybe/sitemap`

A Sanity.io plugin containing the fields, schemas, and defaults for valid Schema.org Markup. This does <strong>not</strong> generate json-ld by itself, you must interpret it on the frontend (try `@crawl-me-maybe/schema).

<br/>

**Supported Schemas**
Click any link to check their full schema on schema.org
- [AboutPage](https://schema.org/AboutPage)
- [ContactPage](https://schema.org/ContactPage)
- [Article](https://schema.org/Article)
- [CreativeWork](https://schema.org/CreativeWork)
- [Event](https://schema.org/Event)
- [FAQPage](https://schema.org/FAQPage)
- [LocalBusiness](https://schema.org/LocalBusiness)
- [Organization](https://schema.org/Organization)
- [Person](https://schema.org/Person)
- [Product](https://schema.org/Product)
- [WebPage](https://schema.org/WebPage)
- [WebSite](https://schema.org/WebSite)

<stromg>Extra fields</strong>
- Logo
