# @crawl-me-maybe/sanity-plugin-seo

SEO fields, global defaults, and social preview cards for Sanity Studio.

> Built for Sanity v5 and v6

## Features

- **Global defaults** — a `globalSeoSettings` singleton document that feeds fallback values to all page-level fields; editors always see what's being inherited
- **Page metadata** — a `pageMetadata` object type with meta description, meta image, and search indexing controls that each show and override the global default
- **Social preview cards** — live editable previews for Facebook, Twitter/X, LinkedIn, and Google Search, built from page data
- **Favicon browser-tab preview** — renders your favicon and site title in a mock browser tab with light/dark toggle
- **robots.txt rules editor** — structured rule builder with a read-only `robots.txt` preview tab

## Getting Started

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

## Favicons
Browser-tab preview for dynamic favicons with theme-switching button. Can be disabled by setting `global.favicon` to `false`.

<img width="661" height="355" alt="Screenshot 2026-06-23 at 1 22 48 PM" src="https://github.com/user-attachments/assets/69600f60-2e93-4df4-88f6-ec50fcd3adb5" />
<br/>

## Robots.txt
Preview-enabled array field for robots.txt entries. Disabled by setting `global.robots` to `false`.

<img width="697" height="318" alt="Screenshot 2026-06-23 at 1 18 44 PM" src="https://github.com/user-attachments/assets/7592bdbc-a39c-44d9-b801-4e566e499919" />
<img width="682" height="333" alt="Screenshot 2026-06-23 at 1 18 50 PM" src="https://github.com/user-attachments/assets/f8d7444c-cb8a-4571-80a8-352699dd36fc" />
<br/>

## Schemas

### `globalSeoSettings` document

A singleton document that provides site-wide defaults. Page-level fields inherit from these values when empty.

| Field | Sanity type | Required | Validation | Notes |
|---|---|---|---|---|
| `siteTitle` | `string` | ✅ | Required | Injected into `pageTitleTemplate` via `{siteTitle}` |
| `pageTitleTemplate` | `string` | ✅ | Required | Custom token input; initial value `{pageTitle} - {siteTitle}` |
| `siteUrl` | `url` | ✅ | Must start with `https://` | Used for canonical and Open Graph tags |
| `metaDescription` | `metaDescription` | — | Warn < 120 or > 160 chars | Default description inherited by all pages |
| `defaultMetaImage` | `metaImage` | — | — | Default OG image inherited by all pages |
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
| `searchIndexing` | `searchIndexing` | — | — | noIndex / noFollow controls. Controlled by `page.searchIndexing` option |
| `metaImage` | `metaImage` | — | — | Overrides `globalSeoSettings.defaultMetaImage`; shows thumbnail of active default when empty |

---

### Shared field types

These named types are registered by the plugin and can be reused in your own schemas:

| Type name | Base type | Description |
|---|---|---|
| `metaDescription` | `text` | 3-row textarea with 120–160 char warnings |
| `metaTitle` | `string` | Single-line with 50–60 char warnings |
| `metaImage` | `image` | Standard image field for OG/social use |
| `favicon` | `image` | Image with browser-tab preview component |
| `searchIndexing` | `object` | noIndex + noFollow boolean controls |
| `robots` | `array` | Rule builder with userAgent / allow / disallow fields and robots.txt preview |

