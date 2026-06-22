import type { SitemapEntry } from "@crawl-me-maybe/sitemap";
import { defineQuery } from "next-sanity";
import { client } from "@/lib/sanityClient";

type SanityPage = {
	path: string;
	_updatedAt: string;
};

const pagesForSitemapQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_updatedAt desc) {
    "path": slug.current,
    "_updatedAt": _updatedAt
  }
`);

export async function getPageSitemapEntries(): Promise<SitemapEntry[]> {
	const pages = await client.fetch<SanityPage[]>(pagesForSitemapQuery);

	const pageEntries: SitemapEntry[] = pages.map((page) => ({
		path: `/${page.path}`,
		lastmod: page._updatedAt,
		changefreq: "weekly",
		priority: 0.8,
	}));

	return [{ path: "/", changefreq: "daily", priority: 1 }, ...pageEntries];
}
