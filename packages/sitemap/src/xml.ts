import type { SitemapEntryWithAlternates, SitemapVideo } from "./types";
import { validateSitemapVideos } from "./validate-video";

const INDENT = "  ";

function indent(level: number): string {
	return INDENT.repeat(level);
}

function xmlLine(level: number, content: string): string {
	return `${indent(level)}${content}\n`;
}

function escapeXml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function createVideoXml(video: SitemapVideo, level: number): string {
	const lines = [
		xmlLine(level, "<video:video>"),
		xmlLine(
			level + 1,
			`<video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>`,
		),
		xmlLine(level + 1, `<video:title>${escapeXml(video.title)}</video:title>`),
		xmlLine(
			level + 1,
			`<video:description>${escapeXml(video.description)}</video:description>`,
		),
	];

	if (video.contentUrl) {
		lines.push(
			xmlLine(
				level + 1,
				`<video:content_loc>${video.contentUrl}</video:content_loc>`,
			),
		);
	}

	if (video.playerUrl) {
		lines.push(
			xmlLine(
				level + 1,
				`<video:player_loc>${video.playerUrl}</video:player_loc>`,
			),
		);
	}

	if (video.duration !== undefined) {
		lines.push(
			xmlLine(level + 1, `<video:duration>${video.duration}</video:duration>`),
		);
	}

	if (video.publicationDate) {
		lines.push(
			xmlLine(
				level + 1,
				`<video:publication_date>${video.publicationDate}</video:publication_date>`,
			),
		);
	}

	lines.push(xmlLine(level, "</video:video>"));
	return lines.join("");
}

function createUrlXml(u: SitemapEntryWithAlternates, now: string): string {
	if (u.videos?.length) {
		validateSitemapVideos(u.videos);
	}

	const lines = [
		xmlLine(1, "<url>"),
		xmlLine(2, `<loc>${u.url}</loc>`),
		xmlLine(2, `<lastmod>${u.lastmod ?? now}</lastmod>`),
	];

	if (u.changefreq) {
		lines.push(xmlLine(2, `<changefreq>${u.changefreq}</changefreq>`));
	}

	if (typeof u.priority === "number") {
		lines.push(xmlLine(2, `<priority>${u.priority.toFixed(1)}</priority>`));
	}

	if (u.alternates?.length) {
		for (const alt of u.alternates) {
			lines.push(
				xmlLine(
					2,
					`<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`,
				),
			);
		}
	}

	if (u.imageUrls?.length) {
		for (const img of u.imageUrls) {
			lines.push(xmlLine(2, "<image:image>"));
			lines.push(xmlLine(3, `<image:loc>${img}</image:loc>`));
			lines.push(xmlLine(2, "</image:image>"));
		}
	}

	if (u.videos?.length) {
		for (const video of u.videos) {
			lines.push(createVideoXml(video, 2));
		}
	}

	lines.push(xmlLine(1, "</url>"));
	return lines.join("");
}

/**
 * Builds a urlset sitemap XML string from resolved entries.
 * @param urls - Entries with absolute URLs and optional hreflang alternates
 * @returns Sitemap XML string
 */
export function createSitemapXml(urls: SitemapEntryWithAlternates[]): string {
	try {
		const now = new Date().toISOString();
		let imageNS = false;
		let videoNS = false;
		let xhtmlNS = false;

		for (const u of urls) {
			if (u.alternates?.length) xhtmlNS = true;
			if (u.imageUrls?.length) imageNS = true;
			if (u.videos?.length) videoNS = true;
		}

		const items = urls.map((u) => createUrlXml(u, now)).join("");
		const ns: string = [
			'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
			xhtmlNS ? 'xmlns:xhtml="http://www.w3.org/1999/xhtml"' : null,
			imageNS
				? 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
				: null,
			videoNS
				? 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'
				: null,
		]
			.filter(Boolean)
			.join(" ");

		return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ns}>\n${items}</urlset>\n`;
	} catch (err) {
		throw new Error(
			`Sitemap XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}
