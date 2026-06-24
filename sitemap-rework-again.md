# Implement manifest-based runtime sitemap API

> **Archived design doc.** This describes the manifest API design that is now shipped as `createSitemapManifest`. See [runtime routes](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/runtime-routes.md) and [splitting](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/splitting.md).

## Goal

Refactor the runtime sitemap API around a **lazy manifest object** that supports:

* a **single sitemap**
* **multiple named sitemaps**
* **automatic splitting** when a sitemap exceeds `maxUrls`
* a **stable child route structure** that does **not** change when a sitemap later grows and begins splitting

The manifest should **not** eagerly resolve all sitemap entries on every request. It should only resolve:

* **all configured sitemaps** when generating the root sitemap/index
* **one specific sitemap** when generating a child sitemap file

---

# High-level API shape

The new runtime API should revolve around:

```ts
const manifest = createSitemapManifest({
  domain,
  basePath: "/sitemap",
  entries,
});
```

The returned manifest object should expose:

```ts
manifest.getRootSitemap()
manifest.getSitemap({ sitemap?, index })
manifest.getSitemapFiles()
```

---

# Key behavior

## `manifest.getRootSitemap()`

Returns the XML that should be served at **`/sitemap.xml`**.

### If there is exactly one concrete sitemap file

Return a normal sitemap XML:

```xml
<urlset>...</urlset>
```

### If there are multiple concrete sitemap files

Return a sitemap index XML:

```xml
<sitemapindex>...</sitemapindex>
```

This means `getRootSitemap()` is effectively:

> “what belongs at `/sitemap.xml`?”

not strictly “always return a sitemap index.”

---

## `manifest.getSitemap({ sitemap?, index })`

Returns one **child sitemap XML file**.

This method should only resolve the **specific sitemap being requested**, not every configured sitemap.

Examples:

```ts
await manifest.getSitemap({ index: 0 })
await manifest.getSitemap({ sitemap: "pages", index: 0 })
await manifest.getSitemap({ sitemap: "products", index: 2 })
```

---

## `manifest.getSitemapFiles()`

Returns metadata for all concrete child sitemap files.

This is mainly useful internally for building the root sitemap/index, but it can be public if desired.

Example return shape:

```ts
[
  {
    sitemap: "pages",
    index: 0,
    path: "/sitemap-pages-0.xml",
  },
  {
    sitemap: "products",
    index: 0,
    path: "/sitemap-products-0.xml",
  },
  {
    sitemap: "products",
    index: 1,
    path: "/sitemap-products-1.xml",
  },
]
```

This method **may** resolve all configured sitemaps, because it needs to know how many concrete files exist.

---

# Stable route structure (index-always)

The library should adopt an **index-always** child sitemap structure so route shapes do not change when a sitemap later grows and splits.

## Root route

Always:

```txt
/sitemap.xml
```

## Single sitemap child files

Always:

```txt
/sitemap-0.xml
/sitemap-1.xml
/sitemap-2.xml
```

Even if the sitemap is currently unsplit, `index 0` is the stable child file identity.

## Named sitemap child files

Always:

```txt
/sitemap-pages-0.xml
/sitemap-blog-0.xml
/sitemap-products-0.xml
/sitemap-products-1.xml
```

This avoids the DX trap where a user starts with `/sitemap-pages.xml` and later has to add a new route shape because that sitemap crossed 50k URLs.

---

# Public config shape

## Entry source types

```ts
type MaybePromise<T> = T | Promise<T>;

type SitemapEntrySource =
  | SitemapEntry[]
  | (() => MaybePromise<SitemapEntry[]>);
```

## Named sitemap definition

A named sitemap can either be a raw entry source or an object with per-sitemap split settings.

```ts
type SitemapDefinition =
  | SitemapEntrySource
  | {
      entries: SitemapEntrySource;
      maxUrls?: number;
    };
```

## Manifest options

```ts
type CreateSitemapManifestOptions = {
  domain: string;
  basePath?: string; // default "/sitemap"
  maxUrls?: number; // default 50_000
  entries: SitemapEntrySource | Record<string, SitemapDefinition>;
};
```

### Notes

* `entries` supports:

  * a **single sitemap** via `SitemapEntrySource`
  * **multiple named sitemaps** via `Record<string, SitemapDefinition>`
* `maxUrls` at the top level is the default split threshold
* a named sitemap definition can override `maxUrls`

---

# Manifest return shape

