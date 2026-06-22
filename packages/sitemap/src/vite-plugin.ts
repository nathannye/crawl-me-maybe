import fs from "node:fs";
import path from "node:path";
import { generateRobotsTxt } from "./robots";
import { generateIndexSitemap, generateSitemap } from "./sitemap";
import type { LocaleConfig, SitemapConfig, SitemapEntry } from "./types";
import { createFile } from "./file";

// Export types for consumers
export type { LocaleConfig, SitemapConfig, SitemapEntry };

const DEFAULT_CONFIG: SitemapConfig = {
	domain: "https://yoursite.com",
	outDir: "dist",
	sitemaps: { pages: async () => [] },
};

export function vitePluginSitemap(config?: SitemapConfig) {
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
	const locales = pluginConfig?.locales;
	const localeMode = pluginConfig?.localeMode || "prefix";
	const prefixDefault = pluginConfig?.prefixDefault ?? false;

	const createRobots = async (sitemapIndex = "sitemap.xml") => {
		const content = await generateRobotsTxt(
			domain,
			sitemapIndex,
			pluginConfig.robots,
		);
		createFile(resolvedOutDir, "robots.txt", content);
	};

	const createSitemap = async (filename: string, urls: SitemapEntry[]) => {
		const xml = await generateSitemap({
			domain,
			entries: urls,
			locales,
			localeMode,
			prefixDefault,
		});
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
				await createRobots("sitemap.xml");
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

			const indexXml = await generateIndexSitemap(
				allSitemaps.map((s: string) => s.slice(1)),
				domain,
			);
			createFile(resolvedOutDir, "sitemap.xml", indexXml);
			await createRobots("sitemap.xml");
			console.log(
				`✅ Generated ${allSitemaps.length} sitemaps + index + robots.txt`,
			);
		},
	};
}
