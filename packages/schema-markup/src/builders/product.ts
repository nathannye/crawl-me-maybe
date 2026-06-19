// schema/builders/product.ts

import type { MergedMetadata } from "@crawl-me-maybe/meta";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type { SchemaImage } from "../types";
import { createSchemaImageObject } from "../utils/image";
import { buildOrgSchema } from "./utils";

export function buildProduct({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const defaults = schemaDefaults?.product || {};

	const name = coalesce(extra?.name, extra?.title, seo.title);
	const description = coalesce(extra?.description, seo.description);
	const image = createSchemaImageObject(
		coalesce(extra?.image, seo.metaImage) as SchemaImage,
		schemaDefaults?.imageFallback,
	);

	const brand = extra?.brand || defaults.brand;

	const offers =
		extra?.offers ||
		(extra?.price
			? {
					"@type": "Offer",
					price: extra.price,
					priceCurrency: extra.priceCurrency || defaults.priceCurrency || "USD",
					availability: `https://schema.org/${extra.availability || defaults.availability || "InStock"}`,
					url: seo.canonicalUrl,
				}
			: undefined);

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name,
		description,
		image,
		brand: brand
			? buildOrgSchema(brand as any, true, seo.canonicalUrl)
			: undefined,
		sku: extra?.sku as string | undefined,
		mpn: extra?.mpn as string | undefined,
		gtin: extra?.gtin as string | undefined,
		offers,
		aggregateRating: extra?.aggregateRating,
		review: extra?.review,
		url: seo.canonicalUrl,
	};
}
