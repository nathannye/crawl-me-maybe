import type { LocaleConfig, SitemapEntry, SitemapEntryWithAlternates } from "./types";

export function localizeUrl(
	baseUrl: string,
	locale: LocaleConfig,
	domain: string,
	localeMode: "prefix" | "subdomain" = "prefix",
	prefixDefault: boolean = false,
): string {
	// Normalize baseUrl: ensure it starts with /
	const normalizedUrl = baseUrl?.startsWith("/")
		? baseUrl
		: `/${baseUrl || ""}`;

	// Default locale: only add prefix if prefixDefault is true
	if (locale.default) {
		if (!prefixDefault) {
			return domain + normalizedUrl;
		}
		// Continue to add prefix like other locales when prefixDefault is true
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
 * Generates localized versions of sitemap entries.
 * Creates one entry per locale with hreflang alternates.
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
			href: localizeUrl(entry.url, locale, domain, localeMode, prefixDefault),
		}));

		// Add x-default pointing to the default locale (or first if no default set)
		const xDefaultLocale = defaultLocale || locales[0];
		if (xDefaultLocale) {
			alternates.push({
				hreflang: "x-default",
				href: localizeUrl(
					entry.url,
					xDefaultLocale,
					domain,
					localeMode,
					prefixDefault,
				),
			});
		}

		// Create an entry for each locale
		for (const locale of locales) {
			localizedEntries.push({
				...entry,
				url: localizeUrl(entry.url, locale, domain, localeMode, prefixDefault),
				alternates,
			});
		}
	}

	return localizedEntries;
}
