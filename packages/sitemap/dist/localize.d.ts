import type { LocaleConfig, SitemapEntry, SitemapEntryWithAlternates } from "./types";
export declare function localizeUrl(baseUrl: string, locale: LocaleConfig, domain: string, localeMode?: "prefix" | "subdomain", prefixDefault?: boolean): string;
/**
 * Generates localized versions of sitemap entries.
 * Creates one entry per locale with hreflang alternates.
 */
export declare function generateLocalizedEntries(baseEntries: SitemapEntry[], locales: LocaleConfig[], domain: string, localeMode?: "prefix" | "subdomain", prefixDefault?: boolean): SitemapEntryWithAlternates[];
