import {
	mergeSeoData,
	type PageMetadata,
	type SeoDefaults,
	type MergedMetadata,
} from "./utils/merge";
import { composeSchema, type SchemaDefaults } from "./schema-markup";
import type { Thing } from "schema-dts";
import { setConfig } from "./config";

export type BuildSeoPayloadParams = {
	globalDefaults?: SeoDefaults;
	schemaDefaults?: SchemaDefaults;
	pageSeo?: PageMetadata;
	pageSchemaType?: string;
	seoFieldName?: string;
	extraSchemaData?: Record<string, unknown>;
	isHomepage?: boolean;
	projectId: string;
	dataset: string;
};

export type BuildSeoPayloadResult = {
	meta: MergedMetadata;
	schemas: Thing[] | undefined;
};

/**
 * Builds the complete SEO payload for a page
 * Merges global defaults with page-specific metadata
 */
export function buildSeoPayload({
	pageSeo,
	globalDefaults,
	schemaDefaults,
	pageSchemaType = "WebPage",
	seoFieldName = "metadata",
	isHomepage = false,
	extraSchemaData,
	projectId,
	dataset,
}: BuildSeoPayloadParams): BuildSeoPayloadResult {
	if (!projectId || !dataset) {
		console.warn(
			"No projectId or dataset provided to buildSeoPayload, favicons and image Objects will not be created",
		);
	}
	
	setConfig({ projectId, dataset });
	// Merge SEO data: page metadata overrides global defaults
	const merged = mergeSeoData(pageSeo, globalDefaults, seoFieldName);

	// Compose schema markup if defaults are provided
	const schemas = schemaDefaults
		? composeSchema({
				seo: merged,
				schemaDefaults,
				type: pageSchemaType || "WebPage",
				extra: extraSchemaData,
				isHomepage,
			})
		: undefined;

	return {
		meta: merged,
		schemas,
	};
}
