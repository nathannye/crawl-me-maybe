# @crawl-me-maybe/web

>🚨 This library is under extremely active development, the structure of data is not set in stone, nor are exports in a final stage. I just needed this out of my turborepo folder 🙃.

Web utilities and schema markup builders for Sanity driven data.

## Installation

```bash
npm install @crawl-me-maybe/web
# or
pnpm add @crawl-me-maybe/web
# or
yarn add @crawl-me-maybe/web
```

## Features

- 🎯 **SEO Utilities**: Merge page-level and global SEO metadata
- 🏗️ **Schema Markup Builders**: Generate structured data (JSON-LD) for various schema types
- 🖼️ **Image Utilities**: Format and optimize Sanity images for schema markup
- 🎨 **Favicon Generation**: Create multi-format favicons from Sanity assets
- 📝 **Type-safe**: Full TypeScript support with comprehensive type definitions

## Quick Start


### 2. Build SEO Payload

Combine global defaults with page-specific metadata:

```typescript
import { buildSeoPayload } from '@crawl-me-maybe/web';

const seoData = buildSeoPayload({
  globalDefaults: {
    siteTitle: 'My Website',
    pageTitleTemplate: '{pageTitle} | {siteTitle}',
    metaDescription: 'Default site description',
    siteUrl: 'https://example.com',
    twitterHandle: '@example'
  },
  pageSeo: {
    title: 'About Us',
    metadata: {
      description: 'Learn more about our company',
      canonicalUrl: 'https://example.com/about'
    }
  },
  schemaDefaults: {
    organization: {
      name: 'Example Company',
      url: 'https://example.com'
    }
  },
  pageSchemaType: 'AboutPage'
});

// Use the merged metadata
const { meta, schemas } = seoData;
```

## Core Functions

### `buildSeoPayload(params)`

Builds the complete SEO payload for a page, merging global defaults with page-specific metadata.

**Parameters:**
- `globalDefaults?: SeoDefaults` - Global SEO configuration
- `schemaDefaults?: SchemaDefaults` - Global schema markup defaults
- `pageSeo?: PageMetadata` - Page-specific metadata
- `pageSchemaType?: string` - Schema type (default: "WebPage")
- `extraSchemaData?: Record<string, unknown>` - Additional schema data
- `isHomepage?: boolean` - Whether this is the homepage

**Returns:** `{ meta: MergedMetadata, schemas: Thing[] | undefined }`

## SEO Utilities

### `mergeSeoData(page?, seoDefaults?)`

Merges page-level metadata with SEO defaults. Page metadata takes precedence.

### `createMetaTitle(pageTitle, siteTitle, template)`

Generates a meta title using a template.

```typescript
import { createMetaTitle } from '@crawl-me-maybe/web';

const title = createMetaTitle(
  'About Us',
  'My Website',
  '{pageTitle} | {siteTitle}'
);
// Result: "About Us | My Website"
```

### `createFavicons(favicon)`

Creates multi-format favicons from a Sanity asset. Feed SVG in, generate PNG + SVG.

### `createSchemaImageObject(image?, fallback?)`

Creates a Schema.org ImageObject from a Sanity image asset.

## Schema Markup

### `composeSchema(props)`

Composes complete schema markup for a page, returning an array of schema objects to be rendered as JSON-LD.

```typescript
import { composeSchema } from '@crawl-me-maybe/web';

const schemas = composeSchema({
  seo: mergedMetadata,
  schemaDefaults: {
    organization: {
      name: 'Example Company',
      url: 'https://example.com'
    }
  },
  type: 'Article',
  extra: {
    author: [{
      name: 'John Doe',
      url: 'https://example.com/authors/john-doe'
    }],
    datePublished: '2025-01-01'
  }
});
```

### Schema Builders

Individual builder functions for specific schema types:

- `buildWebPage(props)` - Generic webpage
- `buildWebSite(props)` - Website root
- `buildArticle(props)` - Article/blog post
- `buildProduct(props)` - Product page
- `buildEvent(props)` - Event page
- `buildFAQPage(props)` - FAQ page
- `buildOrganization(org, defaults, baseUrl)` - Organization
- `buildPersonOrOrg(entity, isOrg, baseUrl)` - Person or Organization
- `buildAboutPage(props)` - About page
- `buildContactPage(props)` - Contact page

## TypeScript Types

All types are fully exported for use in your application:

```typescript
import type {
  // Core types
  BuildSeoPayloadParams,
  BuildSeoPayloadResult,
  
  // SEO types
  SeoDefaults,
  PageMetadata,
  MergedMetadata,
  Favicon,
  
  // Schema types
  SchemaDefaults,
  SchemaImage,
  SchemaAddress,
  SchemaGeo,
  SchemaAggregateRating,
  SchemaPerson,
  SchemaOrganization,
  SchemaFAQItem,
  SchemaSearchAction,
  SchemaLocation,
  SchemaOffer,
  
  // Image config
  SanityImageConfig
} from '@crawl-me-maybe/web';
```

## Utility Functions

### `coalesce(...values)`

Returns the first non-null, non-undefined value from the provided arguments.

```typescript
import { coalesce } from '@crawl-me-maybe/web';

const value = coalesce(undefined, null, 'default', 'fallback');
// Result: "default"
```

## Example: Complete Implementation

```typescript
import { 
  buildSeoPayload, 
  type SeoDefaults,
  type SchemaDefaults
} from '@crawl-me-maybe/web';



// Define your defaults
const seoDefaults: SeoDefaults = {
  siteTitle: 'My Awesome Site',
  pageTitleTemplate: '{pageTitle} | {siteTitle}',
  metaDescription: 'Welcome to my awesome site',
  siteUrl: 'https://awesome.com',
  twitterHandle: '@awesome'
};

const schemaDefaults: SchemaDefaults = {
  organization: {
    name: 'Awesome Company',
    url: 'https://awesome.com',
    logo: myLogoAsset
  }
};

// Build SEO for a page
export async function getPageSeo(page: any) {
  return buildSeoPayload({
    globalDefaults: seoDefaults,
    schemaDefaults,
    pageSeo: {
      title: page.title,
      metadata: {
        description: page.description,
        canonicalUrl: `https://awesome.com/${page.slug}`
      }
    },
    pageSchemaType: page.schemaType || 'WebPage'
  });
}
```

## License

MIT

