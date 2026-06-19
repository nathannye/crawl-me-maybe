import { defineField } from "sanity";
import { IndexingControls } from "../../../components/core";

export default defineField({
	name: "searchIndexing",
	title: "Search Indexing",
	type: "object",
	components: {
		input: IndexingControls,
	},
	fields: [
		{
			name: "noFollow",
			title: "No Follow",
			type: "boolean",
		},
		{
			name: "noIndex",
			title: "No Index",
			type: "boolean",
		},
	],
});
