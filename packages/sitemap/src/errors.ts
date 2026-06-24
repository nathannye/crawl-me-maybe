export class SitemapNotFoundError extends Error {
	constructor(sitemap: string) {
		super(`Sitemap not found: ${sitemap}`);
		this.name = "SitemapNotFoundError";
	}
}

export class SitemapPartNotFoundError extends Error {
	constructor(selector: { sitemap?: string; index: number }) {
		const sitemapLabel = selector.sitemap ?? "sitemap";
		super(`Sitemap part not found: ${sitemapLabel}[${selector.index}]`);
		this.name = "SitemapPartNotFoundError";
	}
}
