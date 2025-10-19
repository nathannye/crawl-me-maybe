/**
 * Example usage of @crawl-me-maybe/web
 * This file demonstrates how to use the package in your application
 */

import {
	buildSeoPayload,
	configureSanityImages,
	composeSchema,
	createMetaTitle,
	type SeoDefaults,
	type SchemaDefaults,
	type PageMetadata,
} from "./src";

// 1. Configure Sanity images (required if using Sanity assets)
configureSanityImages({
	projectId: "your-project-id",
	dataset: "production",
});

// 2. Define your global SEO defaults
const seoDefaults: SeoDefaults = {
	siteTitle: "Awesome Company",
	pageTitleTemplate: "{pageTitle} | {siteTitle}",
	metaDescription:
		"Welcome to Awesome Company - providing awesome solutions since 2020",
	siteUrl: "https://awesome.com",
	twitterHandle: "@awesome",
};

// 3. Define your schema markup defaults
const schemaDefaults: SchemaDefaults = {
	organization: {
		"@id": "#organization",
		name: "Awesome Company",
		url: "https://awesome.com",
		sameAs: [
			"https://twitter.com/awesome",
			"https://linkedin.com/company/awesome",
		],
	},
	publisher: {
		"@id": "#organization",
		name: "Awesome Company",
		url: "https://awesome.com",
	},
	autoMap: {
		title: true,
		description: true,
		image: true,
		dates: true,
	},
};

// 4. Build SEO payload for a page
const pageData: PageMetadata = {
	title: "About Us",
	metadata: {
		description: "Learn more about our company and mission",
		canonicalUrl: "https://awesome.com/about",
		searchVisibility: {
			noIndex: false,
			noFollow: false,
		},
	},
};

const seoPayload = buildSeoPayload({
	globalDefaults: seoDefaults,
	schemaDefaults,
	pageSeo: pageData,
	pageSchemaType: "AboutPage",
	isHomepage: false,
});

console.log("Generated SEO Metadata:", seoPayload.meta);
console.log("Generated Schema Markup:", seoPayload.schemas);

// 5. Create a custom meta title
const customTitle = createMetaTitle(
	"Our Services",
	"Awesome Company",
	"{pageTitle} - {siteTitle}",
);
console.log("Custom Title:", customTitle);

// 6. Compose schema for an article
const articleSchemas = composeSchema({
	seo: {
		title: "10 Tips for Better SEO",
		description: "Learn how to improve your website's search rankings",
		canonicalUrl: "https://awesome.com/blog/seo-tips",
	},
	schemaDefaults,
	type: "Article",
	extra: {
		author: [
			{
				name: "John Doe",
				url: "https://awesome.com/authors/john-doe",
				jobTitle: "SEO Specialist",
			},
		],
		datePublished: "2025-01-15",
		dateModified: "2025-01-16",
	},
});

console.log("Article Schema:", JSON.stringify(articleSchemas, null, 2));

// 7. Compose schema for a product
const productSchemas = composeSchema({
	seo: {
		title: "Amazing Widget Pro",
		description: "The best widget on the market",
		canonicalUrl: "https://awesome.com/products/widget-pro",
	},
	schemaDefaults,
	type: "Product",
	extra: {
		brand: schemaDefaults.organization,
		offers: {
			"@type": "Offer",
			price: 99.99,
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
			url: "https://awesome.com/products/widget-pro",
		},
		aggregateRating: {
			ratingValue: 4.8,
			reviewCount: 127,
		},
	},
});

console.log("Product Schema:", JSON.stringify(productSchemas, null, 2));

// 8. Compose schema for an event
const eventSchemas = composeSchema({
	seo: {
		title: "Tech Conference 2025",
		description: "Join us for the biggest tech conference of the year",
		canonicalUrl: "https://awesome.com/events/tech-conf-2025",
	},
	schemaDefaults,
	type: "Event",
	extra: {
		startDate: "2025-06-15T09:00:00Z",
		endDate: "2025-06-17T18:00:00Z",
		location: {
			name: "Convention Center",
			address: {
				streetAddress: "123 Main St",
				addressLocality: "San Francisco",
				addressRegion: "CA",
				postalCode: "94102",
				addressCountry: "US",
			},
		},
		organizer: [schemaDefaults.organization],
	},
});

console.log("Event Schema:", JSON.stringify(eventSchemas, null, 2));
