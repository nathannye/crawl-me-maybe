declare const _default: (({
    type: "document";
    name: "schemaMarkupDefaults";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        baseUrl: string;
        locale: string;
    }, Record<"baseUrl" | "locale", any>> | undefined;
}) | ({
    type: "document";
    name: "seoDefaults";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>> | undefined;
}) | ({
    type: "document";
    name: "socialNetworks";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
}))[];
export default _default;
