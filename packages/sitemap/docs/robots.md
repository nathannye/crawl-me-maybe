# Robots

← [Package README](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap)

Build `robots.txt` as a string. Pass the sitemap **filename only** (no domain) — e.g. `"sitemap.xml"`.

If you're generating multiple sitemaps, pass the sitemap index filename (usually `sitemap.xml`) rather than a child sitemap filename.

## Runtime: array of rules

Same shape as Next.js `MetadataRoute.Robots` rules. The sitemap line is appended automatically.

```ts
// app/robots.txt/route.ts
import { generateRobotsTxt } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const robots = generateRobotsTxt(
    "https://example.com",
    "sitemap.xml",
    [
      { userAgent: "Googlebot", allow: ["/"], disallow: "/private/" },
      { userAgent: ["Applebot", "Bingbot"], disallow: ["/"] },
    ],
  );

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

## Runtime: single rule

```ts
// app/robots.txt/route.ts
import { generateRobotsTxt } from "@crawl-me-maybe/sitemap";

export async function GET() {
  const robots = generateRobotsTxt(
    "https://example.com",
    "sitemap.xml",
    { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
  );

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

## Vite plugin

When using the Vite plugin, `robots.txt` is written alongside your sitemap files during the build.

```ts
vitePluginSitemap({
  domain: "https://example.com",
  robots: {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/api/"],
  },
  sitemaps: async () => [{ path: "/" }],
});
```

## With @crawl-me-maybe/sanity-plugin-seo

If you use [`@crawl-me-maybe/sanity-plugin-seo`](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sanity-plugin-seo), the robots rules stored in `globalSeoSettings.advanced.robots` share the same shape as `RobotsRule`. Fetch them from Sanity and pass them directly — no mapping needed.

```ts
// app/robots.txt/route.ts
import { generateRobotsTxt, type RobotsRule } from "@crawl-me-maybe/sitemap";
import { client } from "@/lib/sanityClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await client.fetch<{
    siteUrl?: string;
    advanced?: { robots?: RobotsRule[] };
  }>(`*[_type == "globalSeoSettings"][0]{ siteUrl, advanced }`);

  const domain = settings?.siteUrl ?? "https://example.com";
  const rules = settings?.advanced?.robots;

  const robots = generateRobotsTxt(domain, "sitemap.xml", rules);

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

If `rules` is `undefined` (not configured in Studio), `generateRobotsTxt` falls back to `DEFAULT_ROBOTS_RULES` automatically.
