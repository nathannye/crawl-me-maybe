export declare class SitemapNotFoundError extends Error {
    constructor(sitemap: string);
}
export declare class SitemapPartNotFoundError extends Error {
    constructor(selector: {
        sitemap?: string;
        index: number;
    });
}
