import type { BreadcrumbList, Thing, WithContext } from "schema-dts";
import type { SchemaOrganization, SchemaPerson } from "./types";
type SchemaNode = Record<string, unknown>;
export type BuildSchemaMarkupInput = {
    identity: SchemaOrganization | SchemaPerson;
    siteUrl: string;
    siteName: string;
    siteDescription?: string;
    pageUrl: string;
    pageTitle: string;
    pageDescription?: string;
    breadcrumb?: WithContext<BreadcrumbList>;
    mainEntity?: Thing | SchemaNode;
};
export declare const buildSchemaMarkup: (input: BuildSchemaMarkupInput) => string[];
export {};
