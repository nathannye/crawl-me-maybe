import { defineField } from "sanity";

const MIN_CHARACTERS = 120;
const MAX_CHARACTERS = 160;

export default defineField({
	name: "metaDescription",
	title: "Meta Description",
	type: "text",
	rows: 3,
	description:
		"The description of the page used in meta tags. 50-160 characters is recommended to avoid truncation.",
	validation: (Rule) =>
		Rule.custom((value) => {
			if (
				typeof value === "string" &&
				value.length > 0 &&
				value.length < MIN_CHARACTERS
			) {
				return `Short descriptions (under ${MIN_CHARACTERS} characters) could be more descriptive.`;
			}

			if (typeof value === "string" && value.length > MAX_CHARACTERS) {
				return `Long descriptions (over ${MAX_CHARACTERS} characters) will be truncated in search results.`;
			}

			return true;
		}).warning(),
});
