# @crawl-me-maybe/meta

> This library is under active development. APIs and data shapes may change.

SEO utilities for Sanity-driven sites: merge page and global metadata, generate meta titles, and output framework-specific meta tags.

For Schema.org JSON-LD, use [`@crawl-me-maybe/schema-markup`](../schema-markup).

## Table of contents

- [Install](#install)
- [Features](#features)
- [Quick start](#quick-start)
- [Sanity queries](#sanity-queries)
- [Core exports](#core-exports)
- [Output adapters](#output-adapters)
  - [toHtmlTags](#tohtmltags)
  - [Next.js (`/next`)](#nextjs-next)
  - [Nuxt (`/nuxt`)](#nuxt-nuxt)
- [License](#license)

## Install

```bash
npm install @crawl-me-maybe/meta
pnpm add @crawl-me-maybe/meta
bun add @crawl-me-maybe/meta
yarn add @crawl-me-maybe/meta
```

For framework adapters, install the optional peer when needed:

```bash
# Next.js adapter only
npm install next

# Nuxt adapter uses zhead (bundled as a dependency of this package)
```

---

## Features

- Merge page-level and global SEO metadata
- Meta title templates
- Framework output adapters for raw HTML, Next.js, and Nuxt

---

## Quick start

```typescript
import { buildMetadata } from "@crawl-me-maybe/meta";

const meta = buildMetadata(
  {
    title: "About Us",
    slug: { current: "about" },
    description: "Learn more about our company",
    metaImage: "https://cdn.sanity.io/images/project/dataset/image.jpg",
    canonicalUrl: "https://example.com/about",
  },
  {
    siteTitle: "My Website",
    pageTitleTemplate: "{pageTitle} | {siteTitle}",
    siteUrl: "https://example.com",
    defaultMetaImage: "https://cdn.sanity.io/images/project/dataset/default.jpg",
  },
);
```

---

## Sanity queries

`metaImage` must be a **resolved URL string** before it reaches `buildMetadata`. Resolve it in your GROQ projection — the Studio still stores image fields; your frontend query dereferences them.

**Page query** — expose a string URL for the page-level image:

```groq
*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": { "current": slug.current },
  "description": seo.description,
  "searchIndexing": seo.searchIndexing,
  "metaImage": seo.metaImage.asset->url
}
```

**Global defaults query** — expose the fallback image URL:

```groq
*[_type == "globalSeoSettings"][0]{
  siteTitle,
  pageTitleTemplate,
  metaDescription,
  siteUrl,
  twitterHandle,
  "defaultMetaImage": defaultMetaImage.asset->url
}
```

`buildMetadata` merges page and global values: a page-level `metaImage` overrides `defaultMetaImage` when present. You can also resolve both in GROQ with `coalesce()` if you prefer a single field upstream:

```groq
"metaImage": coalesce(
  seo.metaImage.asset->url,
  *[_type == "globalSeoSettings"][0].defaultMetaImage.asset->url
)
```

For Open Graph, consider appending Sanity image params (`?w=1200&h=630&fit=crop&auto=format`) when building the URL.

### Canonical URLs

`buildMetadata` resolves `canonicalUrl` automatically when both page data and `globalSeoSettings.siteUrl` are provided:

- **Empty** — generates a self-referential canonical from `siteUrl` + slug (unless `disableSelfCanonical: true`)
- **Path** (e.g. `/about`) — joined with `siteUrl` internally
- **Full URL** (e.g. `https://example.com/about`) — used as-is

Pass paths from Studio as-is in your GROQ projection:

```groq
"canonicalUrl": seo.canonicalUrl
```

---

## Core exports

- `buildMetadata` — merge page metadata with global SEO defaults
- `createMetaTitle` — generate titles from a template
- `toHtmlTags` — convert merged metadata into spreadable `<meta>` / `<link>` tag objects

Framework-specific adapters are available via subpath imports:

- `@crawl-me-maybe/meta/next` — `toNextMeta`
- `@crawl-me-maybe/meta/nuxt` — `toNuxtMeta`

---

## Output adapters

All adapters accept the merged output of `buildMetadata`. Image tags are emitted automatically when `metaImage` is set.

### toHtmlTags

Framework-agnostic. Returns a `title` string and arrays of tag objects you can spread onto elements.

```typescript
import { buildMetadata, toHtmlTags } from "@crawl-me-maybe/meta";

const merged = buildMetadata(page, globalSeoDefaults);
const { title, tags, links } = toHtmlTags(merged);

// React / JSX
<>
  <title>{title}</title>
  {tags.map((tag) => (
    <meta key={JSON.stringify(tag)} {...tag} />
  ))}
  {links.map((link) => (
    <link key={JSON.stringify(link)} {...link} />
  ))}
</>
```

OG tags use `property`, standard and Twitter tags use `name`. Canonical URLs are returned in `links`.

### Next.js (`/next`)

Import from the `/next` subpath. Returns a Next.js App Router `Metadata` object.

```typescript
// app/about/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@crawl-me-maybe/meta";
import { toNextMeta } from "@crawl-me-maybe/meta/next";

export async function generateMetadata(): Promise<Metadata> {
  const merged = buildMetadata(page, globalSeoDefaults);

  return toNextMeta(merged);
}
```

Requires `next` as a peer dependency.

### Nuxt (`/nuxt`)

Import from the `/nuxt` subpath. Returns a `MetaFlatInput` object compatible with `useSeoMeta()`.

```vue
<script setup lang="ts">
import { buildMetadata } from "@crawl-me-maybe/meta";
import { toNuxtMeta } from "@crawl-me-maybe/meta/nuxt";

const merged = buildMetadata(page, globalSeoDefaults);

useSeoMeta(toNuxtMeta(merged));
</script>
```

---

## License

MIT
