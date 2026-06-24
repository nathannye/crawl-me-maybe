import { normalizeDomain } from "./domain";
import { resolveSitemapEntrySource } from "./resolve-entries";
import { expandLocalizedEntries } from "./localize";
import type { GenerateSitemapIndexOptions, GenerateSitemapOptions } from "./types";
import { createSitemapXml } from "./xml";

/**
 * Generates a sitemap XML string from entries and optional locale configuration.
 */
export async function generateSitemap(
	domain: string,
	options: GenerateSitemapOptions,
): Promise<string> {
	const entries = await resolveSitemapEntrySource(options.entries);
	const processedUrls = expandLocalizedEntries(
		entries,
		domain,
		options.localization,
	);

	return createSitemapXml(processedUrls);
}

/**
 * Generates a sitemap index XML string referencing child sitemap files.
 */
export function generateSitemapIndex(
	domain: string,
	options: GenerateSitemapIndexOptions,
): string {
	try {
		const normalizedBase = normalizeDomain(domain);
		const normalizedFiles = options.sitemaps.map((f) => f.replace(/^\/+/, ""));
		const items = normalizedFiles
			.map(
				(f) =>
					`  <sitemap>\n    <loc>${normalizedBase}/${f}</loc>\n  </sitemap>\n`,
			)
			.join("");
		return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}</sitemapindex>\n`;
	} catch (err) {
		throw new Error(
			`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}
