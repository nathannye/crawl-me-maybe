export declare const schemaMarkupWebPageFields: {
    type: "object";
    name: "schemaMarkupWebPageFields";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>> | undefined;
};
