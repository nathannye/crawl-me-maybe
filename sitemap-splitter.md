# Implement split sitemap support in `@crawl-me-maybe/sitemap`

## Goal

Add **split sitemap support** to the core runtime package so a single large sitemap can be broken into multiple numbered child sitemap files and referenced from a sitemap index.

This should support the common case where a single logical sitemap exceeds the 50k URL limit and needs to be exposed as:

* `/sitemap-0.xml`
* `/sitemap-1.xml`
* `/sitemap-2.xml`

with a root sitemap index pointing to those child files.

The implementation should remain **framework-agnostic**. The core package should not return `Response` objects or contain Next-specific route helpers.

---

# Scope

## In scope

* add a helper that resolves a sitemap entry source and splits it into numbered parts
* return enough metadata for:

  * a child split sitemap route
  * a sitemap index route
* document the recommended runtime pattern for sharing split metadata between routes

## Out of scope

* named sitemap support
* combined named + split orchestration
* framework-specific adapters like `createSitemapRoute()`
* Next-specific helpers that return `[{ id: 0 }, { id: 1 }]`

---

# Desired API

Add a new exported helper:

```ts id="z7sl1w"
const split = await splitSitemap({
  entries: getProductSitemapEntries,
  basePath: "/sitemap-products",
  maxUrls: 50_000,
});
```

Expected return shape:

```ts id="n3m1yr"
{
  parts: [
    {
      index: 0,
      path: "/sitemap-products-0.xml",
      entries: [...]
    },
    {
      index: 1,
      path: "/sitemap-products-1.xml",
      entries: [...]
    },
  ],
}
```

This allows:

* a child route to use `split.parts[index]`
* an index route to use `split.parts.map((part) => part.path)`

---

# Intended usage

## Split child sitemap route

```ts id="0dcdph"
const split = await splitSitemap({
  entries: getProductSitemapEntries,
  basePath: "/sitemap-products",
});

const part = split.parts[Number(params.part)];
if (!part) return new Response("Not found", { status: 404 });

const xml = generateSitemap(domain, {
  entries: part.entries,
});
```

## Sitemap index route

```ts id="cksnzi"
const split = await splitSitemap({
  entries: getProductSitemapEntries,
  basePath: "/sitemap-products",
});

const xml = generateSitemapIndex(domain, {
  sitemaps: split.parts.map((part) => part.path),
});
```

---

# Implementation plan

# 1) Add or reuse a single sitemap entry source type

The split helper should accept the same basic entry source shape as `generateSitemap()`.

## Add type

```ts id="g7aehv"
type MaybePromise<T> = T | Promise<T>;

type SitemapEntrySource =
  | SitemapEntry[]
  | (() => MaybePromise<SitemapEntry[]>);
```

If an equivalent type already exists internally, reuse it instead of introducing a duplicate.

---

# 2) Add a small internal resolver for entry sources

Create or reuse a helper that normalizes a sitemap entry source into a `SitemapEntry[]`.

## Internal helper

```ts id="z28ipj"
async function resolveSitemapEntrySource(
  source: SitemapEntrySource,
): Promise<SitemapEntry[]>
```

Behavior:

* if `source` is an array, return it directly
* if `source` is a function, call it and await the result

This helper can remain internal unless there is already a good reason to export it.

---

# 3) Add `splitSitemap()` to core

## Proposed API

```ts id="w3vboq"
type SplitSitemapOptions = {
  entries: SitemapEntrySource;
  basePath: string;
  maxUrls?: number;
};

type SplitSitemapPart = {
  index: number;
  path: string;
  entries: SitemapEntry[];
};

type SplitSitemapResult = {
  parts: SplitSitemapPart[];
};

async function splitSitemap(
  options: SplitSitemapOptions,
): Promise<SplitSitemapResult>
```

Export this from the main package entrypoint.

---

# 4) Implement split logic

## `splitSitemap()` should:

1. resolve the input `entries` into a flat `SitemapEntry[]`
2. split that array into chunks of `maxUrls`
3. return one `parts[]` item per chunk
4. attach:

   * `index`
   * `path`
   * `entries`

## Default `maxUrls`

Default `maxUrls` to:

```ts id="cm1hcz"
50_000
```

---

# 5) Implement child sitemap path generation

`splitSitemap()` should generate a child path for each part.

## Input

```ts id="lnnnyg"
basePath: "/sitemap-products"
```

## Output paths

```ts id="zrr82k"
/sitemap-products-0.xml
/sitemap-products-1.xml
/sitemap-products-2.xml
```

## Rules

* `basePath` should **not** include `.xml`
* child paths should always be:

