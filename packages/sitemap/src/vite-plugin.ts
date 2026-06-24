import fs from "node:fs";
import path from "node:path";
import { generateRobotsTxt } from "./robots";
import { generateIndexSitemap, generateSitemap } from "./sitemap";
import type { GenerateSitemapOptions, SitemapConfig } from "./types";
import { validateConfig } from "./validate-config";
import { createFile } from "./file";

/**
 * Vite plugin that generates sitemap.xml and robots.txt on `closeBundle`.
 * @param config - Plugin configuration (domain and sitemaps are required)
 */
export function vitePluginSitemap(config: SitemapConfig) {
	const pluginConfig = validateConfig(config);

	const domain = pluginConfig.domain;
	const outDir = pluginConfig.outDir || "dist";
	const resolvedOutDir = path.resolve(process.cwd(), outDir);
	const locales = pluginConfig.locales;
	const localeMode = pluginConfig.localeMode || "prefix";
	const prefixDefault = pluginConfig.prefixDefault ?? false;

	const writeRobots = (sitemapIndex = "sitemap.xml") => {
		const content = generateRobotsTxt(
			domain,
			sitemapIndex,
			pluginConfig.robots,
		);
		createFile(resolvedOutDir, "robots.txt", content);
	};

	const writeSitemap = async (
		filename: string,
		entriesOptions: Pick<GenerateSitemapOptions, "entries" | "sitemap">,
	) => {
		const xml = await generateSitemap(domain, {
			...entriesOptions,
			locales,
			localeMode,
			prefixDefault,
		} as GenerateSitemapOptions);
		createFile(resolvedOutDir, filename, xml);
	};

	return {
		name: "vite-plugin-sitemap",
		apply: "build" as const,
		async closeBundle() {
			fs.mkdirSync(resolvedOutDir, { recursive: true });
			const { sitemaps } = pluginConfig;

			if (typeof sitemaps === "function") {
				await writeSitemap("sitemap.xml", { entries: sitemaps });
				writeRobots("sitemap.xml");
				console.log("✅ Generated single sitemap");
				return;
			}

			const indexFiles: string[] = [];
			for (const [name, cb] of Object.entries(sitemaps)) {
				if (typeof cb !== "function") continue;
				const filename = `sitemap/${name}.xml`;
				await writeSitemap(filename, {
					entries: sitemaps,
					sitemap: name,
				});
				indexFiles.push(filename);
			}

			const indexXml = generateIndexSitemap(domain, {
				childSitemapNames: indexFiles,
			});
			createFile(resolvedOutDir, "sitemap.xml", indexXml);
			writeRobots("sitemap.xml");
			console.log(
				`✅ Generated ${indexFiles.length} sitemaps + index + robots.txt`,
			);
		},
	};
}
