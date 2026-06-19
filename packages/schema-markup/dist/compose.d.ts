import type { MergedMetadata } from "@crawl-me-maybe/web";
import type { Thing } from "schema-dts";
import type { SchemaAddress, SchemaAggregateRating, SchemaGeo, SchemaImage, SchemaOrganization, SchemaPerson, SchemaSearchAction } from "./types";
export type SchemaDefaults = {
    sameAs?: string[];
    logo?: SchemaImage;
    organization?: SchemaOrganization;
    publisher?: SchemaOrganization;
    imageFallback?: SchemaImage;
    imageFieldMapping?: string[];
    autoMap?: {
        title?: boolean;
        description?: boolean;
        image?: boolean;
        dates?: boolean;
        authors?: boolean;
    };
    webSite?: {
        name?: string;
        publisher?: SchemaOrganization;
        searchAction?: SchemaSearchAction;
    };
    webPage?: {
        inLanguage?: string;
        primaryImageOfPage?: SchemaImage;
    };
    article?: {
        publisher?: SchemaOrganization;
        section?: string;
    };
    product?: {
        brand?: SchemaOrganization;
        priceCurrency?: string;
        availability?: string;
    };
    event?: {
        eventAttendanceMode?: string;
        organizer?: SchemaOrganization | SchemaPerson;
    };
    localBusiness?: {
        priceRange?: string;
        address?: SchemaAddress;
        geo?: SchemaGeo;
        aggregateRating?: SchemaAggregateRating;
    };
    rendering?: {
        multiLocaleStrategy?: string;
    };
};
/**
 * Composes the complete schema markup for a page
 * Returns an array of schema objects to be rendered as JSON-LD
 *
 * Entities with @id (Person, Organization) are output as full schemas first,
 * then referenced by @id in other schemas for cleaner markup.
 */
interface ComposeSchemaProps {
    seo: MergedMetadata;
    schemaDefaults?: SchemaDefaults;
    type?: string;
    extra?: Record<string, unknown>;
    isHomepage?: boolean;
}
export declare function composeSchema({ seo, schemaDefaults, type, extra, isHomepage, }: ComposeSchemaProps): Thing[];
export {};
