# @crawl-me-maybe/meta

> This library is under active development. APIs and data shapes may change.

SEO utilities for Sanity-driven sites: merge page and global metadata, generate meta titles, favicons, and Sanity image URLs.

For Schema.org JSON-LD, use [`@crawl-me-maybe/schema-markup`](../schema-markup).

## Table of contents

- [Install](#install)
- [Features](#features)
- [Quick start](#quick-start)
- [Core exports](#core-exports)
- [License](#license)

## Install

```bash
npm install @crawl-me-maybe/meta
pnpm add @crawl-me-maybe/meta
bun add @crawl-me-maybe/meta
yarn add @crawl-me-maybe/meta
```

---

## Features

- Merge page-level and global SEO metadata
- Meta title templates
- Multi-format favicon generation from Sanity assets
- Sanity image URL helpers

---

## Quick start

```typescript
import { buildMetadata } from "@crawl-me-maybe/meta";

const meta = buildMetadata(
  {
    title: "About Us",
    slug: { slug: { current: "about" } },
    metadata: {
      description: "Learn more about our company",
      canonicalUrl: "https://example.com/about",
    },
  },
  {
    siteTitle: "My Website",
    pageTitleTemplate: "{pageTitle} | {siteTitle}",
    siteUrl: "https://example.com",
  },
);
```

---

## Core exports

- `buildMetadata` — merge page metadata with global SEO defaults
- `createMetaTitle` — generate titles from a template
- `createFavicons` — build favicon set from a Sanity asset
- `urlFor` — Sanity image URL builder (requires `setConfig` first)
- `setConfig` / `getConfig` — project ID and dataset for image URLs

---

## License

MIT
