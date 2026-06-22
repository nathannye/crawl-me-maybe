import type { RobotsRule } from "./types";
export declare const DEFAULT_ROBOTS_RULES: RobotsRule[];
/**
 * Generates a robots.txt string using the default crawler rules.
 * @param domain - Site origin (e.g. https://example.com)
 * @param sitemapIndex - Sitemap index filename only (e.g. "sitemap.xml")
 */
export declare function createRobotsTxt(domain: string, sitemapIndex?: string): string;
/**
 * Builds a complete robots.txt string from structured rules, appending the
 * sitemap index URL at the end.
 * @param domain - Site origin (e.g. https://example.com)
 * @param sitemapIndex - Sitemap index filename only (e.g. "sitemap.xml")
 * @param rules - Optional rule(s); falls back to DEFAULT_ROBOTS_RULES
 */
export declare function generateRobotsTxt(domain: string, sitemapIndex?: string, rules?: RobotsRule | RobotsRule[]): Promise<string>;
