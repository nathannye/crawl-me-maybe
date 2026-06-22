import type {
	BreadcrumbList,
	OpeningHoursSpecification,
	PostalAddress,
	Thing,
	WithContext,
} from "schema-dts";
import { createSchemaId } from "./builders/fragments";

type SchemaNode = Record<string, unknown>;

export type BuildSchemaMarkupInput = {
	identity: Identity;
	siteUrl: string;
	siteName: string;
	siteDescription?: string;
	pageUrl: string;
	pageTitle: string;
	pageDescription?: string;
	breadcrumb?: WithContext<BreadcrumbList>;
	mainEntity?: Thing | SchemaNode;
};

export type PersonIdentity = {
	type: "person";
	name: string;
	description?: string;
	image?: string;
	sameAs?: string[];
};

export type OrganizationIdentity = {
	type: "organization";
	name: string;
	description?: string;
	logo?: string;
	sameAs?: string[];
};

export type LocalBusinessIdentity = {
	type: "localBusiness";
	name: string;
	description?: string;
	logo?: string;
	phone?: string;
	email?: string;
	address?: PostalAddress;
	openingHours?: OpeningHoursSpecification[];
	sameAs?: string[];
};

export type Identity =
	| PersonIdentity
	| OrganizationIdentity
	| LocalBusinessIdentity;

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

type RankedNode = {
	node: SchemaNode;
	order: number;
};

const assembleNodes = (nodes: Array<Thing | SchemaNode | undefined>): string[] => {
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

	for (const node of nodes) {
		if (!node) continue;
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

const buildIdentityNodes = (
	identity: Identity,
	siteUrl: string,
): { node: SchemaNode; ref: { "@id": string } } => {
	switch (identity.type) {
		case "person": {
			const id = createSchemaId({
				kind: "person",
				name: identity.name,
				baseUrl: siteUrl,
			});
			return {
				node: {
					"@type": "Person",
					"@id": id,
					name: identity.name,
					description: identity.description,
					image: identity.image,
					sameAs: identity.sameAs,
					url: siteUrl,
				},
				ref: { "@id": id },
			};
		}
		case "organization": {
			const id = createSchemaId({
				kind: "organization",
				name: identity.name,
				baseUrl: siteUrl,
			});
			return {
				node: {
					"@type": "Organization",
					"@id": id,
					name: identity.name,
					description: identity.description,
					logo: identity.logo,
					sameAs: identity.sameAs,
					url: siteUrl,
				},
				ref: { "@id": id },
			};
		}
		case "localBusiness": {
			const id = createSchemaId({
				kind: "local-business",
				name: identity.name,
				baseUrl: siteUrl,
			});
			return {
				node: {
					"@type": "LocalBusiness",
					"@id": id,
					name: identity.name,
					description: identity.description,
					logo: identity.logo,
					telephone: identity.phone,
					email: identity.email,
					address: identity.address,
					openingHoursSpecification: identity.openingHours,
					sameAs: identity.sameAs,
					url: siteUrl,
				},
				ref: { "@id": id },
			};
		}
	}
};

export const buildSchemaMarkup = (input: BuildSchemaMarkupInput): string[] => {
	const { node: identityNode, ref: identityRef } = buildIdentityNodes(
		input.identity,
		input.siteUrl,
	);
	const websiteId = `${input.siteUrl}#website`;

	const websiteNode: SchemaNode = {
		"@type": "WebSite",
		"@id": websiteId,
		name: input.siteName,
		url: input.siteUrl,
		description: input.siteDescription,
		publisher: identityRef,
	};

	const webpageNode: SchemaNode = {
		"@type": "WebPage",
		"@id": `${input.pageUrl}#webpage`,
		url: input.pageUrl,
		name: input.pageTitle,
		description: input.pageDescription,
		isPartOf: { "@id": websiteId },
		breadcrumb: input.breadcrumb,
		mainEntity: input.mainEntity,
	};

	return assembleNodes([identityNode, websiteNode, webpageNode]);
};
