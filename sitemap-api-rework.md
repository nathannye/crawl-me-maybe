# Proposed runtime API shape for `@crawl-me-maybe/sitemap`

> **Archived design doc.** The manifest-based API described here has been implemented. See [sitemap README](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap) and [API reference](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/api.md).

The runtime `generateSitemap()` API should support the same high-level mental model as the Vite plugin:

* **single sitemap** → one set of entries
* **multi sitemap** → a named object of entry sources, plus a selected sitemap key

The goal is to reduce boilerplate in dynamic sitemap endpoints without introducing framework-specific helpers.

---

# Proposed API

## Single sitemap

Allow `entries` to be either:

* a plain array of sitemap entries
* a function returning an array of sitemap entries
* an async function returning an array of sitemap entries

```ts
generateSitemap(domain, {
  entries: [
    { path: "/" },
    { path: "/about" },
  ],
});
```

```ts
generateSitemap(domain, {
  entries: () => [
    { path: "/" },
    { path: "/about" },
  ],
});
```

```ts
generateSitemap(domain, {
  entries: async () => [
    { path: "/" },
    { path: "/about" },
  ],
});
```

---

## Multi sitemap

Allow `entries` to also be an object of named sitemap entry sources.

When `entries` is an object, require a `sitemap` option to select which one should be generated.

```ts
generateSitemap(domain, {
  entries: {
    pages: getPageSitemapEntries,
    blog: getBlogSitemapEntries,
  },
  sitemap: "blog",
});
```

This should resolve the selected entry source, run it if needed, and generate the XML for that sitemap.

---

# Example: Next.js dynamic route

```ts
// app/sitemap/[sitemap].xml/route.ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

const entries = {
  pages: getPageSitemapEntries,
  blog: getBlogSitemapEntries,
} as const;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sitemap: keyof typeof entries }> },
) {
  const { sitemap } = await params;

  try {
    const xml = await generateSitemap(domain, {
      entries,
      sitemap,
    });

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
```

This is the main runtime DX target for multi-sitemap endpoints.

---

# Example: simple API route with a single async sitemap

```ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const xml = await generateSitemap(domain, {
    entries: async () => {
      const pages = await getPages();

      return pages.map((page) => ({
        path: page.slug,
        lastmod: page.updatedAt,
      }));
    },
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
```

---

# Example: static entries

```ts
import { generateSitemap } from "@crawl-me-maybe/sitemap";

const xml = await generateSitemap(domain, {
  entries: [
    { path: "/" },
    { path: "/about" },
    { path: "/contact" },
  ],
});
```

---

# Proposed option shape

```ts
type SitemapEntrySource =
  | SitemapEntry[]
  | (() => SitemapEntry[] | Promise<SitemapEntry[]>);

type NamedSitemapEntrySources = Record<string, SitemapEntrySource>;

type GenerateSitemapOptions =
  | {
      entries: SitemapEntrySource;
      sitemap?: never;
    }
  | {
      entries: NamedSitemapEntrySources;
      sitemap: string;
    };
```

---

# Behavior rules

## `entries` as a single sitemap source

If `entries` is:

* an array → use it directly
* a function → call it and use the returned array

## `entries` as a named sitemap object

If `entries` is an object of named sitemap sources:

* require `sitemap`
* resolve `entries[sitemap]`
* if no matching key exists, throw a typed not-found error
* if the resolved value is a function, call it
* generate XML from the resolved entry list

---

# Error cases to handle

## Invalid multi-sitemap usage

Throw clear errors for:

* `entries` is an object, but `sitemap` is missing
* `entries` is an object, but `sitemap` does not match a key
* invalid entry source shape

## Suggested typed error

```ts
class SitemapNotFoundError extends Error {}
```

This lets framework code return a 404 without string-matching errors.

---

# Naming decisions

## Use `sitemap`, not `name`

For multi-sitemap selection, prefer:

```ts
generateSitemap(domain, {
  entries,
  sitemap: "blog",
});
```

instead of:

```ts
generateSitemap(domain, {
  entries,
  name: "blog",
});
```

`sitemap` is more self-explanatory and reads better in route params:

```ts
// app/sitemap/[sitemap].xml/route.ts
```

---

# Non-goals

## No framework-specific route helpers in core

Do **not** make the core package return `Response` objects or expose helpers like `createSitemapRoute()`.

The core package should stay framework-agnostic and return XML strings.

Framework code is still responsible for:

* reading route params
* returning the response
* mapping not-found errors to 404s

---

# Summary

## Recommended runtime API direction

Support this:

```ts
await generateSitemap(domain, {
  entries: async () => [...],
});
```

and this:

```ts
await generateSitemap(domain, {
  entries: {
    pages: getPageSitemapEntries,
    blog: getBlogSitemapEntries,
  },
  sitemap: "pages",
});
```

This keeps the API compact, works well for both static and runtime generation, and removes the worst boilerplate from multi-sitemap route handlers without introducing framework-specific abstractions.
