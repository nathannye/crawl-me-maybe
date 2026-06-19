> 🚨 These libraries are still under heavy active development, they are not ready for primetime usage.

# Crawl me maybe
A suite of framework-agnostic tools for CMS-driven SEO.

Other plugins place most of the work on editors, schema markup and bunches of metadata that the user must duplicate. Your users are busy, pass this dupliated content once in your template and save them the time.

## Features
- Schema Markup handlers for every non-deprecated type (full list here)
- Global schema markup defaults
- Global schema markup dataset that can be re-used
- Sanity Plugin 
- Global defaults with visual indications of completeness
- Social previews
- Search result previews
- Dynamic favicons


## Schema Markup (JSON-LD)



## Web (SEO runtime)
`@crawl-me-maybe/web`

Framework-agnostic helpers to merge SEO metadata, generate meta titles, favicons, and Sanity image URLs.

## Schema Markup (JSON-LD)
`@crawl-me-maybe/schema-markup`

Builds Schema.org JSON-LD from Sanity content. Depends on `@crawl-me-maybe/web` for merged metadata. Pairs with `@crawl-me-maybe/sanity` for CMS field definitions.

### buildSeoPayload
Builds a complete SEO payload for a page by merging global defaults, page metadata, and optional schema config. Field names align with `@crawl-me-maybe/sanity`.

Returns:
- `meta`: merged title/description/canonical, favicons, robots string, twitter handle, etc.
- `schemas`: an array of JSON‑LD objects (`schema-dts` `Thing[]`) ready to render.

Typical usage flow:
1) Provide `projectId` and `dataset` so images/favicons resolve.
2) Pass `globalSeoDefaults` and the page's `pageMetadata`.
3) Optionally pass `schemaDefaults` and `pageSchemaType` to emit JSON‑LD.
4) Render `schemas` as `<script type="application/ld+json">` and apply `meta` to the page head.


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
`@crawl-me-maybe/sanity`

Sanity Studio plugin with SEO and Schema Markup fields, defaults, and custom components. Does not generate JSON-LD by itself — use `@crawl-me-maybe/schema-markup` on the frontend.
