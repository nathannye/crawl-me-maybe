import InputWithGlobalDefault from "../../components/core/InputWithGlobalDefault";
import PageSeoInput from "../../components/core/PageSeoInput/PageSeoInput";
import type { PluginOptions } from "../../types";

export default function buildPageMetadata(options?: PluginOptions) {
	const includeSearchIndexing = options?.page?.searchIndexing !== false;

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
