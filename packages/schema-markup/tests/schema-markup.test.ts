import { describe, expect, test } from "bun:test";
import {
	buildBreadcrumbListSchema,
	buildSchemaMarkup,
} from "../src";

describe("buildBreadcrumbListSchema", () => {
	test("derives parent crumbs from pageUrl and appends current page", () => {
		const breadcrumb = buildBreadcrumbListSchema({
			pageUrl: "/recipes/lemon-pie",
			pageTitle: "Lemon Pie",
		});

		expect(breadcrumb["@type"]).toBe("BreadcrumbList");
		expect(breadcrumb.itemListElement).toHaveLength(2);

		expect(breadcrumb.itemListElement?.[0]).toMatchObject({
			"@type": "ListItem",
			position: 1,
			name: "Recipes",
			item: "/recipes",
		});

		expect(breadcrumb.itemListElement?.[1]).toMatchObject({
			"@type": "ListItem",
			position: 2,
			name: "Lemon Pie",
			item: "/recipes/lemon-pie",
		});
	});

	test("uses provided items and still appends current page", () => {
		const breadcrumb = buildBreadcrumbListSchema({
			pageUrl: "/recipes/lemon-pie",
			pageTitle: "Lemon Pie",
			items: [
				{
					title: "Recipes",
					url: "/recipes",
				},
			],
		});

		expect(breadcrumb.itemListElement).toHaveLength(2);
		expect(breadcrumb.itemListElement?.[0]).toMatchObject({
			position: 1,
			name: "Recipes",
			item: "/recipes",
		});
		expect(breadcrumb.itemListElement?.[1]).toMatchObject({
			position: 2,
			name: "Lemon Pie",
			item: "/recipes/lemon-pie",
		});
	});
});

describe("buildSchemaMarkup", () => {
	test("stringifies nodes and replaces nested entity objects with @id references", () => {
		const organization = {
			"@type": "Organization",
			"@id": "https://example.com#organization-main",
			name: "Example Org",
		};

		const product = {
			"@type": "Product",
			"@id": "https://example.com/products/lemon-pie#product",
			name: "Lemon Pie",
		};

		const website = {
			"@type": "WebSite",
			"@id": "https://example.com#website",
			name: "Example",
			publisher: organization,
		};

		const webpage = {
			"@type": "WebPage",
			"@id": "https://example.com/recipes/lemon-pie#webpage",
			url: "https://example.com/recipes/lemon-pie",
			isPartOf: website,
			mainEntity: product,
		};

		const output = buildSchemaMarkup({
			nodes: [webpage],
		});

		expect(output.length).toBe(4);
		const nodes = output.map((entry) => JSON.parse(entry));

		expect(nodes.map((node) => node["@type"])).toEqual([
			"Organization",
			"WebSite",
			"WebPage",
			"Product",
		]);

		const webSiteNode = nodes.find((node) => node["@type"] === "WebSite");
		const webPageNode = nodes.find((node) => node["@type"] === "WebPage");

		expect(webSiteNode.publisher).toEqual({
			"@id": organization["@id"],
		});
		expect(webPageNode.mainEntity).toEqual({
			"@id": product["@id"],
		});
		expect(webPageNode.isPartOf).toEqual({
			"@id": website["@id"],
		});
	});
});
