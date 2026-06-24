import type { ImageInput } from "./utils/image";

export type SchemaAddress = {
	streetAddress?: string;
	addressLocality?: string;
	addressRegion?: string;
	postalCode?: string;
	addressCountry?: string;
};

export type SchemaGeo = {
	latitude?: number | string;
	longitude?: number | string;
};

export type SchemaAggregateRating = {
	ratingValue?: number | string;
	reviewCount?: number | string;
	bestRating?: number | string;
	worstRating?: number | string;
};

export type SchemaPerson = {
	"@id"?: string;
	name: string;
	url?: string;
	sameAs?: string[];
	jobTitle?: string;
	image?: ImageInput;
	affiliation?: SchemaOrganization[];
};

export type SchemaContactPoint = {
	contactType: string;
	telephone?: string;
	email?: string;
	url?: string;
	areaServed?: string[];
	availableLanguage?: string[];
};

export type SchemaOrganization = {
	"@id"?: string;
	name: string;
	url?: string;
	logo?: ImageInput;
	sameAs?: string[];
	department?: SchemaOrganization[];
	contactPoint?: SchemaContactPoint[];
};

export type SchemaFAQItem = {
	question: string;
	answer: string;
};

export type SchemaSearchAction = {
	target?: string;
	queryInput?: string;
};

export type SchemaLocation = {
	name?: string;
	url?: string;
	address?: SchemaAddress;
	geo?: SchemaGeo;
};

export type SchemaOffer = {
	"@type": "Offer";
	price?: number | string;
	priceCurrency?: string;
	availability?: string;
	url?: string;
};
