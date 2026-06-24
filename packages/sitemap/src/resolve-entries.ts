import { SitemapNotFoundError } from "./errors";
import type { GenerateSitemapOptions, SitemapEntry } from "./types";

type SitemapEntrySource =
	| SitemapEntry[]
	| (() => SitemapEntry[] | Promise<SitemapEntry[]>);

function isNamedSitemapEntrySources(
	entries: GenerateSitemapOptions["entries"],
): entries is Record<string, SitemapEntrySource> {
	return typeof entries === "object" && entries !== null && !Array.isArray(entries);
}

async function resolveEntrySource(
	source: SitemapEntrySource,
): Promise<SitemapEntry[]> {
	const resolved = typeof source === "function" ? await source() : source;

	if (!Array.isArray(resolved)) {
		throw new Error("Sitemap entry source must resolve to an array of entries");
	}

	return resolved;
}

export async function resolveSitemapEntries(
	options: GenerateSitemapOptions,
): Promise<SitemapEntry[]> {
	const { entries } = options;

	if (Array.isArray(entries) || typeof entries === "function") {
		return resolveEntrySource(entries);
	}

	if (!isNamedSitemapEntrySources(entries)) {
		throw new Error("Invalid sitemap entry source");
	}

	if (!("sitemap" in options) || !options.sitemap) {
		throw new Error(
			"generateSitemap: `sitemap` is required when `entries` is a named object",
		);
	}

	const source = entries[options.sitemap];
	if (source === undefined) {
		throw new SitemapNotFoundError(options.sitemap);
	}

	return resolveEntrySource(source);
}
