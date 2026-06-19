// schema/builders/contact-page.ts

import type { MergedMetadata } from "@crawl-me-maybe/meta";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type { SchemaImage } from "../types";
import { createSchemaImageObject } from "../utils/image";

export function buildContactPage({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const defaults = schemaDefaults?.webPage || {};

	const name = coalesce(extra?.name, extra?.title, seo.title);
	const description = coalesce(extra?.description, seo.description);
	const image = createSchemaImageObject(
		coalesce(extra?.image, seo.metaImage) as SchemaImage,
		schemaDefaults?.imageFallback,
	);

	return {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name,
		description,
		url: coalesce(seo.canonicalUrl, extra?.url),
		image,
		inLanguage:
			(extra?.inLanguage as string | undefined) || defaults.inLanguage,
		datePublished: (extra?.datePublished || extra?._createdAt) as
			| string
			| undefined,
		dateModified: (extra?.dateModified || extra?._updatedAt) as
			| string
			| undefined,
		isPartOf: seo.canonicalUrl
			? {
					"@type": "WebSite",
					"@id": `${seo.canonicalUrl}#website`,
				}
			: undefined,
	};
}
