// ============================================================================
// Main Entry Point: @crawl-me-maybe/meta
// ============================================================================

export type {
	Favicon,
	MergedMetadata,
	PageMetadata,
	SeoDefaults,
} from "~/utils";
export {
	createFavicons,
	createMetaTitle,
	mergeSeoData,
	setConfig,
	urlFor,
} from "~/utils";
export type { SanityWebConfig } from "./config";
export { getConfig } from "./config";