```ts
type SitemapSelector = {
  sitemap?: string;
  index: number;
};

type SitemapFile = {
  sitemap: string | null;
  index: number;
  path: string;
};

type SitemapManifest = {
  getRootSitemap(): Promise<string>;
  getSitemap(selector: SitemapSelector): Promise<string>;
  getSitemapFiles(): Promise<SitemapFile[]>;
};
```

### Important

`getSitemap()` should return the **XML string** for the selected child sitemap file, not metadata.

---

# Expected behavior by scenario

---

# Scenario 1: single sitemap, unsplit

## User config

```ts
const manifest = createSitemapManifest({
  domain,
  entries: getSitemapEntries,
});
```

## Concrete sitemap files

Internally this represents:

```ts
[
  {
    sitemap: null,
    index: 0,
    path: "/sitemap-0.xml",
  },
]
```

## Root route behavior

`manifest.getRootSitemap()` should return a **normal sitemap XML** (`<urlset>`) because there is only one concrete sitemap file total.

## Child route behavior

`manifest.getSitemap({ index: 0 })` should also work and return that same sitemap file XML.

### Note

The root route should **not** point to `/sitemap-0.xml` in this case. It should just serve the sitemap directly at `/sitemap.xml`.

---

# Scenario 2: single sitemap, split

## User config

```ts
const manifest = createSitemapManifest({
  domain,
  entries: getSitemapEntries,
  maxUrls: 50_000,
});
```

Assume the sitemap resolves to 120k URLs.

## Concrete sitemap files

Internally this represents:

```ts
[
  { sitemap: null, index: 0, path: "/sitemap-0.xml" },
  { sitemap: null, index: 1, path: "/sitemap-1.xml" },
  { sitemap: null, index: 2, path: "/sitemap-2.xml" },
]
```

## Root route behavior

`manifest.getRootSitemap()` returns a **sitemap index** pointing to:

* `/sitemap-0.xml`
* `/sitemap-1.xml`
* `/sitemap-2.xml`

## Child route behavior

`manifest.getSitemap({ index: 1 })` returns the XML for the second chunk only.

---

# Scenario 3: multiple named sitemaps, all unsplit

## User config

```ts
const manifest = createSitemapManifest({
  domain,
  entries: {
    pages: getPageEntries,
    blog: getBlogEntries,
  },
});
```

## Concrete sitemap files

Internally this represents:

```ts
[
  { sitemap: "pages", index: 0, path: "/sitemap-pages-0.xml" },
  { sitemap: "blog", index: 0, path: "/sitemap-blog-0.xml" },
]
```

## Root route behavior

`manifest.getRootSitemap()` returns a sitemap index pointing to:

* `/sitemap-pages-0.xml`
* `/sitemap-blog-0.xml`

## Child route behavior

`manifest.getSitemap({ sitemap: "pages", index: 0 })` returns the pages sitemap XML.

---

# Scenario 4: multiple named sitemaps, one split

## User config

```ts
const manifest = createSitemapManifest({
  domain,
  entries: {
    pages: getPageEntries,
    blog: getBlogEntries,
    products: {
      entries: getProductEntries,
      maxUrls: 50_000,
    },
  },
});
```

Assume `products` resolves to 120k URLs.

## Concrete sitemap files

Internally this represents:

```ts
[
  { sitemap: "pages", index: 0, path: "/sitemap-pages-0.xml" },
  { sitemap: "blog", index: 0, path: "/sitemap-blog-0.xml" },
  { sitemap: "products", index: 0, path: "/sitemap-products-0.xml" },
  { sitemap: "products", index: 1, path: "/sitemap-products-1.xml" },
  { sitemap: "products", index: 2, path: "/sitemap-products-2.xml" },
]
```

## Root route behavior

`manifest.getRootSitemap()` returns a sitemap index pointing to all of the above child files.

## Child route behavior

`manifest.getSitemap({ sitemap: "products", index: 2 })` returns only the third `products` chunk.

---

# Internal implementation plan

# 1) Add shared entry source types

Create or reuse the following runtime types:

```ts
type MaybePromise<T> = T | Promise<T>;

type SitemapEntrySource =
  | SitemapEntry[]
  | (() => MaybePromise<SitemapEntry[]>);

type SitemapDefinition =
  | SitemapEntrySource
  | {
      entries: SitemapEntrySource;
      maxUrls?: number;
    };
```

---

# 2) Implement `createSitemapManifest()`

Add a new exported helper:

```ts
function createSitemapManifest(
  options: CreateSitemapManifestOptions,
): SitemapManifest
```

This should return a **lazy manifest object**. It should **not** resolve any entries during construction.

