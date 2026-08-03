import { defineField } from "sanity";

const MIN_CHARACTERS = 120;
const MAX_CHARACTERS = 160;

export default function buildMetaDescription(type = "text") {
	return defineField({
		name: "metaDescription",
		title: "Meta Description",
		type,
		...(type === "text" ? { rows: 3 } : {}),
		description: `The description of the page used in meta tags. ${MIN_CHARACTERS}-${MAX_CHARACTERS} characters is recommended to avoid truncation.`,
		validation: (Rule) => [
			Rule.custom((value) => {
				if (typeof value !== "string") return true;
				const currentLength = value.length;

				if (currentLength > 0 && currentLength < MIN_CHARACTERS) {
					return `Short descriptions (under ${MIN_CHARACTERS} characters) could be more descriptive. Current length: ${currentLength}`;
				}
				return true;
			}).warning(),
			Rule.custom((value) => {
				if (typeof value !== "string") return true;
				const currentLength = value.length;

				if (currentLength > MAX_CHARACTERS) {
					return `Long descriptions (over ${MAX_CHARACTERS} characters) will be truncated in search results. Current length: ${currentLength}`;
				}
				return true;
			}).warning(),
		],
	});
}
