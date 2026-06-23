import { buildSrc } from "@sanity-image/url-builder";
import { Box, Card, Flex, Text } from "@sanity/ui";
import { useMemo } from "react";
import type { InputProps } from "sanity";
import { useDataset, useProjectId } from "sanity";
import { useSeoDefaults } from "../../context/SeoDefaultsContext";
import { MdCheck, MdWarning } from "react-icons/md";
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
	const defaultValue = defaultFieldName ? seoDefaults?.[defaultFieldName] : null;
	const hasDefault = hasContent(defaultValue);
	const hasValue = hasContent(value);
	const isImageField = props?.schemaType?.name === "metaImage";
	const defaultText = typeof defaultValue === "string" ? defaultValue.trim() : null;

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
		return `${src}?w=300&h=157&fit=crop&auto=format`;
	}, [dataset, defaultValue, isImageField, projectId]);

	const propsWithPlaceholder =
		!hasValue && defaultText
			? ({
					...props,
					elementProps: {
						...(props as InputProps & { elementProps?: Record<string, unknown> })
							.elementProps,
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
					<Flex gap={3} align="center">
						<MdCheck size={18} />
						<Box>
							<Text size={1} weight="semibold">
								This field is using the global default image.
							</Text>
							{imageFallbackUrl && (
								<Box marginTop={3}>
									<img
										src={imageFallbackUrl}
										alt="Global default preview"
										style={{
											width: "150px",
											maxWidth: "100%",
											aspectRatio: "1.91 / 1",
											objectFit: "cover",
											borderRadius: "4px",
											border: "1px solid var(--card-border-color)",
										}}
									/>
								</Box>
							)}
						</Box>
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
