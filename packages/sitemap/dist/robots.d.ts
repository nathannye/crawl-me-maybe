import type { RobotsRule } from "./types";
export declare const DEFAULT_ROBOTS_RULES: RobotsRule[];
/**
 * Generates a robots.txt string from a single fully-qualified sitemap URL,
 * using the default crawler rules.
 * @param indexUrl - Fully-qualified URL for the produced sitemap.xml
 */
export declare function createRobotsTxt(indexUrl: string): string;
/**
 * Builds a complete robots.txt string from structured rules, appending the
 * correct `Sitemap:` lines at the end.
 * @param domain - The site domain (e.g. https://example.com)
 * @param sitemapUrls - Site-relative sitemap paths (e.g. ["/sitemap.xml"])
 * @param rules - Optional rule(s) object; falls back to DEFAULT_ROBOTS_RULES
 */
export declare function generateRobotsTxt(domain: string, sitemapUrls?: string[], rules?: RobotsRule | RobotsRule[]): Promise<string>;
