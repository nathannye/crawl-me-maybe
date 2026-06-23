import { MdSearch, MdShare } from "react-icons/md";
import { defineField, defineType, type StringRule } from "sanity";
import PageTitleTemplateInput from "../../components/core/PageTitleTemplateInput";
import type { PluginOptions } from "../../types";

export default function buildGlobalSeoSettings(options?: PluginOptions) {
	const includeFavicon = options?.global?.favicon !== false;
	const includeRobots = options?.global?.robots !== false;

	return defineType({
		name: "globalSeoSettings",
		title: "Global SEO Settings",
		type: "document",
		groups: [
			{
				name: "metadata",
				title: "Metadata",
				default: true,
				icon: MdSearch,
			},
			{
				name: "social",
				title: "Social",
				icon: MdShare,
			},
		],
		fields: [
			defineField({
				name: "siteTitle",
				title: "Site Title",
				type: "string",
				description:
					"The title of the site injected into the Page Title Template field below.",
				validation: (Rule) => Rule.required(),
			}),
			defineField({
				name: "pageTitleTemplate",
				title: "Page Title Template",
				type: "string",
				components: {
					input: PageTitleTemplateInput,
				},
				description:
					"Template for page titles. Use {siteTitle} and {pageTitle} for the page title. Example: {pageTitle} - {siteTitle}",
				validation: (Rule) => Rule.required(),
				initialValue: "{pageTitle} - {siteTitle}",
			}),
			defineField({
				name: "siteUrl",
				title: "Site URL",
				type: "url",
				description:
					"Root URL of the website (e.g. https://your-domain.com). Used for canonical and Open Graph tags.",
				validation: (Rule) =>
					Rule.custom((value) => {
						if (!value) return "Site URL is required";
						if (typeof value !== "string") return "Site URL must be a string";
						if (!value.startsWith("https://"))
							return "Site URL must start with https://";
						return true;
					}),
			}),
			defineField({
				name: "metaDescription",
				type: "metaDescription",
				description: "The default meta description for all pages.",
			}),
			defineField({
				name: "defaultMetaImage",
				type: "metaImage",
				description:
					"The default meta image for all pages if not overridden on the page.",
			}),
			...(includeFavicon
				? [
						defineField({
							name: "favicon",
							type: "favicon",
						}),
					]
				: []),
			defineField({
				name: "twitterHandle",
				title: "Twitter Handle",
				type: "string",
				description: "Example: @yourbrand",
				validation: (rule: StringRule) =>
					rule.custom((val: string | undefined) => {
						if (!val) return true;
						if (typeof val !== "string") return "Twitter handle must be a string";
						if (!val.startsWith("@")) return "Twitter handle must start with @";
						return true;
					}),
				group: "social",
			}),
			defineField({
				name: "logo",
				title: "Global Logo",
				type: "image",
				description:
					"Logo used behind the scenes to populate Organization and WebSite schema markup.",
			}),
			...(includeRobots
				? [
						defineField({
							name: "advanced",
							type: "object",
							fields: [
								{
									name: "robots",
									type: "robots",
								},
							],
						}),
					]
				: []),
		],
		preview: {
			prepare() {
				return { title: "Global SEO Settings" };
			},
		},
	});
}
