export declare const schemaMarkupAboutPageFields: {
    type: "object";
    name: "schemaMarkupAboutPageFields";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
    }, Record<"title", any>> | undefined;
};
