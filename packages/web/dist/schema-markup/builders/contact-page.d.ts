import type { MergedMetadata } from "../../utils/merge";
import type { SchemaDefaults } from "../compose";
export declare function buildContactPage({ seo, schemaDefaults, extra, }: {
    seo: MergedMetadata;
    schemaDefaults?: SchemaDefaults;
    extra?: Record<string, unknown>;
}): Record<string, unknown>;
