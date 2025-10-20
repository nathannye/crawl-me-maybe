import type { SanityImageAssetDocument } from "@sanity/client";
import { createMetaTitle } from "./meta-title";
import { createFavicons, type Favicon } from "./favicon";

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

type SanitySlug = { slug: { current?: string; fullUrl?: string } } | string;

// This allows you to dynamically change the metadata field name on the page object
export type PageMetadata<MetaKey extends string = "meta"> = {
	schemaMarkup?: { type: string };
	title: string;
	[metaKey in MetaKey]: {
		description?: string;
		canonicalUrl?: string;
		metaImage?: SanityImageAssetDocument;
		searchVisibility?: {
			noIndex?: boolean;
			noFollow?: boolean;
		};
	};
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

const buildRobotsString = ({
	noIndex = false,
	noFollow = false,
}: { noIndex?: boolean; noFollow?: boolean }) => {
	const parts = [];

	if (noIndex) parts.push("noindex");
	if (noFollow) parts.push("nofollow");

	if (parts.length === 0) return undefined;

	return parts.join(",");
};

/**
 * Merges page-level metadata with SEO defaults,
 * Page metadata takes precedence over defaults
 *
 * The `seoObjectName` parameter tells us which key to look for on the page object.
 * Typescript cannot statically verify the key, so types are a little looser at this access.
 */
export const mergeSeoData = <
	MetaKey extends string = "meta"
>(
	page?: PageMetadata<MetaKey>,
	seoDefaults?: SeoDefaults,
	seoObjectName: MetaKey = "meta" as MetaKey
): MergedMetadata => {
	// If no data available, return minimal metadata
	if (!page && !seoDefaults) {
		console.warn("mergeSeoData: No page or seoDefaults provided");
		return {
			title: undefined,
			description: undefined,
		};
	}

	// -------- Dynamic meta key extraction --------
	const pageMeta = page?.[seoObjectName as keyof PageMetadata<MetaKey>]
	const schemaMarkupType = page?.schemaMarkup?.type;

	// If only defaults available
	if (!page) {
		console.warn("mergeSeoData: No page data provided");
		return {
			title: seoDefaults?.siteTitle,
			description: seoDefaults?.metaDescription,
			canonicalUrl: seoDefaults?.siteUrl,
			favicons: createFavicons(seoDefaults?.favicon),
			twitterHandle: seoDefaults?.twitterHandle,
		};
	}

	// If only page data available (no defaults)
	if (!seoDefaults) {
		console.warn("mergeSeoData: No seoDefaults provided");
		return {
			title: page.title,
			description: pageMeta?.description,
			canonicalUrl: pageMeta?.canonicalUrl,
			schemaMarkup: schemaMarkupType,
		};
	}

	// Both page and defaults available - merge them
	return {
		// Generate title using template
		title: createMetaTitle(
			page.title,
			seoDefaults.siteTitle,
			seoDefaults.pageTitleTemplate
		),
		siteTitle: seoDefaults.siteTitle,
		// Page metadata overrides defaults
		description: pageMeta?.description || seoDefaults.metaDescription,
		canonicalUrl: pageMeta?.canonicalUrl || seoDefaults.siteUrl,
		metaImage: pageMeta?.metaImage,
		favicons: createFavicons(seoDefaults.favicon),
		twitterHandle: seoDefaults.twitterHandle,
		robots: buildRobotsString(
			pageMeta?.searchVisibility || { noIndex: false, noFollow: false }
		),
		schemaMarkup: schemaMarkupType,
	};
};
