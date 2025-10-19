import { buildSrc } from "@sanity-image/url-builder";

/**
 * Configuration for Sanity image builder
 * Users should provide this configuration when initializing the library
 */
export type SanityImageConfig = {
	projectId: string;
	dataset: string;
};

let imageConfig: SanityImageConfig | null = null;

/**
 * Initialize the Sanity image configuration
 * This should be called once at app initialization
 */
export function configureSanityImages(config: SanityImageConfig) {
	imageConfig = config;
}

/**
 * Get the current Sanity image configuration
 */
export function getImageConfig(): SanityImageConfig {
	if (!imageConfig) {
		throw new Error(
			"Sanity image config not initialized. Call configureSanityImages() first.",
		);
	}
	return imageConfig;
}

/**
 * Build a Sanity image URL with optional transformations
 */

export function urlFor(imageRef: string) {
	const config = getImageConfig();
	const baseUrl = `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/`;

	let width: number | undefined;
	let height: number | undefined;
	let format: string | undefined;
	let quality: number | undefined;

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
			quality = q;
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
