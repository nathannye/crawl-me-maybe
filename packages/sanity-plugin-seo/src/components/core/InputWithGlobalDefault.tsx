import { Box, Card, Flex, Stack, Text } from "@sanity/ui";
import { buildSrc } from "@sanity-image/url-builder";
import { useMemo } from "react";
import { MdCheck, MdWarning } from "react-icons/md";
import type { InputProps } from "sanity";
import { useDataset, useProjectId } from "sanity";
import { useSeoDefaults } from "../../context/SeoDefaultsContext";
import CardWithIcon from "../partials/CardWithIcon";

function hasContent(value: unknown): boolean {
	if (typeof value === "string") return value.trim().length > 0;
	return value !== null && value !== undefined;
}

export default function InputWithGlobalDefault(props: InputProps) {
	const { seoDefaults } = useSeoDefaults();
	const dataset = useDataset();
	const projectId = useProjectId();

	const defaultFieldName = props?.schemaType?.options?.matchingDefaultField;

	if (!defaultFieldName) {
		console.warn(
			"No default field name found for input: ",
			props?.schemaType?.name,
		);
	}

	const value = props?.value;
	const defaultValue = defaultFieldName
		? seoDefaults?.[defaultFieldName]
		: null;
	const hasDefault = hasContent(defaultValue);
	const hasValue = hasContent(value);
	const isImageField = props?.schemaType?.name === "metaImage";
	const defaultText =
		typeof defaultValue === "string" ? defaultValue.trim() : null;

	const imageFallbackUrl = useMemo(() => {
		if (!isImageField || !defaultValue || typeof defaultValue !== "object") {
			return null;
		}

		const assetRef =
			(defaultValue as { asset?: { _ref?: string } })?.asset?._ref ?? null;
		if (!assetRef) return null;

		const src = buildSrc({
			id: assetRef,
			baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`,
		})?.src;

		if (!src) return null;
		try {
			const imageUrl = new URL(src);
			imageUrl.searchParams.set("w", "300");
			imageUrl.searchParams.set("h", "157");
			imageUrl.searchParams.set("fit", "crop");
			imageUrl.searchParams.set("auto", "format");
			return imageUrl.toString();
		} catch {
			return src;
		}
	}, [dataset, defaultValue, isImageField, projectId]);

	const propsWithPlaceholder =
		!hasValue && defaultText
			? ({
					...props,
					elementProps: {
						...(
							props as InputProps & { elementProps?: Record<string, unknown> }
						).elementProps,
						placeholder: defaultText,
						title: defaultText,
					},
				} as InputProps)
			: props;

	return (
		<div>
			{!hasValue && !hasDefault && (
				<CardWithIcon
					icon={MdWarning}
					tone="critical"
					text="This field does not have a global default set. Make sure to fill it in here."
				/>
			)}
			{!hasValue && hasDefault && !isImageField && (
				<CardWithIcon
					icon={MdCheck}
					tone="suggest"
					text="This field is using the global default as placeholder."
				/>
			)}
			{!hasValue && hasDefault && isImageField && (
				<Card marginBottom={3} tone="positive" padding={3}>
					<Flex gap={3} align="center" justify="space-between">
						<Flex gap={2} align="center">
							<MdCheck size={18} />
							<Stack gap={2}>
								<Text size={1} weight="semibold">
									Using the global default image.
								</Text>
								<Text size={0} muted>
									Add an image below to override.
								</Text>
							</Stack>
						</Flex>
						{imageFallbackUrl && (
							<img
								src={imageFallbackUrl}
								alt="Global default preview"
								style={{
									width: "90px",
									flexShrink: 0,
									aspectRatio: "1.91 / 1",
									objectFit: "cover",
									borderRadius: "4px",
									border: "1px solid var(--card-border-color)",
								}}
							/>
						)}
					</Flex>
				</Card>
			)}

			<Box style={{ position: "relative" }}>
				{props.renderDefault(propsWithPlaceholder)}
				{!hasValue && hasDefault && isImageField && (
					<Flex
						align="center"
						justify="center"
						style={{
							position: "absolute",
							inset: 0,
							pointerEvents: "none",
							background: "rgba(255,255,255,0.55)",
							border: "1px dashed var(--card-border-color)",
							borderRadius: "4px",
						}}
					>
						<Text size={1} muted>
							Using global default image
						</Text>
					</Flex>
				)}
			</Box>
		</div>
	);
}
