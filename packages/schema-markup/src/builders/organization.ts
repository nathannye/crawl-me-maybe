import type { SchemaOrganization } from "../types";
import { asIdReference, createSchemaId } from "./fragments";
import { buildOrganizationCore } from "./utils";

export function buildOrganization(
	organization: SchemaOrganization,
	baseUrl?: string,
	asReference = false,
): Record<string, unknown> {
	const base = baseUrl || organization.url || "";
	const id = createSchemaId({
		kind: "organization",
		name: organization.name,
		baseUrl: base,
		explicitId: organization["@id"],
	});

	if (asReference) {
		return asIdReference(id);
	}

	return {
		"@context": "https://schema.org",
		...buildOrganizationCore(organization, baseUrl),
	};
}
