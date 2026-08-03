import { definePlugin } from "sanity";
import createSeoLayoutWrapper from "./components/core/SeoLayoutWrapper";
import buildDocuments from "./schemas/documents";
import buildFieldTypes from "./schemas/fields";
import type { PluginOptions } from "./types";

export type { PluginOptions, ResolveValue } from "./types";

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
			layout: createSeoLayoutWrapper(options?.resolveValue),
		},
	},
}));
