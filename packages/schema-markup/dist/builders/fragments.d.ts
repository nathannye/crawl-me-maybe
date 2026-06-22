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
export declare function buildWebsiteReference(canonicalUrl?: string): ({
    "@type": "WebSite";
    "@id": string;
} | undefined);
type ContactPointInput = {
    contactType: string;
    telephone?: string;
    email?: string;
    url?: string;
    areaServed?: string[];
    availableLanguage?: string[];
};
export declare function mapContactPoints(contactPoints?: ContactPointInput[]): {
    "@type": string;
    contactType: string;
    telephone: string | undefined;
    email: string | undefined;
    url: string | undefined;
    areaServed: string[] | undefined;
    availableLanguage: string[] | undefined;
}[] | undefined;
export declare function mapEntityReferences<T>(entities: T[] | undefined, mapToReference: (entity: T, baseUrl?: string) => Record<string, unknown> | undefined, baseUrl?: string): Record<string, unknown>[] | undefined;
export {};
