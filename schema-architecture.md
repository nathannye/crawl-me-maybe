# Schema Generation Architecture Specification

## Goals

1. Support all Google Rich Result eligible schema types.
2. Keep schema builders independent and composable.
3. Hide all internal `@id` generation from consumers.
4. Avoid graph managers, registries, or explicit relationship APIs.
5. Make the common case extremely simple.
6. Allow advanced users to compose arbitrary schema graphs.

---

# Core Architecture

The library consists of three layers:

```txt
Schema Builders
├── buildOrganizationSchema()
├── buildWebSiteSchema()
├── buildWebPageSchema()
├── buildRecipeSchema()
├── buildProductSchema()
└── etc

Graph Assembly
└── buildSchemaMarkup()
```

---

# Design Principles

## Builders Create Nodes

Builders are responsible for generating individual schema nodes.

Example:

```ts
const recipe = buildRecipeSchema(...)
```

returns:

```json
{
  "@type": "Recipe",
  "@id": "...",
}
```

Builders should not be aware of the overall graph.

---

## IDs Are Internal

Consumers never provide IDs.

Consumers never reference IDs.

Builders generate IDs internally.

Relationships are established by passing schema objects.

Example:

```ts
const recipe = buildRecipeSchema(...)

buildWebPageSchema({
  mainEntity: recipe,
})
```

The builder extracts the internal `@id`.

---

## Graphs Are Arrays

The final graph is always:

```ts
SchemaNode[]
```

Consumers should be able to compose arrays freely.

Example:

```ts
[
  ...buildSchemaMarkup(...),
  buildVideoObjectSchema(...),
]
```

No graph manager is required.

---

# Global Schema Package

## Purpose

Provide the common schema graph that exists on nearly every page.

The package creates:

```txt
Identity
└── Organization | Person | LocalBusiness

WebSite

WebPage
```

and wires the standard relationships automatically.

---

## API

```ts
buildSchemaMarkup({
  identity,

  siteUrl,
  siteName,
  siteDescription,

  pageUrl,
  pageTitle,
  pageDescription,

  breadcrumb,
  mainEntity,
})
```

---

## Output

```txt
Organization
WebSite
WebPage
```

or

```txt
Person
WebSite
WebPage
```

or

```txt
LocalBusiness
WebSite
WebPage
```

depending on identity type.

---

## Automatically Wired Relationships

### Publisher

```txt
WebSite
└── publisher -> Identity
```

---

### Is Part Of

```txt
WebPage
└── isPartOf -> WebSite
```

---

### Breadcrumb

```txt
WebPage
└── breadcrumb -> BreadcrumbList
```

when provided.

---

### Main Entity

```txt
WebPage
└── mainEntity -> Content Entity
```

when provided.

---

# Rich Result Builders

## Content Entities

These are intended to be attached to a WebPage through `mainEntity`.

```txt
Article
Course
Dataset
DiscussionForumPosting
JobPosting
Movie
Product
Recipe
SoftwareApplication
VacationRental
VideoObject
Event
```

Example:

```ts
const recipe = buildRecipeSchema(...)

const schema = buildSchemaMarkup({
  ...
  mainEntity: recipe,
})
```

---

# Supporting Builders

These are typically attached to other entities.

```txt
AggregateRating
Review
Comment
Answer
Question
BreadcrumbList
ItemList
```

---

# Relationship Ownership

Relationships should be owned by the schema type that naturally contains them.

---

## WebSite

```ts
buildWebSiteSchema({
  publisher,
})
```

Allowed:

```txt
Organization
Person
LocalBusiness
```

---

## WebPage

```ts
buildWebPageSchema({
  breadcrumb,
  mainEntity,
})
```

Allowed breadcrumb:

```txt
BreadcrumbList
```

Allowed mainEntity:

```txt
Article
Course
Dataset
DiscussionForumPosting
JobPosting
Movie
Product
Recipe
SoftwareApplication
VacationRental
VideoObject
Event
```

---

## Recipe

```ts
buildRecipeSchema({
  aggregateRating,
  reviews,
})
```

---

## Product

```ts
buildProductSchema({
  aggregateRating,
  reviews,
})
```

---

## SoftwareApplication

```ts
buildSoftwareApplicationSchema({
  aggregateRating,
  reviews,
})
```

---

## Course

```ts
buildCourseSchema({
  aggregateRating,
  reviews,
})
```

---

## Movie

```ts
buildMovieSchema({
  aggregateRating,
  reviews,
})
```

---

## LocalBusiness

```ts
buildLocalBusinessSchema({
  aggregateRating,
  reviews,
})
```

---

## VacationRental

```ts
buildVacationRentalSchema({
  aggregateRating,
  reviews,
})
```

---

## DiscussionForumPosting

```ts
buildDiscussionForumPostingSchema({
  comments,
})
```

Allowed:

```txt
Comment[]
```

---

## Question

```ts
buildQuestionSchema({
  acceptedAnswer,
  suggestedAnswers,
})
```

Allowed:

```txt
Answer
Answer[]
```

---

## QAPage

```ts
buildQAPageSchema({
  question,
})
```

Allowed:

```txt
Question
```

QAPage owns the Question relationship.

---

## ItemList

```ts
buildItemListSchema({
  items,
})
```

Allowed:

```txt
Course[]
Event[]
Movie[]
Product[]
Recipe[]
SoftwareApplication[]
VideoObject[]
```

---

# Rich Result Page Patterns

## Recipe

```txt
Organization
WebSite
WebPage
Recipe
AggregateRating
Review[]
```

Relationships:

```txt
WebSite.publisher -> Organization
WebPage.isPartOf -> WebSite
WebPage.mainEntity -> Recipe

Recipe.aggregateRating -> AggregateRating
Recipe.review -> Review[]
```

---

## Product

```txt
Organization
WebSite
WebPage
Product
AggregateRating
Review[]
```

---

## Job Posting

```txt
Organization
WebSite
WebPage
JobPosting
```

---

## Course

```txt
Organization
WebSite
WebPage
Course
AggregateRating
Review[]
```

---

## Software Application

```txt
Organization
WebSite
WebPage
SoftwareApplication
AggregateRating
Review[]
```

---

## Movie

```txt
Organization
WebSite
WebPage
Movie
AggregateRating
Review[]
```

---

## Dataset

```txt
Organization
WebSite
WebPage
Dataset
```

---

## Discussion Forum

```txt
Organization
WebSite
WebPage
DiscussionForumPosting
Comment[]
```

---

## Q&A

```txt
Organization
WebSite
QAPage
Question
Answer[]
```

QAPage replaces WebPage.

---

## Profile

```txt
Organization
WebSite
ProfilePage
```

ProfilePage replaces WebPage.

---

# Advanced Composition

Consumers may freely append additional schema nodes.

Example:

```ts
const schema = [
  ...buildSchemaMarkup({
    ...
    mainEntity: recipe,
  }),

  buildVideoObjectSchema(...),
  buildItemListSchema(...),
]
```

This should be the preferred extension mechanism.

No graph APIs should be introduced unless future schema relationships prove the current model insufficient.

---

# TypeScript Enforcement

TypeScript should prevent invalid relationships.

Example:

```ts
buildWebPageSchema({
  mainEntity: recipe,
})
```

✅ Valid

```ts
buildWebPageSchema({
  mainEntity: organization,
})
```

❌ Invalid

Likewise:

```ts
buildRecipeSchema({
  aggregateRating,
})
```

✅ Valid

```ts
buildRecipeSchema({
  aggregateRating: recipe,
})
```

❌ Invalid

Relationship constraints should be encoded in builder option types wherever practical.
