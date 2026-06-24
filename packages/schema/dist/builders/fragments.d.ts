type IdReference = {
    "@id": string;
};
type SchemaIdOptions = {
    kind: string;
    name: string;
    baseUrl?: string;
    explicitId?: string;
};
export declare function normalizeId(name: string): string;
export declare function createSchemaId({ kind, name, baseUrl, explicitId, }: SchemaIdOptions): string;
export declare function asIdReference(id: string): IdReference;
export {};
