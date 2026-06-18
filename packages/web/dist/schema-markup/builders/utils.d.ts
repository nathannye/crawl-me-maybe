import type { SchemaPerson, SchemaOrganization } from "../types";
/**
 * Normalize a name to create a valid @id
 */
export declare function normalizeId(name: string): string;
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
