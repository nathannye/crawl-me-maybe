import type { Thing } from "schema-dts";
type SchemaSet = {
    schemaType: string;
    schemaData: Thing | undefined;
};
export declare const buildSchemaMarkup: (schemaSets: SchemaSet[]) => Thing[];
export {};
