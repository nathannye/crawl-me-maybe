import { defineField } from "sanity";
import InputWithGlobalDefault from "../../components/core/InputWithGlobalDefault";
import PageSeoInput from "../../components/core/PageSeoInput/PageSeoInput";
import type { PluginOptions } from "../../types";
import { validateCanonicalPathOrUrl } from "../../utils/canonical";

export default function buildPageMetadata(options?: PluginOptions) {
	const includeSearchIndexing = options?.page?.searchIndexing !== false;
	const includeCanonicalUrl = options?.page?.canonicalUrl !== false;

	return {
		name: "pageMetadata",
		title: "Metadata",
		components: {
			input: PageSeoInput,
		},
		type: "object",
		fields: [
			{
				name: "description",
				title: "Meta Description",
				components: {
					input: InputWithGlobalDefault,
				},
				options: {
					matchingDefaultField: "metaDescription",
				},
				type: "metaDescription",
			},
			...(includeCanonicalUrl
				? [
						defineField({
							name: "canonicalUrl",
							title: "Canonical URL",
							type: "string",
							description:
								"Optional canonical override: a path (e.g. /about) or full URL (https://…). Leave empty to use the auto-generated self-referential URL on the frontend.",
							validation: (Rule) => Rule.custom(validateCanonicalPathOrUrl),
						}),
					]
				: []),
			...(includeSearchIndexing
				? [
						{
							name: "searchIndexing",
							type: "searchIndexing",
						},
					]
				: []),
			{
				name: "metaImage",
				components: {
					input: InputWithGlobalDefault,
				},
				options: {
					matchingDefaultField: "defaultMetaImage",
				},
				description:
					"Displayed when the site link is posted on social media, defaults to a screenshot of the homepage.",
				type: "metaImage",
			},
		],
	};
}
