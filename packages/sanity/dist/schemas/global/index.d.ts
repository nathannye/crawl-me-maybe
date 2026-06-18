declare const _default: (({
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
}) | ({
    type: "document";
    name: "schemaMarkupPerson";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        refName: string;
        inlineName: string;
        refImage: string;
        inlineImage: string;
    }, Record<"refName" | "inlineName" | "refImage" | "inlineImage", any>> | undefined;
}) | ({
    type: "object";
    name: "schemaMarkupFAQItem";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>> | undefined;
}))[];
export default _default;
