import type { SitemapEntry, SitemapEntryWithAlternates, SitemapLocaleConfig } from "./types";
/**
 * Resolves a site-relative path against a domain origin.
 * @param path - Site-relative path or slug (e.g. "/about" or "about")
 * @param domain - Site origin used as the URL base
 */
export declare function resolveUrl(path: string, domain: string): string;
/**
 * Expands a set of sitemap entries into concrete URLs with optional hreflang alternates.
 * When no locale config is provided, entries are emitted exactly once without alternates.
 */
export declare function expandLocalizedEntries(baseEntries: SitemapEntry[], domain: string, locales?: SitemapLocaleConfig): SitemapEntryWithAlternates[];
