// ============================================================================
// Main Entry Point: @crawl-me-maybe/web
// ============================================================================

// Schema Types
export type {
	SchemaAddress,
	SchemaAggregateRating,
	SchemaContactPoint,
	SchemaDefaults,
	SchemaFAQItem,
	SchemaGeo,
	SchemaImage,
	SchemaLocation,
	SchemaOffer,
	SchemaOrganization,
	SchemaPerson,
	SchemaSearchAction,
} from "~/schema-markup";
// ----------------------------------------------------------------------------
// Schema Markup
// ----------------------------------------------------------------------------
// Schema Builders
export {
	buildAboutPage,
	buildArticle,
	buildContactPage,
	buildEvent,
	buildFAQPage,
	buildOrganization,
	buildOrgSchema,
	buildPersonOrOrg,
	buildPersonSchema,
	buildProduct,
	buildWebPage,
	buildWebSite,
	composeSchema,
	formatSchemaDate,
	normalizeId,
} from "~/schema-markup";
export type {
	Favicon,
	MergedMetadata,
	PageMetadata,
	SeoDefaults,
} from "~/utils";
// ----------------------------------------------------------------------------
// SEO Utilities
// ----------------------------------------------------------------------------
export {
	createFavicons,
	createMetaTitle,
	createSchemaImageObject,
	mergeSeoData,
	urlFor,
} from "~/utils";
export type {
	BuildSeoPayloadParams,
	BuildSeoPayloadResult,
} from "./build";
// ----------------------------------------------------------------------------
// Core Functions
// ----------------------------------------------------------------------------
export { buildSeoPayload } from "./build";
