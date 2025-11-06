import fs from "node:fs";
import path from "node:path";
import { DEFAULT_ROBOTS_TXT } from "./robots";
import type { LocaleConfig, SitemapConfig, SitemapEntry } from "./types";
import {
	createFile,
	createIndexSitemap,
	createSitemapXml,
	generateLocalizedEntries,
} from "./utils";

// Export types for consumers
export type { LocaleConfig, SitemapConfig, SitemapEntry };

const DEFAULT_CONFIG: SitemapConfig = {
	domain: "https://yoursite.com",
	outDir: "dist",
	disableMinification: false,
	sitemaps: { pages: async () => [] },
	robots: async () => DEFAULT_ROBOTS_TXT,
};

export default function crawlMeMaybeSitemap(
	config: SitemapConfig = DEFAULT_CONFIG,
) {
	const domain = config?.domain;
	if (!domain) {
		throw new Error(
			"⚠️ No domain provided. Sitemap generation requires a domain.",
		);
	}

	const outDir = config?.outDir || "dist";
	const minify = !config?.disableMinification;
	const locales = config?.locales;
	const localeMode = config?.localeMode || "prefix";

	/**
	 * Creates robots.txt handling custom async/user rules and always adds sitemaps at the end.
	 * @param sitemapsUrls - array of string (relative to domain)
	 */
	const createRobots = async (sitemapsUrls: string[] = ["/sitemap.xml"]) => {
		let userRobots = DEFAULT_ROBOTS_TXT;
		if (config.robots && typeof config.robots === "function") {
			try {
				const result = await config.robots();
				if (typeof result === "string") {
					userRobots = result;
				}
			} catch (err) {
				console.warn("[SEO] Error in user robots async callback", err);
			}
		}
		let content = userRobots.trim();
		if (!content.endsWith("\n")) content += "\n";
		// Ensure no duplicate Sitemap: lines
		const domainUrl = domain.endsWith("/") ? domain.slice(0, -1) : domain;
		for (const rel of sitemapsUrls) {
			content += `Sitemap: ${domainUrl}${rel.startsWith("/") ? rel : `${"/"}${rel}`}\n`;
		}
		createFile(outDir, "robots.txt", content);
	};

	const createSitemap = async (filename: string, urls: SitemapEntry[]) => {
		// Apply localization if configured
		const processedUrls =
			locales && locales.length > 0
				? generateLocalizedEntries(urls, locales, domain, localeMode)
				: urls.map((u) => ({ ...u, url: domain + u.url }));

		const xml = await createSitemapXml(processedUrls, { minify });
		createFile(outDir, `${filename}.xml`, xml);
	};

	return {
		name: "vite-plugin-sitemap",
		apply: "build" as const,
		async closeBundle() {
			const outDir = path.resolve(process.cwd(), config?.outDir || "dist");
			fs.mkdirSync(outDir, { recursive: true });
			const { sitemaps } = config;

			if (typeof sitemaps === "function") {
				// Single sitemap mode
				const urls = await sitemaps();
				await createSitemap("sitemap.xml", urls);
				await createRobots(["/sitemap.xml"]);
				console.log("✅ Generated single sitemap");
				return;
			}

			// Multi-sitemap mode (object)
			const allSitemaps: string[] = [];
			for (const [name, cb] of Object.entries(sitemaps)) {
				if (typeof cb !== "function") continue;
				const urls = await cb();
				await createSitemap(`sitemap-${name}.xml`, urls);
				allSitemaps.push(`/sitemap-${name}.xml`);
			}

			const indexXml = await createIndexSitemap(
				allSitemaps.map((s: string) => s.slice(1)),
				domain,
				{ minify },
			);
			createFile(outDir, "sitemap.xml", indexXml);
			await createRobots(["/sitemap.xml", ...allSitemaps]);
			console.log(
				`✅ Generated ${allSitemaps.length} sitemaps + index + robots.txt`,
			);
		},
	};
}
