import type { MergedMetadata } from "@crawl-me-maybe/web";
import type { SchemaDefaults } from "../compose";
export declare function buildProduct({ seo, schemaDefaults, extra, }: {
    seo: MergedMetadata;
    schemaDefaults?: SchemaDefaults;
    extra?: Record<string, unknown>;
}): Record<string, unknown>;
