import type { SitemapEntry, SitemapEntrySource } from "./types";

/**
 * Resolves a sitemap entry source into a concrete array of entries.
 */
export async function resolveSitemapEntrySource(
	source: SitemapEntrySource,
): Promise<SitemapEntry[]> {
	const resolved = typeof source === "function" ? await source() : source;

	if (!Array.isArray(resolved)) {
		throw new Error("Sitemap entry source must resolve to an array of entries");
	}

	return resolved;
}
