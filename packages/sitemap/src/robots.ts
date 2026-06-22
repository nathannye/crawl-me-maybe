export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
`;

/**
 * Generates robots.txt string referencing sitemap.xml or custom sitemaps as needed.
 * @param indexUrl Fully-qualified URL for the produced sitemap.xml
 * @returns Standard robots.txt content
 */
export function createRobotsTxt(indexUrl: string): string {
	if (!indexUrl || typeof indexUrl !== "string") {
		throw new Error("createRobotsTxt: indexUrl must be a non-empty string");
	}
	return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${indexUrl}\n`;
}

/**
 * Builds robots.txt content, merging an optional user-supplied callback with
 * the correct `Sitemap:` lines appended at the end.
 * @param domain - The site domain (e.g. https://example.com)
 * @param sitemapUrls - Site-relative sitemap paths (e.g. ["/sitemap.xml"])
 * @param robotsCallback - Optional async function returning custom robots.txt content
 * @returns Assembled robots.txt string
 */
export async function generateRobotsTxt(
	domain: string,
	sitemapUrls: string[] = ["/sitemap.xml"],
	robotsCallback?: () => Promise<string> | string,
): Promise<string> {
	let userRobots = DEFAULT_ROBOTS_TXT;
	if (robotsCallback && typeof robotsCallback === "function") {
		try {
			const result = await robotsCallback();
			if (typeof result === "string") {
				userRobots = result;
			}
		} catch (err) {
			console.warn("[SEO] Error in user robots async callback", err);
		}
	}
	let content = userRobots.trim();
	if (!content.endsWith("\n")) content += "\n";
	const domainUrl = domain.endsWith("/") ? domain.slice(0, -1) : domain;
	for (const rel of sitemapUrls) {
		content += `Sitemap: ${domainUrl}${rel.startsWith("/") ? rel : `/${rel}`}\n`;
	}
	return content;
}
