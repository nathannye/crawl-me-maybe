<img width="1590" height="408" alt="meta-thumb" src="https://github.com/user-attachments/assets/defbfb17-6b76-4c9d-91cd-84d5ea28b47c" />
<br/>

# @crawl-me-maybe/meta

SEO utilities for Sanity-driven sites: merge page and global metadata, generate meta titles, and output framework-specific meta tags.

Built to pair with [`@crawl-me-maybe/sanity-plugin-seo`](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sanity-plugin-seo) in Sanity Studio. The plugin's `globalSeoSettings` document and `pageMetadata` object match the `GlobalSeoSettings` and `RawPageMetadata` types that `buildMetadata()` accepts.

For Schema.org JSON-LD, use [`@crawl-me-maybe/schema`](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/schema).

## Table of contents

- [Install](#install)
- [Features](#features)
- [Quick start](#quick-start)
- [With `@crawl-me-maybe/sanity-plugin-seo`](#with-crawl-me-maybesanity-plugin-seo)
- [Sanity queries](#sanity-queries)
- [Build options](#build-options)
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

## With `@crawl-me-maybe/sanity-plugin-seo`

If you use [`@crawl-me-maybe/sanity-plugin-seo`](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sanity-plugin-seo), the Studio schemas map directly to `buildMetadata()` — no field renaming or custom adapters:

| Plugin schema | `buildMetadata` argument | Notes |
|---|---|---|
| `globalSeoSettings` | `globalSeoDefaults` | `siteTitle`, `pageTitleTemplate`, `siteUrl`, `metaDescription`, `twitterHandle` |
| `globalSeoSettings.defaultMetaImage` | `defaultMetaImage` | Resolve to a URL string in GROQ |
| `globalSeoSettings.favicon` | `faviconUrl` | Resolve to a URL string in GROQ (`favicon.asset->url`) |
| Page `title` + `slug` | `page.title`, `page.slug` | Required for title templates and self-canonical URLs |
| `pageMetadata.description` | `page.description` | Merged with `globalSeoSettings.metaDescription` |
| `pageMetadata.metaImage` | `page.metaImage` | Resolve to a URL string in GROQ; overrides `defaultMetaImage` |
| `pageMetadata.canonicalUrl` | `page.canonicalUrl` | Path or full URL; empty values become a self-canonical from `siteUrl` + slug |
| `pageMetadata.searchIndexing` | `page.searchIndexing` | `noIndex` / `noFollow` become a `robots` meta tag |

The plugin handles global fallbacks in Studio previews; `buildMetadata()` applies the same merge logic on the frontend.

---

## Sanity queries

These examples assume the `pageMetadata` field is named `seo` on your page document, as registered by [`@crawl-me-maybe/sanity-plugin-seo`](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sanity-plugin-seo).

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
  "defaultMetaImage": defaultMetaImage.asset->url,
  "faviconUrl": favicon.asset->url
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

Path values require `seoDefaults.siteUrl` so they can be resolved into an absolute URL. If you call `buildMetadata(page)` without global defaults, only a full canonical URL can be returned safely.

Pass paths from Studio as-is in your GROQ projection:

```groq
"canonicalUrl": seo.canonicalUrl
```

---

## Build options

`buildMetadata` accepts an optional third argument:

```ts
buildMetadata(page, globalSeoDefaults, {
  disableSelfCanonical: false,
  twitterCardStyle: "summary_large_image",
  ogType: "website",
  metadata: {},
});
```

| Option | Type | Description |
|---|---|---|
| `disableSelfCanonical` | `boolean` | When `true`, no self-referential canonical is generated from `siteUrl` + slug. Explicit `canonicalUrl` values are still honored. |
| `twitterCardStyle` | `"summary_large_image" \| "summary" \| "app" \| "player"` | Controls the generated Twitter card type. |
| `ogType` | `"website" \| "article" \| "product"` | Controls `openGraph.type`. |
| `metadata` | `Record<string, unknown>` | Extra values to merge into the returned metadata object. |

`openGraph.url` currently comes from `globalSeoDefaults.siteUrl`. The canonical URL is exposed separately as `canonicalUrl` and is what the HTML, Next.js, and Nuxt adapters use for canonical links.

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

OG tags use `property`, standard and Twitter tags use `name`. Canonical URLs and favicons are returned in `links` (`rel: "canonical"` and `rel: "icon"`).

### Next.js (`/next`)

Import from the `/next` subpath. Returns a Next.js App Router `Metadata` object. Favicon URLs map to `icons`.

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

Import from the `/nuxt` subpath. Returns a `NuxtMeta` object compatible with [`useHead()`](https://nuxt.com/docs/4.x/api/composables/use-head) — `title`, `meta[]`, and `link[]`. Use `useHead`, not `useSeoMeta`.

```vue
<script setup lang="ts">
import { buildMetadata } from "@crawl-me-maybe/meta";
import { toNuxtMeta } from "@crawl-me-maybe/meta/nuxt";

const merged = buildMetadata(page, globalSeoDefaults);

// title, meta tags, canonical link, and favicon link
useHead(toNuxtMeta(merged));
</script>
```

Example output shape:

```ts
{
  title: "About Us | My Website",
  meta: [
    { name: "description", content: "..." },
    { property: "og:title", content: "..." },
  ],
  link: [
    { rel: "canonical", href: "https://example.com/about" },
    { rel: "icon", href: "https://cdn.sanity.io/.../favicon.svg" },
  ],
}
```

---

## License

MIT
