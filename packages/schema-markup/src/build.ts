import type { Thing } from "schema-dts";

export type BuildSeoPayloadParams = {
	schemaSets: SchemaSet[];
};

export type BuildSeoPayloadResult = Thing[];

type SchemaSet = {
	schemaType: string;
	schemaData: Thing | undefined;
};

export const buildSchemaMarkup = (schemaSets: SchemaSet[]): Thing[] => {
	return schemaSets.flatMap(({ schemaType, schemaData }) => {
		if (!schemaData) return [];

		return [
			{
				"@context": "https://schema.org",
				"@type": schemaType,
			} as Thing,
		];
	});
};

export const buildSeoPayload = ({
	schemaSets,
}: BuildSeoPayloadParams): BuildSeoPayloadResult => {
	return buildSchemaMarkup(schemaSets);
};
