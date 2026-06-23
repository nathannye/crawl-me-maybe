import { Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { useRef, useState } from "react";
import { type StringInputProps, set } from "sanity";

const TEMPLATE_TOKENS = ["pageTitle", "siteTitle"] as const;
const TOKEN_REGEX = /\{(pageTitle|siteTitle)\}/g;

function findTokenRangeForDelete(
	value: string,
	caret: number,
	key: "Backspace" | "Delete",
): { start: number; end: number } | null {
	let match: RegExpExecArray | null = TOKEN_REGEX.exec(value);
	while (match !== null) {
		const tokenStart = match.index;
		const tokenEnd = tokenStart + match[0].length;

		if (key === "Backspace") {
			if (caret > tokenStart && caret <= tokenEnd) {
				return { start: tokenStart, end: tokenEnd };
			}
		} else if (caret >= tokenStart && caret < tokenEnd) {
			return { start: tokenStart, end: tokenEnd };
		}

		match = TOKEN_REGEX.exec(value);
	}

	return null;
}

export default function PageTitleTemplateInput(props: StringInputProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [showTokenHints, setShowTokenHints] = useState(false);
	const value = typeof props.value === "string" ? props.value : "";

	const applyValue = (nextValue: string, caretPosition?: number) => {
		props.onChange(set(nextValue));
		if (caretPosition === undefined) return;
		requestAnimationFrame(() => {
			if (!inputRef.current) return;
			inputRef.current.focus();
			inputRef.current.setSelectionRange(caretPosition, caretPosition);
		});
	};

	const insertToken = (tokenName: (typeof TEMPLATE_TOKENS)[number]) => {
		const tokenText = `{${tokenName}}`;
		const selectionStart = inputRef.current?.selectionStart ?? value.length;
		const selectionEnd = inputRef.current?.selectionEnd ?? selectionStart;

		const shouldReplaceLeadingBrace =
			selectionStart > 0 &&
			selectionStart === selectionEnd &&
			value[selectionStart - 1] === "{";

		const start = shouldReplaceLeadingBrace
			? selectionStart - 1
			: selectionStart;
		const nextValue =
			value.slice(0, start) + tokenText + value.slice(selectionEnd);
		applyValue(nextValue, start + tokenText.length);
		setShowTokenHints(false);
	};

	return (
		<Stack space={3}>
			<TextInput
				value={value}
				ref={(node) => {
					inputRef.current = node;
				}}
				onChange={(event) => {
					props.onChange(set(event.currentTarget.value));
				}}
				onKeyDown={(event) => {
					if (event.key === "{") {
						setShowTokenHints(true);
						return;
					}
					if (event.key === "Escape") {
						setShowTokenHints(false);
						return;
					}
					if (
						(event.key === "Backspace" || event.key === "Delete") &&
						inputRef.current?.selectionStart === inputRef.current?.selectionEnd
					) {
						const caret = inputRef.current?.selectionStart ?? 0;
						const tokenRange = findTokenRangeForDelete(
							value,
							caret,
							event.key as "Backspace" | "Delete",
						);
						if (tokenRange) {
							event.preventDefault();
							const nextValue =
								value.slice(0, tokenRange.start) + value.slice(tokenRange.end);
							applyValue(nextValue, tokenRange.start);
						}
					}
				}}
				onBlur={() => {
					// Delay close so mousedown on hint buttons can run first.
					setTimeout(() => setShowTokenHints(false), 80);
				}}
				placeholder="{pageTitle} - {siteTitle}"
			/>

			{showTokenHints && (
				<Card tone="primary" border radius={2} padding={2}>
					<Stack gap={3}>
						<Text size={1} muted>
							Insert template variable
						</Text>
						<Flex gap={2}>
							{TEMPLATE_TOKENS.map((tokenName) => (
								<button
									key={tokenName}
									type="button"
									onMouseDown={(event) => {
										event.preventDefault();
										insertToken(tokenName);
									}}
									style={{
										border: "1px solid var(--card-border-color)",
										borderRadius: 6,
										background: "var(--card-bg-color)",
										padding: "10px 10px",
										cursor: "pointer",
									}}
								>
									<Text size={1}>{`{${tokenName}}`}</Text>
								</button>
							))}
						</Flex>
					</Stack>
				</Card>
			)}
		</Stack>
	);
}
