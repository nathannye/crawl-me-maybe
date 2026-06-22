import type { SchemaOrganization, SchemaPerson } from "../types";
import { normalizeId } from "./fragments";
/**
 * Normalize a name to create a valid @id
 */
export { normalizeId };
export declare function buildOrganizationCore(org: SchemaOrganization, baseUrl?: string): Record<string, unknown>;
/**
 * Helper to build Person schema or return reference if @id exists
 */
export declare function buildPersonSchema(person: SchemaPerson | undefined, asReference?: boolean, baseUrl?: string): Record<string, unknown> | undefined;
/**
 * Helper to build Organization schema or return reference if @id exists
 */
export declare function buildOrgSchema(org: SchemaOrganization | undefined, asReference?: boolean, baseUrl?: string): Record<string, unknown> | undefined;
/**
 * Helper to build Person or Organization schema
 * Detects type based on jobTitle presence (Person) or defaults to Organization
 */
export declare function buildPersonOrOrg(entity: SchemaPerson | SchemaOrganization, asReference?: boolean, baseUrl?: string): Record<string, unknown> | undefined;
/**
 * Helper to format date for schema.org
 */
export declare function formatSchemaDate(date?: string | Date | undefined): string | Date | undefined;