It should store:

* `domain`
* `basePath`
* top-level `maxUrls`
* sitemap entry config

---

# 3) Add an internal normalizer for entry config

Create an internal helper that normalizes the manifest config into a consistent array of sitemap definitions.

## Suggested normalized shape

```ts
type NormalizedSitemapDefinition = {
  sitemap: string | null;
  entries: SitemapEntrySource;
  maxUrls?: number;
};
```

### Single sitemap input

```ts
entries: getSitemapEntries
```

normalizes to:

```ts
[
  {
    sitemap: null,
    entries: getSitemapEntries,
  },
]
```

### Multiple named sitemap input

```ts
entries: {
  pages: getPageEntries,
  blog: {
    entries: getBlogEntries,
    maxUrls: 10_000,
  },
}
```

normalizes to:

```ts
[
  {
    sitemap: "pages",
    entries: getPageEntries,
  },
  {
    sitemap: "blog",
    entries: getBlogEntries,
    maxUrls: 10_000,
  },
]
```

---

# 4) Add an internal resolver for `SitemapEntrySource`

Create or reuse:

```ts
async function resolveSitemapEntrySource(
  source: SitemapEntrySource,
): Promise<SitemapEntry[]>
```

Behavior:

* if array → return directly
* if function → call and await it

---

# 5) Add an internal chunking helper

Create or reuse a helper that chunks a resolved sitemap into `maxUrls`-sized arrays.

```ts
function chunkEntries(
  entries: SitemapEntry[],
  maxUrls: number,
): SitemapEntry[][]
```

Default `maxUrls` should be `50_000`.

---

# 6) Add child path generation rules

Create an internal helper for generating stable child sitemap paths.

## Suggested signature

```ts
function getChildSitemapPath(options: {
  basePath: string;
  sitemap: string | null;
  index: number;
}): string
```

## Rules

### Single sitemap child files

```ts
getChildSitemapPath({ basePath: "/sitemap", sitemap: null, index: 0 })
// "/sitemap-0.xml"
```

### Named sitemap child files

```ts
getChildSitemapPath({ basePath: "/sitemap", sitemap: "pages", index: 0 })
// "/sitemap-pages-0.xml"
```

```ts
getChildSitemapPath({ basePath: "/sitemap", sitemap: "products", index: 2 })
// "/sitemap-products-2.xml"
```

### Important

* `basePath` should not include `.xml`
* all child sitemap files should use the **index-always** structure

---

# 7) Implement `manifest.getSitemapFiles()`

This method should:

1. normalize all configured sitemap definitions
2. resolve each sitemap’s entries
3. split each sitemap into chunks using:

   * per-sitemap `maxUrls` if present
   * otherwise top-level `maxUrls`
   * otherwise `50_000`
4. return a flat list of sitemap file metadata

## Return shape

```ts
[
  {
    sitemap: "pages",
    index: 0,
    path: "/sitemap-pages-0.xml",
  },
  {
    sitemap: "products",
    index: 1,
    path: "/sitemap-products-1.xml",
  },
]
```

### Important

This method may resolve **all configured sitemaps**. That is acceptable because it is primarily used by the root sitemap logic.

---

# 8) Implement `manifest.getSitemap(selector)`

This method should resolve **only one sitemap definition**.

## Selector shape

```ts
type SitemapSelector = {
  sitemap?: string;
  index: number;
};
```

## Behavior

1. find the correct normalized sitemap definition:

   * if single sitemap config → only valid selector is `{ index }`
   * if multiple named sitemaps → `sitemap` is required
2. resolve that sitemap’s entries only
3. split into chunks
4. return the selected chunk as sitemap XML using `generateSitemap(domain, { entries })`

## Errors

Throw a typed error if:

* a named sitemap selector does not match any configured sitemap
* the requested `index` does not exist for that sitemap

---

# 9) Implement `manifest.getRootSitemap()`

This method should:

1. call `manifest.getSitemapFiles()`
2. inspect the number of concrete sitemap files

## If `files.length === 1`

Return the actual sitemap XML for that single file.

### Important

Do **not** return a sitemap index in this case.

This means:

* resolve the single sitemap’s entries
* return `generateSitemap(domain, { entries })`

## If `files.length > 1`

Return a sitemap index XML using:

```ts
generateSitemapIndex(domain, {
  sitemaps: files.map((file) => file.path),
})
```

This is the logic that makes `/sitemap.xml` behave correctly for both:

* single unsplit sitemaps
* split or multi-sitemap setups

---

# 10) Add typed errors

