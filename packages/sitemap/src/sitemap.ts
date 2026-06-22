import { normalizeDomain } from "./domain";
import { generateLocalizedEntries, resolveUrl } from "./localize";
import type { LocaleConfig, SitemapEntry } from "./types";
import { createSitemapXml } from "./xml";

/** Configuration for {@link generateSitemap}. */
export type SitemapGeneratorConfig = {
	/** Site origin for resolving entry paths (e.g. https://example.com) */
	domain: string;
	/** Sitemap entries with site-relative paths */
	entries: SitemapEntry[];
	/** Locale list for hreflang alternates */
	locales?: LocaleConfig[];
	/** How to format localized URLs (default: "prefix") */
	localeMode?: "prefix" | "subdomain";
	/** Whether to add a locale prefix to the default locale URL (default: false) */
	prefixDefault?: boolean;
};

/**
 * Generates a sitemap XML string from entries and optional locale configuration.
 * @param config - Domain, entries, and optional locale settings
 * @returns Sitemap XML string
 */
export function generateSitemap(config: SitemapGeneratorConfig): string {
	const {
		domain,
		entries,
		locales,
		localeMode = "prefix",
		prefixDefault = false,
	} = config;

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
 * @param baseUrl - Site origin used to build absolute `<loc>` URLs
 * @param childSitemapNames - Sitemap filenames without a leading slash (e.g. "sitemap-pages.xml", not "/sitemap-pages.xml")
 * @returns Sitemap index XML string
 */
export function generateIndexSitemap(
	baseUrl: string,
	childSitemapNames: string[],
): string {
	try {
		const normalizedBase = normalizeDomain(baseUrl);
		const normalizedFiles = childSitemapNames.map((f) => f.replace(/^\/+/, ""));
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
