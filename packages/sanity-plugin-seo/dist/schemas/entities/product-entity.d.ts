export declare const schemaMarkupProductFields: {
    type: "object";
    name: "schemaMarkupProductFields";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
    }, Record<"title", any>> | undefined;
};