Add or reuse errors for:

```ts
class SitemapNotFoundError extends Error {}
class SitemapPartNotFoundError extends Error {}
```

Use them when:

* a named sitemap selector is invalid
* a requested split index does not exist

---

# 11) Keep `generateSitemap()` and `generateSitemapIndex()` as low-level primitives

Do **not** merge the manifest logic into `generateSitemap()`.

The manifest layer should sit **above** the existing primitives.

The expected layering is:

* `generateSitemap()` → generate one concrete sitemap XML file from entries
* `generateSitemapIndex()` → generate a sitemap index from paths
* `createSitemapManifest()` → orchestration layer for root + child sitemap runtime routing

---

# Documentation examples to add

The docs should show the new stable runtime pattern.

---

# Example 1: single sitemap, unsplit

```ts
// app/sitemap.xml/route.ts
import { createSitemapManifest } from "@crawl-me-maybe/sitemap";

const manifest = createSitemapManifest({
  domain,
  entries: getSitemapEntries,
});

export async function GET() {
  const xml = await manifest.getRootSitemap();

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### Notes

* no child routes are required unless the user wants to future-proof for splitting
* if the sitemap remains unsplit, `/sitemap.xml` serves the real sitemap XML directly

---

# Example 2: single sitemap with split support

## Root route

```ts
// app/sitemap.xml/route.ts
import { createSitemapManifest } from "@crawl-me-maybe/sitemap";

const manifest = createSitemapManifest({
  domain,
  entries: getSitemapEntries,
});

export async function GET() {
  const xml = await manifest.getRootSitemap();

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

## Child route

```ts
// app/sitemap-[index].xml/route.ts
import { createSitemapManifest } from "@crawl-me-maybe/sitemap";

const manifest = createSitemapManifest({
  domain,
  entries: getSitemapEntries,
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ index: string }> },
) {
  const { index } = await params;

  const xml = await manifest.getSitemap({
    index: Number(index),
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### Notes

* if the sitemap never exceeds the split threshold, `/sitemap.xml` will continue to serve the actual sitemap directly
* if it later grows and splits, the child route is already in place

---

# Example 3: multiple named sitemaps

## Shared manifest

```ts
// lib/sitemaps.ts
import { createSitemapManifest } from "@crawl-me-maybe/sitemap";

export const manifest = createSitemapManifest({
  domain,
  entries: {
    pages: getPageEntries,
    blog: getBlogEntries,
    products: {
      entries: getProductEntries,
      maxUrls: 50_000,
    },
  },
});
```

## Root route

```ts
// app/sitemap.xml/route.ts
import { manifest } from "@/lib/sitemaps";

export async function GET() {
  const xml = await manifest.getRootSitemap();

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

## Child route

```ts
// app/sitemap-[sitemap]-[index].xml/route.ts
import { manifest } from "@/lib/sitemaps";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sitemap: string; index: string }> },
) {
  const { sitemap, index } = await params;

  const xml = await manifest.getSitemap({
    sitemap,
    index: Number(index),
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### Notes

* unsplit named sitemaps still use `index: 0`
* split named sitemaps use `index > 0`
* the route structure never changes when a sitemap later grows

---

# Testing requirements

Add tests for the following scenarios:

## `getRootSitemap()`

* single sitemap, unsplit → returns `<urlset>`
* single sitemap, split → returns `<sitemapindex>`
* multiple named sitemaps → returns `<sitemapindex>`
* multiple named sitemaps with one split → returns `<sitemapindex>`

## `getSitemap()`

* single sitemap, `index: 0`
* single split sitemap, `index > 0`
* named unsplit sitemap, `index: 0`
* named split sitemap, `index > 0`
* invalid sitemap name throws
* invalid split index throws

## `getSitemapFiles()`

* returns correct child paths for:

  * single sitemap
  * named sitemap
  * named split sitemap

---

# Acceptance criteria

This work is complete when:

* `createSitemapManifest()` exists and returns a lazy manifest object
* the manifest object exposes:

  * `getRootSitemap()`
  * `getSitemap({ sitemap?, index })`
  * `getSitemapFiles()`
* `getRootSitemap()` returns:

  * a real sitemap XML if there is exactly one concrete sitemap file
  * a sitemap index XML if there are multiple concrete sitemap files
* child sitemap paths always use the **index-always** format:

  * single → `/sitemap-0.xml`
  * named → `/sitemap-pages-0.xml`
* `getSitemap()` resolves only the requested sitemap definition, not all configured sitemaps
* docs include the root + child route examples above
