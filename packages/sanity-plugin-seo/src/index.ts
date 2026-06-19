import { definePlugin } from "sanity";
import SeoLayoutWrapper from "./components/core/SeoLayoutWrapper";
import entities from "./schemas/entities";
import fieldGroups from "./schemas/fields";
import global from "./schemas/global";
import singleton from "./schemas/singleton";

export default definePlugin({
	name: "crawl-me-maybe",

	schema: {
		types: [...fieldGroups, ...global, ...entities, ...singleton],
	},
	studio: {
		components: {
			layout: SeoLayoutWrapper,
		},
	},
});
