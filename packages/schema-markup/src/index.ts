// ============================================================================
// Main Entry Point: @crawl-me-maybe/schema-markup
// ============================================================================

export { automap } from "./automap";
export type {
	BuildSeoPayloadParams,
	BuildSeoPayloadResult,
} from "./build";
export { buildSeoPayload } from "./build";

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
	formatSchemaDate,
	normalizeId,
} from "./builders";
export type { SchemaDefaults } from "./compose";
export { composeSchema } from "./compose";
export { coalesce } from "./schema-utils";
export type {
	SchemaAddress,
	SchemaAggregateRating,
	SchemaContactPoint,
	SchemaFAQItem,
	SchemaGeo,
	SchemaImage,
	SchemaLocation,
	SchemaOffer,
	SchemaOrganization,
	SchemaPerson,
	SchemaSearchAction,
} from "./types";
export { createSchemaImageObject } from "./utils/image";
