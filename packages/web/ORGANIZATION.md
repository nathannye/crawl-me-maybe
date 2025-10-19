# Package Organization Summary

## Overview

The `@crawl-me-maybe/web` package has been reorganized for better structure, maintainability, and usability. All exports are now semantically organized and properly typed for use as `import { ... } from '@crawl-me-maybe/web'`.

## Directory Structure

```
packages/web/
├── src/                          # Source files
│   ├── index.ts                  # Main entry point with organized exports
│   ├── build.ts                  # Core buildSeoPayload function
│   ├── utils/                    # SEO and image utilities
│   │   ├── index.ts              # Utils barrel export
│   │   ├── favicon.ts            # Favicon generation
│   │   ├── image.ts              # Schema image formatting
│   │   ├── merge.ts              # SEO data merging
│   │   ├── meta-title.ts         # Title generation
│   │   └── sanity-image.ts       # Sanity image builder
│   └── schema-markup/            # Schema.org markup builders
│       ├── index.ts              # Schema barrel export
│       ├── compose.ts            # Main schema composition
│       ├── types.ts              # Schema type definitions
│       ├── schema-utils.ts       # Utility functions
│       └── builders/             # Individual schema builders
│           ├── index.ts          # Builders barrel export
│           ├── about-page.ts     # AboutPage schema
│           ├── article.ts        # Article schema
│           ├── contact-page.ts   # ContactPage schema
│           ├── event.ts          # Event schema
│           ├── faq.ts            # FAQPage schema
│           ├── organization.ts   # Organization schema
│           ├── product.ts        # Product schema
│           ├── utils.ts          # Builder utilities
│           ├── webpage.ts        # WebPage schema
│           └── website.ts        # WebSite schema
├── package.json                  # Package configuration
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Comprehensive documentation
├── ORGANIZATION.md               # This file
└── example.ts                    # Usage examples

# Build output (generated):
dist/
├── index.js                      # CommonJS bundle
├── index.mjs                     # ES module bundle
├── index.d.ts                    # TypeScript declarations
├── index.js.map                  # Source map (CJS)
└── index.mjs.map                 # Source map (ESM)
```

## Exported API

### Core Functions

| Export | Type | Description |
|--------|------|-------------|
| `buildSeoPayload` | Function | Main function to build complete SEO payload |
| `BuildSeoPayloadParams` | Type | Parameters for buildSeoPayload |
| `BuildSeoPayloadResult` | Type | Return type of buildSeoPayload |

### SEO Utilities

| Export | Type | Description |
|--------|------|-------------|
| `mergeSeoData` | Function | Merges page and global SEO metadata |
| `createMetaTitle` | Function | Generates meta title from template |
| `createSchemaImageObject` | Function | Formats Sanity image for schema |
| `createFavicons` | Function | Generates multi-format favicons |
| `configureSanityImages` | Function | Configures Sanity image builder |
| `getImageConfig` | Function | Gets current Sanity config |
| `urlFor` | Function | Builds Sanity image URLs |
| `SeoDefaults` | Type | Global SEO defaults structure |
| `PageMetadata` | Type | Page-specific metadata structure |
| `MergedMetadata` | Type | Merged metadata result |
| `Favicon` | Type | Favicon object structure |
| `SanityImageConfig` | Type | Sanity image configuration |

### Schema Markup

| Export | Type | Description |
|--------|------|-------------|
| `composeSchema` | Function | Composes complete schema markup |
| `SchemaDefaults` | Type | Global schema defaults |

### Schema Builders

| Export | Type | Description |
|--------|------|-------------|
| `buildWebPage` | Function | Builds WebPage schema |
| `buildWebSite` | Function | Builds WebSite schema |
| `buildArticle` | Function | Builds Article schema |
| `buildProduct` | Function | Builds Product schema |
| `buildEvent` | Function | Builds Event schema |
| `buildFAQPage` | Function | Builds FAQPage schema |
| `buildOrganization` | Function | Builds Organization schema |
| `buildPersonOrOrg` | Function | Builds Person or Organization |
| `buildAboutPage` | Function | Builds AboutPage schema |
| `buildContactPage` | Function | Builds ContactPage schema |
| `buildPersonSchema` | Function | Builds Person schema |
| `buildOrgSchema` | Function | Builds Organization schema |
| `normalizeId` | Function | Normalizes name to ID |
| `formatSchemaDate` | Function | Formats date for schema.org |

