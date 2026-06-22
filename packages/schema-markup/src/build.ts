import type { Thing } from "schema-dts";

type SchemaNode = Record<string, unknown>;

export type SchemaSet = {
	schemaType?: string;
	schemaData: Thing | SchemaNode | undefined;
};

export type BuildSchemaMarkupInput =
	| SchemaSet[]
	| {
			nodes?: Array<Thing | SchemaNode | undefined>;
			schemaSets?: SchemaSet[];
	  };

const TYPE_PRIORITY = [
	"Organization",
	"Person",
	"LocalBusiness",
	"WebSite",
	"WebPage",
	"ProfilePage",
	"QAPage",
	"BreadcrumbList",
	"Article",
	"Course",
	"Dataset",
	"DiscussionForumPosting",
	"JobPosting",
	"Movie",
	"Product",
	"Recipe",
	"SoftwareApplication",
	"VacationRental",
	"VideoObject",
	"Event",
	"ItemList",
	"Question",
	"Answer",
	"Review",
	"Comment",
	"AggregateRating",
] as const;

const typeWeight = new Map<string, number>(
	TYPE_PRIORITY.map((type, index) => [type, index]),
);

const hasObjectShape = (value: unknown): value is SchemaNode => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

const hasType = (value: SchemaNode): value is SchemaNode & { "@type": string } => {
	return typeof value["@type"] === "string";
};

const hasId = (value: SchemaNode): value is SchemaNode & { "@id": string } => {
	return typeof value["@id"] === "string" && value["@id"].length > 0;
};

const ensureContext = (node: SchemaNode): SchemaNode => {
	if (hasType(node) && node["@context"] === undefined) {
		return {
			"@context": "https://schema.org",
			...node,
		};
	}

	return node;
};

const normalizeInput = (input: BuildSchemaMarkupInput): SchemaNode[] => {
	if (Array.isArray(input)) {
		return input.map((set) => set.schemaData).filter(Boolean) as SchemaNode[];
	}

	const fromSets = (input.schemaSets || []).map((set) => set.schemaData);
	const fromNodes = input.nodes || [];
	return [...fromSets, ...fromNodes].filter(Boolean) as SchemaNode[];
};

type RankedNode = {
	node: SchemaNode;
	order: number;
};

export const buildSchemaMarkup = (input: BuildSchemaMarkupInput): string[] => {
	const collected: RankedNode[] = [];
	const seenIds = new Set<string>();
	const processingIds = new Set<string>();
	let orderCounter = 0;

	const addNode = (node: SchemaNode) => {
		const normalized = ensureContext(node);
		if (hasId(normalized)) {
			if (seenIds.has(normalized["@id"])) return;
			seenIds.add(normalized["@id"]);
		}

		collected.push({
			node: normalized,
			order: orderCounter++,
		});
	};

	const processValue = (value: unknown, isRoot = false): unknown => {
		if (Array.isArray(value)) {
			return value.map((item) => processValue(item, false));
		}

		if (!hasObjectShape(value)) return value;

		if (!isRoot && hasType(value) && hasId(value)) {
			registerEntity(value);
			return { "@id": value["@id"] };
		}

		const output: SchemaNode = {};
		for (const [key, child] of Object.entries(value)) {
			output[key] = processValue(child, false);
		}
		return output;
	};

	const registerEntity = (entity: SchemaNode & { "@id": string }) => {
		const id = entity["@id"];
		if (seenIds.has(id) || processingIds.has(id)) return;

		processingIds.add(id);
		const processedEntity = processValue(entity, true);
		if (hasObjectShape(processedEntity)) {
			addNode(processedEntity);
		}
		processingIds.delete(id);
	};

	for (const node of normalizeInput(input)) {
		const processed = processValue(node, true);
		if (!hasObjectShape(processed)) continue;
		addNode(processed);
	}

	const ranked = collected.sort((a, b) => {
		const aType = hasType(a.node) ? a.node["@type"] : "";
		const bType = hasType(b.node) ? b.node["@type"] : "";
		const aWeight = typeWeight.get(aType) ?? Number.MAX_SAFE_INTEGER;
		const bWeight = typeWeight.get(bType) ?? Number.MAX_SAFE_INTEGER;

		if (aWeight !== bWeight) return aWeight - bWeight;
		return a.order - b.order;
	});

	return ranked.map(({ node }) => JSON.stringify(node));
};
