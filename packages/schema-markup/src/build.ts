import type { Thing } from "schema-dts";

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
