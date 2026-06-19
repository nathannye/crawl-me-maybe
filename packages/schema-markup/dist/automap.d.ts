import type { MergedMetadata } from "@crawl-me-maybe/web";
type AutoMapSettings = {
    title?: boolean;
    description?: boolean;
    image?: boolean;
    datePublished?: boolean;
    dateModified?: boolean;
};
type AutoMapProperty = keyof AutoMapSettings;
type AutoMapValue = {
    [K in AutoMapProperty]: string | undefined;
};
export declare const automap: (automapSettings: AutoMapSettings, baseSeoObject: MergedMetadata, extra?: Record<string, unknown>) => AutoMapValue;
export {};
