import { expect, it } from "bun:test";
import {
	createSitemapManifest,
	SitemapNotFoundError,
	SitemapPartNotFoundError,
} from "../src";

const makeEntries = (count: number) =>
	Array.from({ length: count }, (_, index) => ({
		path: `/page-${index + 1}`,
		lastmod: `2025-06-${String(index + 1).padStart(2, "0")}`,
	}));

it("serves a single sitemap directly and exposes a stable child file", async () => {
	const manifest = createSitemapManifest({
		domain: "https://example.com",
		entries: makeEntries(1),
	});

	const rootXml = await manifest.getRootSitemap();
	const files = await manifest.getSitemapFiles();
	const childXml = await manifest.getSitemap({ index: 0 });

	expect(rootXml).toContain("<urlset");
	expect(rootXml).not.toContain("<sitemapindex");
	expect(files).toEqual([
		{
			sitemap: null,
			index: 0,
			path: "/sitemap-0.xml",
		},
	]);
	expect(childXml).toContain("<urlset");
	expect(childXml).toContain("https://example.com/page-1");
});

it("keeps an empty sitemap as a real direct sitemap file", async () => {
	const manifest = createSitemapManifest({
		domain: "https://example.com",
		entries: [],
	});

	const rootXml = await manifest.getRootSitemap();
	const files = await manifest.getSitemapFiles();

	expect(rootXml).toContain("<urlset");
	expect(files).toEqual([
		{
			sitemap: null,
			index: 0,
			path: "/sitemap-0.xml",
		},
	]);
});

it("splits a sitemap when it exceeds the maxUrls threshold", async () => {
	const manifest = createSitemapManifest({
		domain: "https://example.com",
		maxUrls: 2,
		entries: makeEntries(5),
	});

	const rootXml = await manifest.getRootSitemap();
	const files = await manifest.getSitemapFiles();
	const secondPart = await manifest.getSitemap({ index: 1 });

	expect(rootXml).toContain("<sitemapindex");
	expect(files.map((file) => file.path)).toEqual([
		"/sitemap-0.xml",
		"/sitemap-1.xml",
		"/sitemap-2.xml",
	]);
	expect(secondPart).toContain("https://example.com/page-3");
});

it("serves a single named sitemap directly when it is the only file", async () => {
	const manifest = createSitemapManifest({
		domain: "https://example.com",
		entries: {
			pages: [{ path: "/pages" }],
		},
	});

	const rootXml = await manifest.getRootSitemap();
	const files = await manifest.getSitemapFiles();

	expect(rootXml).toContain("<urlset");
	expect(files).toEqual([
		{
			sitemap: "pages",
			index: 0,
			path: "/sitemap-pages-0.xml",
		},
	]);
});

it("keeps named sitemap routes stable and resolves only the requested sitemap", async () => {
	let pagesCalls = 0;
	let blogCalls = 0;

	const manifest = createSitemapManifest({
		domain: "https://example.com",
		entries: {
			pages: () => {
				pagesCalls += 1;
				return [{ path: "/pages" }];
			},
			blog: () => {
				blogCalls += 1;
				return [{ path: "/blog" }];
			},
		},
	});

	const childXml = await manifest.getSitemap({ sitemap: "pages", index: 0 });
	const files = await manifest.getSitemapFiles();
	const rootXml = await manifest.getRootSitemap();

	expect(childXml).toContain("https://example.com/pages");
	expect(files.map((file) => file.path)).toEqual([
		"/sitemap-pages-0.xml",
		"/sitemap-blog-0.xml",
	]);
	expect(rootXml).toContain("<sitemapindex");
	expect(pagesCalls).toBe(1);
	expect(blogCalls).toBe(1);
});

it("throws typed errors for invalid sitemap names and indexes", async () => {
	const namedManifest = createSitemapManifest({
		domain: "https://example.com",
		entries: {
			pages: [{ path: "/pages" }],
			blog: [{ path: "/blog" }],
		},
	});

	await expect(
		namedManifest.getSitemap({ sitemap: "blog-posts", index: 0 }),
	).rejects.toBeInstanceOf(SitemapNotFoundError);

	const singleManifest = createSitemapManifest({
		domain: "https://example.com",
		entries: [{ path: "/pages" }],
	});

	await expect(
		singleManifest.getSitemap({ index: 1 }),
	).rejects.toBeInstanceOf(SitemapPartNotFoundError);
});
