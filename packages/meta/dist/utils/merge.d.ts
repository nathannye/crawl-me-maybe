import type { SanityImageAssetDocument } from "@sanity/client";
import { type Favicon } from "./favicon";
/**
 * Type for SEO defaults from seoDefaults singleton
 * Based on apps/cms/plugins/schema-markup/src/schemas/singleton/seo-defaults.ts
 */
export type GlobalSeoSettings = {
    siteTitle: string;
    pageTitleTemplate: string;
    metaDescription?: string;
    siteUrl: string;
    favicon?: SanityImageAssetDocument;
    twitterHandle?: string;
};
export type RawPageMetadata = {
    slug: {
        current?: string;
    };
    title: string;
    _createdAt?: string;
    _updatedAt?: string;
    description?: string;
    canonicalUrl?: string;
    metaImage?: SanityImageAssetDocument;
    searchIndexing?: {
        noIndex?: boolean;
        noFollow?: boolean;
    };
};
export type MergedMetadata = {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    metaImage?: SanityImageAssetDocument;
    favicons?: Favicon[] | null;
    twitterHandle?: string;
    robots?: string;
    schemaMarkup?: string;
    siteTitle?: string;
};
type MergeSeoDataOptions = {
    disableSelfCanonical?: boolean;
};
export declare const buildMetadata: (page?: RawPageMetadata, seoDefaults?: GlobalSeoSettings, options?: MergeSeoDataOptions) => MergedMetadata;
export {};
