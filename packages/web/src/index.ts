// ============================================================================
// Main Entry Point: @crawl-me-maybe/web
// ============================================================================

// ----------------------------------------------------------------------------
// Core Functions
// ----------------------------------------------------------------------------
export { buildSeoPayload } from "./build";
export type {
	BuildSeoPayloadParams,
	BuildSeoPayloadResult,
} from "./build";

// ----------------------------------------------------------------------------
// SEO Utilities
// ----------------------------------------------------------------------------
export {
	mergeSeoData,
	createMetaTitle,
	createSchemaImageObject,
	createFavicons,
	configureSanityImages,
	getImageConfig,
	urlFor,
} from "~/utils";

export type {
	SeoDefaults,
	PageMetadata,
	MergedMetadata,
	Favicon,
	SanityImageConfig,
} from "~/utils";

// ----------------------------------------------------------------------------
// Schema Markup
// ----------------------------------------------------------------------------
export { composeSchema } from "~/schema-markup";
export type { SchemaDefaults } from "~/schema-markup";

// Schema Builders
export {
	buildWebPage,
	buildWebSite,
	buildArticle,
	buildProduct,
	buildEvent,
	buildFAQPage,
	buildOrganization,
	buildPersonOrOrg,
	buildAboutPage,
	buildContactPage,
	buildPersonSchema,
	buildOrgSchema,
	normalizeId,
	formatSchemaDate,
} from "~/schema-markup";

// Schema Types
export type {
	SchemaImage,
	SchemaAddress,
	SchemaGeo,
	SchemaAggregateRating,
	SchemaPerson,
	SchemaContactPoint,
	SchemaOrganization,
	SchemaFAQItem,
	SchemaSearchAction,
	SchemaLocation,
	SchemaOffer,
} from "~/schema-markup";

// ----------------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------------
export { coalesce } from "./schema-markup/schema-utils";
