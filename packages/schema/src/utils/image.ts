import type {
	IdReference,
	ImageObjectLeaf,
	Organization,
	Person,
} from "schema-dts";

type ImageObjectInput = {
	url: string;
	width?: number;
	height?: number;
	caption?: string;
	creditText?: string;
	copyrightNotice?: string;
	license?: string;
	acquireLicensePage?: string;
	creator?: Person | Organization | IdReference;
};

export type ImageInput = string | ImageObjectInput;

export function buildImageObject(
	input?: ImageInput,
): ImageObjectLeaf | undefined {
	if (!input) {
		return undefined;
	}

	if (typeof input === "string") {
		return {
			"@type": "ImageObject",
			url: input,
			contentUrl: input,
		};
	}

	const { url, ...rest } = input;

	// schema-dts types width/height as Distance strings, but numeric pixel values are valid JSON-LD.
	return {
		"@type": "ImageObject",
		url,
		contentUrl: url,
		...rest,
	} as ImageObjectLeaf;
}
