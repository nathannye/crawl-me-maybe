/**
 * jsonldFAQItem
 * Represents a single Question/Answer pair for the FAQPage JSON-LD type.
 * Used inside an array field on FAQPage entities.
 *
 * Matches Google’s recommended structure:
 * {
 *   "@type": "Question",
 *   "name": "Question text",
 *   "acceptedAnswer": {
 *     "@type": "Answer",
 *     "text": "Answer text"
 *   }
 * }
 */
export declare const schemaMarkupFAQItem: {
    type: "object";
    name: "schemaMarkupFAQItem";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>> | undefined;
};
