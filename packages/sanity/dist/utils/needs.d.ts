import type { SchemaMarkupType } from "../types";
/**
 * Common keys you might conditionally show at the top-level of your `jsonld` field.
 * (These are the generic, cross-entity fields you added like name, description, inLanguage, image, etc.)
 */
type CommonKey = "name" | "description" | "inLanguage" | "image";
/**
 * Returns true if a common field should be visible for the selected JSON-LD type.
 * Use it in Sanity field `hidden` callbacks: hidden: ({parent}) => !needs(parent, 'image')
 */
export declare function needs(parent: {
    type?: SchemaMarkupType;
} | undefined, key: CommonKey): boolean;
export declare function isRequired(parent: {
    type?: SchemaMarkupType;
} | undefined, key: CommonKey): boolean;
export {};
