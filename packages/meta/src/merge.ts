import type { SanityImageAssetDocument } from "@sanity/client";
import { createFavicons, type Favicon } from "./favicon";
import { createMetaTitle } from "./meta-title";
import { normalizeUrl } from "./url";

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

const buildOpenGraphMetadata = ({
	siteUrl,
	siteTitle,
	pageTitle,
	pageDescription,
	ogType,
}: {
	siteUrl: string;
	pageTitle: string;
	pageDescription?: string;
	siteTitle: string;
	ogType?: OpenGraphType;
}) => {
	const obj = {
		siteName: siteTitle,
		url: siteUrl,
		title: pageTitle,
		description: pageDescription,
		type: ogType || "website",
	};

	return obj;
};
const buildTwitterMetadata = ({
	siteUrl,
	twitterHandle,
	twitterCardStyle,
}: {
	siteUrl: string;
	twitterHandle: string | undefined;
	twitterCardStyle?: TwitterCardStyle;
}) => {
	return {
		card: twitterCardStyle || "summary_large_image",
		creator: twitterHandle,
		site: siteUrl,
	};
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

	const openGraph = buildOpenGraphMetadata({
		siteUrl: seoDefaults.siteUrl,
		pageTitle: page.title,
		pageDescription: page.description,
		siteTitle: seoDefaults.siteTitle,
		ogType: options?.ogType,
	});

	const twitter = buildTwitterMetadata({
		siteUrl: seoDefaults.siteUrl,
		twitterHandle: seoDefaults.twitterHandle,
		twitterCardStyle: options?.twitterCardStyle,
	});

	return {
		title: metaTitle,
		description: description,
		canonicalUrl: canonicalUrl,
		metaImage: pageMeta?.metaImage,
		favicons: favicons,
		twitter: twitter,
		openGraph: openGraph,
		robots: robots,
		...(options?.metadata || {}),
	};
};
