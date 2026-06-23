import type { MetaFlatInput } from "zhead";
import type { MergedMetadata } from "./merge";

export function toNuxtMeta(meta: MergedMetadata): MetaFlatInput {
	const ogTitle = meta.openGraph?.title ?? meta.title;
	const ogDescription = meta.openGraph?.description ?? meta.description;

	const output: MetaFlatInput = {};

	if (meta.description) output.description = meta.description;
	if (meta.robots) output.robots = meta.robots;
	if (ogTitle) output.ogTitle = ogTitle;
	if (ogDescription) output.ogDescription = ogDescription;
	if (meta.openGraph?.url) output.ogUrl = meta.openGraph.url;
	if (meta.openGraph?.type) {
		output.ogType = meta.openGraph.type as MetaFlatInput["ogType"];
	}
	if (meta.openGraph?.siteName) output.ogSiteName = meta.openGraph.siteName;
	if (meta.metaImage) output.ogImage = meta.metaImage;
	if (meta.twitter?.card) output.twitterCard = meta.twitter.card;
	if (ogTitle) output.twitterTitle = ogTitle;
	if (ogDescription) output.twitterDescription = ogDescription;
	if (meta.metaImage) output.twitterImage = meta.metaImage;
	if (meta.twitter?.creator) output.twitterCreator = meta.twitter.creator;
	if (meta.twitter?.site) output.twitterSite = meta.twitter.site;

	return output;
}
