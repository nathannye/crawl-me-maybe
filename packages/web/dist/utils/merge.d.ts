import type { SanityImageAssetDocument } from "@sanity/client";
import { type Favicon } from "./favicon";
/**
 * Type for SEO defaults from seoDefaults singleton
 * Based on apps/cms/plugins/schema-markup/src/schemas/singleton/seo-defaults.ts
 */
export type SeoDefaults = {
    siteTitle: string;
    pageTitleTemplate: string;
    metaDescription?: string;
    siteUrl: string;
    favicon?: SanityImageAssetDocument;
    twitterHandle?: string;
};
/**
 * Type for page-level metadata
 * Based on apps/cms/plugins/schema-markup/src/schemas/fields/metadata/page-metadata.ts
 */
type SanitySlug = {
    slug: {
        current?: string;
        fullUrl?: string;
    };
} | string;
export type PageMetadata<MetaKey extends string = "meta"> = {
    schemaMarkup?: {
        type: string;
    };
    title: string;
} & {
    [metaKey in MetaKey]: {
        description?: string;
        canonicalUrl?: string;
        metaImage?: SanityImageAssetDocument;
        searchVisibility?: {
            noIndex?: boolean;
            noFollow?: boolean;
        };
    };
} & {
    slug: SanitySlug;
    _createdAt?: string;
    _updatedAt?: string;
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
/**
 * Merges page-level metadata with SEO defaults,
 * Page metadata takes precedence over defaults
 *
 * The `seoObjectName` parameter tells us which key to look for on the page object.
 * Typescript cannot statically verify the key, so types are a little looser at this access.
 */
export declare const mergeSeoData: <MetaKey extends string = "meta">(page?: PageMetadata<MetaKey>, seoDefaults?: SeoDefaults, seoObjectName?: MetaKey) => MergedMetadata;
export {};
