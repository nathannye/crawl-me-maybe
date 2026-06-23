import { Box, Card, Flex, Text } from "@sanity/ui";
import { useMemo, useState } from "react";
import { MdEdit, MdPreview } from "react-icons/md";
import type { ArrayOfObjectsInputProps } from "sanity";
import ButtonWithIcon from "../partials/ButtonWithIcon";
import { PreviewGroup } from "./PageSeoInput/PreviewGroup";

type RobotsRuleItem = {
	_key?: string;
	userAgent?: string;
	allow?: string;
	disallow?: string;
};

function buildRobotsPreview(rules: RobotsRuleItem[]): string {
	if (rules.length === 0) {
		return "User-agent: *\nAllow: /";
	}

	const content = rules
		.map((rule) => {
			const lines: string[] = [];
			lines.push(`User-agent: ${rule.userAgent?.trim() || "*"}`);
			if (rule.allow?.trim()) lines.push(`Allow: ${rule.allow.trim()}`);
			if (rule.disallow?.trim())
				lines.push(`Disallow: ${rule.disallow.trim()}`);
			return lines.join("\n");
		})
		.join("\n\n");

	return content;
}

export default function RobotsRulesInput(
	props: ArrayOfObjectsInputProps<RobotsRuleItem & { _key: string }>,
) {
	const [mode, setMode] = useState<"input" | "preview">("input");
	const rules = (props.value ?? []) as RobotsRuleItem[];

	const robotsPreview = useMemo(() => buildRobotsPreview(rules), [rules]);

	return (
		<div>
			<Box marginBottom={4} width="fill">
				<Flex gap={2} width="fill">
					<ButtonWithIcon
						icon={MdEdit}
						label="Input"
						buttonProps={{
							padding: 2,
							width: "fill",
							mode: mode === "input" ? "default" : "ghost",
							onClick: () => setMode("input"),
						}}
					/>
					<ButtonWithIcon
						icon={MdPreview}
						label="Preview"
						buttonProps={{
							padding: 2,
							width: "fill",
							mode: mode === "preview" ? "default" : "ghost",
							onClick: () => setMode("preview"),
						}}
					/>
				</Flex>
			</Box>

			{mode === "input" && props.renderDefault(props)}
			{mode === "preview" && (
				<PreviewGroup title="robots.txt">
					<Card border radius={2} padding={4} tone="transparent">
						<Text
							size={1}
							muted
							style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
						>
							{robotsPreview}
						</Text>
					</Card>
				</PreviewGroup>
			)}
		</div>
	);
}
