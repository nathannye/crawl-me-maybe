import { SitemapNotFoundError, SitemapPartNotFoundError } from "./errors";
import { resolveSitemapEntrySource } from "./resolve-entries";
import { expandLocalizedEntries } from "./localize";
import { createSitemapXml } from "./xml";
import { generateSitemapIndex } from "./sitemap";
import type {
	CreateSitemapManifestOptions,
	ResolvedSitemapFile,
	SitemapDefinition,
	SitemapFile,
	SitemapManifest,
	SitemapSelector,
	SitemapEntrySource,
} from "./types";

const DEFAULT_MAX_URLS = 50_000;
const DEFAULT_BASE_PATH = "/sitemap";

type NormalizedSitemapDefinition = {
	sitemap: string | null;
	entries: SitemapEntrySource;
	maxUrls: number;
};

type ResolvedSitemapPlan = {
	definition: NormalizedSitemapDefinition;
	files: ResolvedSitemapFile[];
};

function normalizeBasePath(basePath?: string): string {
	const resolved = basePath ?? DEFAULT_BASE_PATH;

	if (typeof resolved !== "string" || resolved.trim() === "") {
		throw new Error("createSitemapManifest: basePath must be a non-empty string");
	}

	const trimmed = resolved.trim().replace(/\/+$/, "");
	if (trimmed === "") {
		throw new Error("createSitemapManifest: basePath must be a non-empty string");
	}

	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

	if (withLeadingSlash.toLowerCase().endsWith(".xml")) {
		throw new Error("createSitemapManifest: basePath must not include .xml");
	}

	return withLeadingSlash;
}

function normalizeMaxUrls(maxUrls: number | undefined, fallback: number): number {
	const resolved = maxUrls ?? fallback;

	if (
		typeof resolved !== "number" ||
		!Number.isFinite(resolved) ||
		!Number.isInteger(resolved) ||
		resolved <= 0
	) {
		throw new Error("createSitemapManifest: maxUrls must be a positive integer");
	}

	return resolved;
}

function isSitemapDefinition(value: SitemapDefinition): value is {
	entries: SitemapEntrySource;
	maxUrls?: number;
} {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		"entries" in value
	);
}

function normalizeSitemapDefinitions(
	entries: CreateSitemapManifestOptions["entries"],
	defaultMaxUrls: number,
): NormalizedSitemapDefinition[] {
	if (Array.isArray(entries) || typeof entries === "function") {
		return [
			{
				sitemap: null,
				entries,
				maxUrls: defaultMaxUrls,
			},
		];
	}

	if (typeof entries !== "object" || entries === null) {
		throw new Error("createSitemapManifest: entries must be a sitemap source or a named sitemap map");
	}

	const definitions = Object.entries(entries).map(
		([sitemap, definition]): NormalizedSitemapDefinition => {
			if (!sitemap || sitemap.trim() === "") {
				throw new Error("createSitemapManifest: sitemap names must be non-empty strings");
			}

			if (Array.isArray(definition) || typeof definition === "function") {
				return {
					sitemap,
					entries: definition,
					maxUrls: defaultMaxUrls,
				};
			}

			if (!isSitemapDefinition(definition)) {
				throw new Error(
					`createSitemapManifest: sitemap definition for "${sitemap}" must be a source or an object with entries`,
				);
			}

			return {
				sitemap,
				entries: definition.entries,
				maxUrls: normalizeMaxUrls(definition.maxUrls, defaultMaxUrls),
			};
		},
	);

	if (definitions.length === 0) {
		throw new Error("createSitemapManifest: entries must include at least one sitemap");
	}

	return definitions;
}

function chunkEntries<T>(entries: T[], maxUrls: number): T[][] {
	if (entries.length === 0) return [[]];

	const chunks: T[][] = [];
	for (let index = 0; index < entries.length; index += maxUrls) {
		chunks.push(entries.slice(index, index + maxUrls));
	}

	return chunks;
}

