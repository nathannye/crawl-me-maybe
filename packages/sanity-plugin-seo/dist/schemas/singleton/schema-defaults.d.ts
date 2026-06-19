export declare const schemaMarkupDefaults: {
    type: "document";
    name: "schemaMarkupDefaults";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        baseUrl: string;
        locale: string;
    }, Record<"baseUrl" | "locale", any>> | undefined;
};
