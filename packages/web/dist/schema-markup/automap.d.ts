import type { MergedMetadata } from "~/utils/merge";
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
