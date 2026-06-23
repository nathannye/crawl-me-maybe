import { defineField } from "sanity";

export default defineField({
	name: "sitemapExclusion",
	title: "Exclude from Sitemap",
	type: "boolean",
	description:
		"If checked, the page will be excluded from the sitemap. This is useful for pages that are not meant to be indexed by search engines.",
});
