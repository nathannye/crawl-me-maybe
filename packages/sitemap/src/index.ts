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
	// Explicitly capture config to ensure it's always available in closures
	const pluginConfig: SitemapConfig = config || DEFAULT_CONFIG;

	const domain = pluginConfig?.domain;
	if (!domain) {
		throw new Error(
			"⚠️ No domain provided. Sitemap generation requires a domain.",
		);
	}

	const outDir = pluginConfig?.outDir || "dist";
	const resolvedOutDir = path.resolve(process.cwd(), outDir);
	const minify = !pluginConfig?.disableMinification;
	const locales = pluginConfig?.locales;
	const localeMode = pluginConfig?.localeMode || "prefix";
	const prefixDefault = pluginConfig?.prefixDefault ?? false;

	/**
	 * Creates robots.txt handling custom async/user rules and always adds sitemaps at the end.
	 * @param sitemapsUrls - array of string (relative to domain)
	 */
	const createRobots = async (sitemapsUrls: string[] = ["/sitemap.xml"]) => {
		let userRobots = DEFAULT_ROBOTS_TXT;
		if (pluginConfig.robots && typeof pluginConfig.robots === "function") {
			try {
				const result = await pluginConfig.robots();
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
		createFile(resolvedOutDir, "robots.txt", content);
	};

	const createSitemap = async (filename: string, urls: SitemapEntry[]) => {
		// Apply localization if configured
		const processedUrls =
			locales && locales.length > 0
				? generateLocalizedEntries(
						urls,
						locales,
						domain,
						localeMode,
						prefixDefault,
					)
				: urls.map((u) => {
						// Normalize URL: ensure it starts with /
						const normalizedUrl = u.url?.startsWith("/")
							? u.url
							: `/${u.url || ""}`;
						return { ...u, url: domain + normalizedUrl };
					});

		const xml = await createSitemapXml(processedUrls, { minify });
		createFile(resolvedOutDir, filename, xml);
	};

	return {
		name: "vite-plugin-sitemap",
		apply: "build" as const,
		async closeBundle() {
			// Use the captured pluginConfig from outer scope for consistency
			fs.mkdirSync(resolvedOutDir, { recursive: true });
			const { sitemaps } = pluginConfig;

			if (!sitemaps) {
				console.warn("⚠️ No sitemaps configuration found");
				return;
			}

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
			createFile(resolvedOutDir, "sitemap.xml", indexXml);
			await createRobots(["/sitemap.xml"]);
			console.log(
				`✅ Generated ${allSitemaps.length} sitemaps + index + robots.txt`,
			);
		},
	};
}