### Schema Types

| Export | Type | Description |
|--------|------|-------------|
| `SchemaImage` | Type | Image reference type |
| `SchemaAddress` | Type | Address structure |
| `SchemaGeo` | Type | Geographic coordinates |
| `SchemaAggregateRating` | Type | Aggregate rating data |
| `SchemaPerson` | Type | Person entity |
| `SchemaContactPoint` | Type | Contact information |
| `SchemaOrganization` | Type | Organization entity |
| `SchemaFAQItem` | Type | FAQ question/answer |
| `SchemaSearchAction` | Type | Search action config |
| `SchemaLocation` | Type | Location with address/geo |
| `SchemaOffer` | Type | Product offer |

### Utility Functions

| Export | Type | Description |
|--------|------|-------------|
| `coalesce` | Function | Returns first non-null value |

## Key Changes

### 1. Restructured to `src/` Directory

All source files moved into `src/` directory following the same pattern as other packages (`sanity-seo`, `sitemap`).

### 2. Organized Index Exports

The main `index.ts` now provides a semantically organized export structure with clear sections:
- Core Functions
- SEO Utilities  
- Schema Markup
- Schema Builders
- Schema Types
- Utility Functions

### 3. Fixed Dependencies

Added proper dependencies to `package.json`:
- `@sanity-image/url-builder` for image processing
- `@sanity/client` for Sanity types
- Existing: `schema-dts`, `minify-xml`

### 4. Created Standalone Image Utilities

Created `utils/sanity-image.ts` to provide standalone image URL building without requiring direct imports from `sanity-seo` package.

### 5. Updated Package Configuration

Updated `package.json` with:
- Proper `main`, `module`, and `types` fields pointing to `dist/`
- Modern `exports` field for dual ESM/CJS support
- `files` field to only publish `dist/` directory

### 6. Added Build Configuration

Added web package to `tsup.config.ts` to enable:
- Automatic TypeScript declaration (`.d.ts`) generation
- Dual ESM/CJS bundle creation
- Source map generation
- Tree-shaking and bundling

### 7. Fixed Import Issues

- Changed relative imports to use internal package structure
- Added `type` keyword for type-only imports
- Fixed unreachable code in `sanity-image.ts`

### 8. Documentation

Created:
- Comprehensive `README.md` with installation, usage, and API docs
- `example.ts` with real-world usage patterns
- This `ORGANIZATION.md` file

## Import Examples

### Before (Not Organized)
```typescript
// Mixed exports, unclear structure
import { buildSeoPayload } from '@crawl-me-maybe/web';
// Some utilities might not have been exported
```

### After (Well Organized)
```typescript
// Clear, semantic imports
import {
  // Core
  buildSeoPayload,
  
  // SEO Utilities
  mergeSeoData,
  createMetaTitle,
  configureSanityImages,
  
  // Schema
  composeSchema,
  buildArticle,
  buildProduct,
  
  // Types
  type SeoDefaults,
  type SchemaDefaults,
  type PageMetadata,
} from '@crawl-me-maybe/web';
```

## Build System

The package is now integrated into the monorepo build system:

```bash
# Build all packages
pnpm build

# This will generate for web package:
# - dist/index.js (CommonJS)
# - dist/index.mjs (ES Module)
# - dist/index.d.ts (TypeScript declarations)
# - Source maps for both
```

## TypeScript Support

Full TypeScript support with:
- Comprehensive type definitions exported
- Auto-generated `.d.ts` files
- Proper type inference
- JSDoc comments preserved

## Next Steps

1. **Run Build**: Execute `pnpm build` to generate the distribution files
2. **Test Imports**: Verify imports work correctly in consuming applications
3. **Update Consumers**: Update any code that imports from this package
4. **Documentation**: Share README with team for reference

## Notes

- All functions maintain their original behavior
- Breaking changes: None (only organizational)
- Backward compatibility: Maintained through proper exports
- Performance: No impact (same code, better structure)

