/**
 * jsonldAggregateRating
 * Represents the overall rating for a Product, LocalBusiness, or similar entity.
 *
 * Output example:
 * {
 *   "@type": "AggregateRating",
 *   "ratingValue": 4.7,
 *   "reviewCount": 128
 * }
 */
export declare const schemaMarkupAggregateRating: {
    type: "object";
    name: "schemaMarkupAggregateRating";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        value: string;
        count: string;
    }, Record<"value" | "count", any>> | undefined;
};
