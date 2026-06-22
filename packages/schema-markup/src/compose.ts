// schema/compose.ts

import type { MergedMetadata } from "@crawl-me-maybe/meta";
import type {
	AboutPage,
	Article,
	ContactPage,
	Event,
	FAQPage,
	Offer,
	Product,
	Thing,
	WebPage,
	WebSite,
} from "schema-dts";
import {
	buildAboutPage,
	buildArticle,
	buildContactPage,
	buildEvent,
	buildFAQPage,
	buildOrganization,
	buildProduct,
	buildWebPage,
	buildWebSite,
} from "./builders";
import type { BuilderInput } from "./define-builder";
import { coalesce } from "./schema-utils";
import type {
	SchemaAddress,
	SchemaAggregateRating,
	SchemaGeo,
	SchemaImage,
	SchemaLocation,
	SchemaOrganization,
	SchemaPerson,
	SchemaFAQItem,
	SchemaSearchAction,
} from "./types";
import { createSchemaImageObject } from "./utils/image";
import {
	buildOrgSchema,
	buildPersonOrOrg,
	formatSchemaDate,
} from "./builders/utils";

export type SchemaDefaults = {
	sameAs?: string[];
	logo?: SchemaImage; // Global logo fallback
	organization?: SchemaOrganization;
	publisher?: SchemaOrganization;
	imageFallback?: SchemaImage;
	webSite?: {
		name?: string;
		publisher?: SchemaOrganization;
		searchAction?: SchemaSearchAction;
	};
	webPage?: {
		inLanguage?: string;
		primaryImageOfPage?: SchemaImage;
	};
	article?: {
		publisher?: SchemaOrganization;
		section?: string;
	};
	product?: {
		brand?: SchemaOrganization;
		priceCurrency?: string;
		availability?: string;
	};
	event?: {
		eventAttendanceMode?: string;
		organizer?: SchemaOrganization | SchemaPerson;
	};
	localBusiness?: {
		priceRange?: string;
		address?: SchemaAddress;
		geo?: SchemaGeo;
		aggregateRating?: SchemaAggregateRating;
	};
	rendering?: {
		multiLocaleStrategy?: string;
	};
};

/**
 * Composes the complete schema markup for a page
 * Returns an array of schema objects to be rendered as JSON-LD
 *
 * Entities with @id (Person, Organization) are output as full schemas first,
 * then referenced by @id in other schemas for cleaner markup.
 */

interface ComposeSchemaProps {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	type?: string;
	extra?: Record<string, unknown>;
	isHomepage?: boolean;
}

