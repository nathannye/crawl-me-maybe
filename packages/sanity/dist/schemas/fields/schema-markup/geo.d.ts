export declare const schemaMarkupGeo: {
    type: "object";
    name: "schemaMarkupGeo";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        lat: string;
        lon: string;
    }, Record<"lat" | "lon", any>> | undefined;
};
