export class SitemapNotFoundError extends Error {
	constructor(sitemap: string) {
		super(`Sitemap not found: ${sitemap}`);
		this.name = "SitemapNotFoundError";
	}
}
