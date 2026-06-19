// schema/builders/faq.ts
import type { MergedMetadata } from "@crawl-me-maybe/meta";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type { SchemaFAQItem } from "../types";

export function buildFAQPage({
	seo,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const name = coalesce(extra?.name, extra?.title, seo.title);
	const description = coalesce(extra?.description, seo.description);

	const mainEntity = extra?.mainEntity
		? (extra.mainEntity as SchemaFAQItem[]).map((item: SchemaFAQItem) => ({
				"@type": "Question",
				name: item.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: item.answer,
				},
			}))
		: [];

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		name,
		description,
		mainEntity,
		url: seo.canonicalUrl,
		isPartOf: seo.canonicalUrl
			? {
					"@type": "WebSite",
					"@id": `${seo.canonicalUrl}#website`,
				}
			: undefined,
	};
}
