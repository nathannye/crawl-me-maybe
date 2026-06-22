import type { SitemapConfig } from "./types";
/**
 * Vite plugin that generates sitemap.xml and robots.txt on `closeBundle`.
 * @param config - Plugin configuration (domain and sitemaps are required)
 */
export declare function vitePluginSitemap(config: SitemapConfig): {
    name: string;
    apply: "build";
    closeBundle(): Promise<void>;
};
