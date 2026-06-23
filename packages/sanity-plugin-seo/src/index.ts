import { definePlugin } from "sanity";
import SeoLayoutWrapper from "./components/core/SeoLayoutWrapper";
import buildDocuments from "./schemas/documents";
import buildFieldTypes from "./schemas/fields";
import type { PluginOptions } from "./types";

export type { PluginOptions };

export default definePlugin<PluginOptions | undefined>((options) => ({
	name: "crawl-me-maybe",

	schema: {
		types: [
			...buildFieldTypes(options ?? undefined),
			...buildDocuments(options ?? undefined),
		],
	},
	studio: {
		components: {
			layout: SeoLayoutWrapper,
		},
	},
}));
