# Locale configuration

← [Package README](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap)

Most multilingual sites fall into a few common patterns. Pass a `localization` config to the Vite plugin, `createSitemapManifest`, or `generateSitemap` to opt in. Define each page once using its default-locale path; the package expands it into locale-specific URLs and emits hreflang alternates.

When `localization` is omitted, entries are resolved against `domain` with no locale expansion and no hreflang alternates. Paths are still site-relative — manual mode controls how you structure those paths, not whether you can embed other origins.

`createSitemapManifest` and `generateSitemap` accept the same `localization` config as the Vite plugin, so alternates stay consistent across build-time and runtime output.

## Every page exists in every locale

Your site serves the same pages in every language. URLs use a locale prefix (`/fr/about`) and the default locale lives at the root (`/about`).

```ts
vitePluginSitemap({
  domain: "https://example.com",
  localization: {
    locales: ["en", "fr", "de"],
    defaultLocale: "en",
    mode: "prefix", // default
  },
  sitemaps: async () => [
    { path: "/about" },
    { path: "/blog/hello-world" },
  ],
});
```

This emits:

- `https://example.com/about`
- `https://example.com/fr/about`
- `https://example.com/de/about`
- …and the same pattern for `/blog/hello-world`

Each URL includes `<xhtml:link>` alternates for the other locales. Set `prefixDefault: true` if the default locale should also be prefixed (`/en/about`).

## Some pages only exist in some locales

Not every page is translated. Limit an entry with `locales` — omit it to include all configured locales.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  localization: {
    locales: ["en", "fr", "de"],
    defaultLocale: "en",
    mode: "prefix",
  },
  sitemaps: async () => [
    { path: "/about" }, // all locales
    { path: "/pricing", locales: ["en", "fr"] }, // no German version
    { path: "/feed.xml", locales: [] }, // skip locale expansion
  ],
});
```

Entries without an explicit `locales` array are assumed to exist in all configured locales. `/about` expands to en, fr, and de. `/pricing` expands to en and fr only. `/feed.xml` uses `locales: []` so it is emitted once at `https://example.com/feed.xml` with no alternates.

## Some locales use different slugs

The French version of a page has its own slug. `path` is always the default-locale path; use `localePaths` for overrides.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  localization: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    mode: "prefix",
  },
  sitemaps: async () => [
    {
      path: "/about",
      localePaths: { fr: "/a-propos" },
    },
  ],
});
```

This emits `https://example.com/about` and `https://example.com/fr/a-propos`, with hreflang alternates linking the two.

Combine with per-locale availability when needed:

```ts
{
  path: "/about",
  locales: ["en", "fr"],
  localePaths: { fr: "/a-propos" },
}
```

## Locale URLs live on subdomains or separate domains

URLs are not prefixed — each locale has its own origin. Set `mode` to `"subdomain"` or `"domain"` and provide `domainByLocale` for every configured locale.

```ts
// fr.example.com/a-propos
vitePluginSitemap({
  domain: "https://example.com",
  localization: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    mode: "subdomain",
    domainByLocale: {
      en: "https://example.com",
      fr: "https://fr.example.com",
    },
  },
  sitemaps: async () => [
    {
      path: "/about",
      localePaths: { fr: "/a-propos" },
    },
  ],
});
```

```ts
// example.fr/a-propos
vitePluginSitemap({
  domain: "https://example.com",
  localization: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    mode: "domain",
    domainByLocale: {
      en: "https://example.com",
      fr: "https://example.fr",
    },
  },
  sitemaps: async () => [
    {
      path: "/about",
      localePaths: { fr: "/a-propos" },
    },
  ],
});
```

## Skip the locale system entirely

Omit `localization` when you want to control URL structure yourself, or when locale handling does not fit a single expansion model. Paths remain site-relative; each manifest or plugin instance covers one `domain`.

**Prefix locales in `path` on a single domain:**

```ts
vitePluginSitemap({
  domain: "https://example.com",
  sitemaps: async () => [
    { path: "/about" },
    { path: "/fr/a-propos" },
    { path: "/de/uber-uns" },
  ],
});
```

Each path is resolved as `domain + path`. Entry-level `locales` and `localePaths` are ignored. You are responsible for emitting the correct path per locale — the package does not expand or link alternates.

**Separate domains require separate instances** — one manifest or plugin per origin:

```ts
// vite.config.ts — build-time
export default {
  plugins: [
    vitePluginSitemap({
      domain: "https://example.com",
      outDir: "dist",
      sitemaps: async () => getEnglishEntries(), // paths like "/about"
    }),
    vitePluginSitemap({
      domain: "https://example.fr",
      outDir: "dist",
      sitemaps: async () => getFrenchEntries(), // paths like "/a-propos"
    }),
  ],
};
```

```ts
// app/sitemap.xml/route.ts — runtime
const enManifest = createSitemapManifest({
  domain: "https://example.com",
  entries: getEnglishEntries,
});

const frManifest = createSitemapManifest({
  domain: "https://example.fr",
  entries: getFrenchEntries,
});
```

You cannot mix `example.com` and `example.fr` URLs in a single sitemap from one instance. Point each domain's `robots.txt` at its own sitemap. No hreflang alternates are generated — add those manually if you need them.

## Locale config reference

| Option | Description |
|--------|-------------|
| `locales` | All locale codes the site can emit. |
| `defaultLocale` | Canonical locale; `path` on each entry refers to this locale. |
| `mode` | `"prefix"` (default), `"subdomain"`, or `"domain"`. |
| `prefixDefault` | In prefix mode, prefix the default locale too (e.g. `/en/about`). Default: `false`. |
| `domainByLocale` | Required for subdomain/domain modes. Maps each locale to its origin. |
| `alternates` | Emit hreflang `<xhtml:link>` tags. Default: `true`. |
| `xDefault` | `true` uses `defaultLocale`; a locale code sets `hreflang="x-default"` explicitly. |

See [API reference](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap/docs/api.md) for full `SitemapLocaleConfig` types.
