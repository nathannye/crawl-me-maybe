import { expect, it } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createFile } from "../src/file";
import { vitePluginSitemap } from "../src/vite";

const makeTempDir = () => mkdtempSync(path.join(os.tmpdir(), "sitemap-"));
const makeEntries = (prefix: string, count: number) =>
	Array.from({ length: count }, (_, index) => ({
		path: `/${prefix}-${index + 1}`,
	}));

const removeTempDir = (dir: string) => {
	rmSync(dir, { recursive: true, force: true });
};

it("creates parent directories for nested sitemap outputs", () => {
	const tempDir = makeTempDir();

	try {
		createFile(tempDir, "sitemap/pages.xml", "<xml />");

		const target = path.join(tempDir, "sitemap", "pages.xml");

		expect(existsSync(target)).toBe(true);
		expect(readFileSync(target, "utf8")).toBe("<xml />");
	} finally {
		removeTempDir(tempDir);
	}
});

it("writes child sitemap files and index with per-sitemap maxUrls overrides", async () => {
	const tempDir = makeTempDir();

	try {
		const plugin = vitePluginSitemap({
			domain: "https://example.com",
			outDir: tempDir,
			maxUrls: 2,
			sitemaps: {
				pages: {
					entries: async () => makeEntries("pages", 3),
				},
				blog: {
					entries: async () => makeEntries("blog", 3),
					maxUrls: 1,
				},
			},
		});

		await plugin.closeBundle?.();

		const rootFile = path.join(tempDir, "sitemap.xml");
		const pageFile0 = path.join(tempDir, "sitemap-pages-0.xml");
		const pageFile1 = path.join(tempDir, "sitemap-pages-1.xml");
		const blogFile0 = path.join(tempDir, "sitemap-blog-0.xml");
		const blogFile1 = path.join(tempDir, "sitemap-blog-1.xml");
		const blogFile2 = path.join(tempDir, "sitemap-blog-2.xml");
		const robotsFile = path.join(tempDir, "robots.txt");

		expect(existsSync(rootFile)).toBe(true);
		expect(existsSync(pageFile0)).toBe(true);
		expect(existsSync(pageFile1)).toBe(true);
		expect(existsSync(blogFile0)).toBe(true);
		expect(existsSync(blogFile1)).toBe(true);
		expect(existsSync(blogFile2)).toBe(true);
		expect(existsSync(robotsFile)).toBe(true);

		expect(readFileSync(rootFile, "utf8")).toContain("<sitemapindex");
		expect(readFileSync(rootFile, "utf8")).toContain(
			"https://example.com/sitemap-pages-0.xml",
		);
		expect(readFileSync(rootFile, "utf8")).toContain(
			"https://example.com/sitemap-pages-1.xml",
		);
		expect(readFileSync(rootFile, "utf8")).toContain(
			"https://example.com/sitemap-blog-0.xml",
		);
		expect(readFileSync(rootFile, "utf8")).toContain(
			"https://example.com/sitemap-blog-1.xml",
		);
		expect(readFileSync(rootFile, "utf8")).toContain(
			"https://example.com/sitemap-blog-2.xml",
		);
		expect(readFileSync(robotsFile, "utf8")).toContain(
			"Sitemap: https://example.com/sitemap.xml",
		);
	} finally {
		removeTempDir(tempDir);
	}
});

it("uses the default maxUrls for a single sitemap source", async () => {
	const tempDir = makeTempDir();

	try {
		const plugin = vitePluginSitemap({
			domain: "https://example.com",
			outDir: tempDir,
			maxUrls: 2,
			sitemaps: async () => makeEntries("page", 3),
		});

		await plugin.closeBundle?.();

		const rootFile = path.join(tempDir, "sitemap.xml");
		const childFile0 = path.join(tempDir, "sitemap-0.xml");
		const childFile1 = path.join(tempDir, "sitemap-1.xml");
		const robotsFile = path.join(tempDir, "robots.txt");

		expect(existsSync(rootFile)).toBe(true);
		expect(existsSync(childFile0)).toBe(true);
		expect(existsSync(childFile1)).toBe(true);
		expect(existsSync(robotsFile)).toBe(true);

		expect(readFileSync(rootFile, "utf8")).toContain("<sitemapindex");
		expect(readFileSync(rootFile, "utf8")).toContain(
			"https://example.com/sitemap-0.xml",
		);
		expect(readFileSync(rootFile, "utf8")).toContain(
			"https://example.com/sitemap-1.xml",
		);
		expect(readFileSync(robotsFile, "utf8")).toContain(
			"Sitemap: https://example.com/sitemap.xml",
		);
	} finally {
		removeTempDir(tempDir);
	}
});
