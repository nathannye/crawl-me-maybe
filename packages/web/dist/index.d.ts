import { SanityAssetDocument, SanityImageAssetDocument } from "@sanity/client";
import { Thing, ImageObject } from "schema-dts";

type Favicon = {
	type: string;
	sizes?: string;
	href: string;
};
declare const createFavicons: (
	favicon: SanityAssetDocument | undefined,
) => Favicon[] | null;

/**
 * Type for SEO defaults from seoDefaults singleton
 * Based on apps/cms/plugins/schema-markup/src/schemas/singleton/seo-defaults.ts
 */
type SeoDefaults = {
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
type SanitySlug =
	| {
			slug: {
				current?: string;
				fullUrl?: string;
			};
	  }
	| string;
type PageMetadata<MetaKey extends string = "meta"> = {
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
type MergedMetadata = {
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
declare const mergeSeoData: <MetaKey extends string = "meta">(
	page?: PageMetadata<MetaKey>,
	seoDefaults?: SeoDefaults,
	seoObjectName?: MetaKey,
) => MergedMetadata;

type SchemaImage = SanityImageAssetDocument;
type SchemaAddress = {
	streetAddress?: string;
	addressLocality?: string;
	addressRegion?: string;
	postalCode?: string;
	addressCountry?: string;
};
type SchemaGeo = {
	latitude?: number | string;
	longitude?: number | string;
};
type SchemaAggregateRating = {
	ratingValue?: number | string;
	reviewCount?: number | string;
	bestRating?: number | string;
	worstRating?: number | string;
};
type SchemaPerson = {
	"@id"?: string;
	name: string;
	url?: string;
	sameAs?: string[];
	jobTitle?: string;
	image?: SchemaImage;
	affiliation?: SchemaOrganization[];
};
type SchemaContactPoint = {
	contactType: string;
	telephone?: string;
	email?: string;
	url?: string;
	areaServed?: string[];
	availableLanguage?: string[];
};
type SchemaOrganization = {
	"@id"?: string;
	name: string;
	url?: string;
	logo?: SchemaImage;
	sameAs?: string[];
	department?: SchemaOrganization[];
	contactPoint?: SchemaContactPoint[];
};
type SchemaFAQItem = {
	question: string;
	answer: string;
};
type SchemaSearchAction = {
	target?: string;
	queryInput?: string;
};
type SchemaLocation = {
	name?: string;
	url?: string;
	address?: SchemaAddress;
	geo?: SchemaGeo;
};
type SchemaOffer = {
	"@type": "Offer";
	price?: number | string;
	priceCurrency?: string;
	availability?: string;
	url?: string;
};

type SchemaDefaults = {
	sameAs?: string[];
	logo?: SchemaImage;
	organization?: SchemaOrganization;
	publisher?: SchemaOrganization;
	imageFallback?: SchemaImage;
	imageFieldMapping?: string[];
	autoMap?: {
		title?: boolean;
		description?: boolean;
		image?: boolean;
		dates?: boolean;
		authors?: boolean;
	};
	webSite?: {
		name?: string;
		publisher?: SchemaOrganization;
		searchAction?: SchemaSearchAction;
	};
	webPage?: {
		inLanguage?: string;
		primaryImageOfPage?: SchemaImage;
	};
	article?: {
		publisher?: SchemaOrganization;
		section?: string;
	};
	product?: {
		brand?: SchemaOrganization;
		priceCurrency?: string;
		availability?: string;
	};
	event?: {
		eventAttendanceMode?: string;
		organizer?: SchemaOrganization | SchemaPerson;
	};
	localBusiness?: {
		priceRange?: string;
		address?: SchemaAddress;
		geo?: SchemaGeo;
		aggregateRating?: SchemaAggregateRating;
	};
	rendering?: {
		multiLocaleStrategy?: string;
	};
};
/**
 * Composes the complete schema markup for a page
 * Returns an array of schema objects to be rendered as JSON-LD
 *
 * Entities with @id (Person, Organization) are output as full schemas first,
 * then referenced by @id in other schemas for cleaner markup.
 */
interface ComposeSchemaProps {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	type?: string;
	extra?: Record<string, unknown>;
	isHomepage?: boolean;
}
declare function composeSchema({
	seo,
	schemaDefaults,
	type,
	extra,
	isHomepage,
}: ComposeSchemaProps): Thing[];

declare function buildWebPage({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown>;

declare function buildArticle({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown>;

declare function buildProduct({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown>;

declare function buildEvent({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown>;

declare function buildFAQPage({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown>;

declare function buildWebSite({
	name,
	url,
	publisher,
	searchAction,
	inLanguage,
}: {
	name?: string;
	url?: string;
	publisher?: SchemaOrganization;
	searchAction?: SchemaSearchAction;
	inLanguage?: string;
}): Record<string, unknown>;

declare function buildOrganization(
	organization: SchemaOrganization,
	schemaDefaults?: SchemaDefaults,
	baseUrl?: string,
	asReference?: boolean,
): Record<string, unknown>;

declare function buildAboutPage({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown>;

declare function buildContactPage({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown>;

/**
 * Normalize a name to create a valid @id
 */
declare function normalizeId(name: string): string;
/**
 * Helper to build Person schema or return reference if @id exists
 */
declare function buildPersonSchema(
	person: SchemaPerson | undefined,
	asReference?: boolean,
	baseUrl?: string,
): Record<string, unknown> | undefined;
/**
 * Helper to build Organization schema or return reference if @id exists
 */
declare function buildOrgSchema(
	org: SchemaOrganization | undefined,
	asReference?: boolean,
	baseUrl?: string,
): Record<string, unknown> | undefined;
/**
 * Helper to build Person or Organization schema
 * Detects type based on jobTitle presence (Person) or defaults to Organization
 */
declare function buildPersonOrOrg(
	entity: SchemaPerson | SchemaOrganization,
	asReference?: boolean,
	baseUrl?: string,
): Record<string, unknown> | undefined;
/**
 * Helper to format date for schema.org
 */
declare function formatSchemaDate(
	date?: string | Date | undefined,
): string | Date | undefined;

declare const createMetaTitle: (
	pageTitle?: string,
	siteTitle?: string,
	template?: string,
) => string;

declare function createSchemaImageObject(
	image?: SanityImageAssetDocument,
	fallback?: SanityImageAssetDocument,
): ImageObject | undefined;

/**
 * Build a Sanity image URL with optional transformations
 */
declare function urlFor(imageRef: string): {
	size: (w: number, h: number) => /*elided*/ any;
	format: (fm: string) => /*elided*/ any;
	quality: (q: number) => /*elided*/ any;
	url: () => string;
};

type BuildSeoPayloadParams = {
	globalSeoDefaults?: SeoDefaults;
	schemaDefaults?: SchemaDefaults;
	pageMetadata?: PageMetadata;
	pageSchemaType?: string;
	seoFieldName?: string;
	extraSchemaData?: Record<string, unknown>;
	isHomepage?: boolean;
	projectId: string;
	dataset: string;
};
type BuildSeoPayloadResult = {
	meta: MergedMetadata;
	schemas: Thing[] | undefined;
};
/**
 * Builds the complete SEO payload for a page
 * Merges global defaults with page-specific metadata
 */
declare function buildSeoPayload({
	pageMetadata,
	globalSeoDefaults,
	schemaDefaults,
	pageSchemaType,
	seoFieldName,
	isHomepage,
	extraSchemaData,
	projectId,
	dataset,
}: BuildSeoPayloadParams): BuildSeoPayloadResult;

export {
	type BuildSeoPayloadParams,
	type BuildSeoPayloadResult,
	type Favicon,
	type MergedMetadata,
	type PageMetadata,
	type SchemaAddress,
	type SchemaAggregateRating,
	type SchemaContactPoint,
	type SchemaDefaults,
	type SchemaFAQItem,
	type SchemaGeo,
	type SchemaImage,
	type SchemaLocation,
	type SchemaOffer,
	type SchemaOrganization,
	type SchemaPerson,
	type SchemaSearchAction,
	type SeoDefaults,
	buildAboutPage,
	buildArticle,
	buildContactPage,
	buildEvent,
	buildFAQPage,
	buildOrgSchema,
	buildOrganization,
	buildPersonOrOrg,
	buildPersonSchema,
	buildProduct,
	buildSeoPayload,
	buildWebPage,
	buildWebSite,
	composeSchema,
	createFavicons,
	createMetaTitle,
	createSchemaImageObject,
	formatSchemaDate,
	mergeSeoData,
	normalizeId,
	urlFor,
};
