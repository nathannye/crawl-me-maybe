import type { RobotsRule } from "./types";
import { normalizeDomain } from "./domain";

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

function toSitemapPath(filename: string): string {
	const trimmed = filename.replace(/^\/+/, "");
	return `/${trimmed}`;
}

function toSitemapUrl(domain: string, filename: string): string {
	return `${normalizeDomain(domain)}${toSitemapPath(filename)}`;
}

/**
 * Generates a robots.txt string using the default crawler rules.
 * @param domain - Site origin (e.g. https://example.com)
 * @param sitemapIndex - Sitemap index filename only (e.g. "sitemap.xml")
 */
export function createRobotsTxt(
	domain: string,
	sitemapIndex: string = "sitemap.xml",
): string {
	if (!domain || typeof domain !== "string") {
		throw new Error("createRobotsTxt: domain must be a non-empty string");
	}
	if (!sitemapIndex || typeof sitemapIndex !== "string") {
		throw new Error("createRobotsTxt: sitemapIndex must be a non-empty string");
	}
	let content = serializeRobotsRules(DEFAULT_ROBOTS_RULES).trim();
	if (!content.endsWith("\n")) content += "\n";
	content += `Sitemap: ${toSitemapUrl(domain, sitemapIndex)}\n`;
	return content;
}

/**
 * Builds a complete robots.txt string from structured rules, appending the
 * sitemap index URL at the end.
 * @param domain - Site origin (e.g. https://example.com)
 * @param sitemapIndex - Sitemap index filename only (e.g. "sitemap.xml")
 * @param rules - Optional rule(s); falls back to DEFAULT_ROBOTS_RULES
 */
export async function generateRobotsTxt(
	domain: string,
	sitemapIndex: string = "sitemap.xml",
	rules?: RobotsRule | RobotsRule[],
): Promise<string> {
	let content = serializeRobotsRules(rules ?? DEFAULT_ROBOTS_RULES).trim();
	if (!content.endsWith("\n")) content += "\n";
	content += `Sitemap: ${toSitemapUrl(domain, sitemapIndex)}\n`;
	return content;
}
