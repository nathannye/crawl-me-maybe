import { type MergedMetadata, type PageMetadata, type SeoDefaults } from "@crawl-me-maybe/web";
import type { Thing } from "schema-dts";
import { type SchemaDefaults } from "./compose";
export type BuildSeoPayloadParams = {
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
export type BuildSeoPayloadResult = {
    meta: MergedMetadata;
    schemas: Thing[] | undefined;
};
/**
 * Builds the complete SEO payload for a page
 * Merges global defaults with page-specific metadata
 */
export declare function buildSeoPayload({ pageMetadata, globalSeoDefaults, schemaDefaults, pageSchemaType, seoFieldName, isHomepage, extraSchemaData, projectId, dataset, }: BuildSeoPayloadParams): BuildSeoPayloadResult;