```ts id="m8d4gm"
`${basePath}-${index}.xml`
```

Examples:

* `/sitemap` → `/sitemap-0.xml`
* `/sitemap-products` → `/sitemap-products-0.xml`

---

# 6) Decide and document empty-entry behavior

If the resolved entry list is empty, decide what `splitSitemap()` should return.

## Recommended behavior

Return:

```ts id="5xmvz6"
{ parts: [] }
```

This avoids generating a fake `/sitemap-0.xml` that contains no URLs unless the caller explicitly wants that.

If a different behavior is preferred, document it clearly and test it.

---

# 7) Keep `generateSitemap()` unchanged

Do **not** add split-specific options directly to `generateSitemap()` in this pass.

Avoid APIs like:

```ts id="7my8w7"
generateSitemap(domain, {
  entries,
  split: true,
  part: 0,
});
```

or:

```ts id="0bnhh3"
generateSitemap(domain, {
  entries,
  chunk: 0,
});
```

The split helper should handle planning/chunking. `generateSitemap()` should remain focused on generating **one concrete sitemap XML file** from a concrete entry list.

The intended flow is:

```ts id="c9hl3x"
const split = await splitSitemap({
  entries: getEntries,
  basePath: "/sitemap-products",
});

const part = split.parts[partIndex];

const xml = generateSitemap(domain, {
  entries: part.entries,
});
```

---

# 8) Add tests for split behavior

## Basic split

* input has fewer than `maxUrls`
* returns a single part
* part has:

  * `index: 0`
  * correct `.path`
  * all entries

## Multi-part split

* input exceeds `maxUrls`
* returns multiple parts
* each part contains the correct slice of entries
* indexes are sequential starting at `0`

## Custom `maxUrls`

* verify chunking with a small limit like `2`

## Async entry source

* works when `entries` is an async function

## Empty entries

* verify the chosen behavior for an empty sitemap source

## Path generation

* `/sitemap` produces `/sitemap-0.xml`
* `/sitemap-products` produces `/sitemap-products-0.xml`

---

# 9) Add docs/examples for split sitemap usage

Add a minimal runtime docs section showing the intended split sitemap flow.

## Example: shared split helper

```ts id="vpk6qb"
// lib/product-sitemap.ts
import { splitSitemap } from "@crawl-me-maybe/sitemap";

export function getProductSitemapSplit() {
  return splitSitemap({
    entries: getProductSitemapEntries,
    basePath: "/sitemap-products",
  });
}
```

## Example: split child route

```ts id="v57sfr"
// app/sitemap-products-[part].xml/route.ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";
import { getProductSitemapSplit } from "@/lib/product-sitemap";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ part: string }> },
) {
  const { part } = await params;
  const split = await getProductSitemapSplit();

  const child = split.parts[Number(part)];
  if (!child) return new Response("Not found", { status: 404 });

  const xml = generateSitemap(domain, {
    entries: child.entries,
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

## Example: split sitemap index route

```ts id="r62fx8"
// app/sitemap.xml/route.ts
import { generateSitemapIndex } from "@crawl-me-maybe/sitemap";
import { getProductSitemapSplit } from "@/lib/product-sitemap";

export async function GET() {
  const split = await getProductSitemapSplit();

  const xml = generateSitemapIndex(domain, {
    sitemaps: split.parts.map((part) => part.path),
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

---

# 10) Document the recommended runtime pattern

The docs should explicitly recommend that users **share the split plan/helper** between:

* the child split sitemap route
* the sitemap index route

The important idea is:

* the child route needs `part.entries`
* the index route needs `part.path`

Both routes should derive that from the same split helper rather than duplicating path logic or chunking logic separately.

---

# Suggested file/task breakdown

## Runtime types

* add or reuse `SitemapEntrySource`

## Runtime helpers

* add or reuse `resolveSitemapEntrySource()`

## Split implementation

* add `splitSitemap()`
* implement chunking logic
* implement child path generation

## Tests

* add `splitSitemap()` coverage for:

  * one part
  * many parts
  * async source
  * custom `maxUrls`
  * empty input
  * path generation

## Docs

* add split sitemap examples to README / docs
* show shared split helper + child route + index route

---

# Acceptance criteria

This work is done when all of the following are true:

* `splitSitemap()` is exported from the core package
* `splitSitemap()` accepts a single sitemap entry source and a `basePath`
* `splitSitemap()` returns numbered parts with:

  * `index`
  * `path`
  * `entries`
* a split child sitemap route can select a part via a numeric route param
* a sitemap index route can generate an index using `split.parts.map((part) => part.path)`
* docs include a minimal split sitemap example showing a shared split helper between the child route and the index route
