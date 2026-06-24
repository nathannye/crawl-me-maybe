import type { BreadcrumbList, ListItem, WithContext } from "schema-dts";
import { slugToTitle } from "./internal/slug-to-title";

export type BreadcrumbItemInput = {
	title: string;
	url: string;
};

export type BuildBreadcrumbListSchemaInput = {
	pagePath: string;
	pageTitle: string;
	items?: BreadcrumbItemInput[];
};

function normalizePath(path: string): string {
	if (!path) return "/";
	const withoutHash = path.split("#")[0];
	const withoutQuery = withoutHash.split("?")[0];
	const prefixed = withoutQuery.startsWith("/")
		? withoutQuery
		: `/${withoutQuery}`;
	return prefixed.replace(/\/+$/, "") || "/";
}

function createDerivedParentItems(pagePath: string): BreadcrumbItemInput[] {
	const normalized = normalizePath(pagePath);
	const segments = normalized.split("/").filter(Boolean);

	if (segments.length <= 1) return [];

	return segments.slice(0, -1).map((segment, index) => ({
		title: slugToTitle(segment),
		url: `/${segments.slice(0, index + 1).join("/")}`,
	}));
}

function toListItems(items: BreadcrumbItemInput[]): ListItem[] {
	return items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.title,
		item: item.url,
	}));
}

export function buildBreadcrumbListSchema({
	pagePath,
	pageTitle,
	items,
}: BuildBreadcrumbListSchemaInput): WithContext<BreadcrumbList> {
	const parentItems = items?.length
		? items
		: createDerivedParentItems(pagePath);
	const finalItems = [
		...parentItems,
		{
			title: pageTitle,
			url: normalizePath(pagePath),
		},
	];

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: toListItems(finalItems),
	};
}
