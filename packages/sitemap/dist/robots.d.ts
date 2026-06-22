import type { RobotsRule } from "./types";
/** Default crawler rules used when `generateRobotsTxt` is called without custom rules. */
export declare const DEFAULT_ROBOTS_RULES: RobotsRule[];
/**
 * Builds a robots.txt string from structured rules, appending the sitemap index URL at the end.
 * @param domain - Site origin (e.g. https://example.com)
 * @param sitemapIndex - Sitemap index filename only, without a leading slash (e.g. "sitemap.xml")
 * @param rules - Optional rule(s); falls back to {@link DEFAULT_ROBOTS_RULES}
 * @returns Complete robots.txt content
 */
export declare function generateRobotsTxt(domain: string, sitemapIndex?: string, rules?: RobotsRule | RobotsRule[]): string;
