// schema/builders/article.ts

import type { MergedMetadata } from "@crawl-me-maybe/meta";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type { SchemaImage, SchemaOrganization, SchemaPerson } from "../types";
import { createSchemaImageObject } from "../utils/image";
import { buildOrgSchema, buildPersonOrOrg, formatSchemaDate } from "./utils";

export function buildArticle({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const defaults = schemaDefaults?.article || {};

	const headline = coalesce(extra?.headline, extra?.title, seo.title);
	const description = coalesce(extra?.description, seo.description);
	const image = createSchemaImageObject(
		coalesce(extra?.image, seo.metaImage) as SchemaImage,
		schemaDefaults?.imageFallback,
	);

	const authors = (extra?.author || []) as Array<
		SchemaPerson | SchemaOrganization
	>;
	const authorSchema =
		authors.length > 0
			? authors
					.map((author) => buildPersonOrOrg(author, true, seo.canonicalUrl))
					.filter(Boolean)
			: undefined;

	const publisher = coalesce(
		extra?.publisher,
		defaults.publisher,
		schemaDefaults?.publisher,
		schemaDefaults?.organization,
	) as SchemaOrganization | undefined;

	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline,
		description,
		image,
		datePublished: formatSchemaDate(
			coalesce(extra?.datePublished, extra?._createdAt) as
				| string
				| Date
				| undefined,
		),
		dateModified: formatSchemaDate(
			coalesce(extra?.dateModified, extra?._updatedAt) as
				| string
				| Date
				| undefined,
		),
		author: authorSchema,
		publisher: buildOrgSchema(publisher, true, seo.canonicalUrl),
		mainEntityOfPage: coalesce(seo.canonicalUrl, extra?.mainEntityOfPage) as
			| string
			| undefined,
		articleSection: coalesce(extra?.articleSection, defaults.section),
		url: coalesce(seo.canonicalUrl, extra?.url) as string | undefined,
		isPartOf: seo.canonicalUrl
			? {
					"@type": "WebSite",
					"@id": `${seo.canonicalUrl}#website`,
				}
			: undefined,
	};
}
