# @crawl-me-maybe/sanity-plugin-seo

SEO fields, global defaults, and social preview cards for Sanity Studio.

> Built for Sanity v5 and v6

## Table of contents

- [Install](#install)
- [Features](#features)
- [Getting started](#getting-started)
  - [Plugin configuration](#plugin-configuration)
  - [Custom canonical URLs](#custom-canonical-urls)
  - [Adding SEO fields to a page document](#adding-seo-fields-to-a-page-document)
  - [Studio structure — surfacing Global SEO Settings](#studio-structure--surfacing-global-seo-settings)
- [Favicons](#favicons)
- [Robots.txt](#robotstxt)
- [Frontend integration](#frontend-integration)
- [Schemas](#schemas)
  - [`globalSeoSettings` document](#globalseoSettings-document)
  - [`pageMetadata` object](#pagemetadata-object)
  - [Shared field types](#shared-field-types)

## Install

```bash
npm install @crawl-me-maybe/sanity-plugin-seo
pnpm add @crawl-me-maybe/sanity-plugin-seo
bun add @crawl-me-maybe/sanity-plugin-seo
yarn add @crawl-me-maybe/sanity-plugin-seo
```

---

## Features

- **Global defaults** — a `globalSeoSettings` singleton document that feeds fallback values to all page-level fields; editors always see what fallback is being displayed
- **Page metadata** — a `pageMetadata` object type with meta description, meta image, and search indexing controls that each show and override the global default
- **Social preview cards** — live editable previews for Facebook, Twitter/X, LinkedIn, and Google Search, built from page data
- **Favicon browser-tab preview** — renders your favicon and site title in a mock browser tab with light/dark toggle
- **Robots.txt rules editor** — structured rule builder with a read-only `robots.txt` preview tab

## Getting started

### Plugin configuration

Pass options to the plugin to enable or disable individual features. All options default to `true`.

```ts
// sanity.config.ts
import crawlMeMaybeSeo from "@crawl-me-maybe/sanity-plugin-seo";

export default defineConfig({
  plugins: [
    crawlMeMaybeSeo({
      global: {
        favicon: true,   // favicon field + browser-tab preview in Global Settings
        robots: true,    // robots.txt rule builder in Global Settings
      },
      page: {
        searchIndexing: true, // noIndex / noFollow controls on page metadata
        canonicalUrl: true,   // canonical URL override on page metadata
      },
    }),
  ],
});
```

| Option | Type | Default | Description |
|---|---|---|---|
| `global.favicon` | `boolean` | `true` | Includes the favicon field (with browser-tab preview) in Global SEO Settings |
| `global.robots` | `boolean` | `true` | Includes the robots rules builder in Global SEO Settings |
| `page.searchIndexing` | `boolean` | `true` | Includes noIndex / noFollow controls on the `pageMetadata` field |
| `page.canonicalUrl` | `boolean` | `true` | Includes the canonical URL field on `pageMetadata`. Disable if you manage canonical via a custom reference field on the document |

### Custom canonical URLs

By default, `pageMetadata` includes a `canonicalUrl` field for explicit URL overrides. Disable it when you prefer a reference to another document:

```ts
// sanity.config.ts
crawlMeMaybeSeo({
  page: {
    canonicalUrl: false,
  },
});
```

Then add your own field on the page document:

```ts
defineField({
  name: "canonical",
  type: "reference",
  to: [{ type: "page" }, { type: "post" }],
})
```

Resolve the referenced document to a URL in your frontend query and pass it to `@crawl-me-maybe/meta` with `disableSelfCanonical: true`. When the built-in field is enabled, leave it empty and `@crawl-me-maybe/meta` generates a self-referential canonical from `siteUrl` + slug automatically.


### Adding SEO fields to a page document

Include the `pageMetadata` object type on any document schema. Global defaults are displayed automatically in Studio, but frontend fallback merging must be wired manually.

```ts
// schemas/page.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "pageMetadata", // registered by the plugin
    }),
  ],
});
```

Each `pageMetadata` field shows the live global default as a placeholder when the field is empty, and renders social preview cards (Facebook, Twitter/X, LinkedIn, Google) in a tabbed panel.

<img width="814" height="686" alt="Screenshot 2026-06-23 at 1 48 58 PM" src="https://github.com/user-attachments/assets/542b0804-4036-4d8c-b2ab-d6579f84523c" />
<br/>

### Studio structure — surfacing Global SEO Settings

Register the plugin, then add the `globalSeoSettings` singleton to your Studio's structure so editors can reach it:

```ts
// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import crawlMeMaybeSeo from "@crawl-me-maybe/sanity-plugin-seo";

export default defineConfig({
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // ... your other list items ...
            S.divider(),
            S.listItem()
              .title("Global SEO Settings")
              .child(
                S.document()
                  .schemaType("globalSeoSettings")
                  .documentId("globalSeoSettings")
              ),
          ]),
    }),
    crawlMeMaybeSeo(),
  ],
});
```

---

## Favicons
Browser-tab preview for dynamic favicons with theme-switching button. Can be disabled by setting `global.favicon` to `false`.

<img width="661" height="355" alt="Screenshot 2026-06-23 at 1 22 48 PM" src="https://github.com/user-attachments/assets/69600f60-2e93-4df4-88f6-ec50fcd3adb5" />
<br/>

## Robots.txt
Preview-enabled array field for robots.txt entries. Disabled by setting `global.robots` to `false`.

> 🧠 Note: This plugin only generates a preview, you are still responsible for exposing and formatting this to your frontend.

<img width="697" height="318" alt="Screenshot 2026-06-23 at 1 18 44 PM" src="https://github.com/user-attachments/assets/7592bdbc-a39c-44d9-b801-4e566e499919" />
<img width="682" height="333" alt="Screenshot 2026-06-23 at 1 18 50 PM" src="https://github.com/user-attachments/assets/f8d7444c-cb8a-4571-80a8-352699dd36fc" />
<br/>

---

## Frontend Integration
This plugin only stores SEO metadata inside Sanity.

You are responsible for reading these fields and generating:
- meta tags
- Open Graph tags
- Twitter/X tags
- canonical URLs
- schema markup
- robots.txt
- sitemap.xml

`@crawl-me-maybe/meta` and `@crawl-me-maybe/sitemap` can be used to format this data for your frontend.

---

## Schemas

### `globalSeoSettings` document

A singleton document that provides site-wide defaults. Page-level fields display these values in Studio when empty; frontend fallback merging is handled by your app.

| Field | Sanity type | Required | Validation | Notes |
|---|---|---|---|---|
| `siteTitle` | `string` | ✅ | Required | Injected into `pageTitleTemplate` via `{siteTitle}` |
| `pageTitleTemplate` | `string` | ✅ | Required | Custom token input; initial value `{pageTitle} - {siteTitle}` |
| `siteUrl` | `url` | ✅ | Must start with `https://` | Used when generating canonical URLs, Open Graph URLs, and sitemap entries. |
| `metaDescription` | `metaDescription` | — | Warn < 120 or > 160 chars | Default description displayed by page metadata fields |
| `defaultMetaImage` | `metaImage` | — | — | Default OG image displayed by page metadata fields |
| `favicon` | `image` | — | — | Browser-tab preview in Studio. Controlled by `global.favicon` option |
| `twitterHandle` | `string` | — | Must start with `@` | Social group |
| `logo` | `image` | — | — | Used for Organization / WebSite schema markup |
| `advanced.robots` | `robots[]` | — | Paths must start with `/` | robots.txt rule builder with preview tab. Controlled by `global.robots` option |

---

### `pageMetadata` object

Add this type to any document that needs per-page SEO. Fields display the active global default as placeholder when empty.

| Field | Sanity type | Required | Validation | Notes |
|---|---|---|---|---|
| `description` | `metaDescription` | — | Warn < 120 or > 160 chars | Overrides `globalSeoSettings.metaDescription` |
| `canonicalUrl` | `string` | — | Path (`/about`) or `https://` URL | Optional override; leave empty for auto self-canonical on the frontend. Controlled by `page.canonicalUrl` option |
| `searchIndexing` | `searchIndexing` | — | — | noIndex / noFollow controls. Controlled by `page.searchIndexing` option |
| `metaImage` | `metaImage` | — | — | Overrides `globalSeoSettings.defaultMetaImage`; shows thumbnail of active default when empty |

---

### Shared field types

These named types are registered by the plugin and can be reused in your own schemas:

| Type name | Base type | Description |
|---|---|---|
| `metaDescription` | `text` | 3-row textarea with 120–160 char warnings |
| `metaTitle` | `string` | Single-line title field with 50–60 char warnings |
| `metaImage` | `image` | Standard image field for OG/social use |
| `favicon` | `image` | Image with browser-tab preview component |
| `searchIndexing` | `object` | noIndex + noFollow boolean controls |
| `robots` | `array` | Rule builder with userAgent / allow / disallow fields and robots.txt preview |

