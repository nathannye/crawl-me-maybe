import type { GenerateIndexSitemapOptions, GenerateSitemapOptions } from "./types";
export type { GenerateIndexSitemapOptions, GenerateSitemapOptions, NamedSitemapEntrySources, SitemapEntrySource, } from "./types";
/**
 * Generates a sitemap XML string from entries and optional locale configuration.
 * @param domain - Site origin for resolving entry paths (e.g. https://example.com)
 * @param options - Entries and optional locale settings
 * @returns Sitemap XML string
 */
export declare function generateSitemap(domain: string, options: GenerateSitemapOptions): Promise<string>;
/**
 * Generates a sitemap index XML string referencing child sitemap files.
 * @param domain - Site origin used to build absolute `<loc>` URLs
 * @param options - Child sitemap filenames to reference in the index
 * @returns Sitemap index XML string
 */
export declare function generateIndexSitemap(domain: string, options: GenerateIndexSitemapOptions): string;
