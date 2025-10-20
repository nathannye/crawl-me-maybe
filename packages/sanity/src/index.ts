import { definePlugin } from "sanity";
import entities from "./schemas/entities";
import global from "./schemas/global";
import fieldGroups from "./schemas/fields";

import singleton from "./schemas/singleton";
import SeoLayoutWrapper from "./components/core/SeoLayoutWrapper";

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
