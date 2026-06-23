# @crawl-me-maybe/schema-markup

Schema markup should be generated from your content model, not rebuilt beside it. At all costs, avoid breaking the guarantee that schema markup reflects the content model.

## Table of contents

- [Install](#install)
- [Features](#features)
- [Why this exists](#why-this-exists)
- [Quick start](#quick-start)
- [Rendering JSON-LD](#rendering-json-ld)
- [Supported schemas](#supported-schemas)
- [Core exports](#core-exports)
- [License](#license)

## Install

```bash
npm install @crawl-me-maybe/schema-markup
pnpm add @crawl-me-maybe/schema-markup
bun add @crawl-me-maybe/schema-markup
yarn add @crawl-me-maybe/schema-markup
```

---

## Features

- `buildSchemaMarkup` emits a JSON-LD graph for identity, `WebSite`, and `WebPage`
- Typed builders for common Schema.org nodes, backed by `schema-dts`
- Entity de-duping by `@id` when nested nodes reference the same entity
- Identity roots for `Person`, `Organization`, and `LocalBusiness`
- Utility builders for breadcrumbs, FAQ pages, products, articles, events, and more

## Why this exists

Schema markup from CMS → frontend is usually handled with a bulk of fields that editors are forced to fill in, often duplicating content that's already present. This library takes advantage of more developer work up front to reduce the load on editors.

---

## Quick start

```ts
import {
  buildArticle,
  buildBreadcrumbListSchema,
  buildSchemaMarkup,
} from "@crawl-me-maybe/schema-markup";

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
    pageUrl: "/blog/hello-world",
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

`buildSchemaMarkup` returns `string[]`, with each string ready to render in a `<script type="application/ld+json">`.

---

## Rendering JSON-LD

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

Builders are exported from the package root:

| Builder | Schema.org type |
|---|---|
| `buildAboutPage` | `AboutPage` |
| `buildAggregateRating` | `AggregateRating` |
| `buildAnswer` | `Answer` |
| `buildArticle` | `Article` |
| `buildComment` | `Comment` |
| `buildContactPage` | `ContactPage` |
| `buildCourse` | `Course` |
| `buildDataset` | `Dataset` |
| `buildDiscussionForumPosting` | `DiscussionForumPosting` |
| `buildEvent` | `Event` |
| `buildFAQPage` | `FAQPage` |
| `buildItemList` | `ItemList` |
| `buildJobPosting` | `JobPosting` |
| `buildLocalBusiness` | `LocalBusiness` |
| `buildMovie` | `Movie` |
| `buildOrganization` | `Organization` |
| `buildProduct` | `Product` |
| `buildProfilePage` | `ProfilePage` |
| `buildQAPage` | `QAPage` |
| `buildQuestion` | `Question` |
| `buildRecipe` | `Recipe` |
| `buildReview` | `Review` |
| `buildSoftwareApplication` | `SoftwareApplication` |
| `buildVacationRental` | `VacationRental` |
| `buildVideoObject` | `VideoObject` |
| `buildWebPage` | `WebPage` |
| `buildWebSite` | `WebSite` |
| `buildBreadcrumbListSchema` | `BreadcrumbList` |

See Google's [structured data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) for which schema types are eligible for rich results.

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
