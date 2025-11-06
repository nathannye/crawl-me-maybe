import fs from "node:fs";
import path from "node:path";
import type { LocaleConfig, SitemapEntry } from "./types";

/**
 * Minifies XML by removing unnecessary whitespace.
 * Lightweight alternative to heavy minification libraries.
 */
function minifyXml(xml: string): string {
	return xml
		.replace(/>\s+</g, "><") // Remove whitespace between tags
		.replace(/\s{2,}/g, " ") // Collapse multiple spaces
		.trim();
}

/**
 * Generates a localized URL based on the locale mode.
 * @param baseUrl - The base URL (e.g., '/about')
 * @param locale - The locale configuration
 * @param domain - The domain (e.g., 'https://example.com')
 * @param localeMode - How to format the URL ('prefix' or 'subdomain')
 */
export function localizeUrl(
	baseUrl: string,
	locale: LocaleConfig,
	domain: string,
	localeMode: "prefix" | "subdomain" = "prefix",
): string {
	// Normalize baseUrl: ensure it starts with /
	const normalizedUrl = baseUrl?.startsWith("/")
		? baseUrl
		: `/${baseUrl || ""}`;

	// Default locale doesn't get modified
	if (locale.default) {
		return domain + normalizedUrl;
	}

	if (localeMode === "subdomain") {
		// Remove protocol and www for subdomain handling
		const urlObj = new URL(domain);
		const hostname = urlObj.hostname.replace(/^www\./, "");
		const subdomain = `${locale.code}.${hostname}`;
		return `${urlObj.protocol}//${subdomain}${urlObj.port ? `:${urlObj.port}` : ""}${normalizedUrl}`;
	}

	// Prefix mode: add locale to path
	const prefix = `/${locale.code}`;
	return domain + prefix + normalizedUrl;
}

/**
 * Internal type for sitemap entry with locale alternates
 */
type SitemapEntryWithAlternates = SitemapEntry & {
	alternates?: { hreflang: string; href: string }[];
};

/**
 * Generates a sitemap.xml string from a list of SitemapEntry objects.
 * Optionally minifies the output with minify-xml if opts.minify is true.
 * Throws an Error if minify or generation fails.
 */
export async function createSitemapXml(
	urls: SitemapEntryWithAlternates[],
	opts?: { minify?: boolean },
): Promise<string> {
	try {
		const now = new Date().toISOString();
		let imageNS = false;
		let videoNS = false;
		let xhtmlNS = false;

		const items: string = urls
			.map((u) => {
				let xml = `<url><loc>${u.url}</loc><lastmod>${u.lastmod ?? now}</lastmod>`;
				if (u.changefreq) {
					xml += `<changefreq>${u.changefreq}</changefreq>`;
				}
				if (typeof u.priority === "number") {
					xml += `<priority>${u.priority.toFixed(1)}</priority>`;
				}
				if (u.alternates?.length) {
					xhtmlNS = true;
					for (const alt of u.alternates) {
						xml += `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`;
					}
				}
				if (u.imageUrls?.length) {
					imageNS = true;
					for (const img of u.imageUrls) {
						xml += `<image:image><image:loc>${img}</image:loc></image:image>`;
					}
				}
				if (u.videoUrls?.length) {
					videoNS = true;
					for (const vid of u.videoUrls) {
						xml += `<video:video><video:content_loc>${vid}</video:content_loc></video:video>`;
					}
				}
				xml += "</url>";
				return xml;
			})
			.join("");
		const ns: string = [
			'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
			xhtmlNS ? 'xmlns:xhtml="http://www.w3.org/1999/xhtml"' : null,
			imageNS
				? 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
				: null,
			videoNS
				? 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'
				: null,
		]
			.filter(Boolean)
			.join(" ");
		let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ns}>${items}</urlset>`;
		if (opts?.minify) {
			xmlString = minifyXml(xmlString);
		}
		return xmlString;
	} catch (err) {
		throw new Error(
			`Sitemap XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}

/**
 * Generates a sitemapindex XML string for an array of sitemap file urls.
 * Throws an Error if minify or generation fails.
 */
export async function createIndexSitemap(
	files: string[],
	baseUrl: string,
	opts?: { minify?: boolean },
): Promise<string> {
	try {
		const items: string = files
			.map((f) => `<sitemap><loc>${baseUrl}/${f}</loc></sitemap>`)
			.join("");
		let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
		if (opts?.minify) {
			xmlString = minifyXml(xmlString);
		}
		return xmlString;
	} catch (err) {
		throw new Error(
			`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}

/**
 * Writes a file to a directory, creating the full path if needed. Throws on failure.
 */
export const createFile = (
	outputPath: string,
	filename: string,
	content: string,
): void => {
	try {
		fs.writeFileSync(path.join(outputPath, filename), content);
	} catch (err) {
		throw new Error(
			`Failed to write file ${filename} to ${outputPath}: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
};

/**
 * Generates localized versions of sitemap entries.
 * Creates one entry per locale with hreflang alternates.
 */
export function generateLocalizedEntries(
	baseEntries: SitemapEntry[],
	locales: LocaleConfig[],
	domain: string,
	localeMode: "prefix" | "subdomain" = "prefix",
): SitemapEntryWithAlternates[] {
	const localizedEntries: SitemapEntryWithAlternates[] = [];
	const defaultLocale = locales.find((l) => l.default);

	for (const entry of baseEntries) {
		// Skip localization if requested
		if (entry.skipLocalization) {
			localizedEntries.push({
				...entry,
				url: domain + entry.url,
			});
			continue;
		}

		// Generate alternates for this entry
		const alternates = locales.map((locale) => ({
			hreflang: locale.code,
			href: localizeUrl(entry.url, locale, domain, localeMode),
		}));

		// Add x-default pointing to the default locale (or first if no default set)
		const xDefaultLocale = defaultLocale || locales[0];
		if (xDefaultLocale) {
			alternates.push({
				hreflang: "x-default",
				href: localizeUrl(entry.url, xDefaultLocale, domain, localeMode),
			});
		}

		// Create an entry for each locale
		for (const locale of locales) {
			localizedEntries.push({
				...entry,
				url: localizeUrl(entry.url, locale, domain, localeMode),
				alternates,
			});
		}
	}

	return localizedEntries;
}
