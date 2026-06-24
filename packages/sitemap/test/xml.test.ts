import { expect, it } from "bun:test";
import { generateSitemap } from "../src";
import { createSitemapXml } from "../src/xml";

it("emits full video sitemap tags including duration and publicationDate", () => {
	const xml = createSitemapXml([
		{
			url: "https://example.com/blog/hello-world",
			videos: [
				{
					title: "Hello World",
					description: "A short intro video",
					thumbnailUrl: "https://cdn.example.com/thumb.jpg",
					contentUrl: "https://cdn.example.com/video.mp4",
					duration: 183,
					publicationDate: "2025-06-01T12:00:00+00:00",
				},
			],
		},
	]);

	expect(xml).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
	expect(xml).toContain(
		"<video:thumbnail_loc>https://cdn.example.com/thumb.jpg</video:thumbnail_loc>",
	);
	expect(xml).toContain("<video:title>Hello World</video:title>");
	expect(xml).toContain(
		"<video:description>A short intro video</video:description>",
	);
	expect(xml).toContain(
		"<video:content_loc>https://cdn.example.com/video.mp4</video:content_loc>",
	);
	expect(xml).toContain("<video:duration>183</video:duration>");
	expect(xml).toContain(
		"<video:publication_date>2025-06-01T12:00:00+00:00</video:publication_date>",
	);
});

it("accepts playerUrl without contentUrl", () => {
	const xml = createSitemapXml([
		{
			url: "https://example.com/watch",
			videos: [
				{
					title: "Watch",
					description: "Embedded player",
					thumbnailUrl: "https://cdn.example.com/thumb.jpg",
					playerUrl: "https://www.youtube.com/embed/abc123",
				},
			],
		},
	]);

	expect(xml).toContain(
		"<video:player_loc>https://www.youtube.com/embed/abc123</video:player_loc>",
	);
	expect(xml).not.toContain("<video:content_loc>");
});

it("escapes special characters in video title and description", () => {
	const xml = createSitemapXml([
		{
			url: "https://example.com/watch",
			videos: [
				{
					title: "Tom & Jerry",
					description: 'Say "hello" & <goodbye>',
					thumbnailUrl: "https://cdn.example.com/thumb.jpg",
					contentUrl: "https://cdn.example.com/video.mp4",
				},
			],
		},
	]);

	expect(xml).toContain("<video:title>Tom &amp; Jerry</video:title>");
	expect(xml).toContain(
		"<video:description>Say &quot;hello&quot; &amp; &lt;goodbye&gt;</video:description>",
	);
});

it("throws when thumbnailUrl is missing", () => {
	expect(() =>
		createSitemapXml([
			{
				url: "https://example.com/watch",
				videos: [
					{
						title: "Watch",
						description: "Missing thumbnail",
						thumbnailUrl: "",
						contentUrl: "https://cdn.example.com/video.mp4",
					},
				],
			},
		]),
	).toThrow("must include a non-empty thumbnailUrl");
});

it("throws when both contentUrl and playerUrl are missing", () => {
	expect(() =>
		createSitemapXml([
			{
				url: "https://example.com/watch",
				videos: [
					{
						title: "Watch",
						description: "Missing URLs",
						thumbnailUrl: "https://cdn.example.com/thumb.jpg",
					},
				],
			},
		]),
	).toThrow("must include contentUrl or playerUrl");
});

it("throws when duration is not a positive integer", () => {
	expect(() =>
		createSitemapXml([
			{
				url: "https://example.com/watch",
				videos: [
					{
						title: "Watch",
						description: "Bad duration",
						thumbnailUrl: "https://cdn.example.com/thumb.jpg",
						contentUrl: "https://cdn.example.com/video.mp4",
						duration: 1.5,
					},
				],
			},
		]),
	).toThrow("duration must be a positive integer");
});

it("copies videos onto each localized URL", async () => {
	const xml = await generateSitemap("https://example.com", {
		entries: [
			{
				path: "/watch",
				locales: ["en", "fr"],
				videos: [
					{
						title: "Watch",
						description: "A video",
						thumbnailUrl: "https://cdn.example.com/thumb.jpg",
						contentUrl: "https://cdn.example.com/video.mp4",
					},
				],
			},
		],
		locales: {
			locales: ["en", "fr"],
			defaultLocale: "en",
			mode: "prefix",
		},
	});

	expect(xml.match(/<video:content_loc>/g)?.length).toBe(2);
});
