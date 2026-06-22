import type { SanityImageAssetDocument } from "@sanity/client";
import { createFavicons, type Favicon } from "./favicon";
import { createMetaTitle } from "./meta-title";
import { normalizeUrl } from "./url";

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

const buildRobotsString = ({
	noIndex = false,
	noFollow = false,
}: {
	noIndex?: boolean;
	noFollow?: boolean;
}) => {
	const parts = [];

	if (noIndex) parts.push("noindex");
	if (noFollow) parts.push("nofollow");

	if (parts.length === 0) return undefined;

	return parts.join(",");
};

const createCanonicalUrl = ({
	slug = "/",
	siteUrl,
	disableSelfCanonical,
	canonicalUrl,
}: {
	slug?: string;
	siteUrl: string;
	disableSelfCanonical?: boolean;
	canonicalUrl?: string;
}) => {
	if (disableSelfCanonical) return canonicalUrl || undefined;
	return normalizeUrl(siteUrl, slug);
};

export const buildMetadata = (
	page?: RawPageMetadata,
	seoDefaults?: GlobalSeoSettings,
	options?: MergeSeoDataOptions,
): MergedMetadata => {
	const { disableSelfCanonical = false } = options || {};

	// If no data available, return minimal metadata
	if (!page && !seoDefaults) {
		console.warn("buildMetadata: No page or seoDefaults provided");
		return {
			title: undefined,
			description: undefined,
			canonicalUrl: undefined,
			favicons: undefined,
			twitterHandle: undefined,
			robots: undefined,
			schemaMarkup: undefined,
			siteTitle: undefined,
		};
	}

	// -------- Dynamic meta key extraction --------
	const pageMeta = page;

	// If only defaults available
	if (!page) {
		console.warn("buildMetadata: No page data provided");
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
		console.warn("buildMetadata: No seoDefaults provided");
		return {
			title: page.title,
			description: pageMeta?.description,
			canonicalUrl: pageMeta?.canonicalUrl,
		};
	}

	const canonicalUrl = createCanonicalUrl({
		slug: page?.slug?.current,
		siteUrl: seoDefaults?.siteUrl,
		disableSelfCanonical,
		canonicalUrl: page?.canonicalUrl,
	});
	const robots = buildRobotsString(
		pageMeta?.searchIndexing || { noIndex: false, noFollow: false },
	);
	const metaTitle = createMetaTitle(
		page.title,
		seoDefaults.siteTitle,
		seoDefaults.pageTitleTemplate,
	);
	const description = pageMeta?.description || seoDefaults.metaDescription;
	const favicons = createFavicons(seoDefaults.favicon);

	// Both page and defaults available - merge them
	return {
		// Generate title using template
		title: metaTitle,
		description: description,
		canonicalUrl: canonicalUrl,
		metaImage: pageMeta?.metaImage,
		favicons: favicons,
		twitterHandle: seoDefaults.twitterHandle,
		robots: robots,
	};
};
