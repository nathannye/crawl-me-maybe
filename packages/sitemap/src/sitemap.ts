import { normalizeDomain } from "./domain";
import { generateLocalizedEntries, resolveUrl } from "./localize";
import type { LocaleConfig, SitemapEntry } from "./types";
import { createSitemapXml } from "./xml";

export type SitemapGeneratorConfig = {
	domain: string;
	entries: SitemapEntry[];
	locales?: LocaleConfig[];
	localeMode?: "prefix" | "subdomain";
	prefixDefault?: boolean;
};

export async function generateSitemap(
	config: SitemapGeneratorConfig,
): Promise<string> {
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

export async function createIndexSitemap(
	files: string[],
	baseUrl: string,
): Promise<string> {
	try {
		const normalizedBase = normalizeDomain(baseUrl);
		const items: string = files
			.map((f) => `<sitemap><loc>${normalizedBase}/${f}</loc></sitemap>`)
			.join("");
		const xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
		return xmlString;
	} catch (err) {
		throw new Error(
			`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}
