import type { LocaleConfig, SitemapEntry } from "./types";
/**
 * Generates a localized URL based on the locale mode.
 * @param baseUrl - The base URL (e.g., '/about')
 * @param locale - The locale configuration
 * @param domain - The domain (e.g., 'https://example.com')
 * @param localeMode - How to format the URL ('prefix' or 'subdomain')
 * @param prefixDefault - Whether to add prefix to default locale
 */
export declare function localizeUrl(baseUrl: string, locale: LocaleConfig, domain: string, localeMode?: "prefix" | "subdomain", prefixDefault?: boolean): string;
/**
 * Internal type for sitemap entry with locale alternates
 */
type SitemapEntryWithAlternates = SitemapEntry & {
    alternates?: {
        hreflang: string;
        href: string;
    }[];
};
/**
 * Generates a sitemap.xml string from a list of SitemapEntry objects.
 * Optionally minifies the output with minify-xml if opts.minify is true.
 * Throws an Error if minify or generation fails.
 */
export declare function createSitemapXml(urls: SitemapEntryWithAlternates[], opts?: {
    minify?: boolean;
}): Promise<string>;
/**
 * Generates a sitemapindex XML string for an array of sitemap file urls.
 * Throws an Error if minify or generation fails.
 */
export declare function createIndexSitemap(files: string[], baseUrl: string, opts?: {
    minify?: boolean;
}): Promise<string>;
/**
 * Writes a file to a directory, creating the full path if needed. Throws on failure.
 */
export declare const createFile: (outputPath: string, filename: string, content: string) => void;
/**
 * Generates localized versions of sitemap entries.
 * Creates one entry per locale with hreflang alternates.
 */
export declare function generateLocalizedEntries(baseEntries: SitemapEntry[], locales: LocaleConfig[], domain: string, localeMode?: "prefix" | "subdomain", prefixDefault?: boolean): SitemapEntryWithAlternates[];
export {};
