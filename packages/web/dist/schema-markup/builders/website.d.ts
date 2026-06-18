import type { SchemaOrganization, SchemaSearchAction } from "../types";
export declare function buildWebSite({ name, url, publisher, searchAction, inLanguage, }: {
    name?: string;
    url?: string;
    publisher?: SchemaOrganization;
    searchAction?: SchemaSearchAction;
    inLanguage?: string;
}): Record<string, unknown>;
