import { normalizeDomain } from "./domain";
import { generateLocalizedEntries, resolveUrl } from "./localize";
import type { LocaleConfig, SitemapEntry } from "./types";
import { createSitemapXml } from "./xml";

/** Options for {@link generateSitemap}. */
export type GenerateSitemapOptions = {
	/** Sitemap entries with site-relative paths */
	entries: SitemapEntry[];
	/** Locale list for hreflang alternates */
	locales?: LocaleConfig[];
	/** How to format localized URLs (default: "prefix") */
	localeMode?: "prefix" | "subdomain";
	/** Whether to add a locale prefix to the default locale URL (default: false) */
	prefixDefault?: boolean;
};

/** Options for {@link generateIndexSitemap}. */
export type GenerateIndexSitemapOptions = {
	/** Sitemap filenames without a leading slash (e.g. "sitemap-pages.xml", not "/sitemap-pages.xml") */
	childSitemapNames: string[];
};

/**
 * Generates a sitemap XML string from entries and optional locale configuration.
 * @param domain - Site origin for resolving entry paths (e.g. https://example.com)
 * @param options - Entries and optional locale settings
 * @returns Sitemap XML string
 */
export function generateSitemap(
	domain: string,
	options: GenerateSitemapOptions,
): string {
	const {
		entries,
		locales,
		localeMode = "prefix",
		prefixDefault = false,
	} = options;

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
 * @param domain - Site origin used to build absolute `<loc>` URLs
 * @param options - Child sitemap filenames to reference in the index
 * @returns Sitemap index XML string
 */
export function generateIndexSitemap(
	domain: string,
	options: GenerateIndexSitemapOptions,
): string {
	try {
		const normalizedBase = normalizeDomain(domain);
		const normalizedFiles = options.childSitemapNames.map((f) =>
			f.replace(/^\/+/, ""),
		);
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
