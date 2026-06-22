import type { Thing } from "schema-dts";
type SchemaNode = Record<string, unknown>;
export type SchemaSet = {
    schemaType?: string;
    schemaData: Thing | SchemaNode | undefined;
};
export type BuildSchemaMarkupInput = SchemaSet[] | {
    nodes?: Array<Thing | SchemaNode | undefined>;
    schemaSets?: SchemaSet[];
};
export declare const buildSchemaMarkup: (input: BuildSchemaMarkupInput) => string[];
export {};
