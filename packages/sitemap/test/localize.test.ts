import { expect, it } from "bun:test";
import { createSitemapManifest, generateSitemap } from "../src";

it("keeps manual mode permissive when no locale config is provided", async () => {
	const xml = await generateSitemap("https://example.com", {
		entries: [
			{
				path: "/about",
				locales: ["fr"],
				localePaths: { fr: "/a-propos" },
			},
			{
				path: "https://cdn.example.com/feed.xml",
			},
		],
	});

	expect(xml).toContain("https://example.com/about");
	expect(xml).toContain("https://cdn.example.com/feed.xml");
	expect(xml).not.toContain("xhtml:link");
});

it("expands localized entries with alternates and x-default in prefix mode", async () => {
	const xml = await generateSitemap("https://example.com", {
		entries: [
			{
				path: "/about",
				locales: ["en", "fr"],
				localePaths: { fr: "/a-propos" },
			},
		],
		locales: {
			locales: ["en", "fr", "de"],
			defaultLocale: "en",
			mode: "prefix",
			xDefault: "fr",
		},
	});

	expect(xml).toContain("https://example.com/about");
	expect(xml).toContain("https://example.com/fr/a-propos");
	expect(xml).not.toContain("https://example.com/de/about");
	expect(xml).toContain(
		'<xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />',
	);
	expect(xml).toContain(
		'<xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/a-propos" />',
	);
	expect(xml).toContain(
		'<xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/fr/a-propos" />',
	);
});

it("supports subdomain and domain locale modes", async () => {
	const subdomainXml = await generateSitemap("https://example.com", {
		entries: [
			{
				path: "/about",
				locales: ["en", "fr"],
				localePaths: { fr: "/a-propos" },
			},
		],
		locales: {
			locales: ["en", "fr"],
			defaultLocale: "en",
			mode: "subdomain",
			domainByLocale: {
				en: "https://example.com",
				fr: "https://fr.example.com",
			},
			alternates: false,
		},
	});

	const domainXml = await generateSitemap("https://example.com", {
		entries: [
			{
				path: "/about",
				locales: ["en", "fr"],
				localePaths: { fr: "/a-propos" },
			},
		],
		locales: {
			locales: ["en", "fr"],
			defaultLocale: "en",
			mode: "domain",
			domainByLocale: {
				en: "https://example.com",
				fr: "https://example.fr",
			},
			alternates: false,
		},
	});

	expect(subdomainXml).toContain("https://example.com/about");
	expect(subdomainXml).toContain("https://fr.example.com/a-propos");
	expect(domainXml).toContain("https://example.com/about");
	expect(domainXml).toContain("https://example.fr/a-propos");
});

it("splits after locale expansion in the manifest", async () => {
	const manifest = createSitemapManifest({
		domain: "https://example.com",
		maxUrls: 1,
		locales: {
			locales: ["en", "fr"],
			defaultLocale: "en",
			mode: "prefix",
		},
		entries: [
			{
				path: "/about",
				locales: ["en", "fr"],
				localePaths: { fr: "/a-propos" },
			},
		],
	});

	const files = await manifest.getSitemapFiles();
	const rootXml = await manifest.getRootSitemap();
	const firstChild = await manifest.getSitemap({ index: 0 });
	const secondChild = await manifest.getSitemap({ index: 1 });

	expect(files.map((file) => file.path)).toEqual([
		"/sitemap-0.xml",
		"/sitemap-1.xml",
	]);
	expect(rootXml).toContain("<sitemapindex");
	expect(rootXml).toContain("https://example.com/sitemap-0.xml");
	expect(rootXml).toContain("https://example.com/sitemap-1.xml");
	expect(firstChild).toContain("https://example.com/about");
	expect(secondChild).toContain("https://example.com/fr/a-propos");
});
