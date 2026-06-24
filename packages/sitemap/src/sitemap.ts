import { normalizeDomain } from "./domain";
import { generateLocalizedEntries, resolveUrl } from "./localize";
import { resolveSitemapEntrySource } from "./resolve-entries";
import type {
	GenerateSitemapIndexOptions,
	GenerateSitemapOptions,
} from "./types";
import { createSitemapXml } from "./xml";

/**
 * Generates a sitemap XML string from entries and optional locale configuration.
 */
export async function generateSitemap(
	domain: string,
	options: GenerateSitemapOptions,
): Promise<string> {
	const {
		locales,
		localeMode = "prefix",
		prefixDefault = false,
	} = options;

	const entries = await resolveSitemapEntrySource(options.entries);

	const processedUrls =
		locales && locales.length > 0
			? generateLocalizedEntries(
					entries,
					locales,
					domain,
					localeMode,
					prefixDefault,
				)
			: entries.map(({ path, ...rest }) => ({
					...rest,
					url: resolveUrl(path, domain),
				}));

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
		const items: string = normalizedFiles
			.map((f) => `<sitemap><loc>${normalizedBase}/${f}</loc></sitemap>`)
			.join("");
		return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
	} catch (err) {
		throw new Error(
			`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}
