import { Box, Flex } from "@sanity/ui";
import { buildSrc } from "@sanity-image/url-builder";
import { useMemo, useState } from "react";
import { MdEdit, MdPreview } from "react-icons/md";
import {
	type ObjectInputProps,
	useDataset,
	useFormValue,
	useProjectId,
} from "sanity";
import { useSeoDefaults } from "../../../context/SeoDefaultsContext";
import { concatenatePageTitle } from "../../../utils/string";
import ButtonWithIcon from "../../partials/ButtonWithIcon";
import FacebookCard from "../../socials/facebook/FacebookCard";
import GoogleEntry from "../../socials/google/GoogleEntry";
import LinkedInCard from "../../socials/linkedin/LinkedInCard";
import TwitterCard from "../../socials/twitter/TwitterCard";
import { PreviewGroup } from "./PreviewGroup";

const PREVIEW_GROUPS = [
	{
		name: "Facebook",
		component: FacebookCard,
		title: "Facebook",
	},
	{
		name: "Twitter / X",
		component: TwitterCard,
		title: "Twitter",
	},
	{
		name: "LinkedIn",
		component: LinkedInCard,
		title: "LinkedIn",
	},
	{
		name: "Google",
		component: GoogleEntry,
		title: "Google",
	},
];

function asString(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

export default function PageSeoInput(props: ObjectInputProps) {
	const dataset = useDataset();
	const projectId = useProjectId();
	const { seoDefaults, resolveValue } = useSeoDefaults();
	const MODES = [
		{ name: "fields", title: "Fields", icon: MdEdit },
		{ name: "preview", title: "Preview", icon: MdPreview },
	];

	type SeoInputMode = (typeof MODES)[number];

	const [currentMode, setCurrentMode] = useState<SeoInputMode["name"]>(
		MODES[0]?.name,
	);

	const document = (useFormValue([]) || {}) as Record<string, unknown>;
	const pageValue = (props.value || {}) as {
		description?: unknown;
		metaImage?: { asset?: { _ref?: string } };
	};
	const defaults = (seoDefaults || {}) as {
		metaDescription?: unknown;
		defaultMetaImage?: { asset?: { _ref?: string } };
		siteTitle?: unknown;
		pageTitleTemplate?: unknown;
		twitterHandle?: unknown;
		siteUrl?: unknown;
	};

	const previewImageUrl = useMemo(() => {
		const effectiveMetaImage = pageValue.metaImage ?? defaults.defaultMetaImage;
		const assetRef = effectiveMetaImage?.asset?._ref;
		if (!assetRef) return undefined;

		return buildSrc({
			id: assetRef,
			baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`,
		})?.src;
	}, [dataset, defaults.defaultMetaImage, pageValue.metaImage, projectId]);

	const resolvedDescription =
		asString(resolveValue(pageValue.description)) ??
		asString(resolveValue(defaults.metaDescription)) ??
		"";

	const seoData = {
		siteUrl: asString(resolveValue(defaults.siteUrl)) ?? "",
		twitterHandle: asString(resolveValue(defaults.twitterHandle)),
		image: previewImageUrl ?? "",
		title:
			concatenatePageTitle(
				asString(resolveValue(document?.title)),
				asString(resolveValue(defaults.siteTitle)),
				asString(resolveValue(defaults.pageTitleTemplate)),
			) ?? "",
		description: resolvedDescription,
	};

	return (
		<div>
			<Box marginBottom={4} width="fill">
				<Flex gap={2} width="fill">
					{MODES.map((m: SeoInputMode) => (
						<ButtonWithIcon
							key={m.name}
							buttonProps={{
								padding: 2,
								width: "fill",
								mode: m.name === currentMode ? "default" : "ghost",
								onClick: () => setCurrentMode(m.name),
							}}
							label={m.title}
							icon={m.icon}
						/>
					))}
				</Flex>
			</Box>

			{currentMode === "fields" && props.renderDefault(props)}
			{currentMode === "preview" && (
				<Flex gap={6} marginTop={6} direction="column">
					{PREVIEW_GROUPS.map((group) => (
						<PreviewGroup key={group.name} title={group.title}>
							<group.component {...seoData} />
						</PreviewGroup>
					))}
				</Flex>
			)}
		</div>
	);
}
