# Implement locale-aware sitemap generation

## Goal

Add **optional locale-aware sitemap generation** to the library while preserving a strong manual escape hatch.

The locale system should support:

* **automatic locale expansion** for common multilingual sites
* **prefix**, **subdomain**, and **domain-per-locale** URL structures
* **per-entry locale availability** (a page may only exist in some locales)
* **per-entry locale path overrides** (localized slugs)
* **automatic hreflang alternate links**
* **full manual control** when users do not opt into locale handling

This locale system must work consistently across:

* `generateSitemap()`
* `createSitemapManifest()`
* `vitePluginSitemap()`

Locale expansion should happen **before splitting**, so split behavior is based on the final number of concrete localized URLs.

---

# Design principles

## 1) Locale handling is optional

If a user does **not** provide a locale config, the library should do **no locale processing at all**.

This means users can still manually create:

* one sitemap per locale
* locale-prefixed paths
* locale-specific subdomains/domains
* highly custom multilingual setups

without the library trying to be clever.

---

## 2) Global locale behavior belongs at the sitemap level

The sitemap config should define:

* which locales exist globally
* which locale is the default
* how locale URLs are addressed
* whether hreflang alternates should be emitted

This is sitemap-level behavior, not page-level behavior.

---

## 3) Entry-level locale fields should describe page-specific behavior

Each entry should be able to express:

* **which locales the page exists in**
* **which locales have custom paths/slugs**

This is what allows:

* partial localization
* localized slugs
* “this page only exists in English”

without requiring users to manually duplicate every localized URL.

---

## 4) Locale expansion happens before splitting

The library should:

1. resolve raw sitemap entries
2. expand them into concrete locale-specific URLs
3. attach alternates
4. split the concrete entries into sitemap files if needed
5. render sitemap XML

This ensures the 50k URL limit is enforced against the actual emitted URLs.

---

# Public API

# 1) Add a root-level locale config

Add a `locales` option to all sitemap-producing entry points:

* `generateSitemap(domain, { locales, ... })`
* `createSitemapManifest({ locales, ... })`
* `vitePluginSitemap({ locales, ... })`

## Proposed type

```ts id="kdfexs"
type SitemapLocaleConfig = {
  /**
   * All locale variants the site can emit.
   * Use hreflang-style codes where needed:
   * "en", "fr", "en-US", "fr-CA", etc.
   */
  locales: string[];

  /**
   * The canonical default locale.
   * The entry's `path` always refers to this locale.
   */
  defaultLocale: string;

  /**
   * How locale URLs are addressed.
   *
   * - "prefix": /fr/about
   * - "subdomain": https://fr.example.com/about
   * - "domain": https://example.fr/about
   */
  mode?: "prefix" | "subdomain" | "domain";

  /**
   * In prefix mode, whether the default locale should also be prefixed.
   *
   * false:
   *   en => /about
   *   fr => /fr/about
   *
   * true:
   *   en => /en/about
   *   fr => /fr/about
   */
  prefixDefault?: boolean;

  /**
   * Required for subdomain and domain modes.
   * Maps a locale code to its absolute base domain.
   *
   * Example:
   * {
   *   en: "https://example.com",
   *   fr: "https://fr.example.com"
   * }
   *
   * or:
   * {
   *   en: "https://example.com",
   *   fr: "https://example.fr"
   * }
   */
  domainByLocale?: Record<string, string>;

  /**
   * Whether to emit xhtml alternate links.
   * Default: true
   */
  alternates?: boolean;

  /**
   * Optional x-default handling.
   *
   * true:
   *   use the default locale URL as x-default
   *
   * string:
   *   use the provided locale code as x-default
   *
   * false / undefined:
   *   do not emit x-default
   */
  xDefault?: boolean | string;
};
```

---

# 2) Extend `SitemapEntry`

Add entry-level locale controls.

## Proposed type

```ts id="6fhnim"
type SitemapEntry = {
  /**
   * Default-locale path.
   * This remains the primary path field for the entry.
   */
  path: string;

  lastmod?: string;
  changefreq?: Changefreq;
  priority?: number;
  imageUrls?: string[];
  videoUrls?: string[];

  /**
   * The locales this entry exists in.
   *
   * If omitted and global locales are configured:
   *   the entry is assumed to exist in all configured locales.
   *
   * If provided:
   *   only those locales are emitted for this entry.
   */
  locales?: string[];

  /**
   * Locale-specific path overrides.
   *
   * These are only needed when a locale's path differs from the default path
   * or from the default derived locale path.
   *
   * Example:
   * {
   *   path: "/about",
   *   localePaths: {
   *     fr: "/a-propos",
   *     de: "/uber-uns"
   *   }
   * }
   */
  localePaths?: Record<string, string>;
};
```

