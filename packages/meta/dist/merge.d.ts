import type { SanityImageAssetDocument } from "@sanity/client";
import { type Favicon } from "./favicon";
/**
 * Type for SEO defaults from seoDefaults singleton
 * Based on apps/cms/plugins/schema-markup/src/schemas/singleton/seo-defaults.ts
 */
type OpenGraphType = "website" | "article" | "product";
type TwitterCardStyle = "summary_large_image" | "summary" | "app" | "player";
type TwitterMetadata = {
    card: TwitterCardStyle;
    creator: string | undefined;
    site: string;
};
type OpenGraphMetadata = {
    siteName: string;
    url: string;
    title: string;
    description?: string;
    type: OpenGraphType;
};
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
    openGraph?: OpenGraphMetadata;
    twitter?: TwitterMetadata;
};
type MergeSeoDataOptions = {
    disableSelfCanonical?: boolean;
    twitterCardStyle?: "summary_large_image" | "summary" | "app" | "player";
    ogType?: OpenGraphType;
    metadata?: Record<string, unknown>;
};
export declare const buildMetadata: (page?: RawPageMetadata, seoDefaults?: GlobalSeoSettings, options?: MergeSeoDataOptions) => MergedMetadata;
export {};