function getChildSitemapPath(options: {
	basePath: string;
	sitemap: string | null;
	index: number;
}): string {
	const sitemapName =
		options.sitemap === null ? "" : `-${options.sitemap.replace(/^\/+/, "")}`;
	return `${options.basePath}${sitemapName}-${options.index}.xml`;
}

function validateSelectorIndex(index: number): void {
	if (
		typeof index !== "number" ||
		!Number.isFinite(index) ||
		!Number.isInteger(index) ||
		index < 0
	) {
		throw new SitemapPartNotFoundError({ index });
	}
}

export function createSitemapManifest(
	options: CreateSitemapManifestOptions,
): SitemapManifest {
	if (!options || typeof options !== "object") {
		throw new Error("createSitemapManifest: options is required");
	}

	if (!options.domain || typeof options.domain !== "string") {
		throw new Error("createSitemapManifest: domain must be a non-empty string");
	}

	const basePath = normalizeBasePath(options.basePath);
	const maxUrls = normalizeMaxUrls(options.maxUrls, DEFAULT_MAX_URLS);
	const definitions = normalizeSitemapDefinitions(options.entries, maxUrls);
	const { localization } = options;

	const definitionCache = new Map<number, Promise<ResolvedSitemapPlan>>();

	function resolveDefinition(index: number): Promise<ResolvedSitemapPlan> {
		const cached = definitionCache.get(index);
		if (cached) return cached;

		const definition = definitions[index];
		if (!definition) {
			throw new SitemapPartNotFoundError({ index });
		}

		const promise = (async () => {
			const entries = await resolveSitemapEntrySource(definition.entries);
			const concreteEntries = expandLocalizedEntries(
				entries,
				options.domain,
				localization,
			);
			const chunks = chunkEntries(concreteEntries, definition.maxUrls);
			const files: ResolvedSitemapFile[] = chunks.map((chunk, chunkIndex) => ({
				sitemap: definition.sitemap,
				index: chunkIndex,
				path: getChildSitemapPath({
					basePath,
					sitemap: definition.sitemap,
					index: chunkIndex,
				}),
				entries: chunk,
			}));

			return { definition, files };
		})();

		definitionCache.set(index, promise);
		return promise;
	}

	async function getAllFiles(): Promise<ResolvedSitemapFile[]> {
		const plans = await Promise.all(
			definitions.map(async (_definition, index) => resolveDefinition(index)),
		);
		return plans.flatMap((plan) => plan.files);
	}

	async function renderFileBySelector(selector: SitemapSelector): Promise<string> {
		validateSelectorIndex(selector.index);

		let definitionIndex = 0;

		if (selector.sitemap) {
			definitionIndex = definitions.findIndex(
				(definition) => definition.sitemap === selector.sitemap,
			);

			if (definitionIndex < 0) {
				throw new SitemapNotFoundError(selector.sitemap);
			}
		} else if (definitions.length > 1) {
			throw new Error(
				"createSitemapManifest: sitemap is required when multiple sitemap definitions are configured",
			);
		}

		const plan = await resolveDefinition(definitionIndex);
		const file = plan.files[selector.index];
		if (!file) {
			throw new SitemapPartNotFoundError({
				sitemap: plan.definition.sitemap ?? undefined,
				index: selector.index,
			});
		}

		return createSitemapXml(file.entries);
	}

	return {
		async getRootSitemap() {
			const files = await getAllFiles();
			if (files.length === 1) {
				return createSitemapXml(files[0].entries);
			}

			return generateSitemapIndex(options.domain, {
				sitemaps: files.map((file) => file.path),
			});
		},
		async getSitemap(selector: SitemapSelector) {
			return renderFileBySelector(selector);
		},
		async getSitemapFiles(): Promise<SitemapFile[]> {
			const files = await getAllFiles();
			return files.map(({ sitemap, index, path }) => ({ sitemap, index, path }));
		},
	};
}
