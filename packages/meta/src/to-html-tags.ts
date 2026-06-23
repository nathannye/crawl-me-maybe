import type { MergedMetadata } from "./merge";

export type MetaTag = Record<string, string>;
export type LinkTag = Record<string, string>;

export type HtmlTagsOutput = {
	title: string;
	tags: MetaTag[];
	links: LinkTag[];
};

const pushMeta = (
	tags: MetaTag[],
	attrs: { name?: string; property?: string; content: string },
) => {
	if (!attrs.content) return;
	tags.push(attrs as MetaTag);
};

export function toHtmlTags(meta: MergedMetadata): HtmlTagsOutput {
	const tags: MetaTag[] = [];
	const links: LinkTag[] = [];

	if (meta.description) {
		pushMeta(tags, { name: "description", content: meta.description });
	}

	if (meta.robots) {
		pushMeta(tags, { name: "robots", content: meta.robots });
	}

	if (meta.openGraph?.title) {
		pushMeta(tags, {
			property: "og:title",
			content: meta.openGraph.title,
		});
	}

	if (meta.openGraph?.description ?? meta.description) {
		pushMeta(tags, {
			property: "og:description",
			content: meta.openGraph?.description ?? meta.description ?? "",
		});
	}

	if (meta.openGraph?.url) {
		pushMeta(tags, { property: "og:url", content: meta.openGraph.url });
	}

	if (meta.openGraph?.type) {
		pushMeta(tags, { property: "og:type", content: meta.openGraph.type });
	}

	if (meta.openGraph?.siteName) {
		pushMeta(tags, {
			property: "og:site_name",
			content: meta.openGraph.siteName,
		});
	}

	if (meta.metaImage) {
		pushMeta(tags, { property: "og:image", content: meta.metaImage });
	}

	if (meta.twitter?.card) {
		pushMeta(tags, { name: "twitter:card", content: meta.twitter.card });
	}

	const twitterTitle = meta.title ?? meta.openGraph?.title;
	if (twitterTitle) {
		pushMeta(tags, { name: "twitter:title", content: twitterTitle });
	}

	const twitterDescription = meta.description ?? meta.openGraph?.description;
	if (twitterDescription) {
		pushMeta(tags, {
			name: "twitter:description",
			content: twitterDescription,
		});
	}

	if (meta.metaImage) {
		pushMeta(tags, { name: "twitter:image", content: meta.metaImage });
	}

	if (meta.twitter?.creator) {
		pushMeta(tags, {
			name: "twitter:creator",
			content: meta.twitter.creator,
		});
	}

	if (meta.twitter?.site) {
		pushMeta(tags, { name: "twitter:site", content: meta.twitter.site });
	}

	if (meta.canonicalUrl) {
		links.push({ rel: "canonical", href: meta.canonicalUrl });
	}

	return {
		title: meta.title ?? "",
		tags,
		links,
	};
}
