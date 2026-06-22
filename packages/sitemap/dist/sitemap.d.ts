import type { LocaleConfig, SitemapEntry } from "./types";
export type SitemapGeneratorConfig = {
    domain: string;
    entries: SitemapEntry[];
    locales?: LocaleConfig[];
    localeMode?: "prefix" | "subdomain";
    prefixDefault?: boolean;
};
export declare function generateSitemap(config: SitemapGeneratorConfig): Promise<string>;
export declare function createIndexSitemap(files: string[], baseUrl: string): Promise<string>;
