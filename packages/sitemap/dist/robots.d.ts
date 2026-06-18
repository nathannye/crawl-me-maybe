export declare const DEFAULT_ROBOTS_TXT = "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n";
/**
 * Generates robots.txt string referencing sitemap.xml or custom sitemaps as needed.
 * @param indexUrl Fully-qualified URL for the produced sitemap.xml
 * @returns Standard robots.txt content
 */
export declare function createRobotsTxt(indexUrl: string): string;
