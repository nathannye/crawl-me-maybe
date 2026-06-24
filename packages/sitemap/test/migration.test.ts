import { expect, it } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createFile } from "../src/file";
import { generateIndexSitemap } from "../src/sitemap";
import { vitePluginSitemap } from "../src/vite";

const makeTempDir = () => mkdtempSync(path.join(os.tmpdir(), "sitemap-"));

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

it("writes multi-sitemaps into a sitemap folder and indexes them", async () => {
	const tempDir = makeTempDir();

	try {
		const plugin = vitePluginSitemap({
			domain: "https://example.com",
			outDir: tempDir,
			sitemaps: {
				pages: async () => [{ path: "/" }],
				blog: async () => [{ path: "/blog" }],
			},
		});

		await plugin.closeBundle?.();

		const pagesFile = path.join(tempDir, "sitemap", "pages.xml");
		const blogFile = path.join(tempDir, "sitemap", "blog.xml");
		const indexFile = path.join(tempDir, "sitemap.xml");
		const robotsFile = path.join(tempDir, "robots.txt");

		expect(existsSync(pagesFile)).toBe(true);
		expect(existsSync(blogFile)).toBe(true);
		expect(existsSync(indexFile)).toBe(true);
		expect(existsSync(robotsFile)).toBe(true);

		expect(readFileSync(indexFile, "utf8")).toContain(
			"https://example.com/sitemap/pages.xml",
		);
		expect(readFileSync(indexFile, "utf8")).toContain(
			"https://example.com/sitemap/blog.xml",
		);
		expect(readFileSync(robotsFile, "utf8")).toContain(
			"Sitemap: https://example.com/sitemap.xml",
		);
	} finally {
		removeTempDir(tempDir);
	}
});

it("builds nested child sitemap URLs for index generation", () => {
	const xml = generateIndexSitemap("https://example.com", {
		childSitemapNames: ["sitemap/pages.xml", "/sitemap/blog.xml"],
	});

	expect(xml).toContain(
		"<loc>https://example.com/sitemap/pages.xml</loc>",
	);
	expect(xml).toContain("<loc>https://example.com/sitemap/blog.xml</loc>");
});
