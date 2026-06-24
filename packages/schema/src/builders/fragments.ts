type IdReference = { "@id": string };

type SchemaIdOptions = {
	kind: string;
	name: string;
	baseUrl?: string;
	explicitId?: string;
};

export function normalizeId(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function createSchemaId({
	kind,
	name,
	baseUrl = "",
	explicitId,
}: SchemaIdOptions): string {
	if (explicitId) {
		return explicitId.startsWith("http")
			? explicitId
			: `${baseUrl}${explicitId}`;
	}

	return `${baseUrl}#${kind}-${normalizeId(name)}`;
}

export function asIdReference(id: string): IdReference {
	return { "@id": id };
}
