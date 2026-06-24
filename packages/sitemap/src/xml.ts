import type { SitemapEntryWithAlternates, SitemapVideo } from "./types";
import { validateSitemapVideos } from "./validate-video";

function escapeXml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function createVideoXml(video: SitemapVideo): string {
	let xml = "<video:video>";
	xml += `<video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>`;
	xml += `<video:title>${escapeXml(video.title)}</video:title>`;
	xml += `<video:description>${escapeXml(video.description)}</video:description>`;

	if (video.contentUrl) {
		xml += `<video:content_loc>${video.contentUrl}</video:content_loc>`;
	}

	if (video.playerUrl) {
		xml += `<video:player_loc>${video.playerUrl}</video:player_loc>`;
	}

	if (video.duration !== undefined) {
		xml += `<video:duration>${video.duration}</video:duration>`;
	}

	if (video.publicationDate) {
		xml += `<video:publication_date>${video.publicationDate}</video:publication_date>`;
	}

	xml += "</video:video>";
	return xml;
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

		const items: string = urls
			.map((u) => {
				if (u.videos?.length) {
					validateSitemapVideos(u.videos);
				}

				let xml = `<url><loc>${u.url}</loc><lastmod>${u.lastmod ?? now}</lastmod>`;
				if (u.changefreq) {
					xml += `<changefreq>${u.changefreq}</changefreq>`;
				}
				if (typeof u.priority === "number") {
					xml += `<priority>${u.priority.toFixed(1)}</priority>`;
				}
				if (u.alternates?.length) {
					xhtmlNS = true;
					for (const alt of u.alternates) {
						xml += `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`;
					}
				}
				if (u.imageUrls?.length) {
					imageNS = true;
					for (const img of u.imageUrls) {
						xml += `<image:image><image:loc>${img}</image:loc></image:image>`;
					}
				}
				if (u.videos?.length) {
					videoNS = true;
					for (const video of u.videos) {
						xml += createVideoXml(video);
					}
				}
				xml += "</url>";
				return xml;
			})
			.join("");
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
		return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ns}>${items}</urlset>`;
	} catch (err) {
		throw new Error(
			`Sitemap XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}
