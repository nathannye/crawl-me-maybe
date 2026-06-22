import type { LocaleConfig, SitemapEntry } from "./types";
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
export declare function generateSitemap(config: SitemapGeneratorConfig): string;
/**
 * Generates a sitemap index XML string referencing child sitemap files.
 * @param baseUrl - Site origin used to build absolute `<loc>` URLs
 * @param childSitemapNames - Sitemap filenames without a leading slash (e.g. "sitemap-pages.xml", not "/sitemap-pages.xml")
 * @returns Sitemap index XML string
 */
export declare function generateIndexSitemap(baseUrl: string, childSitemapNames: string[]): string;
