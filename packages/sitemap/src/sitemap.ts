import type { LocaleConfig, SitemapEntry } from "./types";
import { createSitemapXml, generateLocalizedEntries } from "./utils";

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
			: entries.map((u) => {
					const normalizedUrl = u.url?.startsWith("/")
						? u.url
						: `/${u.url || ""}`;
					return { ...u, url: domain + normalizedUrl };
				});

	return createSitemapXml(processedUrls);
}

export async function createIndexSitemap(
	files: string[],
	baseUrl: string,
): Promise<string> {
	try {
		const items: string = files
			.map((f) => `<sitemap><loc>${baseUrl}/${f}</loc></sitemap>`)
			.join("");
		const xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
		return xmlString;
	} catch (err) {
		throw new Error(
			`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}
