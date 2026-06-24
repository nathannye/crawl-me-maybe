import { Box, Flex } from "@sanity/ui";
import { buildSrc } from "@sanity-image/url-builder";
import { useEffect, useMemo, useState } from "react";
import { MdEdit, MdPreview } from "react-icons/md";
import {
	type ObjectInputProps,
	useClient,
	useDataset,
	useFormValue,
	useProjectId,
} from "sanity";
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

export default function PageSeoInput(props: ObjectInputProps) {
	const client = useClient({ apiVersion: "2025-01-11" });
	const dataset = useDataset();
	const projectId = useProjectId();
	const MODES = [
		{ name: "fields", title: "Fields", icon: MdEdit },
		{ name: "preview", title: "Preview", icon: MdPreview },
	];

	type SeoInputMode = (typeof MODES)[number];

	const [currentMode, setCurrentMode] = useState<SeoInputMode["name"]>(
		MODES[0]?.name,
	);
	const [seoDefaults, setSeoDefaults] = useState<Record<
		string,
		unknown
	> | null>(null);

	useEffect(() => {
		client.fetch(`*[_type == "globalSeoSettings"][0]`).then(setSeoDefaults);
	}, [client]);

	const document = useFormValue([]) || {};
	const pageValue = (props.value || {}) as {
		metaImage?: { asset?: { _ref?: string } };
	};
	const defaults = (seoDefaults || {}) as {
		defaultMetaImage?: { asset?: { _ref?: string } };
		siteTitle?: string;
		pageTitleTemplate?: string;
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

	const seoData = {
		...defaults,
		...pageValue,
		image: previewImageUrl,
		title: concatenatePageTitle(
			document?.title,
			defaults.siteTitle,
			defaults.pageTitleTemplate,
		),
		// merge description or other fields as needed
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
