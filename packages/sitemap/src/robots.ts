import type { RobotsRule } from "./types";

export const DEFAULT_ROBOTS_RULES: RobotsRule[] = [
	{
		userAgent: "*",
		allow: "/",
		disallow: ["/admin", "/api/"],
	},
];

function serializeRobotsRules(rules: RobotsRule | RobotsRule[]): string {
	const ruleArray = Array.isArray(rules) ? rules : [rules];
	return ruleArray
		.map((rule) => {
			const agents = Array.isArray(rule.userAgent)
				? rule.userAgent
				: [rule.userAgent];
			const lines: string[] = agents.map((a) => `User-agent: ${a}`);

			if (rule.allow) {
				const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
				for (const a of allows) lines.push(`Allow: ${a}`);
			}

			if (rule.disallow) {
				const disallows = Array.isArray(rule.disallow)
					? rule.disallow
					: [rule.disallow];
				for (const d of disallows) lines.push(`Disallow: ${d}`);
			}

			return lines.join("\n");
		})
		.join("\n\n");
}

/**
 * Generates a robots.txt string from a single fully-qualified sitemap URL,
 * using the default crawler rules.
 * @param indexUrl - Fully-qualified URL for the produced sitemap.xml
 */
export function createRobotsTxt(indexUrl: string): string {
	if (!indexUrl || typeof indexUrl !== "string") {
		throw new Error("createRobotsTxt: indexUrl must be a non-empty string");
	}
	let content = serializeRobotsRules(DEFAULT_ROBOTS_RULES).trim();
	if (!content.endsWith("\n")) content += "\n";
	content += `Sitemap: ${indexUrl}\n`;
	return content;
}

/**
 * Builds a complete robots.txt string from structured rules, appending the
 * correct `Sitemap:` lines at the end.
 * @param domain - The site domain (e.g. https://example.com)
 * @param sitemapUrls - Site-relative sitemap paths (e.g. ["/sitemap.xml"])
 * @param rules - Optional rule(s) object; falls back to DEFAULT_ROBOTS_RULES
 */
export async function generateRobotsTxt(
	domain: string,
	sitemapUrls: string[] = ["/sitemap.xml"],
	rules?: RobotsRule | RobotsRule[],
): Promise<string> {
	let content = serializeRobotsRules(rules ?? DEFAULT_ROBOTS_RULES).trim();
	if (!content.endsWith("\n")) content += "\n";
	const domainUrl = domain.endsWith("/") ? domain.slice(0, -1) : domain;
	for (const rel of sitemapUrls) {
		content += `Sitemap: ${domainUrl}${rel.startsWith("/") ? rel : `/${rel}`}\n`;
	}
	return content;
}
