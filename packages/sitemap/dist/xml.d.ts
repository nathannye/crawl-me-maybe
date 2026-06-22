import type { SitemapEntryWithAlternates } from "./types";
/**
 * Builds a urlset sitemap XML string from resolved entries.
 * @param urls - Entries with absolute URLs and optional hreflang alternates
 * @returns Sitemap XML string
 */
export declare function createSitemapXml(urls: SitemapEntryWithAlternates[]): string;
