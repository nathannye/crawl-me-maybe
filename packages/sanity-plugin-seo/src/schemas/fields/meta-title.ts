import { defineField } from "sanity";

const MIN_CHARACTERS = 50;
const MAX_CHARACTERS = 60;

export default defineField({
	name: "metaTitle",
	title: "Meta Title",
	type: "string",
	description: "The title of the page used in meta tags.",
	validation: (Rule) => [
		Rule.custom((value) => {
			if (typeof value === "string" && value.length > 0 && value.length < MIN_CHARACTERS) {
				return `Short titles (under ${MIN_CHARACTERS} characters) could be more descriptive.`;
			}
			return true;
		}).warning(),
		Rule.custom((value) => {
			if (typeof value === "string" && value.length > MAX_CHARACTERS) {
				return `Long titles (over ${MAX_CHARACTERS} characters) will be truncated in search results.`;
			}
			return true;
		}).warning(),
	],
});
