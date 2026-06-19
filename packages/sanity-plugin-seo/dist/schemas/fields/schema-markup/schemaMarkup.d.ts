export declare const schemaMarkup: {
    type: "object";
    name: "schemaMarkup";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>> | undefined;
};
