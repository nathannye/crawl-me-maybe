export type PreviewCardProps = {
	siteUrl: string;
	title: string;
	description: string;
	image: string;
	twitterHandle?: string;
	favicon?: string;
};

export type ResolveValue = (value: unknown) => unknown;

export type PluginOptions = {
	global?: {
		/** Include the favicon field in Global SEO Settings (default: true) */
		favicon?: boolean;
		/** Include the robots rules field in Global SEO Settings (default: true) */
		robots?: boolean;
	};
	page?: {
		/** Include search indexing (noIndex/noFollow) controls on page metadata (default: true) */
		searchIndexing?: boolean;
		/** Include canonicalUrl on page metadata (default: true). Disable if you use a custom reference field for canonical URLs. */
		canonicalUrl?: boolean;
	};
	fieldTypes?: {
		/** Base Sanity type for metaDescription (default: "text") */
		metaDescription?: string;
		/** Base Sanity type for metaTitle (default: "string") */
		metaTitle?: string;
	};
	/**
	 * Studio helper: turn a stored field value into a scalar for
	 * hasContent / placeholders / social previews.
	 * Also useful as a reference for how to resolve values on the frontend.
	 */
	resolveValue?: ResolveValue;
};
