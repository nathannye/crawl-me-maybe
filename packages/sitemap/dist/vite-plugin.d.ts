import type { LocaleConfig, SitemapConfig, SitemapEntry } from "./types";
export type { LocaleConfig, SitemapConfig, SitemapEntry };
export declare function vitePluginSitemap(config?: SitemapConfig): {
    name: string;
    apply: "build";
    closeBundle(): Promise<void>;
};
