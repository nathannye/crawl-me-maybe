/**
 * schemaMarkupAddress
 * Reusable inline PostalAddress object for JSON-LD entities.
 * Usually embedded inside Organization, Event, or LocalBusiness.
 *
 * Kept inline (not referenced) since most sites only have 1–few addresses.
 */
export declare const schemaMarkupAddress: {
    type: "object";
    name: "schemaMarkupAddress";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        street: string;
        city: string;
        region: string;
        country: string;
    }, Record<"street" | "city" | "region" | "country", any>> | undefined;
};
