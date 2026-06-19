export declare const schemaMarkupEventFields: {
    type: "object";
    name: "schemaMarkupEventFields";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>> | undefined;
};
