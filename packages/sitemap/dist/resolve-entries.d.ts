import type { SitemapEntry, SitemapEntrySource } from "./types";
/**
 * Resolves a sitemap entry source into a concrete array of entries.
 */
export declare function resolveSitemapEntrySource(source: SitemapEntrySource): Promise<SitemapEntry[]>;
