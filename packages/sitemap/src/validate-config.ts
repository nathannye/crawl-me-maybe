import type { SitemapConfig } from "./types";

/**
 * Validates a Vite plugin configuration object.
 * @throws If required fields are missing or invalid
 */
export function validateConfig(config: SitemapConfig): SitemapConfig {
	if (!config) {
		throw new Error("vitePluginSitemap: config is required");
	}

	if (!config.domain || typeof config.domain !== "string") {
		throw new Error("vitePluginSitemap: domain must be a non-empty string");
	}

	try {
		new URL(config.domain);
	} catch {
		throw new Error(
			`vitePluginSitemap: domain must be a valid URL origin (received "${config.domain}")`,
		);
	}

	if (!config.sitemaps) {
		throw new Error("vitePluginSitemap: sitemaps is required");
	}

	if (
		typeof config.sitemaps === "object" &&
		!Array.isArray(config.sitemaps) &&
		Object.keys(config.sitemaps).length === 0
	) {
		throw new Error(
			"vitePluginSitemap: sitemaps object must include at least one sitemap definition",
		);
	}

	return config;
}
