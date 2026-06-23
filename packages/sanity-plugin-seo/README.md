# @crawl-me-maybe/sanity-plugin-seo

SEO fields, global defaults, and social preview cards for Sanity Studio.

> Built for Sanity v5 and v6

## Features

- **Global defaults** — a `globalSeoSettings` singleton document that feeds fallback values to all page-level fields; editors always see what's being inherited
- **Page metadata** — a `pageMetadata` object type with meta description, meta image, and search indexing controls that each show and override the global default
- **Social preview cards** — live editable previews for Facebook, Twitter/X, LinkedIn, and Google Search, built from page data
- **Favicon browser-tab preview** — renders your favicon and site title in a mock browser tab with light/dark toggle
- **robots.txt rules editor** — structured rule builder with a read-only `robots.txt` preview tab

## Configuration

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

## Getting started

### Global Defaults Awareness
A global context to show when fields have a default or are empty with no fallback.
 (img)


### Social & Search Preview Cards
Previews for Facebook cards, Twitter cards, and Google Results

### Favicon & meta title previews
Favicon & meta title browser-tab preview


## Schemas

**metadata**

Includes:
- description
- 

### Fields

### Singletons

