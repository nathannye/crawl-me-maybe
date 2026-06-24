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
		return explicitId.startsWith("http") ? explicitId : `${baseUrl}${explicitId}`;
	}

	return `${baseUrl}#${kind}-${normalizeId(name)}`;
}

export function asIdReference(id: string): IdReference {
	return { "@id": id };
}

export function buildWebsiteReference(
	canonicalUrl?: string,
): ({ "@type": "WebSite"; "@id": string } | undefined) {
	if (!canonicalUrl) return undefined;
	return {
		"@type": "WebSite",
		"@id": `${canonicalUrl}#website`,
	};
}

type ContactPointInput = {
	contactType: string;
	telephone?: string;
	email?: string;
	url?: string;
	areaServed?: string[];
	availableLanguage?: string[];
};

export function mapContactPoints(contactPoints?: ContactPointInput[]) {
	if (!contactPoints?.length) return undefined;

	return contactPoints.map((cp) => ({
		"@type": "ContactPoint",
		contactType: cp.contactType,
		telephone: cp.telephone,
		email: cp.email,
		url: cp.url,
		areaServed: cp.areaServed,
		availableLanguage: cp.availableLanguage,
	}));
}

export function mapEntityReferences<T>(
	entities: T[] | undefined,
	mapToReference: (entity: T, baseUrl?: string) => Record<string, unknown> | undefined,
	baseUrl?: string,
): Record<string, unknown>[] | undefined {
	if (!entities?.length) return undefined;
	return entities.map((entity) => mapToReference(entity, baseUrl)).filter(Boolean) as Record<
		string,
		unknown
	>[];
}
