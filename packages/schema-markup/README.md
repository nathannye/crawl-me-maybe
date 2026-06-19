# @crawl-me-maybe/schema-markup

> This library is under active development. APIs and data shapes may change.

Schema.org JSON-LD builders for Sanity-driven content. Pairs with `@crawl-me-maybe/sanity` for CMS fields and `@crawl-me-maybe/meta` for merged SEO metadata.

## Installation

```bash
npm install @crawl-me-maybe/schema-markup @crawl-me-maybe/meta
```

Both packages are required. `@crawl-me-maybe/meta` handles meta title merging, favicons, and Sanity image URLs. This package turns that data into JSON-LD.

## Quick Start

```typescript
import { buildSeoPayload } from "@crawl-me-maybe/schema-markup";

const { meta, schemas } = buildSeoPayload({
  projectId: "your-project-id",
  dataset: "production",
  globalSeoDefaults: {
    siteTitle: "My Website",
    pageTitleTemplate: "{pageTitle} | {siteTitle}",
    siteUrl: "https://example.com",
  },
  pageMetadata: {
    title: "About Us",
    slug: { slug: { current: "about" } },
    metadata: {
      description: "Learn more about our company",
      canonicalUrl: "https://example.com/about",
    },
  },
  schemaDefaults: {
    organization: {
      name: "Example Company",
      url: "https://example.com",
    },
  },
  pageSchemaType: "AboutPage",
});

// meta → apply to <head>
// schemas → render as <script type="application/ld+json">
```

## Core Functions

### `buildSeoPayload(params)`

Merges SEO metadata via `@crawl-me-maybe/meta`, then composes JSON-LD when `schemaDefaults` is provided.

**Returns:** `{ meta: MergedMetadata, schemas: Thing[] | undefined }`

### `composeSchema(props)`

Composes schema markup for a page from merged SEO data and global schema defaults.

### Schema Builders

Individual builders for specific schema types:

- `buildWebPage`, `buildWebSite`, `buildArticle`, `buildProduct`
- `buildEvent`, `buildFAQPage`, `buildAboutPage`, `buildContactPage`
- `buildOrganization`, `buildPersonOrOrg`, `buildPersonSchema`, `buildOrgSchema`

## Scripts

```bash
bun run lint   # biome check
bun run fix    # biome check --write
bun run build  # bundle + emit types
```

## License

MIT
