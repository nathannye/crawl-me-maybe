export declare const schemaMarkupOrganization: {
    type: "document";
    name: "schemaMarkupOrganization";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        refName: string;
        refUrl: string;
        inlineName: string;
        inlineUrl: string;
        logoUrl: string;
    }, Record<"refName" | "refUrl" | "inlineName" | "inlineUrl" | "logoUrl", any>> | undefined;
};
