import type { GenerateSitemapIndexOptions, GenerateSitemapOptions } from "./types";
/**
 * Generates a sitemap XML string from entries and optional locale configuration.
 */
export declare function generateSitemap(domain: string, options: GenerateSitemapOptions): Promise<string>;
/**
 * Generates a sitemap index XML string referencing child sitemap files.
 */
export declare function generateSitemapIndex(domain: string, options: GenerateSitemapIndexOptions): string;