---

# 3) Preserve manual locale handling when `locales` is omitted

This is a core requirement.

If no root-level `locales` config is provided:

* the library should not expand entries across locales
* `entry.locales` and `entry.localePaths` should be ignored or optionally warned on
* the user may return whatever paths or absolute URLs they want

Examples that must continue to work:

```ts id="b2joxl"
{
  path: "/fr/a-propos"
}
```

```ts id="sllxxf"
{
  path: "https://fr.example.com/a-propos"
}
```

```ts id="0hclby"
createSitemapManifest({
  domain: "https://example.com",
  entries: {
    en: async () => getEnglishEntries(),
    fr: async () => getFrenchEntries(),
  },
});
```

This manual escape hatch must be documented as a supported approach for highly custom localization setups.

---

# Locale behavior rules

# 1) No root-level locale config

If `locales` is not configured at the sitemap level:

* emit each entry exactly once
* treat `path` as-is
* prepend the root `domain` only when `path` is relative
* do not emit alternates
* do not interpret `entry.locales` or `entry.localePaths`

This is the manual mode.

---

# 2) Root-level locale config exists

If `locales` is configured, entries become **logical pages** that can expand into multiple locale-specific concrete URLs.

For each entry:

## Determine which locales the entry exists in

```ts id="lgxqsz"
const entryLocales =
  entry.locales ?? localeConfig.locales;
```

Meaning:

* if `entry.locales` is omitted → the page exists in **all configured locales**
* if `entry.locales` is present → the page exists only in those locales

This is how we model partial localization.

---

## Resolve each locale’s path

For each locale in `entryLocales`:

### If the locale is the default locale

Use `entry.path`.

### Else if `entry.localePaths?.[locale]` exists

Use that override.

### Else

Fallback to `entry.path`.

This means `entry.path` is always the default-locale path, and `localePaths` are just overrides for specific locales.

---

## Convert the locale path into a final URL

Apply the configured locale URL strategy:

* `prefix`
* `subdomain`
* `domain`

This step turns the locale-specific path into the final absolute URL.

---

# Supported locale URL strategies

# 1) Prefix mode

## Example config

```ts id="jlwmij"
locales: {
  locales: ["en", "fr", "de"],
  defaultLocale: "en",
  mode: "prefix",
  prefixDefault: false,
}
```

## Entry

```ts id="m5n69j"
{
  path: "/about",
  localePaths: {
    fr: "/a-propos"
  }
}
```

## Output

* `en` → `https://example.com/about`
* `fr` → `https://example.com/fr/a-propos`
* `de` → `https://example.com/de/about`

---

# 2) Subdomain mode

## Example config

```ts id="9r1j4w"
locales: {
  locales: ["en", "fr"],
  defaultLocale: "en",
  mode: "subdomain",
  domainByLocale: {
    en: "https://example.com",
    fr: "https://fr.example.com",
  },
}
```

## Entry

```ts id="y2vmdg"
{
  path: "/about",
  localePaths: {
    fr: "/a-propos"
  }
}
```

## Output

* `en` → `https://example.com/about`
* `fr` → `https://fr.example.com/a-propos`

---

# 3) Domain mode

## Example config

```ts id="6t3vdd"
locales: {
  locales: ["en", "fr"],
  defaultLocale: "en",
  mode: "domain",
  domainByLocale: {
    en: "https://example.com",
    fr: "https://example.fr",
  },
}
```

## Entry

```ts id="gg7vxe"
{
  path: "/about",
  localePaths: {
    fr: "/a-propos"
  }
}
```

## Output

* `en` → `https://example.com/about`
* `fr` → `https://example.fr/a-propos`

---

# Alternate hreflang behavior

If `locales.alternates !== false`, every emitted localized URL should include the alternate set for that entry’s available locales only.

## Example

```ts id="mjlwmk"
{
  path: "/about",
  locales: ["en", "fr"],
  localePaths: {
    fr: "/a-propos"
  }
}
```

with prefix mode should emit:

### English URL node

```xml id="wd0vle"
<url>
  <loc>https://example.com/about</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
  <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/a-propos" />
</url>
```

### French URL node

```xml id="t1osbo"
<url>
  <loc>https://example.com/fr/a-propos</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
  <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/a-propos" />
</url>
```

If `xDefault` is enabled, include an `x-default` alternate pointing to the configured target locale URL.

---

# Internal implementation plan

# 1) Add `SitemapLocaleConfig` to shared types

Create a new shared locale config type in the runtime core and thread it through all public sitemap-producing APIs.

It should be accepted by:

* `generateSitemap()`
* `createSitemapManifest()`
* `vitePluginSitemap()`

---

# 2) Extend `SitemapEntry` with locale fields

Add:

* `locales?: string[]`
* `localePaths?: Record<string, string>`

