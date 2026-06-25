<img width="1590" height="408" alt="schema-thumb" src="https://github.com/user-attachments/assets/3afe5640-0396-48cd-abb9-8bfcae3ca7fc" />
<br/>

# @crawl-me-maybe/schema

Schema markup should be generated from your content model, not rebuilt beside it. If editors update the content, the schema should update with it.

## Table of contents

- [Install](#install)
- [Features](#features)
- [Why this exists](#why-this-exists)
- [What `buildSchemaMarkup` generates](#what-buildschemamarkup-generates)
- [Quick start](#quick-start)
- [`mainEntity`](#mainentity)
- [`@id` and de-duplication](#id-and-de-duplication)
- [Rendering the graph](#rendering-the-graph)
- [Supported schemas](#supported-schemas)
- [With Sanity](#with-sanity)
- [Core exports](#core-exports)
- [License](#license)

## Install

```bash
npm install @crawl-me-maybe/schema
pnpm add @crawl-me-maybe/schema
bun add @crawl-me-maybe/schema
yarn add @crawl-me-maybe/schema
```

---

## Features

- `buildSchemaMarkup` emits a JSON-LD graph for identity, `WebSite`, and `WebPage`
- Typed builders for common Schema.org nodes, backed by `schema-dts`
- Entity de-duping by `@id` when nested nodes reference the same entity
- Identity roots for `Person`, `Organization`, and `LocalBusiness`
- Utility builders for breadcrumbs, FAQ pages, products, articles, events, and more

## Why this exists

Schema markup from CMS → frontend is usually handled with a bulk of fields that editors are forced to fill in. This library pushes a bit more work onto developers up front so editors don't have to duplicate content just to satisfy schema markup.

---

## What `buildSchemaMarkup` generates

`buildSchemaMarkup` creates the page-level schema graph for a single URL. It always generates:

- a site identity node (`Organization`, `Person`, or `LocalBusiness`)
- a `WebSite` node
- a `WebPage` node

You can optionally attach additional entities such as:

- `Article`
- `Product`
- `FAQPage`
- `Event`
- `BreadcrumbList`

These are linked into the same graph as the page's main entity, breadcrumb trail, or supporting nodes.

A typical article page graph looks like:

- `Organization` — who owns the site
- `WebSite` — the site itself
- `WebPage` — the current page
- `BreadcrumbList` — optional page hierarchy
- `Article` — the page's main content entity

---

## Quick start

```ts
import {
  buildArticle,
  buildBreadcrumbListSchema,
  buildSchemaMarkup,
} from "@crawl-me-maybe/schema";

const schemas = buildSchemaMarkup({
  identity: {
    type: "organization",
    name: "Acme",
    logo: "https://example.com/logo.png",
  },
  siteUrl: "https://example.com",
  siteName: "Acme",
  siteDescription: "Useful things from Acme.",
  pageUrl: "https://example.com/blog/hello-world",
  pageTitle: "Hello world",
  pageDescription: "An intro post from Acme.",
  breadcrumb: buildBreadcrumbListSchema({
    pagePath: "/blog/hello-world",
    pageTitle: "Hello world",
  }),
  mainEntity: buildArticle({
    headline: "Hello world",
    datePublished: "2026-06-23",
    dateModified: "2026-06-23",
    image: "https://example.com/og.jpg",
  }),
});
```

In this example, `buildSchemaMarkup` creates the site identity, `WebSite`, and `WebPage` nodes automatically, then attaches the breadcrumb and article as part of the same graph.

`buildSchemaMarkup` returns a `string[]` of serialized JSON-LD script payloads, ready to render into `<script type="application/ld+json">` tags. No `JSON.stringify` needed.

> 🧠 Note: Use `buildSchemaMarkup` to assemble the full page-level graph for a URL. Use the individual `build*` helpers to create entities that are passed into that graph as `mainEntity`, breadcrumbs, or nested supporting nodes.

---

## `mainEntity`

Use `mainEntity` for the primary entity the page is about.

Common examples:

- blog post → `buildArticle(...)`
- product page → `buildProduct(...)`
- event page → `buildEvent(...)`
- FAQ page → `buildFAQPage(...)`

If a page has no clear primary entity, you can omit `mainEntity` and render just the page-level graph.

---

## `@id` and de-duplication

If multiple nodes reference the same entity, give them the same `@id`. The library will collapse duplicates into a single graph node where possible.

In most cases, `buildSchemaMarkup` handles page-level identity, `WebSite`, and `WebPage` IDs for you. You'll mainly care about `@id` when composing custom or nested entities manually.

---

## Rendering the graph

```tsx
{schemas.map((schema) => (
  <script
    key={schema}
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: schema }}
  />
))}
```

---

## Supported schemas

Builders are exported from the package root.

### Common page entities

| Builder | Schema.org type |
|---|---|
| `buildArticle` | `Article` |
| `buildProduct` | `Product` |
| `buildEvent` | `Event` |
| `buildFAQPage` | `FAQPage` |
| `buildRecipe` | `Recipe` |
| `buildSoftwareApplication` | `SoftwareApplication` |
| `buildCourse` | `Course` |
| `buildDataset` | `Dataset` |
| `buildMovie` | `Movie` |
| `buildVacationRental` | `VacationRental` |
| `buildVideoObject` | `VideoObject` |
| `buildJobPosting` | `JobPosting` |

### Site / structural entities

Site identity (`Organization`, `Person`, or `LocalBusiness`) is emitted by `buildSchemaMarkup` via the `identity` option — not a separate builder.

| Builder | Schema.org type |
|---|---|
| `buildLocalBusiness` | `LocalBusiness` |
| `buildWebSite` | `WebSite` |
| `buildWebPage` | `WebPage` |
| `buildBreadcrumbListSchema` | `BreadcrumbList` |
| `buildAboutPage` | `AboutPage` |
| `buildContactPage` | `ContactPage` |
| `buildProfilePage` | `ProfilePage` |

### Supporting / nested entities

| Builder | Schema.org type |
|---|---|
| `buildAggregateRating` | `AggregateRating` |
| `buildReview` | `Review` |
| `buildComment` | `Comment` |
| `buildQuestion` | `Question` |
| `buildAnswer` | `Answer` |
| `buildQAPage` | `QAPage` |
| `buildDiscussionForumPosting` | `DiscussionForumPosting` |
| `buildItemList` | `ItemList` |

See Google's [structured data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) for which schema types are eligible for rich results.

---

## With Sanity

This package has no Sanity dependency. You map your GROQ projections to builders in your app.

If you use [`@crawl-me-maybe/sanity-plugin-seo`](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sanity-plugin-seo), `globalSeoSettings.logo` and `globalSeoSettings.siteUrl` are the usual sources for organization identity and absolute page URLs. Pair with [`@crawl-me-maybe/meta`](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/meta) for page titles and descriptions.

**Article page example:**

```groq
*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  _updatedAt,
  "slug": slug.current,
  "image": mainImage.asset->url,
  "body": body
}
```

```ts
import {
  buildArticle,
  buildBreadcrumbListSchema,
  buildSchemaMarkup,
} from "@crawl-me-maybe/schema";

const pageUrl = `${siteUrl}/blog/${post.slug}`;
const schemas = buildSchemaMarkup({
  identity: {
    type: "organization",
    name: globalSeo.siteTitle,
    logo: globalSeo.logoUrl,
  },
  siteUrl,
  siteName: globalSeo.siteTitle,
  pageUrl,
  pageTitle: post.title,
  breadcrumb: buildBreadcrumbListSchema({
    pagePath: `/blog/${post.slug}`,
    pageTitle: post.title,
  }),
  mainEntity: buildArticle({
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    image: post.image,
  }),
});
```

Pick the `build*` helper that matches your document type (`buildProduct`, `buildEvent`, `buildFAQPage`, etc.) and pass it as `mainEntity`. Omit `mainEntity` for generic pages that only need site-level graph nodes.

---

## Core exports

- `buildSchemaMarkup` — builds the page-level JSON-LD graph
- `build*` schema builders — typed builders for individual Schema.org nodes
- `BuilderInput` — input helper type for builder functions
- `BuildSchemaMarkupInput` — input type for `buildSchemaMarkup`
- `Identity`, `PersonIdentity`, `OrganizationIdentity`, `LocalBusinessIdentity` — supported site identity roots

---

## License

MIT
