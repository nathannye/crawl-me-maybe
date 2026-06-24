import type { BreadcrumbList, OpeningHoursSpecification, PostalAddress, Thing, WithContext } from "schema-dts";
import { type ImageInput } from "./utils/image";
type SchemaNode = Record<string, unknown>;
export type BuildSchemaMarkupInput = {
    identity: Identity;
    siteUrl: string;
    siteName: string;
    siteDescription?: string;
    pageUrl: string;
    pageTitle: string;
    pageDescription?: string;
    breadcrumb?: WithContext<BreadcrumbList>;
    mainEntity?: Thing | SchemaNode;
};
export type PersonIdentity = {
    type: "person";
    name: string;
    description?: string;
    image?: ImageInput;
    sameAs?: string[];
};
export type OrganizationIdentity = {
    type: "organization";
    name: string;
    description?: string;
    logo?: ImageInput;
    sameAs?: string[];
};
export type LocalBusinessIdentity = {
    type: "localBusiness";
    name: string;
    description?: string;
    logo?: ImageInput;
    phone?: string;
    email?: string;
    address?: PostalAddress;
    openingHours?: OpeningHoursSpecification[];
    sameAs?: string[];
};
export type Identity = PersonIdentity | OrganizationIdentity | LocalBusinessIdentity;
export declare const buildSchemaMarkup: (input: BuildSchemaMarkupInput) => string[];
export {};
