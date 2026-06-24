import path from "node:path";
import { createFile } from "./file";
import { createSitemapManifest } from "./manifest";
import { generateRobotsTxt } from "./robots";
import type { SitemapConfig } from "./types";
import { validateConfig } from "./validate-config";

/**
 * Vite plugin that generates sitemap.xml and robots.txt on `closeBundle`.
 * @param config - Plugin configuration (domain and sitemaps are required)
 */
export function vitePluginSitemap(config: SitemapConfig) {
	const pluginConfig = validateConfig(config);

	const domain = pluginConfig.domain;
	const outDir = pluginConfig.outDir || "dist";
	const resolvedOutDir = path.resolve(process.cwd(), outDir);
	const manifest = createSitemapManifest({
		domain,
		entries: pluginConfig.sitemaps,
		maxUrls: pluginConfig.maxUrls,
		localization: pluginConfig.localization,
	});

	const writeRobots = (sitemapIndex = "sitemap.xml") => {
		const content = generateRobotsTxt(
			domain,
			sitemapIndex,
			pluginConfig.robots,
		);
		createFile(resolvedOutDir, "robots.txt", content);
	};

	return {
		name: "vite-plugin-sitemap",
		apply: "build" as const,
		async closeBundle() {
			const files = await manifest.getSitemapFiles();
			const rootXml = await manifest.getRootSitemap();
			createFile(resolvedOutDir, "sitemap.xml", rootXml);

			if (files.length > 1) {
				for (const file of files) {
					const xml = await manifest.getSitemap({
						sitemap: file.sitemap ?? undefined,
						index: file.index,
					});
					createFile(resolvedOutDir, file.path, xml);
				}
			}

			writeRobots("sitemap.xml");

			if (files.length === 1) {
				console.log("✅ Generated sitemap.xml + robots.txt");
			} else {
				console.log(
					`✅ Generated sitemap.xml, ${files.length} child sitemap file(s), and robots.txt`,
				);
			}
		},
	};
}
