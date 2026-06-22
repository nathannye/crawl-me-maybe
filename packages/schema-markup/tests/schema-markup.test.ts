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
	test("builds identity/site/page graph and replaces nested mainEntity with @id reference", () => {
		const product = {
			"@type": "Product",
			"@id": "https://example.com/products/lemon-pie#product",
			name: "Lemon Pie",
		};

		const output = buildSchemaMarkup({
			identity: {
				type: "organization",
				name: "Example Org",
			},
			siteUrl: "https://example.com",
			siteName: "Example",
			pageUrl: "https://example.com/recipes/lemon-pie",
			pageTitle: "Lemon Pie",
			mainEntity: product,
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
		const organizationNode = nodes.find((node) => node["@type"] === "Organization");

		expect(webSiteNode.publisher).toEqual({
			"@id": organizationNode["@id"],
		});
		expect(webPageNode.mainEntity).toEqual({
			"@id": product["@id"],
		});
		expect(webPageNode.isPartOf).toEqual({
			"@id": webSiteNode["@id"],
		});
	});
});
