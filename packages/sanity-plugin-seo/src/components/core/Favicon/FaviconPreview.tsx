import { Box, Card, Flex, useRootTheme } from "@sanity/ui";
import { buildSrc } from "@sanity-image/url-builder";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import type { ImageInputProps } from "sanity";
import { useDataset, useProjectId } from "sanity";
import { useSeoDefaults } from "../../../context/SeoDefaultsContext";
import BrowserTab from "./BrowserTab";
import styles from "./favicon-preview.module.css";
import WindowControls from "./WindowControls";

export default function FaviconPreview(props: ImageInputProps) {
	const defaults = useSeoDefaults() as {
		siteUrl?: string;
		siteTitle?: string;
	} | null;
	const theme = useRootTheme();
	const dataset = useDataset();
	const projectId = useProjectId();
	const [previewSchemeOverride, setPreviewSchemeOverride] = useState<
		"light" | "dark" | null
	>(null);
	const lastGlobalScheme = useRef<"light" | "dark">(theme.scheme);

	const faviconUrl = useMemo(() => {
		return props.value?.asset?._ref
			? buildSrc({
					id: props.value?.asset?._ref,
					baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`,
				})?.src
			: null;
	}, [props.value?.asset?._ref, projectId, dataset]);

	useEffect(() => {
		if (lastGlobalScheme.current !== theme.scheme) {
			lastGlobalScheme.current = theme.scheme;
			setPreviewSchemeOverride(null);
		}
	}, [theme.scheme]);

	const previewScheme = previewSchemeOverride ?? theme.scheme;

	return (
		<div className={styles.card}>
			<Card
				data-tab-display
				data-theme={previewScheme}
				shadow={2}
				marginBottom={2}
				radius={4}
				style={{
					width: "100%",
				}}
			>
				<Flex paddingX={4} paddingY={2} justify="flex-start" align="center">
					<WindowControls />
					<BrowserTab
						title={defaults?.siteTitle}
						favicon={faviconUrl}
						scheme={previewScheme}
					/>
					<BrowserTab title="Facebook" scheme={previewScheme} />
					<button
						type="button"
						title="Toggle favicon preview theme"
						aria-label="Toggle favicon preview theme"
						onClick={() => {
							const currentScheme = previewSchemeOverride ?? theme.scheme;
							setPreviewSchemeOverride(
								currentScheme === "dark" ? "light" : "dark",
							);
						}}
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							marginLeft: "auto",
							width: 24,
							height: 24,
							borderRadius: 999,
							border: "1px solid var(--card-border-color)",
							background: "var(--card-bg-color)",
							color: "var(--card-muted-fg-color)",
							cursor: "pointer",
						}}
					>
						{previewScheme === "dark" ? (
							<MdLightMode size={14} />
						) : (
							<MdDarkMode size={14} />
						)}
					</button>
				</Flex>
			</Card>
			<Box className={styles?.["image-preview"]}>
				{props.renderDefault(props)}
			</Box>
		</div>
	);
}
