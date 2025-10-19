import { urlFor } from "~/utils/sanity-image";
import type { SanityImageAssetDocument } from "@sanity/client";
import type { ImageObject } from "schema-dts";

const formatImageUrl = (
	imageReference: string,
): {
	url: string;
	width: string;
	height: string;
} | null => {
	if (!imageReference) return null;

	const MAX_WIDTH = 2000;
	const QUALITY = 85;

	const parts = imageReference.split("-");
	if (parts.length < 3) return null;

	const [_, id, dimensions, _fileType] = parts;
	const [width, height] = dimensions.split("x").map(Number);
	const aspectRatio = Number(width) / Number(height);

	let w = width;
	let h = height;

	const shouldClamp = width > MAX_WIDTH;
	if (shouldClamp) {
		const newWidth = Math.min(width, MAX_WIDTH);
		const newHeight = Math.round(newWidth / aspectRatio);

		w = newWidth;
		h = newHeight;

		return {
			url: urlFor(imageReference)
				.size(newWidth, newHeight)
				.quality(QUALITY)
				.url(),
			width: String(newWidth),
			height: String(newHeight),
		};
	}

	return {
		url: urlFor(imageReference).quality(QUALITY).url(),
		width: String(w),
		height: String(h),
	};
};

export function createSchemaImageObject(
	image?: SanityImageAssetDocument,
	fallback?: SanityImageAssetDocument,
): ImageObject | undefined {
	if (!image && !fallback) return undefined;
	const imageToUse = image || fallback;

	const isDereferencedImage =
		typeof imageToUse === "object" && "asset" in imageToUse && imageToUse.asset;
	const reference = isDereferencedImage
		? imageToUse.asset?._id
		: imageToUse?.asset?._ref;

	const imageData = formatImageUrl(reference || "");
	if (!imageData) return undefined;

	return {
		"@type": "ImageObject",
		url: imageData.url,
		width: imageData.width,
		height: imageData.height,
	};
}