export function composeSchema({
	seo,
	schemaDefaults,
	type = "WebPage",
	extra,
	isHomepage = false,
}: ComposeSchemaProps): Thing[] {
	const schemas: Thing[] = [];
	const entities = new Set<string>(); // Track entities we've already added
	const extraData = extra ?? {};

	// Extract base URL from seo data
	const baseUrl = seo.canonicalUrl || "";

	// Helper to add entity schemas (Person, Organization) with @id
	const addEntity = (entity: unknown, buildFn: (e: unknown) => unknown) => {
		if (!entity) return;
		const schema = buildFn(entity) as Record<string, unknown>;
		if (schema?.["@id"] && !entities.has(schema["@id"] as string)) {
			entities.add(schema["@id"] as string);
			schemas.push(schema as unknown as Thing);
		}
	};

	// Helper to recursively add organization and all its departments
	const addOrgWithDepartments = (org: SchemaOrganization) => {
		// Apply global logo fallback if organization doesn't have a logo
		const orgWithDefaults = {
			...org,
			logo: org.logo || schemaDefaults?.logo,
			sameAs: org.sameAs || schemaDefaults?.sameAs,
		};

		// Add the organization itself
		addEntity(orgWithDefaults, (o) =>
			buildOrganization(o as SchemaOrganization, baseUrl),
		);

		// Recursively add all departments
		if (org.department && Array.isArray(org.department)) {
			for (const dept of org.department) {
				addOrgWithDepartments(dept);
			}
		}
	};

	// Add Organization entities first (can be referenced by others)
	if (schemaDefaults?.organization) {
		addOrgWithDepartments(schemaDefaults.organization);
	}

	if (
		schemaDefaults?.publisher &&
		schemaDefaults.publisher !== schemaDefaults.organization
	) {
		addOrgWithDepartments(schemaDefaults.publisher);
	}

	// Add Person entities from extra data (e.g., authors, contributors)
	if (extraData.author && Array.isArray(extraData.author)) {
		for (const author of extraData.author) {
			if (author && typeof author === "object" && "name" in author) {
				addEntity(author, (person) =>
					buildPersonOrOrg(
						person as SchemaPerson | SchemaOrganization,
						false,
						baseUrl,
					),
				);
			}
		}
	}

	if (extraData.contributor && Array.isArray(extraData.contributor)) {
		for (const contributor of extraData.contributor) {
			if (
				contributor &&
				typeof contributor === "object" &&
				"name" in contributor
			) {
				addEntity(contributor, (person) =>
					buildPersonOrOrg(
						person as SchemaPerson | SchemaOrganization,
						false,
						baseUrl,
					),
				);
			}
		}
	}

	if (extraData.organizer && Array.isArray(extraData.organizer)) {
		for (const organizer of extraData.organizer) {
			if (organizer && typeof organizer === "object" && "name" in organizer) {
				// Apply logo fallback for organizations
				const entityWithDefaults =
					"jobTitle" in organizer
						? organizer
						: { ...organizer, logo: organizer.logo || schemaDefaults?.logo };
				addEntity(entityWithDefaults, (entity) =>
					buildPersonOrOrg(
						entity as SchemaPerson | SchemaOrganization,
						false,
						baseUrl,
					),
				);
			}
		}
	}

	if (extraData.performer && Array.isArray(extraData.performer)) {
		for (const performer of extraData.performer) {
			if (performer && typeof performer === "object" && "name" in performer) {
				// Apply logo fallback for organizations
				const entityWithDefaults =
					"jobTitle" in performer
						? performer
						: { ...performer, logo: performer.logo || schemaDefaults?.logo };
				addEntity(entityWithDefaults, (entity) =>
					buildPersonOrOrg(
						entity as SchemaPerson | SchemaOrganization,
						false,
						baseUrl,
					),
				);
			}
		}
	}

	// Add brand from product schema (including its departments)
	if (
		extraData.brand &&
		typeof extraData.brand === "object" &&
		"name" in extraData.brand
	) {
		addOrgWithDepartments(extraData.brand as SchemaOrganization);
	}

	// Always include WebSite if defaults provided, or automatically generate for homepage
	if (schemaDefaults?.webSite || isHomepage) {
		const websitePublisher = coalesce(
			schemaDefaults?.webSite?.publisher,
			schemaDefaults?.publisher,
			schemaDefaults?.organization,
		);

		const websiteInput: BuilderInput<WebSite> = {
			"@id": seo.canonicalUrl ? `${seo.canonicalUrl}#website` : undefined,
			name: seo.siteTitle,
			url: seo.canonicalUrl,
			publisher: buildOrgSchema(websitePublisher, true, baseUrl) as BuilderInput<WebSite>["publisher"],
			inLanguage: schemaDefaults?.webPage?.inLanguage,
			potentialAction: schemaDefaults?.webSite?.searchAction?.target
				? ({
						"@type": "SearchAction",
						target: {
							"@type": "EntryPoint",
							urlTemplate: schemaDefaults.webSite.searchAction.target,
						},
						"query-input":
							schemaDefaults.webSite.searchAction.queryInput ||
							"required name=search_term_string",
					} as BuilderInput<WebSite>["potentialAction"])
				: undefined,
		};

		schemas.push(
			buildWebSite(websiteInput) as unknown as Thing,
		);
	}

	switch (type) {
		case "Article": {
			const authors = Array.isArray(extraData.author)
				? (extraData.author as Array<SchemaPerson | SchemaOrganization>)
				: undefined;
			const authorSchema = authors?.length
				? authors
						.map((author) => buildPersonOrOrg(author, true, baseUrl))
						.filter(Boolean)
				: undefined;
			const publisher = coalesce(
				extraData.publisher as SchemaOrganization | undefined,
				schemaDefaults?.article?.publisher,
				schemaDefaults?.publisher,
				schemaDefaults?.organization,
			);

			const input: BuilderInput<Article> = {
				headline: coalesce(
					extraData.headline as string | undefined,
					extraData.title as string | undefined,
					seo.title,
				),
				description: coalesce(
					extraData.description as string | undefined,
					seo.description,
				),
				image: createSchemaImageObject(
					coalesce(
						extraData.image as SchemaImage | undefined,
						seo.metaImage,
					),
					schemaDefaults?.imageFallback,
				),
				datePublished: formatSchemaDate(
					coalesce(
						extraData.datePublished as string | Date | undefined,
						extraData._createdAt as string | Date | undefined,
					),
				) as BuilderInput<Article>["datePublished"],
				dateModified: formatSchemaDate(
					coalesce(
						extraData.dateModified as string | Date | undefined,
						extraData._updatedAt as string | Date | undefined,
					),
				) as BuilderInput<Article>["dateModified"],
				author: authorSchema as BuilderInput<Article>["author"],
				publisher: buildOrgSchema(
					publisher,
					true,
					baseUrl,
				) as BuilderInput<Article>["publisher"],
				mainEntityOfPage: coalesce(
					seo.canonicalUrl,
					extraData.mainEntityOfPage as string | undefined,
				),
				articleSection: coalesce(
					extraData.articleSection as string | undefined,
					schemaDefaults?.article?.section,
				),
				url: coalesce(
					seo.canonicalUrl,
					extraData.url as string | undefined,
				),
				isPartOf: seo.canonicalUrl
					? {
							"@type": "WebSite",
							"@id": `${seo.canonicalUrl}#website`,
						}
					: undefined,
			};

			schemas.push(buildArticle(input) as unknown as Thing);
			break;
		}
		case "Product": {
			const brand = coalesce(
				extraData.brand as SchemaOrganization | undefined,
				schemaDefaults?.product?.brand,
			);
			const fallbackOffer = extraData.price
				? ({
						"@type": "Offer",
						price: extraData.price as number | string,
						priceCurrency:
							(extraData.priceCurrency as string | undefined) ||
							schemaDefaults?.product?.priceCurrency ||
							"USD",
						availability: `https://schema.org/${(extraData.availability as string | undefined) || schemaDefaults?.product?.availability || "InStock"}` as Offer["availability"],
						url: seo.canonicalUrl,
					} as BuilderInput<Product>["offers"])
				: undefined;

			const input: BuilderInput<Product> = {
				name: coalesce(
					extraData.name as string | undefined,
					extraData.title as string | undefined,
					seo.title,
				),
				description: coalesce(
					extraData.description as string | undefined,
					seo.description,
				),
				image: createSchemaImageObject(
					coalesce(
						extraData.image as SchemaImage | undefined,
						seo.metaImage,
					),
					schemaDefaults?.imageFallback,
				),
				brand: brand
					? (buildOrgSchema(brand, true, baseUrl) as BuilderInput<Product>["brand"])
					: undefined,
				sku: extraData.sku as string | undefined,
				mpn: extraData.mpn as string | undefined,
				gtin: extraData.gtin as string | undefined,
				offers: (extraData.offers as BuilderInput<Product>["offers"]) || fallbackOffer,
				aggregateRating: extraData.aggregateRating as BuilderInput<Product>["aggregateRating"],
				review: extraData.review as BuilderInput<Product>["review"],
				url: seo.canonicalUrl,
			};

			schemas.push(buildProduct(input) as unknown as Thing);
			break;
		}
		case "Event": {
			const locationData = extraData.location as SchemaLocation | undefined;
			const organizer = coalesce(
				extraData.organizer as
					| SchemaOrganization
					| SchemaPerson
					| Array<SchemaPerson | SchemaOrganization>
					| undefined,
				schemaDefaults?.event?.organizer,
				schemaDefaults?.organization,
			);
			const organizerSchema = Array.isArray(organizer)
				? organizer
						.map((org) => buildPersonOrOrg(org, true, baseUrl))
						.filter(Boolean)
				: organizer
					? buildPersonOrOrg(organizer, true, baseUrl)
					: undefined;
			const performer = Array.isArray(extraData.performer)
				? (extraData.performer as Array<SchemaPerson | SchemaOrganization>)
						.map((perf) => buildPersonOrOrg(perf, true, baseUrl))
						.filter(Boolean)
				: undefined;

			const input: BuilderInput<Event> = {
				name: coalesce(
					extraData.name as string | undefined,
					extraData.title as string | undefined,
					seo.title,
				),
				description: coalesce(
					extraData.description as string | undefined,
					seo.description,
				),
				image: createSchemaImageObject(
					coalesce(
						extraData.image as SchemaImage | undefined,
						seo.metaImage,
					),
					schemaDefaults?.imageFallback,
				),
				startDate: formatSchemaDate(
					extraData.startDate as string | Date | undefined,
				) as BuilderInput<Event>["startDate"],
				endDate: formatSchemaDate(
					extraData.endDate as string | Date | undefined,
				) as BuilderInput<Event>["endDate"],
				eventStatus: extraData.eventStatus
					? (`https://schema.org/${extraData.eventStatus as string}` as BuilderInput<Event>["eventStatus"])
					: undefined,
				eventAttendanceMode: coalesce(
					extraData.eventAttendanceMode as string | undefined,
					schemaDefaults?.event?.eventAttendanceMode,
				)
					? (`https://schema.org/${((extraData.eventAttendanceMode as string | undefined) || schemaDefaults?.event?.eventAttendanceMode || "")}` as BuilderInput<Event>["eventAttendanceMode"])
					: undefined,
				location: locationData
					? ({
							"@type": locationData.url ? "VirtualLocation" : "Place",
							name: locationData.name,
							url: locationData.url,
							address: locationData.address,
							geo: locationData.geo
								? {
										"@type": "GeoCoordinates",
										latitude: locationData.geo.latitude,
										longitude: locationData.geo.longitude,
									}
								: undefined,
						} as BuilderInput<Event>["location"])
					: undefined,
				organizer: organizerSchema as BuilderInput<Event>["organizer"],
				performer: performer as BuilderInput<Event>["performer"],
				offers: extraData.offers as BuilderInput<Event>["offers"],
				url: seo.canonicalUrl,
			};

			schemas.push(buildEvent(input) as unknown as Thing);
			break;
		}
		case "FAQPage": {
			const mainEntity = Array.isArray(extraData.mainEntity)
				? (extraData.mainEntity as SchemaFAQItem[]).map((item) => ({
						"@type": "Question",
						name: item.question,
						acceptedAnswer: {
							"@type": "Answer",
							text: item.answer,
						},
					}))
				: [];

			const input: BuilderInput<FAQPage> = {
				name: coalesce(
					extraData.name as string | undefined,
					extraData.title as string | undefined,
					seo.title,
				),
				description: coalesce(
					extraData.description as string | undefined,
					seo.description,
				),
				mainEntity: mainEntity as BuilderInput<FAQPage>["mainEntity"],
				url: seo.canonicalUrl,
				isPartOf: seo.canonicalUrl
					? {
							"@type": "WebSite",
							"@id": `${seo.canonicalUrl}#website`,
						}
					: undefined,
			};

			schemas.push(buildFAQPage(input) as unknown as Thing);
			break;
		}
		case "AboutPage": {
			const input: BuilderInput<AboutPage> = {
				name: coalesce(
					extraData.name as string | undefined,
					extraData.title as string | undefined,
					seo.title,
				),
				description: coalesce(
					extraData.description as string | undefined,
					seo.description,
				),
				url: coalesce(
					seo.canonicalUrl,
					extraData.url as string | undefined,
				),
				image: createSchemaImageObject(
					coalesce(
						extraData.image as SchemaImage | undefined,
						seo.metaImage,
					),
					schemaDefaults?.imageFallback,
				),
				inLanguage: coalesce(
					extraData.inLanguage as string | undefined,
					schemaDefaults?.webPage?.inLanguage,
				),
				datePublished: coalesce(
					extraData.datePublished as string | undefined,
					extraData._createdAt as string | undefined,
				),
				dateModified: coalesce(
					extraData.dateModified as string | undefined,
					extraData._updatedAt as string | undefined,
				),
				about: extraData.about as BuilderInput<AboutPage>["about"],
				isPartOf: seo.canonicalUrl
					? {
							"@type": "WebSite",
							"@id": `${seo.canonicalUrl}#website`,
						}
					: undefined,
			};

			schemas.push(buildAboutPage(input) as unknown as Thing);
			break;
		}
		case "ContactPage": {
			const input: BuilderInput<ContactPage> = {
				name: coalesce(
					extraData.name as string | undefined,
					extraData.title as string | undefined,
					seo.title,
				),
				description: coalesce(
					extraData.description as string | undefined,
					seo.description,
				),
				url: coalesce(
					seo.canonicalUrl,
					extraData.url as string | undefined,
				),
				image: createSchemaImageObject(
					coalesce(
						extraData.image as SchemaImage | undefined,
						seo.metaImage,
					),
					schemaDefaults?.imageFallback,
				),
				inLanguage: coalesce(
					extraData.inLanguage as string | undefined,
					schemaDefaults?.webPage?.inLanguage,
				),
				datePublished: coalesce(
					extraData.datePublished as string | undefined,
					extraData._createdAt as string | undefined,
				),
				dateModified: coalesce(
					extraData.dateModified as string | undefined,
					extraData._updatedAt as string | undefined,
				),
				isPartOf: seo.canonicalUrl
					? {
							"@type": "WebSite",
							"@id": `${seo.canonicalUrl}#website`,
						}
					: undefined,
			};

			schemas.push(buildContactPage(input) as unknown as Thing);
			break;
		}
		case "WebPage":
		default: {
			const input: BuilderInput<WebPage> = {
				name: coalesce(
					extraData.name as string | undefined,
					extraData.title as string | undefined,
					seo.title,
				),
				description: coalesce(
					extraData.description as string | undefined,
					seo.description,
				),
				url: coalesce(
					seo.canonicalUrl,
					extraData.url as string | undefined,
				),
				image: createSchemaImageObject(
					coalesce(
						extraData.image as SchemaImage | undefined,
						seo.metaImage,
					),
					schemaDefaults?.imageFallback,
				),
				inLanguage: coalesce(
					extraData.inLanguage as string | undefined,
					schemaDefaults?.webPage?.inLanguage,
				),
				datePublished: coalesce(
					extraData.datePublished as string | undefined,
					extraData._createdAt as string | undefined,
				),
				dateModified: coalesce(
					extraData.dateModified as string | undefined,
					extraData._updatedAt as string | undefined,
				),
				about: extraData.about as BuilderInput<WebPage>["about"],
				isPartOf: seo.canonicalUrl
					? {
							"@type": "WebSite",
							"@id": `${seo.canonicalUrl}#website`,
						}
					: undefined,
			};

			schemas.push(buildWebPage(input) as unknown as Thing);
		}
	}

	return schemas.filter(Boolean) as Thing[];
}
