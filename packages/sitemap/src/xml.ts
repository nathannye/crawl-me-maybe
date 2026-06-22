import type { SitemapEntryWithAlternates } from "./types";

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
				if (u.videoUrls?.length) {
					videoNS = true;
					for (const vid of u.videoUrls) {
						xml += `<video:video><video:content_loc>${vid}</video:content_loc></video:video>`;
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
