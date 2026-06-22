import type { LocaleConfig, SitemapEntry, SitemapEntryWithAlternates } from "./types";
export declare function resolveUrl(path: string, domain: string): string;
export declare function localizeUrl(path: string, locale: LocaleConfig, domain: string, localeMode?: "prefix" | "subdomain", prefixDefault?: boolean): string;
/**
 * Generates localized versions of sitemap entries.
 * Creates one entry per locale with hreflang alternates.
 */
export declare function generateLocalizedEntries(baseEntries: SitemapEntry[], locales: LocaleConfig[], domain: string, localeMode?: "prefix" | "subdomain", prefixDefault?: boolean): SitemapEntryWithAlternates[];
