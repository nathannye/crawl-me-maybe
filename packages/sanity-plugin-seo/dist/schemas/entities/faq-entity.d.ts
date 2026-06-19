export declare const schemaMarkupFAQPageFields: {
    type: "object";
    name: "schemaMarkupFAQPageFields";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        count: string;
    }, Record<"count", any>> | undefined;
};
