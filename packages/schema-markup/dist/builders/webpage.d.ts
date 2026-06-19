import type { MergedMetadata } from "@crawl-me-maybe/meta";
import type { SchemaDefaults } from "../compose";
export declare function buildWebPage({ seo, schemaDefaults, extra, }: {
    seo: MergedMetadata;
    schemaDefaults?: SchemaDefaults;
    extra?: Record<string, unknown>;
}): Record<string, unknown>;
