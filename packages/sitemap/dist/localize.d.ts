import type { LocaleConfig, SitemapEntry, SitemapEntryWithAlternates } from "./types";
/**
 * Resolves a site-relative path against a domain origin.
 * @param path - Site-relative path or slug (e.g. "/about" or "about")
 * @param domain - Site origin used as the URL base
 */
export declare function resolveUrl(path: string, domain: string): string;
/**
 * Builds a localized absolute URL for a path and locale.
 * @param path - Site-relative path or slug
 * @param locale - Target locale configuration
 * @param domain - Site origin
 * @param localeMode - URL strategy (default: "prefix")
 * @param prefixDefault - Whether the default locale also receives a prefix
 */
export declare function localizeUrl(path: string, locale: LocaleConfig, domain: string, localeMode?: "prefix" | "subdomain", prefixDefault?: boolean): string;
/**
 * Generates localized versions of sitemap entries with hreflang alternates.
 * @param baseEntries - Input entries with site-relative paths
 * @param locales - Locale configurations
 * @param domain - Site origin
 * @param localeMode - URL strategy (default: "prefix")
 * @param prefixDefault - Whether the default locale also receives a prefix
 */
export declare function generateLocalizedEntries(baseEntries: SitemapEntry[], locales: LocaleConfig[], domain: string, localeMode?: "prefix" | "subdomain", prefixDefault?: boolean): SitemapEntryWithAlternates[];
