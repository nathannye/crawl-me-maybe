/**
 * schemaMarkupPerson
 * Used wherever you need to reference a person (e.g., author, creator, performer, reviewer).
 * Lets editors either reference an existing Person document or enter inline details.
 */
export declare const schemaMarkupPerson: {
    type: "document";
    name: "schemaMarkupPerson";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        refName: string;
        inlineName: string;
        refImage: string;
        inlineImage: string;
    }, Record<"refName" | "inlineName" | "refImage" | "inlineImage", any>> | undefined;
};
