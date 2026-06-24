import type { Head, Meta } from "zhead";
import type { MergedMetadata } from "./merge";
import { toHtmlTags } from "./to-html-tags";

export type NuxtMeta = Pick<Head, "title" | "meta" | "link">;

export function toNuxtMeta(meta: MergedMetadata): NuxtMeta {
	const { title, tags, links } = toHtmlTags(meta);

	const output: NuxtMeta = {};

	if (title) output.title = title;
	if (tags.length) {
		const metaTags: Meta[] = [];
		for (const tag of tags) {
			if (tag.property) {
				metaTags.push({ property: tag.property, content: tag.content });
			} else if (tag.name) {
				metaTags.push({ name: tag.name, content: tag.content });
			}
		}
		output.meta = metaTags as NuxtMeta["meta"];
	}
	if (links.length) {
		output.link = links.map((link) => ({
			rel: link.rel,
			href: link.href,
		}));
	}

	return output;
}
