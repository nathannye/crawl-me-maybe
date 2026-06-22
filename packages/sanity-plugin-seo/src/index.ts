import { definePlugin } from "sanity";
import SeoLayoutWrapper from "./components/core/SeoLayoutWrapper";
import documents from "./schemas/documents";
import fieldGroups from "./schemas/fields";

export default definePlugin({
	name: "crawl-me-maybe",

	schema: {
		types: [...fieldGroups, ...documents],
	},
	studio: {
		components: {
			layout: SeoLayoutWrapper,
		},
	},
});