Remove or avoid introducing older concepts like `skipLocalization`. Locale existence should be modeled through `entry.locales` instead.

---

# 3) Add an internal locale expansion step

Create a new internal helper responsible for converting logical entries into concrete locale-specific entries.

## Suggested helper

```ts id="d2bnk7"
function expandLocalizedEntries(options: {
  domain: string;
  entries: SitemapEntry[];
  locales?: SitemapLocaleConfig;
}): ResolvedSitemapEntry[]
```

---

# 4) Introduce a concrete internal sitemap entry shape

The XML generator should not need to understand locale rules. It should only receive fully resolved entries.

## Suggested internal type

```ts id="qlwmtv"
type ResolvedSitemapEntry = {
  /**
   * Final absolute URL or final site-relative path, depending on current internal conventions.
   * Prefer absolute URL if that simplifies alternate generation.
   */
  url: string;

  lastmod?: string;
  changefreq?: Changefreq;
  priority?: number;
  imageUrls?: string[];
  videoUrls?: string[];

  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
};
```

### Important

If the current generator still works in terms of relative paths + `domain`, decide whether to:

* keep that internally and only add alternates
* or switch locale-expanded entries to concrete absolute URLs

The implementation should choose one internal representation and keep it consistent.

---

# 5) Implement locale expansion logic

`expandLocalizedEntries()` should behave as follows:

## If no locale config is provided

Return one resolved entry per input entry.

### Behavior

* if `entry.path` is relative → prepend the configured `domain`
* if `entry.path` is absolute → use it as-is
* do not emit alternates

---

## If locale config is provided

For each input entry:

### A. Determine the entry’s available locales

```ts id="prjkh0"
const entryLocales = entry.locales ?? localeConfig.locales;
```

### B. Resolve a concrete URL for each locale

For each locale:

* default locale → `entry.path`
* locale override exists → `entry.localePaths[locale]`
* otherwise → fallback to `entry.path`

Then convert that locale path into a final URL based on the configured mode.

### C. Build the alternate set

If alternates are enabled:

* generate one alternate for each locale in `entryLocales`
* optionally add `x-default`

### D. Emit one resolved entry per locale

Each emitted localized URL should receive the same alternate set for that entry.

---

# 6) Add locale URL resolution helpers

Add internal helpers for:

## Relative vs absolute path detection

If `entry.path` or a locale override is already an absolute URL, do not prepend the root `domain`.

## Prefix mode URL generation

Given a locale and a path, return the correctly prefixed absolute URL.

## Subdomain/domain mode URL generation

Given a locale and a path, use `domainByLocale[locale]` as the base domain.

### Validation

If `mode` is `subdomain` or `domain` and `domainByLocale` is missing or incomplete, throw a clear configuration error.

---

# 7) Run locale expansion before splitting

Update all sitemap generation flows so that splitting happens on **resolved localized entries**, not raw logical entries.

## Affected flows

* `generateSitemap()`
* `createSitemapManifest().getSitemap()`
* `createSitemapManifest().getRootSitemap()`
* Vite plugin sitemap generation

The correct order is:

1. resolve raw entries
2. expand locales
3. split
4. render XML

---

# 8) Thread locale config through the manifest layer

Update `createSitemapManifest()` so locale config can be provided once at the manifest level and automatically applied to all configured sitemap entry sources.

## Example

```ts id="8x54vx"
const manifest = createSitemapManifest({
  domain: "https://example.com",
  locales: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    mode: "prefix",
  },
  entries: {
    pages: getPageEntries,
    blog: getBlogEntries,
  },
});
```

Then:

* `manifest.getRootSitemap()` should use locale-expanded entries when determining split counts
* `manifest.getSitemap({ sitemap, index })` should expand only the selected sitemap’s entries

---

# 9) Thread locale config through the Vite plugin

Update `vitePluginSitemap()` to accept the same root-level `locales` config.

This should behave exactly like runtime generation:

* raw entries are resolved
* locale-expanded
* split if necessary
* written to disk

---

# 10) Decide and document absolute URL support for `SitemapEntry.path`

To preserve the manual locale escape hatch, the library should support absolute URLs in `entry.path`.

## Proposed rule

* if `path` starts with `http://` or `https://`, treat it as absolute
* do not prepend the root `domain`

This should work:

* with no locale config
* in manual multilingual setups
* for per-locale sitemaps authored entirely by the user

Decide whether `localePaths` should also be allowed to be absolute URLs. Recommendation: **yes**, for consistency.

---

# Validation / error handling

Add or update runtime validation for the following cases:

## Invalid root locale config

* `defaultLocale` is not present in `locales`
* `mode` is `subdomain` or `domain` but `domainByLocale` is missing
* `domainByLocale` is missing a configured locale that needs to be emitted

