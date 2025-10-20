import type { MergedMetadata } from "~/utils/merge";

// field name you will use if auto is on
const fieldMappings = {
	title: "title",
	description: "description",
	image: "metaImage",
	datePublished: "_createdAt",
	dateModified: "_updatedAt",
};

type AutoMapSettings = {
	title?: boolean;
	description?: boolean;
	image?: boolean;
	datePublished?: boolean;
	dateModified?: boolean;
};

type AutoMapProperty = keyof AutoMapSettings;

type AutoMapValue = {
	[K in AutoMapProperty]: string | undefined;
};

const shouldAutomap = (
	automapSettings: AutoMapSettings,
	property: AutoMapProperty,
) => {
	return automapSettings[property] !== false;
};

export const automap = (
	automapSettings: AutoMapSettings,
	baseSeoObject: MergedMetadata,
	extra?: Record<string, unknown>,
): AutoMapValue => {
	const automappedValues = Object.keys(fieldMappings).reduce(
		(acc, key) => {
			if (shouldAutomap(automapSettings, key as AutoMapProperty)) {
				acc[key] =
					baseSeoObject[fieldMappings[key]] ||
					extra[fieldMappings[key] as keyof typeof extra];
			}
			return acc;
		},
		{
			title: undefined,
			description: undefined,
			image: undefined,
			datePublished: undefined,
			dateModified: undefined,
		},
	);

	return automappedValues;
};
