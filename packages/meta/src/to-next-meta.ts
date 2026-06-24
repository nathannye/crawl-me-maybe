import type { Metadata } from "next";
import type { MergedMetadata } from "./merge";

const parseRobots = (robots?: string): Metadata["robots"] | undefined => {
	if (!robots) return undefined;

	const directives = robots.split(",").map((part) => part.trim().toLowerCase());
	const result: NonNullable<Metadata["robots"]> = {};

	if (directives.includes("noindex")) result.index = false;
	if (directives.includes("nofollow")) result.follow = false;

	return Object.keys(result).length > 0 ? result : robots;
};

export function toNextMeta(meta: MergedMetadata): Metadata {
	const ogTitle = meta.openGraph?.title ?? meta.title;
	const ogDescription = meta.openGraph?.description ?? meta.description;

	const output: Metadata = {
		title: meta.title,
		description: meta.description,
	};

	if (meta.canonicalUrl) {
		output.alternates = { canonical: meta.canonicalUrl };
	}

	const robots = parseRobots(meta.robots);
	if (robots) {
		output.robots = robots;
	}

	if (
		ogTitle ||
		ogDescription ||
		meta.openGraph?.siteName ||
		meta.openGraph?.url ||
		meta.openGraph?.type ||
		meta.metaImage
	) {
		output.openGraph = {
			title: ogTitle,
			description: ogDescription,
			siteName: meta.openGraph?.siteName,
			url: meta.openGraph?.url,
			type: meta.openGraph?.type,
			...(meta.metaImage ? { images: [{ url: meta.metaImage }] } : {}),
		} as Metadata["openGraph"];
	}

	if (meta.twitter || meta.metaImage) {
		output.twitter = {
			card: meta.twitter?.card,
			creator: meta.twitter?.creator,
			site: meta.twitter?.site,
			title: ogTitle,
			description: ogDescription,
			...(meta.metaImage ? { images: [meta.metaImage] } : {}),
		};
	}

	if (meta.faviconUrl) {
		output.icons = meta.faviconUrl;
	}

	return output;
}
