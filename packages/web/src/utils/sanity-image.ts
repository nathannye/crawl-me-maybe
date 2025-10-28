import { buildSrc } from "@sanity-image/url-builder";
import { getConfig } from "~/config";

/**
 * Build a Sanity image URL with optional transformations
 */

export function urlFor(imageRef: string) {
	const config = getConfig();
	const baseUrl = `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/`;

	let width: number | undefined;
	let height: number | undefined;
	let format: string | undefined;
	let quality = 100;

	const chain = {
		size: (w: number, h: number) => {
			width = w;
			height = h;
			return chain;
		},
		format: (fm: string) => {
			format = fm;
			return chain;
		},
		quality: (q: number) => {
			if (q) {
				quality = q;
			}
			return chain;
		},
		url: () => {
			const result = buildSrc({
				id: imageRef,
				baseUrl,
				width,
				height,
				queryParams: {
					fm: format as "jpg" | "pjpg" | "png" | "webp",
					q: quality,
				},
			});
			return result?.src || "";
		},
	};

	return chain;
}
