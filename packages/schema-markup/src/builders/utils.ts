import type { SchemaOrganization, SchemaPerson } from "../types";
import {
	asIdReference,
	createSchemaId,
	mapContactPoints,
	normalizeId,
} from "./fragments";

/**
 * Normalize a name to create a valid @id
 */
export { normalizeId };

export function buildOrganizationCore(
	org: SchemaOrganization,
	baseUrl?: string,
): Record<string, unknown> {
	const base = baseUrl || org.url || "";
	const id = createSchemaId({
		kind: "organization",
		name: org.name,
		baseUrl: base,
		explicitId: org["@id"],
	});

	const departments = org.department
		? org.department.map((dept) => buildOrgSchema(dept, true, baseUrl)).filter(Boolean)
		: undefined;

	const contactPoint = mapContactPoints(org.contactPoint);

	return {
		"@type": "Organization",
		"@id": id,
		name: org.name,
		url: org.url,
		logo: org.logo,
		sameAs: org.sameAs,
		department: departments,
		contactPoint,
	};
}

/**
 * Helper to build Person schema or return reference if @id exists
 */
export function buildPersonSchema(
	person: SchemaPerson | undefined,
	asReference = false,
	baseUrl?: string,
): Record<string, unknown> | undefined {
	if (!person) return undefined;

	const base = baseUrl || "";
	const id = createSchemaId({
		kind: "person",
		name: person.name,
		baseUrl: base,
		explicitId: person["@id"],
	});

	if (asReference) {
		return asIdReference(id);
	}

	return {
		"@type": "Person",
		"@id": id,
		name: person.name,
		url: person.url,
		sameAs: person.sameAs,
		jobTitle: person.jobTitle,
		image: person.image,
	};
}

/**
 * Helper to build Organization schema or return reference if @id exists
 */
export function buildOrgSchema(
	org: SchemaOrganization | undefined,
	asReference = false,
	baseUrl?: string,
): Record<string, unknown> | undefined {
	if (!org) return undefined;

	const base = baseUrl || org.url || "";
	const id = createSchemaId({
		kind: "organization",
		name: org.name,
		baseUrl: base,
		explicitId: org["@id"],
	});

	if (asReference) {
		return asIdReference(id);
	}

	return buildOrganizationCore(org, baseUrl);
}

/**
 * Helper to build Person or Organization schema
 * Detects type based on jobTitle presence (Person) or defaults to Organization
 */
export function buildPersonOrOrg(
	entity: SchemaPerson | SchemaOrganization,
	asReference = false,
	baseUrl?: string,
): Record<string, unknown> | undefined {
	if (!entity) return undefined;

	// Detect if it's a Person (has jobTitle) or Organization
	if ("jobTitle" in entity || !("logo" in entity)) {
		return buildPersonSchema(entity as SchemaPerson, asReference, baseUrl);
	}

	return buildOrgSchema(entity as SchemaOrganization, asReference, baseUrl);
}

/**
 * Helper to format date for schema.org
 */
export function formatSchemaDate(
	date?: string | Date | undefined,
): string | Date | undefined {
	if (!date) return undefined;

	if (typeof date === "string") {
		return date;
	}

	return date.toISOString();
}
