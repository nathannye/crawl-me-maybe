import type { LocaleConfig, SitemapEntry } from "./types";
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
export declare function generateSitemap(domain: string, options: GenerateSitemapOptions): string;
/**
 * Generates a sitemap index XML string referencing child sitemap files.
 * @param domain - Site origin used to build absolute `<loc>` URLs
 * @param options - Child sitemap filenames to reference in the index
 * @returns Sitemap index XML string
 */
export declare function generateIndexSitemap(domain: string, options: GenerateIndexSitemapOptions): string;
