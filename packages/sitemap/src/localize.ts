import { normalizeDomain, normalizeDomainBase } from "./domain";
import type { LocaleConfig, SitemapEntry, SitemapEntryWithAlternates } from "./types";

/**
 * Resolves a site-relative path against a domain origin.
 * @param path - Site-relative path or slug (e.g. "/about" or "about")
 * @param domain - Site origin used as the URL base
 */
export function resolveUrl(path: string, domain: string): string {
	const slug = path.startsWith("/") ? path.slice(1) : path;
	return new URL(slug, normalizeDomainBase(domain)).href;
}

/**
 * Builds a localized absolute URL for a path and locale.
 * @param path - Site-relative path or slug
 * @param locale - Target locale configuration
 * @param domain - Site origin
 * @param localeMode - URL strategy (default: "prefix")
 * @param prefixDefault - Whether the default locale also receives a prefix
 */
export function localizeUrl(
	path: string,
	locale: LocaleConfig,
	domain: string,
	localeMode: "prefix" | "subdomain" = "prefix",
	prefixDefault: boolean = false,
): string {
	if (locale.default && !prefixDefault) {
		return resolveUrl(path, domain);
	}

	if (localeMode === "subdomain") {
		const urlObj = new URL(domain);
		const hostname = urlObj.hostname.replace(/^www\./, "");
		const subdomain = `${locale.code}.${hostname}`;
		const port = urlObj.port ? `:${urlObj.port}` : "";
		const subdomainBase = `${urlObj.protocol}//${subdomain}${port}/`;
		return resolveUrl(path, subdomainBase);
	}

	const domainWithLocale = `${normalizeDomain(domain)}/${locale.code}/`;
	return resolveUrl(path, domainWithLocale);
}

/**
 * Generates localized versions of sitemap entries with hreflang alternates.
 * @param baseEntries - Input entries with site-relative paths
 * @param locales - Locale configurations
 * @param domain - Site origin
 * @param localeMode - URL strategy (default: "prefix")
 * @param prefixDefault - Whether the default locale also receives a prefix
 */
export function generateLocalizedEntries(
	baseEntries: SitemapEntry[],
	locales: LocaleConfig[],
	domain: string,
	localeMode: "prefix" | "subdomain" = "prefix",
	prefixDefault: boolean = false,
): SitemapEntryWithAlternates[] {
	const localizedEntries: SitemapEntryWithAlternates[] = [];
	const defaultLocale = locales.find((l) => l.default);

	for (const entry of baseEntries) {
		const { path, ...rest } = entry;

		if (entry.skipLocalization) {
			localizedEntries.push({
				...rest,
				url: resolveUrl(path, domain),
			});
			continue;
		}

		const alternates = locales.map((locale) => ({
			hreflang: locale.code,
			href: localizeUrl(path, locale, domain, localeMode, prefixDefault),
		}));

		const xDefaultLocale = defaultLocale || locales[0];
		if (xDefaultLocale) {
			alternates.push({
				hreflang: "x-default",
				href: localizeUrl(
					path,
					xDefaultLocale,
					domain,
					localeMode,
					prefixDefault,
				),
			});
		}

		for (const locale of locales) {
			localizedEntries.push({
				...rest,
				url: localizeUrl(path, locale, domain, localeMode, prefixDefault),
				alternates,
			});
		}
	}

	return localizedEntries;
}
