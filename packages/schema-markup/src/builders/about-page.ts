// schema/builders/about-page.ts

import type { MergedMetadata } from "@crawl-me-maybe/meta";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type { SchemaImage } from "../types";
import { createSchemaImageObject } from "../utils/image";

export function buildAboutPage({
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
		"@type": "AboutPage",
		name,
		description,
		url: coalesce(seo.canonicalUrl, extra?.url) as string | undefined,
		image,
		inLanguage: coalesce(extra?.inLanguage, defaults.inLanguage),
		datePublished: coalesce(extra?.datePublished, extra?._createdAt),
		dateModified: coalesce(extra?.dateModified, extra?._updatedAt),
		about: extra?.about,
		isPartOf: seo.canonicalUrl
			? {
					"@type": "WebSite",
					"@id": `${seo.canonicalUrl}#website`,
				}
			: undefined,
	};
}
