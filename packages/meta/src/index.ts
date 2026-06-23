export type { SanityWebConfig } from "./config";
export { getConfig, setConfig } from "./config";
// export { createFavicons } from "./favicon";
export type {
	// Favicon,
	GlobalSeoSettings,
	MergedMetadata,
	RawPageMetadata,
} from "./merge";
export { buildMetadata } from "./merge";
export { createMetaTitle } from "./meta-title";
export type {
	HtmlTagsOutput,
	LinkTag,
	MetaTag,
} from "./to-html-tags";
export { toHtmlTags } from "./to-html-tags";
