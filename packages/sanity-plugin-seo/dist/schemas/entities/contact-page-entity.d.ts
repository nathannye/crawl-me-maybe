export declare const schemaMarkupContactPageFields: {
    type: "object";
    name: "schemaMarkupContactPageFields";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
    }, Record<"title", any>> | undefined;
};
