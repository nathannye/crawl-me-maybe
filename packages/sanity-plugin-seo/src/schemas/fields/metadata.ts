import InputWithGlobalDefault from "../../components/core/InputWithGlobalDefault";
import PageSeoInput from "../../components/core/PageSeoInput/PageSeoInput";

export default {
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
		{
			name: "searchIndexing",
			type: "searchIndexing",
		},
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