## Invalid entry locale config

* `entry.locales` contains a locale not present in the root locale config
* `entry.localePaths` contains a locale not present in the root locale config

### Decide whether these should:

* throw
* or warn and skip

Recommendation: **throw** in runtime/library code. Misconfigured hreflang is not something we should silently paper over.

---

# Tests to add

# 1) No locale config

* relative paths work normally
* absolute paths work normally
* no alternates emitted
* `entry.locales` / `entry.localePaths` are ignored or rejected consistently

---

# 2) Prefix mode

## All locales, same slug

```ts id="50y0k4"
{ path: "/about" }
```

## Partial locale coverage

```ts id="6on3rj"
{ path: "/pricing", locales: ["en", "fr"] }
```

## Localized slug override

```ts id="k93a18"
{
  path: "/about",
  localePaths: { fr: "/a-propos" }
}
```

## Partial locale coverage + localized slug override

```ts id="z8vrqv"
{
  path: "/about",
  locales: ["en", "fr"],
  localePaths: { fr: "/a-propos" }
}
```

## Prefix default locale true vs false

Verify both behaviors.

---

# 3) Subdomain mode

* same-slug expansion
* localized slug override
* alternate generation
* missing `domainByLocale` validation

---

# 4) Domain mode

* same-slug expansion
* localized slug override
* alternate generation
* missing `domainByLocale` validation

---

# 5) Alternate generation

* alternates include only entry-available locales
* `x-default` behavior works as documented
* `alternates: false` disables alternate output

---

# 6) Splitting interaction

* locale-expanded entries count toward `maxUrls`
* a sitemap that is small pre-expansion but large post-expansion gets split correctly

---

# 7) Manifest interaction

* `manifest.getRootSitemap()` counts locale-expanded entries correctly
* `manifest.getSitemap({ sitemap, index })` only resolves and expands the selected sitemap

---

# Docs update plan

The docs update should be organized by **use case**, not just by API surface.

Do **not** make the locale docs a single giant API reference dump. The docs need to answer:

> “My site works like *this*. How do I model it?”

---

# Recommended docs structure

# 1) “No locale config / fully manual locale sitemaps”

Show that users can skip the locale system entirely.

## Cover:

* one sitemap per locale
* manually prefixed paths
* absolute locale URLs
* highly custom setups

### Example

```ts id="a9t4l7"
createSitemapManifest({
  domain: "https://example.com",
  entries: {
    en: async () => [
      { path: "/about" },
    ],
    fr: async () => [
      { path: "/fr/a-propos" },
    ],
  },
});
```

---

# 2) “Every page exists in every locale”

This is the simplest built-in locale case.

## Cover:

* prefix mode
* no `entry.locales`
* no `localePaths`

### Example

```ts id="jlwmz7"
locales: {
  locales: ["en", "fr", "de"],
  defaultLocale: "en",
  mode: "prefix",
}
```

```ts id="31j1ak"
{ path: "/about" }
```

---

# 3) “Some pages only exist in some locales”

This is the partial localization case.

## Cover:

* `entry.locales`
* alternates only for existing locales

### Example

```ts id="ylp4tq"
{
  path: "/pricing",
  locales: ["en", "fr"],
}
```

---

# 4) “Localized slugs differ by locale”

This is the `localePaths` case.

## Cover:

* one locale override
* multiple locale overrides
* fallback to default path for unspecified locales

### Example

```ts id="prsr5q"
{
  path: "/about",
  localePaths: {
    fr: "/a-propos",
    de: "/uber-uns",
  },
}
```

---

# 5) “Locale URLs live on subdomains”

Show `mode: "subdomain"` with `domainByLocale`.

---

# 6) “Locale URLs live on separate domains”

Show `mode: "domain"` with `domainByLocale`.

---

# 7) “How locale expansion affects sitemap splitting”

Explain that locale expansion happens before splitting, so a multilingual sitemap may split sooner than the raw page count suggests.

---

# 8) API reference section

After the use-case docs, add a concise reference for:

* `SitemapLocaleConfig`
* `entry.locales`
* `entry.localePaths`

But do **not** lead with the reference section.

---

# Acceptance criteria

This work is complete when:

* the library supports a root-level `locales` config across:

  * `generateSitemap()`
  * `createSitemapManifest()`
  * `vitePluginSitemap()`
* `SitemapEntry` supports:

  * `locales?: string[]`
  * `localePaths?: Record<string, string>`
* locale expansion happens before splitting
* prefix, subdomain, and domain-per-locale strategies are supported
* alternate hreflang generation is supported and tied to the entry’s available locales
* users can still skip locale config entirely and manually author multilingual sitemaps
* docs are updated and organized by **use case**, including the manual escape hatch
