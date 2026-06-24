import { normalizeDomain, normalizeDomainBase } from "./domain";
import type {
	SitemapEntry,
	SitemapEntryWithAlternates,
	SitemapLocaleConfig,
} from "./types";

/**
 * Resolves a site-relative path against a domain origin.
 * @param path - Site-relative path or slug (e.g. "/about" or "about")
 * @param domain - Site origin used as the URL base
 */
export function resolveUrl(path: string, domain: string): string {
	const slug = path.startsWith("/") ? path.slice(1) : path;
	return new URL(slug, normalizeDomainBase(domain)).href;
}

function validateLocaleConfig(config: SitemapLocaleConfig): void {
	if (!config || typeof config !== "object") {
		throw new Error("sitemap localization config must be an object");
	}

	if (!Array.isArray(config.locales) || config.locales.length === 0) {
		throw new Error(
			"sitemap localization config must include at least one locale",
		);
	}

	if (new Set(config.locales).size !== config.locales.length) {
		throw new Error(
			"sitemap localization config locales must not contain duplicates",
		);
	}

	if (!config.defaultLocale || typeof config.defaultLocale !== "string") {
		throw new Error("sitemap localization config must include a defaultLocale");
	}

	if (!config.locales.includes(config.defaultLocale)) {
		throw new Error(
			`sitemap localization config defaultLocale "${config.defaultLocale}" must exist in locales`,
		);
	}

	const mode = config.mode ?? "prefix";
	if (!["prefix", "subdomain", "domain"].includes(mode)) {
		throw new Error(
			`sitemap localization config mode "${mode}" is not supported`,
		);
	}

	if (mode !== "prefix") {
		if (!config.domainByLocale || typeof config.domainByLocale !== "object") {
			throw new Error(
				`sitemap localization config domainByLocale is required for ${mode} mode`,
			);
		}

		for (const locale of config.locales) {
			const base = config.domainByLocale[locale];
			if (!base || typeof base !== "string") {
				throw new Error(
					`sitemap localization config domainByLocale must include a valid base domain for locale "${locale}"`,
				);
			}
		}
	}

	if (
		typeof config.xDefault === "string" &&
		!config.locales.includes(config.xDefault)
	) {
		throw new Error(
			`sitemap localization config xDefault locale "${config.xDefault}" must exist in locales`,
		);
	}
}

function getLocaleBaseDomain(
	domain: string,
	config: SitemapLocaleConfig,
	localeCode: string,
): string {
	const mode = config.mode ?? "prefix";
	if (mode === "prefix") return domain;

	const mappedDomain = config.domainByLocale?.[localeCode];
	if (!mappedDomain) {
		throw new Error(
			`sitemap localization config domainByLocale is missing a base domain for locale "${localeCode}"`,
		);
	}

	return mappedDomain;
}

function localizeUrl(
	path: string,
	localeCode: string,
	config: SitemapLocaleConfig,
	domain: string,
): string {
	const mode = config.mode ?? "prefix";
	const baseDomain = getLocaleBaseDomain(domain, config, localeCode);

	if (mode === "prefix") {
		if (localeCode === config.defaultLocale && !config.prefixDefault) {
			return resolveUrl(path, domain);
		}

		const prefixedBase = `${normalizeDomain(baseDomain)}/${localeCode}/`;
		return resolveUrl(path, prefixedBase);
	}

	return resolveUrl(path, baseDomain);
}

function getEntryLocaleCodes(
	entry: SitemapEntry,
	config: SitemapLocaleConfig,
): string[] {
	const configuredLocales = new Set(config.locales);
	const entryLocales = entry.locales ?? config.locales;

	if (entryLocales.length === 0) {
		return [];
	}

	if (new Set(entryLocales).size !== entryLocales.length) {
		throw new Error("sitemap entry locales must not contain duplicates");
	}

	for (const locale of entryLocales) {
		if (!configuredLocales.has(locale)) {
			throw new Error(
				`sitemap entry locale "${locale}" is not present in the sitemap localization config`,
			);
		}
	}

	if (entry.localePaths) {
		for (const locale of Object.keys(entry.localePaths)) {
			if (!configuredLocales.has(locale)) {
				throw new Error(
					`sitemap entry localePaths locale "${locale}" is not present in the sitemap localization config`,
				);
			}
		}
	}

	return entryLocales;
}

function buildAlternates(
	entryPathByLocale: Map<string, string>,
	config: SitemapLocaleConfig,
	domain: string,
): { hreflang: string; href: string }[] {
	const alternates = Array.from(entryPathByLocale.entries()).map(
		([localeCode, path]) => ({
			hreflang: localeCode,
			href: localizeUrl(path, localeCode, config, domain),
		}),
	);

	const xDefaultTarget =
		config.xDefault === true
			? config.defaultLocale
			: typeof config.xDefault === "string"
				? config.xDefault
				: undefined;

	if (xDefaultTarget && entryPathByLocale.has(xDefaultTarget)) {
		const path = entryPathByLocale.get(xDefaultTarget);
		if (path) {
			alternates.push({
				hreflang: "x-default",
				href: localizeUrl(path, xDefaultTarget, config, domain),
			});
		}
	}

	return alternates;
}

/**
 * Expands a set of sitemap entries into concrete URLs with optional hreflang alternates.
 * When no localization config is provided, entries are emitted exactly once without alternates.
 */
export function expandLocalizedEntries(
	baseEntries: SitemapEntry[],
	domain: string,
	localization?: SitemapLocaleConfig,
): SitemapEntryWithAlternates[] {
	if (!localization) {
		return baseEntries.map(
			({ path, locales: _locales, localePaths: _localePaths, ...rest }) => ({
				...rest,
				url: resolveUrl(path, domain),
			}),
		);
	}

	validateLocaleConfig(localization);

	const localizedEntries: SitemapEntryWithAlternates[] = [];

	for (const entry of baseEntries) {
		const { path, locales: entryLocales, localePaths, ...rest } = entry;
		const localeCodes = getEntryLocaleCodes(entry, localization);
		if (localeCodes.length === 0) continue;

		const entryPathByLocale = new Map<string, string>();
		for (const localeCode of localeCodes) {
			const resolvedPath =
				localeCode === localization.defaultLocale
					? path
					: (localePaths?.[localeCode] ?? path);

			entryPathByLocale.set(localeCode, resolvedPath);
		}

		const alternates =
			localization.alternates === false
				? undefined
				: buildAlternates(entryPathByLocale, localization, domain);

		for (const localeCode of localeCodes) {
			const resolvedPath = entryPathByLocale.get(localeCode) ?? path;
			localizedEntries.push({
				...rest,
				url: localizeUrl(resolvedPath, localeCode, localization, domain),
				alternates,
			});
		}
	}

	return localizedEntries;
}
