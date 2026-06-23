# README improvement plan for `@crawl-me-maybe/schema-markup`

The current README is clear, but it still reads more like a package overview than a practical usage guide. The goal of this pass is **not** to make it longer for the sake of it — it’s to make the mental model of the library obvious without forcing people to inspect the source.

## Goals

1. Explain what `buildSchemaMarkup` actually generates at the page level.
2. Clarify how `mainEntity` is intended to be used.
3. Explain `@id` / entity de-duplication in simple terms.
4. Keep the README compact and practical — do **not** turn it into full API docs.

---

# Proposed README structure

## 1. Tighten the intro

Current intro:

> Schema markup should be generated from your content model, not rebuilt beside it. At all costs, avoid breaking the guarantee that schema markup reflects the content model.

Suggested replacement:

> Schema markup should be generated from your content model, not rebuilt beside it. If editors update the content, the schema should update with it.

This keeps the point, but sounds less abstract.

---

## 2. Add a new section: `What buildSchemaMarkup generates`

Place this after **Features** and before **Quick start**.

### Purpose

Right now the README says `buildSchemaMarkup` emits a JSON-LD graph, but it doesn’t explain the graph structure clearly enough. This should be the main conceptual section.

### Content to add

Add a section like:

```md
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

These are linked into the same graph as the page’s main entity, breadcrumb trail, or supporting nodes.
```

### Also add a simple graph mental model

Immediately under that section, add a small example like:

```md
A typical article page graph looks like:

- `Organization` — who owns the site
- `WebSite` — the site itself
- `WebPage` — the current page
- `BreadcrumbList` — optional page hierarchy
- `Article` — the page’s main content entity
```

The point is to help people understand what the package is assembling, not just what functions exist.

---

## 3. Improve the Quick start explanation

Keep the current example, but add a short explanation immediately after it and before the “returns `string[]`” note.

### Add something like:

```md
In this example, `buildSchemaMarkup` creates the site identity, `WebSite`, and `WebPage` nodes automatically, then attaches the breadcrumb and article as part of the same graph.
```

This is important because right now the example shows `breadcrumb` and `mainEntity`, but doesn’t explain how they fit into the output.

---

## 4. Add a dedicated `mainEntity` section

Place this **after Quick start** and **before Rendering JSON-LD**.

### Purpose

`mainEntity` is one of the most important parts of the API, but it currently appears in the example without any explanation.

### Add a section like:

```md
## `mainEntity`

Use `mainEntity` for the primary entity the page is about.

Common examples:

- blog post → `buildArticle(...)`
- product page → `buildProduct(...)`
- event page → `buildEvent(...)`
- FAQ page → `buildFAQPage(...)`

If a page has no clear primary entity, you can omit `mainEntity` and render just the page-level graph.
```

### Optional extra note

If true for the implementation, mention that `mainEntity` can be a single node or array / supporting graph node set. If not, keep it simple and only document the actual supported input.

---

## 5. Add a short `@id` / de-duplication section

Place this **after `mainEntity`** and before Rendering / Supported schemas.

### Purpose

The README mentions de-duping by `@id`, but doesn’t explain when users should care.

### Add a section like:

```md
## `@id` and de-duplication

If multiple nodes reference the same entity, give them the same `@id`. The library will collapse duplicates into a single graph node where possible.

In most cases, `buildSchemaMarkup` handles page-level identity, `WebSite`, and `WebPage` IDs for you. You’ll mainly care about `@id` when composing custom or nested entities manually.
```

Keep it short. This is not the place for a full JSON-LD primer.

---

## 6. Rework `Supported schemas` into grouped categories

The current flat list is fine as a reference, but not great for teaching how the library is meant to be used.

## Replace the single table with grouped sections like:

### Common page entities

* `buildArticle`
* `buildProduct`
* `buildEvent`
* `buildFAQPage`
* `buildRecipe`
* `buildSoftwareApplication`
* `buildCourse`
* `buildDataset`
* `buildMovie`
* `buildVacationRental`
* `buildVideoObject`
* `buildJobPosting`

### Site / structural entities

* `buildOrganization`
* `buildLocalBusiness`
* `buildWebSite`
* `buildWebPage`
* `buildBreadcrumbListSchema`
* `buildAboutPage`
* `buildContactPage`
* `buildProfilePage`

### Supporting / nested entities

* `buildAggregateRating`
* `buildReview`
* `buildComment`
* `buildQuestion`
* `buildAnswer`
* `buildQAPage`
* `buildDiscussionForumPosting`
* `buildItemList`

You can still keep them in tables if you want, but the grouping matters more than the format.

---

## 7. Consider renaming `Rendering JSON-LD`

Optional, but I’d consider one of:

* `Rendering the graph`
* `Rendering in React / Next.js`

`Rendering JSON-LD` is accurate, but slightly generic. If the library is meant to be framework-agnostic, use `Rendering the graph`.

---

## 8. Keep the `Core exports` section, but trim redundancy if needed

If the new sections do a good job explaining the package, the `Core exports` section can stay short.

It should function more like a summary than a substitute for explanation.

---

# Proposed final README outline

```md
# @crawl-me-maybe/schema-markup

<short intro>

## Install

## Features

## Why this exists

## What `buildSchemaMarkup` generates

## Quick start

## `mainEntity`

## `@id` and de-duplication

## Rendering the graph

## Supported schemas

## Core exports

## License
```

---

# Constraints for this pass

## Do

* keep examples concise
* explain the page-level graph clearly
* make the README feel practical and implementation-oriented
* prioritize the “how this library wants to be used” mental model

## Do not

* dump full API docs into the README
* document every builder exhaustively
* add a huge FAQ section
* add extra configuration concepts unless they already exist in the library

---

# Deliverable

Update the README so that a developer can answer these questions without opening source code:

1. What does `buildSchemaMarkup` create automatically?
2. What is `mainEntity` for?
3. When do I use a builder directly vs pass it into `buildSchemaMarkup`?
4. When do I need to think about `@id`?
5. What kinds of schema types are top-level page entities vs supporting nested entities?

```
```
