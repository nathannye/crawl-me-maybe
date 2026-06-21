
import type { Thing } from "schema-dts";


type SchemaSet = {
	schemaType: string;
	schemaData: Thing | undefined;
};

const schemaBuilders = {
	WebPage: buildWebPage,
} 

export const buildSchemaMarkup = (schemaSets: SchemaSet[]): Thing[] => {
	return schemaSets.map(({ schemaType, schemaData }) => {
		if (!schemaData) return undefined;



		return {
			"@context": "https://schema.org",
			"@type": schemaType,
			
		} as Thing;
	});
};
