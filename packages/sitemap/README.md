# SEO Sitemap Plugin

> 🈳 Lang alternates are not _yet_ supported, but are in the works, stay tuned!

## Overview
A generic sitemap generation Vite plugin. Outputs sitemap.xml and robots.txt files after build.
**This does not scan your directory for outputted routes, that approach only works for fully static sites. ISR and SSR are offlimits, hence I made this.**

- **Framework-agnostic:** Works in any Node/Vite build script. 
- **Supports multiple sitemaps:** Single-callback or multi-sitemap object.

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
  - [Vercel Output Directory](#vercel-output-directory)
- [Usage: Single Sitemap (Callback)](#usage-single-sitemap-callback)
- [Usage: Multi-Sitemap (Object)](#usage-multi-sitemap-object)
  - [Why Not Arbitrary Splits?](#why-not-arbitrary-splits)
- [API: SitemapEntry](#api-sitemapentry)
- [Best Practices & Tips](#best-practices--tips)
- [Example: Minimal Setup](#example-minimal-setup)
- [License](#license)

---

## Installation

```
pnpm i -D @crawl-me-maybe/sitemap
```

```js
import crawlMeMaybeSitemap from "@crawl-me-maybe/sitemap"; // Adjust path as needed
```

---

## Configuration

| Name      | Type     | Required | Description                                                         |
|-----------|----------|----------|---------------------------------------------------------------------|
| `domain`    | string   | Yes      | The full site origin (e.g. `https://yoursite.com`); used in URLs    |
| `outDir`   | string   | No       | Directory for output files. Recommend `.vercel/output/static` for Vercel; defaults to `dist` |
| `sitemaps`  | Callback/Obj | Yes  | Your pages. See usage examples below                                |
| `disableMinification` | Boolean | No | Minification is on by default, set this to true to stop XML from being minified. |


### Vercel Output Directory
For Vercel static deployments:
```js
outDir: ".vercel/output/static"
```
This ensures generated files are available for routing.

---

## Usage: Single Sitemap (Callback)
For most sites (typically under 50,000 URLs):
```js
sitemapPlugin({
  domain: "https://yoursite.com",
  // Vercel output:
  outDir: ".vercel/output/static",

  // One big sitemap
  sitemaps: async () => [
    { url: "/", lastmod: "2025-01-01" },
    { url: "/about", lastmod: "2025-01-02" },
    // ...more entries
  ],
});
```
This writes `sitemap.xml` and `robots.txt` in `outDir`.

---

## Usage: Multi-Sitemap (Object)
If your site has *more than 50K URLs* (the maximum allowed per sitemap file by Google and other search engines), **do not split sitemaps arbitrarily by count**. Instead, split your sitemaps by logical content types like `pages`, `posts`, `products`, etc.

```js
sitemapPlugin({
  domain: "https://yoursite.com",
  sitemaps: {
    pages: async () => [/* ... all core pages ... */],
    blog: async () => [/* ... blog posts ... */],
    products: async () => [/* ... product URLs ... */],
    // etc.
  },
});
```
The plugin outputs one `sitemap-[key].xml` per key, plus a `sitemap.xml` index.


### Why Not Arbitrary Splits?
Splitting purely by number (`sitemap-001.xml`, `sitemap-002.xml`) is discouraged: search engines prefer semantically meaningful sitemaps (content type, section, language, etc), which helps with crawl diagnostics and priority. Plus, if you're sorry ass has to look thru an xml sitemap, going through numeric ones to find what you need is a dreadful experience.

---

## API: SitemapEntry
Each entry only requires a url, other properties for bonus points:
```
{
  url: string,       // e.g. "/blog/post-1"
  lastmod?: string,  // ISO or yyyy-mm-dd
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  imageUrls?: string[], 
  videoUrls?: string[], 
  priority?: number
}
```

---

## Best Practices & Tips
- **Provide a valid `domain`** (with protocol and no trailing slash)
- **Use the single callback** unless your sitemap will exceed 50,000 URLs total or for a given content type
- **If over 50,000 URLs, split sitemaps by content type or site section—never by a blind limit per file**
- **Set `outDir`** for static host/adapter compatibility (e.g. `.vercel/output/static` for Vercel, `dist` for others)
- **Call from any Node build script** (Vite, Rollup, or custom)
- **robots.txt is always generated**

---

## Example: Minimal Setup

### Basic (Any Node/Vite project)
```js
import sitemapPlugin from "@crawl-me-maybe/sitemap";

sitemapPlugin({
  domain: "https://mydomain.test",
  sitemaps: async () => [
    { url: "/" },
    { url: "/about" },
    // ...
  ],
  outDir: "dist", // or .vercel/output/static
});
```

---

### With Sanity (Minimal)


```js
import sitemapPlugin from "@crawl-me-maybe/sitemap";
import { createClient } from "path-to-sanity-client";

const client = createClient({
  projectId: "your_project_id",
  dataset: "production",
  apiVersion: "2025-10-15", // use today's date
  useCdn: process.env.NODE_ENV === "production"
});

sitemapPlugin({
  domain: "https://mydomain.test",
  sitemaps: async () => {
    // Fetch all published slugs for your content type(s)
    const pages = await client.fetch(`*[_type == "page" && defined(slug.current)]{ "url": "/" + slug.current }`);
    return pages;
  },
  outDir: "dist",
});
```
---

## License
MIT. No tracking. No telemetry. Use and hack freely.
