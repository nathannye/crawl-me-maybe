import type { LocaleConfig, SitemapConfig, SitemapEntry } from "./types";
export type { LocaleConfig, SitemapConfig, SitemapEntry };
export default function crawlMeMaybeSitemap(config?: SitemapConfig): {
    name: string;
    apply: "build";
    closeBundle(): Promise<void>;
};
