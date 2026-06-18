/**
 * JSON-LD CreativeWork Fields
 * Suitable for agency / case-study style content.
 * Uses existing shared types for Organization & Person references.
 */
export declare const jsonldCreativeWorkFields: {
    type: "object";
    name: "jsonldCreativeWorkFields";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
        media: string;
    }, Record<"title" | "media" | "subtitle", any>> | undefined;
};
