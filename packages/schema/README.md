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
- [Localized pages](#localized-pages)
- [Nesting entities](#nesting-entities)
- [Dates and durations](#dates-and-durations)
- [Helpers](#helpers)
- [Empty values](#empty-values)
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
- Identity roots for `Person`, `Organization`, and `LocalBusiness`, linkable from any page via `identityRef`
- Utility builders for breadcrumbs, FAQ pages, products, articles, events, and more
- Nested builders for offers, course instances, schedules, places, people, and more
- Cleans the graph for you: nested `@context` and empty values (`null`, `""`, `[]`) are dropped
- Small helpers for ISO 8601 durations and dates, and absolute URLs

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

A nested node with both `@type` and `@id` is hoisted to its own top-level node in the graph, and replaced where it was nested with an `{ "@id": ... }` reference. To link to the site identity, use [`identityRef`](#identityref).

Generated IDs ignore trailing slashes on `siteUrl`, so `https://example.com` and `https://example.com/` produce the same IDs.

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

## Localized pages

Pass `inLanguage` to set the language of the current page. It is emitted on the `WebPage` node only.

```ts
buildSchemaMarkup({
  // ...
  siteUrl: "https://example.com",
  pageUrl: "https://example.com/fr/a-propos",
  pageTitle: "À propos",
  inLanguage: "fr",
});
```

- Pass the language of the content that is actually rendered. If a `/fr/...` route falls back to English content, pass `"en"`.
- Use a BCP 47 tag with hyphens (`fr-CA`, not `fr_CA`). Never pass `x-default`; it is an hreflang value, not a language.
- Keep `siteUrl` as the root origin for every locale (`https://example.com`, not `https://example.com/fr`) so all locales share one `WebSite` `@id`.
- Nested entities don't inherit it and don't need it. Set `inLanguage` on an entity only when its language differs from the page.
- `inLanguage` does not replace hreflang. Localized alternates still come from your sitemap or `<link rel="alternate" hreflang>` tags.

---

## Nesting entities

Nested values like a course's offers or instances need their own `@type`. Use a nested builder where one exists, or a plain object with `"@type"` for anything else:

```ts
import {
  buildCourse,
  buildCourseInstance,
  buildOffer,
  buildSchedule,
  identityRef,
  toIsoDate,
  toIsoDuration,
} from "@crawl-me-maybe/schema";

const mainEntity = buildCourse({
  name: course.title,
  description: course.summary,
  provider: identityRef,
  offers: [
    buildOffer({
      category: "Paid",
      price: course.price,
      priceCurrency: "USD",
    }),
  ],
  hasCourseInstance: [
    buildCourseInstance({
      courseMode: "Online",
      courseWorkload: toIsoDuration({ hours: course.totalHours }),
      courseSchedule: buildSchedule({
        duration: toIsoDuration({ minutes: course.sessionMinutes }),
        repeatFrequency: "P1W",
        startDate: toIsoDate(course.startsAt),
      }),
    }),
  ],
  // No builder for this type — a plain object with "@type" works too.
  audience: { "@type": "EducationalAudience", educationalRole: "student" },
});
```

- Builders add their own `@context`. When nested, `buildSchemaMarkup` strips it, so only top-level nodes carry `@context`.
- There is no automatic `@type` inference. Many properties accept more than one type (`author` can be a `Person` or `Organization`), and `@type` is what gives you accurate autocomplete from `schema-dts`.
- The graph cleanup (nested `@context`, [empty values](#empty-values), and `identityRef`) only happens inside `buildSchemaMarkup`. If you serialize a builder's output yourself, it's emitted as-is.

---

## Dates and durations

Schema.org expects ISO 8601 for dates and durations, but `schema-dts` types them as plain `string`, so nothing catches `"3 hours"` at compile time.

| Format | Common fields |
|---|---|
| Duration (`PT1H30M`) | `Recipe.prepTime` / `cookTime` / `totalTime`, `VideoObject.duration`, `Movie.duration`, `Schedule.duration` / `repeatFrequency`, `CourseInstance.courseWorkload` |
| Date / date-time (`2026-09-28`, `2026-09-28T13:00:00-06:00`) | `Article.datePublished` / `dateModified`, `Event.startDate` / `endDate`, `JobPosting.datePosted` / `validThrough`, `VideoObject.uploadDate`, `Offer.validFrom` / `validThrough` / `priceValidUntil`, `Schedule.startDate` / `endDate` |

### `toIsoDuration(parts)`

Takes an object of named parts, so the unit is always explicit:

```ts
toIsoDuration({ hours: 1, minutes: 30 });       // "PT1H30M"
toIsoDuration({ seconds: video.duration });     // "PT183S"
toIsoDuration({ minutes: recipe.cookMinutes }); // "PT45M"
toIsoDuration({ weeks: 1 });                    // "P1W"
toIsoDuration({ months: 1 });                   // "P1M"
```

- Accepts `years`, `months`, `weeks`, `days`, `hours`, `minutes`, and `seconds`.
- Parts are emitted as given, without carrying over — `{ minutes: 90 }` is `"PT90M"`, which is valid ISO 8601.
- Zero parts are omitted; all zeros gives `"PT0S"`.
- Throws on negative or non-finite values, fractional values other than `seconds`, and `weeks` combined with other parts.

### `toIsoDate(value)`

Accepts a `Date` or an ISO 8601 string:

```ts
toIsoDate(new Date());                     // "2026-09-28T19:17:00.000Z"
toIsoDate("2026-09-28T19:17:00.000Z");     // unchanged (Sanity datetime)
toIsoDate("2026-09-28T13:00:00-06:00");    // unchanged, offset kept
toIsoDate("2026-09-28T13:00+0600");        // "2026-09-28T13:00+06:00"
toIsoDate("2026-09-28");                   // unchanged
```

- `Date` objects are converted to UTC with `toISOString()`.
- Valid ISO strings are returned as written, so an editor's local time and offset survive. `+hhmm` offsets are rewritten to `+hh:mm`.
- Date-times without an offset are passed through unchanged — the helper can't safely guess a timezone.
- Anything else throws.

---

## Helpers

### `identityRef`

Page- and component-level code usually doesn't have the global identity config handy. Use `identityRef` anywhere an entity is expected, and `buildSchemaMarkup` resolves it to the `@id` of the identity node it emits:

```ts
// Page or component level
const mainEntity = buildCourse({
  name: course.title,
  provider: identityRef,
  publisher: identityRef,
});

// App level
buildSchemaMarkup({
  identity: { type: "organization", name: siteName },
  siteUrl,
  siteName,
  pageUrl,
  pageTitle,
  mainEntity,
});
```

Prefer this over inlining `{ "@type": "Organization", name: siteName, url: siteUrl }`. Without an `@id`, the inline version is a second organization that search engines can't link to your site identity.

`identityRef` is a plain object (`{ "@id": "@identity" }`), so it survives being serialized across a server/client or loader boundary. It only resolves inside `buildSchemaMarkup`.

### Reusing other entities

For entities that appear in several places, like an instructor across courses, give them a stable `@id`. They're hoisted to top-level nodes and de-duplicated:

```ts
const instructor = buildPerson({
  "@id": `${siteUrl}#instructor-jane`,
  name: "Jane Doe",
});

buildCourse({
  name: "Intro",
  hasCourseInstance: [
    buildCourseInstance({ courseMode: "Online", instructor: [instructor] }),
  ],
});
```

### `toAbsoluteUrl(value, siteUrl)`

Search engines expect absolute URLs for `url`, `image`, and breadcrumb `item` values. CMS content usually gives you slugs or relative paths:

```ts
toAbsoluteUrl("/blog/post", "https://example.com");        // "https://example.com/blog/post"
toAbsoluteUrl("blog/post", "https://example.com/");        // "https://example.com/blog/post"
toAbsoluteUrl("/a", "https://example.com/docs");           // "https://example.com/docs/a"
toAbsoluteUrl("https://cdn.sanity.io/x.jpg", siteUrl);     // unchanged
toAbsoluteUrl("//cdn.example.com/x.jpg", "https://example.com"); // "https://cdn.example.com/x.jpg"
toAbsoluteUrl(null, siteUrl);                              // undefined
```

Relative values are joined to `siteUrl`, keeping any base path. Empty input returns `undefined`, so the field is dropped from the graph.

### `buildImageObject(input)`

Turns a URL string or an object into an `ImageObject`, typed so it can be passed straight to any `image` or `logo` field. Returns `undefined` for empty input.

```ts
buildImageObject("https://example.com/logo.png");
buildImageObject({ url: image.url, width: 1200, height: 630 });
```

The output always includes `contentUrl` alongside `url`, with the same value. Google's [image metadata](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata) feature requires `contentUrl`, and other uses such as logos read `url`.

To show license and credit details in Google Images, add any of the image metadata fields:

```ts
buildImageObject({
  url: image.url,
  caption: image.alt,
  creditText: "Acme Photography",
  copyrightNotice: "© 2026 Acme",
  license: "https://example.com/image-license",
  acquireLicensePage: "https://example.com/licensing",
  creator: identityRef,
});
```

`creator` accepts `identityRef`, `buildPerson(...)`, `buildOrganization(...)`, or an `{ "@id" }` reference.

### Portable Text

For descriptions stored as Portable Text, convert to a plain string first — for example with `toPlainText` from [`@portabletext/toolkit`](https://github.com/portabletext/toolkit). This package has no Sanity dependency.

---

## Empty values

`buildSchemaMarkup` drops values that carry no information before serializing:

- `null` and `undefined`
- empty or whitespace-only strings
- empty arrays (after removing empty items)
- objects with nothing besides `@type`

`0` and `false` are kept. GROQ returns `null` for unset fields, so projections don't need `coalesce()` just to keep `null` out of the markup.

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

### Nested values

Building blocks for properties like `offers`, `hasCourseInstance`, `location`, or `author`. See [Nesting entities](#nesting-entities).

| Builder | Schema.org type | Typical parent properties |
|---|---|---|
| `buildOffer` | `Offer` | `offers` on Product, Course, Event, SoftwareApplication |
| `buildAggregateOffer` | `AggregateOffer` | `offers` with a price range (`lowPrice`, `highPrice`, `offerCount`) |
| `buildMonetaryAmount` | `MonetaryAmount` | `baseSalary` on JobPosting |
| `buildQuantitativeValue` | `QuantitativeValue` | `value` in MonetaryAmount, product dimensions |
| `buildBrand` | `Brand` | `brand` on Product |
| `buildCourseInstance` | `CourseInstance` | `hasCourseInstance` on Course |
| `buildSchedule` | `Schedule` | `courseSchedule`, `eventSchedule` |
| `buildPlace` | `Place` | `location` on Event, `jobLocation` on JobPosting |
| `buildPostalAddress` | `PostalAddress` | `address` on Place, Organization, LocalBusiness |
| `buildGeoCoordinates` | `GeoCoordinates` | `geo` on Place, LocalBusiness |
| `buildPerson` | `Person` | `author`, `actor`, `director`, `instructor` on CourseInstance |
| `buildOrganization` | `Organization` | `hiringOrganization`, `organizer`, `productionCompany` |
| `buildHowToStep` | `HowToStep` | `recipeInstructions` on Recipe |
| `buildNutritionInformation` | `NutritionInformation` | `nutrition` on Recipe |
| `buildOfferShippingDetails` | `OfferShippingDetails` | `shippingDetails` on Offer |
| `buildMerchantReturnPolicy` | `MerchantReturnPolicy` | `hasMerchantReturnPolicy` on Offer or Organization |

`buildPerson` and `buildOrganization` are for other people and organizations on the page. For the site owner, use `identity` on `buildSchemaMarkup` and link to it with [`identityRef`](#identityref).

**Product merchant listing example:**

```ts
buildProduct({
  name: product.title,
  image: buildImageObject(product.imageUrl),
  offers: [
    buildOffer({
      price: product.price,
      priceCurrency: "USD",
      availability: "InStock",
      shippingDetails: buildOfferShippingDetails({
        shippingRate: buildMonetaryAmount({ value: 0, currency: "USD" }),
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
        },
      }),
      hasMerchantReturnPolicy: buildMerchantReturnPolicy({
        applicableCountry: "US",
        returnPolicyCategory: "MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "ReturnByMail",
        returnFees: "FreeReturn",
      }),
    }),
  ],
});
```

See Google's [structured data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) for which schema types are eligible for rich results.

> Google no longer lists FAQ or Course info rich results. `buildFAQPage`, and `offers` / `hasCourseInstance` on a Course, still produce valid Schema.org markup but won't earn a rich result. Google's Course list only needs `name`, `description`, and `provider` on each `Course`, plus an `ItemList` for the carousel.

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
- `identityRef` — reference to the site identity, resolved by `buildSchemaMarkup`
- `toIsoDuration`, `toIsoDate`, `DurationParts` — ISO 8601 duration and date helpers
- `toAbsoluteUrl` — resolves slugs and relative paths against `siteUrl`
- `buildImageObject`, `ImageInput` — `ImageObject` helper
- `BuilderInput` — input helper type for builder functions
- `BuildSchemaMarkupInput` — input type for `buildSchemaMarkup`
- `Identity`, `PersonIdentity`, `OrganizationIdentity`, `LocalBusinessIdentity` — supported site identity roots

---

## License

MIT
