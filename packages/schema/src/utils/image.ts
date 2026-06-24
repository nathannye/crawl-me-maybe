type ImageObjectInput = {
	url: string;
	width?: number;
	height?: number;
};

export type ImageInput = string | ImageObjectInput;

export function buildImageObject(
	input?: ImageInput,
): Record<string, unknown> | undefined {
	if (!input) {
		return undefined;
	}

	if (typeof input === "string") {
		return {
			"@type": "ImageObject",
			url: input,
		};
	}

	return {
		"@type": "ImageObject",
		url: input.url,
		width: input.width,
		height: input.height,
	};
}
