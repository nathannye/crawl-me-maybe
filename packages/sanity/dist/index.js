var sanity = require("sanity");
var md = require("react-icons/md");
var ui = require("@sanity/ui");
var react = require("react");
var jsxRuntime = require("react/jsx-runtime");
var io5 = require("react-icons/io5");
var urlBuilder = require("@sanity-image/url-builder");
var ai = require("react-icons/ai");

// src/index.ts
var schemaMarkupWebPageFields = sanity.defineType({
	name: "schemaMarkupWebPageFields",
	title: "WebPage Fields",
	type: "object",
	fields: [
		sanity.defineField({ name: "name", type: "string" }),
		sanity.defineField({ name: "description", type: "text" }),
		sanity.defineField({ name: "inLanguage", type: "string" }),
		// defineField({ name: "primaryImageOfPage", type: "jsonldImageObject" }),
		sanity.defineField({ name: "datePublished", type: "datetime" }),
		sanity.defineField({ name: "dateModified", type: "datetime" }),
		// defineField({
		// 	name: "breadcrumb",
		// 	title: "Breadcrumb (optional)",
		// 	type: "jsonldBreadcrumbListFields",
		// }),
		sanity.defineField({
			name: "about",
			title: "About (Entities)",
			type: "array",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
		}),
	],
	preview: {
		select: { title: "name", subtitle: "dateModified" },
		prepare: ({ title, subtitle }) => ({ title: title || "WebPage", subtitle }),
	},
});
var schemaMarkupArticleFields = sanity.defineType({
	name: "schemaMarkupArticleFields",
	title: "Article Fields",
	type: "object",
	fields: [
		sanity.defineField({
			name: "headline",
			type: "string",
			validation: (r) => r.required(),
		}),
		// defineField({ name: "articleSection", type: "string" }),
		// defineField({ name: "datePublished", type: "datetime" }),
		// defineField({ name: "dateModified", type: "datetime" }),
		sanity.defineField({
			name: "author",
			title: "Author(s)",
			type: "array",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
		}),
		sanity.defineField({
			name: "publisher",
			title: "Publisher",
			type: "schemaMarkupOrganization",
		}),
		// defineField({
		// 	name: "image",
		// 	title: "Article Image",
		// 	type: "jsonldImageObject",
		// }),
		// defineField({
		// 	name: "mainEntityOfPage",
		// 	type: "url",
		// 	description: "Canonical URL of the page hosting this article.",
		// }),
	],
	preview: {
		select: { title: "headline", subtitle: "articleSection" },
		prepare: ({ title, subtitle }) => ({ title: title || "Article", subtitle }),
	},
});
var schemaMarkupProductFields = sanity.defineType({
	name: "schemaMarkupProductFields",
	title: "Product Fields",
	type: "object",
	fields: [
		// createNote({
		// 	description:
		// 		"Name, image, offers, aggregateRating, reviews, description, and SKU are automatically generated from the product data.",
		// }),
		// defineField({
		// 	name: "name",
		// 	type: "string",
		// 	validation: (r) => r.required(),
		// }),
		// defineField({ name: "description", type: "text" }),
		sanity.defineField({
			name: "brand",
			title: "Brand",
			type: "schemaMarkupOrganization",
		}),
		// defineField({
		// 	name: "sku",
		// 	type: "string",
		// 	description: "Stock keeping unit.",
		// }),
		sanity.defineField({
			name: "mpn",
			type: "string",
			description: "Manufacturer part number.",
		}),
		sanity.defineField({
			name: "gtin",
			type: "string",
			description: "GTIN (8/12/13/14).",
		}),
		// defineField({
		// 	name: "image",
		// 	title: "Primary Image",
		// 	type: "jsonldImageObject",
		// }),
		// defineField({
		// 	name: "offers",
		// 	title: "Offers",
		// 	type: "array",
		// 	of: [{ type: "jsonldOffer" }],
		// 	description: "Price, currency, availability, URL, itemCondition, etc.",
		// }),
		// defineField({
		// 	name: "aggregateRating",
		// 	title: "Aggregate Rating",
		// 	type: "jsonldAggregateRating",
		// }),
		// defineField({
		// 	name: "review",
		// 	title: "Reviews",
		// 	type: "array",
		// 	of: [{ type: "jsonldReview" }],
		// }),
	],
	preview: {
		select: { title: "name" },
		prepare: ({ title }) => ({ title: title || "Product" }),
	},
});
var schemaMarkupEventFields = sanity.defineType({
	name: "schemaMarkupEventFields",
	title: "Event Fields",
	type: "object",
	fields: [
		sanity.defineField({
			name: "name",
			type: "string",
			validation: (r) => r.required(),
		}),
		sanity.defineField({ name: "description", type: "text" }),
		sanity.defineField({
			name: "startDate",
			type: "datetime",
			validation: (r) => r.required(),
		}),
		sanity.defineField({ name: "endDate", type: "datetime" }),
		// defineField({
		// 	name: "eventStatus",
		// 	type: "string",
		// 	options: {
		// 		list: [
		// 			{ title: "Scheduled", value: "EventScheduled" },
		// 			{ title: "Cancelled", value: "EventCancelled" },
		// 			{ title: "Postponed", value: "EventPostponed" },
		// 			{ title: "Rescheduled", value: "EventRescheduled" },
		// 			{ title: "Moved Online", value: "EventMovedOnline" },
		// 		],
		// 	},
		// }),
		sanity.defineField({
			name: "eventAttendanceMode",
			type: "string",
			options: {
				list: [
					{ title: "Offline", value: "OfflineEventAttendanceMode" },
					{ title: "Online", value: "OnlineEventAttendanceMode" },
					{ title: "Mixed", value: "MixedEventAttendanceMode" },
				],
			},
		}),
		sanity.defineField({
			name: "location",
			title: "Location",
			type: "object",
			fields: [
				sanity.defineField({ name: "name", type: "string" }),
				sanity.defineField({ name: "url", type: "url" }),
				sanity.defineField({ name: "address", type: "schemaMarkupAddress" }),
				sanity.defineField({ name: "geo", type: "schemaMarkupGeo" }),
			],
		}),
		// defineField({
		// 	name: "image",
		// 	type: "jsonldImageObject",
		// }),
		// defineField({
		// 	name: "offers",
		// 	title: "Offers / Tickets",
		// 	type: "array",
		// 	of: [{ type: "jsonldOffer" }],
		// }),
		sanity.defineField({
			name: "organizer",
			title: "Organizer",
			type: "array",
			of: [
				{ type: "schemaMarkupOrganization" },
				{ type: "schemaMarkupPerson" },
			],
		}),
		sanity.defineField({
			name: "performer",
			title: "Performer(s)",
			type: "array",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
		}),
	],
	preview: {
		select: { title: "name", subtitle: "startDate" },
		prepare: ({ title, subtitle }) => ({ title: title || "Event", subtitle }),
	},
});
var schemaMarkupFAQPageFields = sanity.defineType({
	name: "schemaMarkupFAQPageFields",
	title: "FAQ Page Fields",
	type: "object",
	fields: [
		sanity.defineField({
			name: "mainEntity",
			title: "FAQ Items",
			type: "array",
			of: [{ type: "schemaMarkupFAQItem" }],
			// {question:string, answer:PortableText}
			validation: (r) => r.min(1),
		}),
	],
	preview: {
		select: { count: "mainEntity.length" },
		prepare: ({ count }) => ({
			title: "FAQPage",
			subtitle: `${count || 0} item(s)`,
		}),
	},
});
var schemaMarkupPersonFields = sanity.defineType({
	name: "schemaMarkupPersonFields",
	title: "Person Fields",
	type: "object",
	fields: [
		sanity.defineField({
			name: "name",
			type: "string",
			validation: (r) => r.required(),
		}),
		// defineField({ name: "jobTitle", type: "string" }),
		// defineField({ name: "url", type: "url" }),
		// defineField({
		// 	name: "image",
		// 	type: "jsonldImageObject",
		// }),
		sanity.defineField({
			name: "sameAs",
			title: "Profiles (sameAs)",
			type: "array",
			of: [{ type: "url" }],
		}),
		sanity.defineField({
			name: "affiliation",
			title: "Affiliation (Organizations)",
			type: "array",
			of: [{ type: "schemaMarkupOrganization" }],
		}),
	],
	preview: {
		select: { title: "name", subtitle: "jobTitle" },
		prepare: ({ title, subtitle }) => ({ title: title || "Person", subtitle }),
	},
});
var schemaMarkupAboutPageFields = sanity.defineType({
	name: "schemaMarkupAboutPageFields",
	title: "About Page Fields",
	type: "object",
	fields: [
		sanity.defineField({
			name: "name",
			type: "string",
			description: "Name of the about page (defaults to page title)",
			// components: {
			// 	input: SchemaFieldWithDefault
			// },
			// options: {
			// 	automapName: 'description',
			// 	matchingDefaultField: 'title'
			// }
		}),
		sanity.defineField({
			name: "description",
			type: "text",
			description:
				"Description of the about page (defaults to meta description)",
			// components: {
			// 	input: SchemaFieldWithDefault
			// },
			// options: {
			// 	matchingDefaultField: 'description',
			// 	automapName: 'description'
			// }
		}),
		sanity.defineField({
			name: "inLanguage",
			type: "string",
			description: "Language code (e.g., 'en-US')",
		}),
		sanity.defineField({
			name: "datePublished",
			type: "datetime",
			description: "When the page was first published",
		}),
		sanity.defineField({
			name: "dateModified",
			type: "datetime",
			description: "When the page was last modified",
		}),
		sanity.defineField({
			name: "about",
			title: "About (Entities)",
			type: "array",
			description: "People or organizations this page is about",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
		}),
	],
	preview: {
		select: { title: "name" },
		prepare: ({ title }) => ({ title: title || "About Page" }),
	},
});
var schemaMarkupContactPageFields = sanity.defineType({
	name: "schemaMarkupContactPageFields",
	title: "Contact Page Fields",
	type: "object",
	fields: [
		sanity.defineField({
			name: "name",
			type: "string",
			description: "Name of the contact page (defaults to page title)",
		}),
		sanity.defineField({
			name: "description",
			type: "text",
			description:
				"Description of the contact page (defaults to meta description)",
		}),
		sanity.defineField({
			name: "inLanguage",
			type: "string",
			description: "Language code (e.g., 'en-US')",
		}),
		sanity.defineField({
			name: "datePublished",
			type: "datetime",
			description: "When the page was first published",
		}),
		sanity.defineField({
			name: "dateModified",
			type: "datetime",
			description: "When the page was last modified",
		}),
	],
	preview: {
		select: { title: "name" },
		prepare: ({ title }) => ({ title: title || "Contact Page" }),
	},
});

// src/schemas/entities/index.ts
var entities_default = [
	schemaMarkupArticleFields,
	schemaMarkupProductFields,
	schemaMarkupEventFields,
	schemaMarkupFAQPageFields,
	schemaMarkupWebPageFields,
	schemaMarkupPersonFields,
	schemaMarkupAboutPageFields,
	schemaMarkupContactPageFields,
];
var schemaMarkupOrganization = sanity.defineType({
	name: "schemaMarkupOrganization",
	icon: md.MdBusiness,
	title: "Organization",
	type: "document",
	validation: (Rule) =>
		Rule.custom((val) => {
			if (!val) return true;
			const hasRef = !!val.organization?._ref;
			const hasInline = !!val.name;
			return (
				hasRef ||
				hasInline ||
				"Provide an organization reference or set a Name."
			);
		}),
	fields: [
		sanity.defineField({
			name: "name",
			title: "Name (Inline)",
			type: "string",
			description: "Inline fallback/override if no reference is set.",
		}),
		sanity.defineField({
			name: "url",
			title: "URL (Inline)",
			type: "url",
		}),
		sanity.defineField({
			name: "logo",
			title: "Logo (Inline)",
			type: "image",
			// shared image object type
		}),
		sanity.defineField({
			name: "department",
			title: "Department (Inline)",
			type: "array",
			of: [{ type: "reference", to: [{ type: "schemaMarkupOrganization" }] }],
		}),
		sanity.defineField({
			name: "contactPoint",
			title: "Contact Points",
			type: "array",
			description: "Contact information for the organization",
			of: [
				{
					type: "object",
					fields: [
						sanity.defineField({
							name: "contactType",
							title: "Contact Type",
							type: "string",
							description: "e.g., customer service, sales, support",
							validation: (Rule) => Rule.required(),
						}),
						sanity.defineField({
							name: "telephone",
							title: "Telephone",
							type: "string",
							description: "Phone number including country code",
						}),
						sanity.defineField({
							name: "email",
							title: "Email",
							type: "string",
							validation: (Rule) => Rule.email(),
						}),
						sanity.defineField({
							name: "url",
							title: "Contact URL",
							type: "url",
							description: "URL to contact form or page",
						}),
						sanity.defineField({
							name: "areaServed",
							title: "Area Served",
							type: "array",
							of: [{ type: "string" }],
							description: "Geographic areas served (e.g., US, GB, Worldwide)",
							options: { layout: "tags" },
						}),
						sanity.defineField({
							name: "availableLanguage",
							title: "Available Languages",
							type: "array",
							of: [{ type: "string" }],
							description: "Languages available for this contact point",
							options: { layout: "tags" },
						}),
					],
					preview: {
						select: {
							contactType: "contactType",
							telephone: "telephone",
							email: "email",
						},
						prepare: ({ contactType, telephone, email }) => ({
							title: contactType || "Contact Point",
							subtitle: telephone || email || "",
						}),
					},
				},
			],
		}),
		sanity.defineField({
			name: "sameAs",
			title: "Profiles (sameAs)",
			type: "array",
			of: [{ type: "url" }],
			options: { layout: "tags" },
		}),
	],
	preview: {
		select: {
			refName: "organization.name",
			refUrl: "organization.url",
			inlineName: "name",
			inlineUrl: "url",
			logoUrl: "logo.asset.url",
		},
		prepare: ({ refName, inlineName }) => {
			const title = refName || inlineName || "Organization";
			return {
				title,
			};
		},
	},
});
var schemaMarkupPerson = sanity.defineType({
	name: "schemaMarkupPerson",
	title: "Person",
	type: "document",
	icon: md.MdPerson,
	validation: (Rule) =>
		Rule.custom((val) => {
			if (!val) return true;
			const hasRef = !!val.person?._ref;
			const hasInline = !!val.name;
			return hasRef || hasInline || "Provide a person reference or set a Name.";
		}),
	fields: [
		// defineField({
		// 	name: "person",
		// 	title: "Reference",
		// 	type: "reference",
		// 	to: [{ type: "person" }], // change if your base person doc uses a different type name
		// 	weak: true,
		// 	description: "Preferred: reference a Person document.",
		// }),
		sanity.defineField({
			name: "name",
			title: "Name (Inline)",
			type: "string",
			description: "Inline fallback or override if no reference is set.",
		}),
		sanity.defineField({
			name: "url",
			title: "URL (Inline)",
			type: "url",
			description: "Personal website or profile URL.",
		}),
		// defineField({
		// 	name: "image",
		// 	title: "Image (Inline)",
		// 	type: "jsonldImageObject", // reuse shared type
		// }),
		sanity.defineField({
			name: "sameAs",
			title: "Profiles (sameAs)",
			type: "array",
			of: [{ type: "url" }],
			options: { layout: "tags" },
			description:
				"Social or professional profiles associated with this person.",
		}),
		sanity.defineField({
			name: "jobTitle",
			title: "Job Title (Optional)",
			type: "string",
			description: "Role or title, if relevant (optional, ignored by Google).",
		}),
		sanity.defineField({
			name: "affiliation",
			title: "Affiliation (Optional)",
			type: "array",
			of: [{ type: "schemaMarkupOrganization" }],
			description: "Organizations this person is affiliated with.",
		}),
	],
	preview: {
		select: {
			refName: "person.name",
			inlineName: "name",
			refImage: "person.image",
			inlineImage: "image",
		},
		prepare: ({ refName, inlineName }) => ({
			title: refName || inlineName || "Person",
			subtitle: refName ? "Referenced" : "Inline",
		}),
	},
});
var schemaMarkupFAQItem = sanity.defineType({
	name: "schemaMarkupFAQItem",
	title: "FAQ Item",
	type: "object",
	options: { collapsible: true, collapsed: true },
	fields: [
		sanity.defineField({
			name: "question",
			title: "Question",
			type: "string",
			validation: (Rule) => Rule.required(),
			description:
				"The question being answered. (Used as the Question name in JSON-LD)",
		}),
		sanity.defineField({
			name: "answer",
			title: "Answer",
			type: "text",
			rows: 3,
			validation: (Rule) => Rule.required(),
			description:
				"The answer text. (Plain text is fine; HTML will be stripped in JSON-LD output)",
		}),
	],
	preview: {
		select: { title: "question", subtitle: "answer" },
		prepare({ title, subtitle }) {
			const shortAnswer =
				subtitle && subtitle.length > 60
					? subtitle.slice(0, 57).trim() + "\u2026"
					: subtitle;
			return {
				title: title || "Untitled FAQ",
				subtitle: shortAnswer || "",
			};
		},
	},
});

// src/schemas/global/index.ts
var global_default = [
	schemaMarkupPerson,
	schemaMarkupOrganization,
	schemaMarkupFAQItem,
];
var schemaMarkupAddress = sanity.defineType({
	name: "schemaMarkupAddress",
	title: "Postal Address",
	type: "object",
	options: { collapsible: true, collapsed: true },
	fields: [
		sanity.defineField({
			name: "streetAddress",
			title: "Street Address",
			type: "string",
			description: 'Street and number, e.g. "123 Main St".',
		}),
		sanity.defineField({
			name: "addressLocality",
			title: "City / Locality",
			type: "string",
		}),
		sanity.defineField({
			name: "addressRegion",
			title: "State / Region",
			type: "string",
		}),
		sanity.defineField({
			name: "postalCode",
			title: "Postal Code",
			type: "string",
		}),
		sanity.defineField({
			name: "addressCountry",
			title: "Country",
			type: "string",
			description:
				'ISO 3166-1 alpha-2 or country name (e.g. "US" or "United States").',
		}),
	],
	preview: {
		select: {
			street: "streetAddress",
			city: "addressLocality",
			region: "addressRegion",
			country: "addressCountry",
		},
		prepare({ street, city, region, country }) {
			const line1 = street ? street : "Address";
			const line2 = [city, region, country].filter(Boolean).join(", ");
			return {
				title: line1,
				subtitle: line2 || "",
			};
		},
	},
});
var schemaMarkupAggregateRating = sanity.defineType({
	name: "schemaMarkupAggregateRating",
	title: "Aggregate Rating",
	type: "object",
	options: { collapsible: true, collapsed: true },
	fields: [
		sanity.defineField({
			name: "ratingValue",
			title: "Rating Value",
			type: "number",
			validation: (Rule) => Rule.min(1).max(5).precision(1),
			description: "Average rating value (usually between 1.0 and 5.0).",
		}),
		sanity.defineField({
			name: "reviewCount",
			title: "Review Count",
			type: "number",
			validation: (Rule) => Rule.min(0),
			description: "Total number of reviews included in this aggregate.",
		}),
		sanity.defineField({
			name: "bestRating",
			title: "Best Rating (Optional)",
			type: "number",
			description: "Optional maximum rating value (defaults to 5 if omitted).",
		}),
		sanity.defineField({
			name: "worstRating",
			title: "Worst Rating (Optional)",
			type: "number",
			description: "Optional minimum rating value (defaults to 1 if omitted).",
		}),
	],
	preview: {
		select: {
			value: "ratingValue",
			count: "reviewCount",
		},
		prepare({ value, count }) {
			return {
				title: value
					? `\u2B50\uFE0F ${value.toFixed(1)} / 5`
					: "Aggregate Rating",
				subtitle: count ? `${count} reviews` : "",
			};
		},
	},
});
var schemaMarkupGeo = sanity.defineType({
	name: "schemaMarkupGeo",
	title: "Geo Coordinates",
	type: "object",
	options: { collapsible: true, collapsed: true, columns: 2 },
	fields: [
		{ name: "latitude", type: "number", validation: (r) => r.min(-90).max(90) },
		{
			name: "longitude",
			type: "number",
			validation: (r) => r.min(-180).max(180),
		},
	],
	preview: {
		select: { lat: "latitude", lon: "longitude" },
		prepare: ({ lat, lon }) => ({
			title:
				lat && lon ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : "Geo Coordinates",
		}),
	},
});
var meta_description_default = sanity.defineField({
	name: "metaDescription",
	title: "Meta Description",
	type: "text",
	rows: 3,
	description: "The description of the page. Used for the meta description.",
	validation: (Rule) =>
		Rule.max(160).warning(
			"Long descriptions (over 160 characters) will be truncated by Google.",
		),
});
var SeoDefaultsContext = react.createContext(null);
var SeoDefaultsProvider = ({ children }) => {
	const client = sanity.useClient({ apiVersion: "2024-10-01" });
	const [defaults, setDefaults] = react.useState({
		seoDefaults: null,
		schemaDefaults: null,
	});
	const cleanup = react.useCallback(() => {
		if (cleanup.seoSub) {
			cleanup.seoSub.unsubscribe();
		}
		if (cleanup.schemaSub) {
			cleanup.schemaSub.unsubscribe();
		}
	}, []);
	const sub = (query, property) => {
		return client.listen(query).subscribe((update) => {
			if (update.result) {
				setDefaults((prev) => ({
					...prev,
					[property]: update.result,
				}));
			}
		});
	};
	react.useEffect(() => {
		const seoSub = sub(`*[_type == "seoDefaults"][0]`, "seoDefaults");
		const schemaSub = sub(
			`*[_type == "schemaMarkupDefaults"][0]`,
			"schemaDefaults",
		);
		cleanup.seoSub = seoSub;
		cleanup.schemaSub = schemaSub;
		client.fetch(`*[_type == "seoDefaults"][0]`).then((seoDefaults2) =>
			setDefaults((prev) => ({
				...prev,
				seoDefaults: seoDefaults2,
			})),
		);
		client
			.fetch(`*[_type == "schemaMarkupDefaults"][0]`)
			.then((schemaDefaults) =>
				setDefaults((prev) => ({
					...prev,
					schemaDefaults,
				})),
			);
		return cleanup;
	}, [client]);
	return /* @__PURE__ */ jsxRuntime.jsx(SeoDefaultsContext.Provider, {
		value: defaults,
		children,
	});
};
var useSeoDefaults = () => react.useContext(SeoDefaultsContext);
function CardWithIcon({ icon, text, tone = "nuetral" }) {
	const Icon = icon;
	return /* @__PURE__ */ jsxRuntime.jsx(ui.Card, {
		marginBottom: 3,
		tone,
		padding: 3,
		children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
			gap: 2,
			align: "center",
			children: [
				Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { size: 18 }),
				/* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: text }),
			],
		}),
	});
}
function InputWithGlobalDefault(props) {
	const { seoDefaults: seoDefaults2 } = useSeoDefaults();
	const defaultFieldName = props?.schemaType?.options?.matchingDefaultField;
	if (!defaultFieldName) {
		console.warn(
			"No default field name found for input: ",
			props?.schemaType?.name,
		);
	}
	const value = props?.value;
	const hasDefault = defaultFieldName
		? seoDefaults2?.[defaultFieldName]
		: false;
	return /* @__PURE__ */ jsxRuntime.jsxs("div", {
		children: [
			!value &&
				!hasDefault &&
				/* @__PURE__ */ jsxRuntime.jsx(CardWithIcon, {
					icon: md.MdWarning,
					tone: "critical",
					text: "This field does not have a global default set. Make sure to fill it in here.",
				}),
			!value &&
				hasDefault &&
				/* @__PURE__ */ jsxRuntime.jsx(CardWithIcon, {
					icon: md.MdCheck,
					tone: "suggest",
					text: "This field is using the global default.",
				}),
			/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
				children: props.renderDefault(props),
			}),
		],
	});
}

// src/components/socials/facebook/FacebookCard.module.css
var FacebookCard_default = {};

// src/utils/string.ts
function truncate(text, len) {
	if (!text) return "";
	if (text.length <= len) return text;
	let out = text.slice(0, len);
	const lastSpace = out.lastIndexOf(" ");
	if (lastSpace > 40) out = out.slice(0, lastSpace);
	return `${out}\u2026`;
}
var concatenatePageTitle = (pageTitle, siteTitle, template) => {
	if (!pageTitle) return siteTitle;
	if (!siteTitle) return pageTitle;
	if (!template) return `${pageTitle} | ${siteTitle}`;
	return template
		.replace("{pageTitle}", pageTitle || "")
		.replace("{siteTitle}", siteTitle || "");
};
function SocialCardWrapper(props) {
	return /* @__PURE__ */ jsxRuntime.jsx(ui.Card, {
		border: false,
		radius: 2,
		tone: "neutral",
		children: props.children,
	});
}
function FacebookCard(props) {
	const fallback = {
		title: "My Awesome Page",
		description:
			"This is an engaging summary preview of your content for Facebook! Enjoy maximum clickthrough.",
		image: "https://placehold.co/600x315",
		siteUrl: "mywebsite.com",
		author: "Your Brand",
		avatar: "https://placehold.co/40x40",
	};
	const data = { ...fallback, ...props };
	return /* @__PURE__ */ jsxRuntime.jsxs(SocialCardWrapper, {
		children: [
			/* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
				gap: 2,
				padding: 3,
				className: FacebookCard_default.header,
				children: [
					/* @__PURE__ */ jsxRuntime.jsx(ui.Avatar, {
						src: data.avatar,
						size: 3,
					}),
					/* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, {
						space: 2,
						children: [
							/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
								weight: "semibold",
								size: 2,
								children: data.siteTitle,
							}),
							/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
								size: 1,
								muted: true,
								children: data.siteUrl,
							}),
						],
					}),
				],
			}),
			/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
				children: /* @__PURE__ */ jsxRuntime.jsx("img", {
					className: FacebookCard_default.image,
					src: data.image,
					alt: "Facebook preview",
				}),
			}),
			/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
				padding: 3,
				children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, {
					space: 3,
					children: [
						/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
							size: 1,
							muted: true,
							children: data.siteUrl,
						}),
						/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
							weight: "semibold",
							size: 3,
							children: truncate(data.title, 60),
						}),
						/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
							marginTop: 1,
							children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
								size: 2,
								children: truncate(data.description, 110),
							}),
						}),
					],
				}),
			}),
		],
	});
}
var FacebookCard_default2 = FacebookCard;

// src/components/socials/twitter/TwitterCard.module.css
var TwitterCard_default = {};
function TwitterCard(props) {
	const fallback = {
		siteTitle: "Why Static Site Generators Rock",
		description:
			"Exploring the benefits of JAMstack and web dev with static content. Fast, secure, scalable.",
		image: "https://placehold.co/800x418",
		siteUrl: "mywebsite.com",
		username: "@yoursite",
		avatar: "https://placehold.co/40x40",
	};
	const data = {
		...fallback,
		...props,
	};
	return /* @__PURE__ */ jsxRuntime.jsxs(SocialCardWrapper, {
		children: [
			/* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
				gap: 2,
				padding: 3,
				className: TwitterCard_default.userRow,
				children: [
					/* @__PURE__ */ jsxRuntime.jsx(ui.Avatar, {
						src: data.avatar,
						size: 3,
					}),
					/* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, {
						space: 2,
						children: [
							/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
								weight: "semibold",
								size: 2,
								children: data.siteTitle,
							}),
							/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
								size: 1,
								muted: true,
								children: data.twitterHandle,
							}),
						],
					}),
				],
			}),
			/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
				children: /* @__PURE__ */ jsxRuntime.jsx("img", {
					className: TwitterCard_default.imageLarge,
					src: data.image,
					alt: "Twitter preview",
				}),
			}),
			/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
				padding: 3,
				children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
					direction: "column",
					gap: 4,
					children: [
						/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
							size: 1,
							muted: true,
							children: data.siteUrl,
						}),
						/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
							weight: "semibold",
							size: 3,
							children: truncate(data.title, 70),
						}),
						/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
							size: 2,
							children: truncate(data.description, 120),
						}),
					],
				}),
			}),
		],
	});
}
var TwitterCard_default2 = TwitterCard;

// src/components/socials/google/GoogleEntry.module.css
var GoogleEntry_default = {};
function GoogleEntry(props) {
	const fallback = {
		title: "My Awesome Page - MyWebsite",
		description:
			"A compelling meta description for Google search snippet. Explain what users can find inside!",
		siteUrl: "https://mywebsite.com/page",
		favicon: "https://placehold.co/32x32",
		// fallback favicon
	};
	const data = { ...fallback, ...props };
	const theme = ui.useRootTheme();
	return /* @__PURE__ */ jsxRuntime.jsx(SocialCardWrapper, {
		children: /* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
			padding: 3,
			children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, {
				space: 3,
				children: [
					/* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
						align: "center",
						marginBottom: 2,
						gap: 2,
						children: [
							/* @__PURE__ */ jsxRuntime.jsx(ui.Avatar, {
								size: 2,
								src: data.favicon,
								alt: "Favicon",
							}),
							/* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, {
								space: 2,
								children: [
									/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
										size: 1,
										weight: "semibold",
										className: GoogleEntry_default.site,
										children: data.siteTitle,
									}),
									/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
										size: 1,
										muted: true,
										className: GoogleEntry_default.site,
										children: data.siteUrl,
									}),
								],
							}),
						],
					}),
					/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
						style: {
							color: theme.scheme === "light" ? "#1D11AC" : "#99C2FF",
						},
						weight: "medium",
						size: 3,
						className: GoogleEntry_default.title,
						children: truncate(data.title, 60),
					}),
					/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
						size: 2,
						muted: true,
						className: GoogleEntry_default.desc,
						children: truncate(data.description, 155),
					}),
				],
			}),
		}),
	});
}
var GoogleEntry_default2 = GoogleEntry;
function PreviewGroup({ title, children }) {
	return /* @__PURE__ */ jsxRuntime.jsxs("div", {
		children: [
			/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
				marginBottom: 4,
				children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
					weight: "semibold",
					size: 2,
					children: title,
				}),
			}),
			children,
		],
	});
}
function ButtonWithIcon({ icon, buttonProps = {}, label }) {
	const Icon = icon;
	return /* @__PURE__ */ jsxRuntime.jsx(ui.Button, {
		...buttonProps,
		children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
			gap: 2,
			align: "center",
			justify: "center",
			children: [
				Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { size: 17 }),
				/* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
					size: 1,
					weight: "semibold",
					children: label,
				}),
			],
		}),
	});
}
var PREVIEW_GROUPS = [
	{
		name: "Facebook",
		component: FacebookCard_default2,
		title: "Facebook",
	},
	{
		name: "Twitter / X",
		component: TwitterCard_default2,
		title: "Twitter",
	},
	{
		name: "Google",
		component: GoogleEntry_default2,
		title: "Google",
	},
];
function PageSeoInput(props) {
	const client = sanity.useClient({ apiVersion: "2025-01-11" });
	const MODES = [
		{ name: "fields", title: "Fields", icon: md.MdEdit },
		{ name: "preview", title: "Preview", icon: md.MdPreview },
	];
	const [currentMode, setCurrentMode] = react.useState(MODES[0]?.name);
	const [seoDefaults2, setSeoDefaults] = react.useState(null);
	react.useEffect(() => {
		client.fetch(`*[_type == "seoDefaults"][0]`).then(setSeoDefaults);
	}, [client]);
	const document = sanity.useFormValue([]) || {};
	const seoData = {
		...(seoDefaults2 || {}),
		...(props.value || {}),
		title: concatenatePageTitle(
			document?.title,
			seoDefaults2?.siteTitle,
			seoDefaults2?.pageTitleTemplate,
		),
		// merge description or other fields as needed
	};
	return /* @__PURE__ */ jsxRuntime.jsxs("div", {
		children: [
			/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
				marginBottom: 4,
				width: "fill",
				children: /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, {
					gap: 2,
					width: "fill",
					children: MODES.map((m) =>
						/* @__PURE__ */ jsxRuntime.jsx(
							ButtonWithIcon,
							{
								buttonProps: {
									padding: 2,
									width: "fill",
									mode: m.name === currentMode ? "default" : "ghost",
									onClick: () => setCurrentMode(m.name),
								},
								label: m.title,
								icon: m.icon,
							},
							m.name,
						),
					),
				}),
			}),
			currentMode === "fields" && props.renderDefault(props),
			currentMode === "preview" &&
				/* @__PURE__ */ jsxRuntime.jsx(ui.Flex, {
					gap: 6,
					marginTop: 6,
					direction: "column",
					children: PREVIEW_GROUPS.map((group) =>
						/* @__PURE__ */ jsxRuntime.jsx(
							PreviewGroup,
							{
								title: group.title,
								children: /* @__PURE__ */ jsxRuntime.jsx(group.component, {
									...seoData,
								}),
							},
							group.name,
						),
					),
				}),
		],
	});
}

// src/schemas/fields/metadata/page-metadata.ts
var page_metadata_default = {
	name: "metadata",
	title: "Metadata",
	group: "seo",
	components: {
		input: PageSeoInput,
	},
	type: "object",
	fields: [
		{
			name: "description",
			title: "Meta Description",
			components: {
				input: InputWithGlobalDefault,
			},
			options: {
				matchingDefaultField: "metaDescription",
			},
			type: "text",
			rows: 3,
			description:
				"The description displayed when a user finds the site in search results. Defaults to the description provided in Settings > SEO.",
			validation: (Rule) =>
				Rule.max(160).warning(
					"Long titles (over 160 characters) will be truncated by Google.",
				),
		},
		{
			name: "searchVisibility",
			type: "searchVisibility",
		},
		{
			name: "canonicalUrl",
			title: "Canonical URL",
			type: "url",
			description:
				"If this webpage has multiple URLs, specify the primary canonical URL that Google should index here",
		},
		{
			name: "metaImage",
			components: {
				input: InputWithGlobalDefault,
			},
			options: {
				matchingDefaultField: "metaImage",
			},
			title: "Meta Image",
			description:
				"Displayed when the site link is posted on social media, defaults to a screenshot of the homepage.",
			type: "imageAlt",
		},
	],
};

// src/utils/needs.ts
var COMMON_BY_TYPE = {
	WebSite: /* @__PURE__ */ new Set(["name", "inLanguage", "image"]),
	WebPage: /* @__PURE__ */ new Set([
		"name",
		"description",
		"inLanguage",
		"image",
	]),
	Article: /* @__PURE__ */ new Set([
		"name",
		"description",
		"inLanguage",
		"image",
	]),
	Product: /* @__PURE__ */ new Set(["name", "description", "image"]),
	Event: /* @__PURE__ */ new Set(["name", "description", "image"]),
	FAQPage: /* @__PURE__ */ new Set(["name", "description"]),
	// often driven by mainEntity; keep minimal here
	BreadcrumbList: /* @__PURE__ */ new Set([]),
	// all data lives in itemListElement
	Organization: /* @__PURE__ */ new Set(["name", "image"]),
	// url lives in the entity group
	Person: /* @__PURE__ */ new Set(["name", "image"]),
	LocalBusiness: /* @__PURE__ */ new Set(["name", "description", "image"]),
};
function needs(parent, key) {
	const t = parent?.type;
	if (!t) return false;
	const set3 = COMMON_BY_TYPE[t];
	return set3 ? set3.has(key) : false;
}
function PageSchemaMarkupInput(props) {
	return /* @__PURE__ */ jsxRuntime.jsx("div", {
		children: props.renderDefault(props),
	});
}
function ButtonSelector(props) {
	ui.useToast();
	const {
		elementProps: { id, onBlur, onFocus, placeholder, readOnly, ref, value },
		onChange,
		schemaType,
		validation,
		// value = '',
	} = props;
	const options = schemaType.options.list;
	const handleChange = (option) => {
		console.log(option);
		onChange(sanity.set(option));
	};
	const c = (c2) => {
		c2 = c2?.replaceAll("#", "")?.toLowerCase().trim();
		return c2;
	};
	return /* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
		children: /* @__PURE__ */ jsxRuntime.jsx(ui.Grid, {
			columns: 3,
			gap: 3,
			children: options.map((option, index) => {
				const { title, value: value2, icon, color } = option;
				return /* @__PURE__ */ jsxRuntime.jsx(
					ButtonWithIcon,
					{
						buttonProps: {
							paddingY: 4,
							mode: c(props?.value) === c(value2) ? "default" : "ghost",
							onClick: () => handleChange(value2),
						},
						label: title,
						icon,
					},
					value2,
				);
			}),
		}),
	});
}
var SCHEMA_MARKUP_TYPES = {
	AboutPage: { title: "AboutPage", value: "AboutPage", icon: md.MdPeople },
	ContactPage: { title: "ContactPage", value: "ContactPage", icon: md.MdEmail },
	Article: { title: "Article", value: "Article", icon: md.MdArticle },
	CreativeWork: {
		title: "CreativeWork",
		value: "CreativeWork",
		icon: md.MdCreate,
	},
	Event: { title: "Event", value: "Event", icon: md.MdEvent },
	FAQPage: { title: "FAQPage", value: "FAQPage", icon: md.MdQuestionAnswer },
	// BreadcrumbList: { title: "BreadcrumbList", value: "BreadcrumbList" },
	LocalBusiness: {
		title: "LocalBusiness",
		value: "LocalBusiness",
		icon: md.MdStore,
	},
	Organization: {
		title: "Organization",
		value: "Organization",
		icon: md.MdBusiness,
	},
	Person: { title: "Person", value: "Person", icon: md.MdPerson },
	Product: { title: "Product", value: "Product", icon: md.MdShoppingBag },
	WebPage: { title: "WebPage", value: "WebPage", icon: md.MdPageview },
	WebSite: { title: "WebSite", value: "WebSite", icon: md.MdWeb },
};

// src/schemas/fields/schema-markup/schemaMarkup.ts
var schemaMarkup = sanity.defineType({
	name: "schemaMarkup",
	title: "Schema Markup",
	components: {
		input: PageSchemaMarkupInput,
	},
	type: "object",
	fields: [
		sanity.defineField({
			name: "type",
			title: "Schema Type",
			type: "string",
			components: {
				input: ButtonSelector,
			},
			options: {
				list: [...Object.values(SCHEMA_MARKUP_TYPES)],
				layout: "radio",
			},
			validation: (Rule) => Rule.required(),
		}),
		// Minimal common fields:
		sanity.defineField({
			name: "name",
			type: "string",
			hidden: ({ parent }) => !needs(parent, "name"),
		}),
		sanity.defineField({
			name: "description",
			type: "text",
			rows: 3,
			hidden: ({ parent }) => !needs(parent, "description"),
		}),
		sanity.defineField({
			name: "inLanguage",
			type: "string",
			hidden: ({ parent }) => !needs(parent, "inLanguage"),
		}),
		// defineField({
		// 	name: "image",
		// 	type: "jsonldImageObject",
		// 	hidden: ({ parent }) => !needs(parent, "image"),
		// }),
		// Type-specific groups (conditionally shown)
		// e.g., Article
		sanity.defineField({
			name: "article",
			type: "schemaMarkupArticleFields",
			hidden: ({ parent }) => parent?.type !== "Article",
		}),
		// Product
		sanity.defineField({
			name: "product",
			type: "schemaMarkupProductFields",
			hidden: ({ parent }) => parent?.type !== "Product",
		}),
		// ...repeat for Event, FAQPage, BreadcrumbList, etc.
	],
	// components: { input: JsonLdInput }, // custom UI that merges defaults + shows preview
	preview: { select: { title: "type", subtitle: "name" } },
});
function getNested(obj, key) {
	return obj && Object.hasOwn(obj, key) ? obj[key] : void 0;
}
function IndexingControls(props) {
	const { value = {}, onChange } = props;
	const noFollow = !!getNested(value, "noFollow");
	const noIndex = !!getNested(value, "noIndex");
	const setValue = react.useCallback(
		(key, val) => {
			onChange?.(sanity.set(val, [key]));
		},
		[onChange],
	);
	let note = "";
	if (!noIndex && !noFollow) {
		note =
			"This page will be indexed by search engines, and links on this page will be crawled and considered for ranking.";
	} else if (!noIndex && noFollow) {
		note =
			"This page will be indexed by search engines, but links on this page will not be crawled or considered for ranking.";
	} else if (noIndex && !noFollow) {
		note =
			"This page will not be indexed by search engines, but links on this page will be crawled and considered for ranking.";
	} else if (noIndex && noFollow) {
		note =
			"This page will not be indexed by search engines, and links on this page will not be crawled or considered for ranking.";
	}
	return /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, {
		space: 3,
		children: [
			/* @__PURE__ */ jsxRuntime.jsx(CardWithIcon, {
				icon: md.MdInfo,
				tone: noIndex && noFollow ? "critical" : "suggest",
				text: note,
			}),
			/* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
				gap: 3,
				children: [
					/* @__PURE__ */ jsxRuntime.jsx(ui.Button, {
						width: "fill",
						icon: io5.IoArrowRedo,
						mode: noFollow ? "default" : "ghost",
						selected: noFollow,
						text: "No Follow",
						tone: noFollow ? "critical" : "default",
						onClick: () => setValue("noFollow", !noFollow),
					}),
					/* @__PURE__ */ jsxRuntime.jsx(ui.Button, {
						width: "fill",
						icon: md.MdPlaylistRemove,
						mode: noIndex ? "default" : "ghost",
						selected: noIndex,
						text: "No Index",
						tone: noIndex ? "critical" : "default",
						onClick: () => setValue("noIndex", !noIndex),
					}),
				],
			}),
		],
	});
}
function SeoLayoutWrapper(props) {
	return /* @__PURE__ */ jsxRuntime.jsx(SeoDefaultsProvider, {
		children: props.renderDefault(props),
	});
}

// src/schemas/fields/metadata/indexing.ts
var indexing_default = sanity.defineField({
	name: "searchVisibility",
	title: "Search Visibility",
	type: "object",
	components: {
		input: IndexingControls,
	},
	fields: [
		{
			name: "noFollow",
			title: "No Follow",
			type: "boolean",
		},
		{
			name: "noIndex",
			title: "No Index",
			type: "boolean",
		},
	],
});
function WindowControls() {
	const CONTROLS = [
		{ bg: "#ff5f57", title: "Close" },
		{ bg: "#ffbd2e", title: "Minimize" },
		{ bg: "#28c940", title: "Maximize" },
	];
	return /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, {
		align: "center",
		style: {
			gap: 6,
			paddingRight: 16,
		},
		children: CONTROLS.map((c, i) =>
			/* @__PURE__ */ jsxRuntime.jsx(
				"span",
				{
					title: c.title,
					style: {
						display: "inline-block",
						width: 11,
						height: 11,
						borderRadius: "50%",
						background: c.bg,
						border: "0.5px solid #bfbfbf",
						boxSizing: "border-box",
						boxShadow:
							i === 0
								? "0 0.5px 0.5px #c14545"
								: i === 2
									? "0 0.5px 0.5px #30993d"
									: "0 0.5px 0.5px #bfa350",
					},
				},
				i,
			),
		),
	});
}

// src/components/core/Favicon/favicon-preview.module.css
var favicon_preview_default = {};
function BrowserTab({
	url = "https://example.com",
	favicon = "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
	title = "Facebook",
}) {
	const theme = ui.useRootTheme();
	return /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
		gap: 2,
		"data-theme": theme.scheme,
		className: favicon_preview_default.card,
		style: {
			borderRadius: "10px 10px 0 0",
			background: "var(--tab-bg)",
			boxShadow: "var(--tab-shadow)",
			maxWidth: 220,
			minWidth: 140,
			height: 36,
			display: "flex",
			alignItems: "center",
			padding: "0 16px",
			border: "var(--tab-border)",
			borderBottom: "none",
		},
		children: [
			/* @__PURE__ */ jsxRuntime.jsx("img", {
				src: favicon,
				width: 16,
				height: 16,
				alt: "Favicon on tab",
				style: {
					borderRadius: 4,
					background: "var(--tab-favicon-bg)",
					display: "block",
				},
			}),
			/* @__PURE__ */ jsxRuntime.jsx(ui.Flex, {
				direction: "column",
				justify: "center",
				align: "center",
				children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, {
					size: 1,
					style: {
						fontWeight: 500,
						color: "var(--tab-url-text-color)",
						opacity: 0.93,
						height: "100%",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						userSelect: "none",
						fontFamily: "inherit",
					},
					children: title,
				}),
			}),
		],
	});
}
function FaviconPreview(props) {
	const defaults = useSeoDefaults();
	const theme = ui.useRootTheme();
	const dataset = sanity.useDataset();
	const projectId = sanity.useProjectId();
	const url = react.useMemo(() => {
		const domain = defaults?.siteUrl ? defaults.siteUrl : "https://example.com";
		return domain.replace("https://", "");
	}, [defaults]);
	const faviconUrl = react.useMemo(() => {
		return props.value?.asset?._ref
			? urlBuilder.buildSrc({
					id: props.value?.asset?._ref,
					baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`,
				})?.src
			: null;
	}, [props.value?.asset?._ref, projectId, dataset]);
	return /* @__PURE__ */ jsxRuntime.jsxs("div", {
		className: favicon_preview_default.card,
		children: [
			/* @__PURE__ */ jsxRuntime.jsx(ui.Card, {
				"data-tab-display": true,
				"data-theme": theme.scheme,
				shadow: 2,
				marginBottom: 2,
				radius: 4,
				style: {
					width: "100%",
				},
				children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, {
					paddingX: 4,
					paddingY: 2,
					justify: "start",
					align: "center",
					children: [
						/* @__PURE__ */ jsxRuntime.jsx(WindowControls, {}),
						/* @__PURE__ */ jsxRuntime.jsx(BrowserTab, {
							url,
							title: defaults?.siteTitle,
							favicon: faviconUrl,
						}),
						/* @__PURE__ */ jsxRuntime.jsx(BrowserTab, {}),
					],
				}),
			}),
			/* @__PURE__ */ jsxRuntime.jsx(ui.Box, {
				className: favicon_preview_default?.["image-preview"],
				children: props.renderDefault(props),
			}),
		],
	});
}

// src/schemas/fields/metadata/favicon.ts
var favicon_default = sanity.defineField({
	name: "favicon",
	type: "image",
	components: {
		input: FaviconPreview,
	},
	description:
		"The favicon of the site. To create the sharpest fallback images possible, use an SVG. Careful with transparent backgrounds, a user might have light or dark mode enabled.",
	group: "metadata",
});

// src/schemas/fields/index.ts
var fields_default = [
	indexing_default,
	favicon_default,
	schemaMarkupAddress,
	schemaMarkupGeo,
	schemaMarkupAggregateRating,
	schemaMarkup,
	page_metadata_default,
	meta_description_default,
];
var schemaMarkupDefaults = sanity.defineType({
	name: "schemaMarkupDefaults",
	title: "Schema Markup Defaults",
	type: "document",
	groups: [
		{
			name: "global",
			title: "Global Defaults",
			default: true,
			icon: ai.AiOutlineGlobal,
		},
		{
			name: "automapping",
			title: "Automapping",
			icon: io5.IoSparklesSharp,
		},
		{
			name: "type-specific",
			title: "Type-Specific Defaults",
			icon: md.MdSettingsSuggest,
		},
	],
	// mark as singleton in your desk (see snippet below)
	fields: [
		// IN OTHER PLACE ALREADY
		// ---- General ----
		// defineField({
		// 	name: "baseUrl",
		// 	title: "Base URL",
		// 	type: "url",
		// 	description: "Root URL used to build canonical links in JSON-LD.",
		// 	validation: (r) => r.required(),
		// }),
		// defineField({
		// 	name: "defaultLocale",
		// 	title: "Default Locale",
		// 	type: "string",
		// 	description: "2-letter language code (e.g., en, it, de).",
		// 	validation: (r) => r.required().max(2),
		// }),
		// GETTING THESE FROM CODEBASE, NOT CMS
		// defineField({
		// 	name: "locales",
		// 	title: "Available Locales",
		// 	type: "array",
		// 	of: [{ type: "string" }],
		// 	description:
		// 		"List of supported locales. First should match defaultLocale.",
		// 	validation: (r) => r.min(1),
		// }),
		sanity.defineField({
			name: "sameAs",
			title: "Global Profiles (sameAs)",
			type: "array",
			group: "global",
			of: [{ type: "url" }],
			description: "Social/profile URLs applied when relevant.",
		}),
		sanity.defineField({
			name: "organization",
			title: "Default Organization",
			group: "global",
			type: "reference",
			to: [{ type: "schemaMarkupOrganization" }],
			description: "Used as publisher/brand when none specified.",
		}),
		sanity.defineField({
			name: "publisher",
			title: "Default Publisher (Overrides Organization)",
			group: "global",
			type: "reference",
			to: [{ type: "schemaMarkupOrganization" }],
		}),
		// ---- Image & Media Fallbacks ----
		sanity.defineField({
			name: "logo",
			title: "Global Logo",
			group: "global",
			type: "image",
			description:
				"Default logo used for Organization and WebSite schemas when no specific logo is provided.",
		}),
		sanity.defineField({
			name: "imageFallback",
			title: "Default Image",
			group: "global",
			type: "image",
			description: "Used if an entity has no image set or auto-mapped.",
		}),
		sanity.defineField({
			name: "imageFieldMapping",
			hidden: true,
			title: "Image Auto-Map Order",
			group: "global",
			type: "array",
			of: [{ type: "string" }],
			description:
				"Field paths (dot notation) searched on the document to auto-map an image. First match wins. Example: coverImage, seo.image, ogImage",
			options: { layout: "tags" },
			initialValue: ["coverImage", "seo.image", "ogImage", "mainImage"],
		}),
		// ---- Auto-Mapping Toggles ----
		sanity.defineField({
			name: "autoMap",
			title: "Automatic Field Mapping",
			group: "automapping",
			type: "object",
			fields: [
				{
					name: "title",
					type: "boolean",
					initialValue: true,
					description: "Map doc title \u2192 name/headline.",
				},
				{
					name: "description",
					type: "boolean",
					initialValue: true,
					description: "Map doc excerpt/description \u2192 description.",
				},
				{
					name: "image",
					type: "boolean",
					initialValue: true,
					description: "Use imageFieldMapping to find an image.",
				},
				{
					name: "dates",
					type: "boolean",
					initialValue: true,
					description:
						"Map publishedAt/updatedAt \u2192 datePublished/dateModified.",
				},
				{
					name: "authors",
					type: "boolean",
					initialValue: true,
					description: "Map authors[] \u2192 Person/Organization authors.",
				},
			],
		}),
		// ---- Type-Specific Defaults ----
		sanity.defineField({
			name: "webSite",
			title: "WebSite Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				// { name: "name", type: "string" },
				// {
				// 	name: "inLanguage",
				// 	type: "string",
				// 	description: "BCP-47 code. Fallback to defaultLocale.",
				// },
				{ name: "publisher", type: "schemaMarkupOrganization" },
				sanity.defineField({
					name: "searchAction",
					title: "SearchAction",
					type: "object",
					fields: [
						{
							name: "target",
							type: "url",
							description:
								"e.g. https://example.com/search?q={search_term_string}",
						},
						{
							name: "queryInput",
							type: "string",
							description: "e.g. required name=search_term_string",
						},
					],
				}),
			],
		}),
		sanity.defineField({
			name: "webPage",
			title: "WebPage Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{ name: "inLanguage", type: "string" },
				{ name: "primaryImageOfPage", type: "image" },
			],
		}),
		sanity.defineField({
			name: "article",
			title: "Article Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{ name: "publisher", type: "schemaMarkupOrganization" },
				{
					name: "section",
					type: "string",
					description: "Default ArticleSection.",
				},
			],
		}),
		sanity.defineField({
			name: "product",
			title: "Product Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{ name: "brand", type: "schemaMarkupOrganization" },
				{
					name: "priceCurrency",
					type: "string",
					description: "ISO 4217, e.g., USD, EUR.",
				},
				{
					name: "availability",
					type: "string",
					options: {
						list: [
							{ title: "InStock", value: "InStock" },
							{ title: "OutOfStock", value: "OutOfStock" },
							{ title: "PreOrder", value: "PreOrder" },
							{ title: "PreSale", value: "PreSale" },
							{ title: "Discontinued", value: "Discontinued" },
						],
					},
				},
			],
		}),
		sanity.defineField({
			name: "event",
			title: "Event Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{
					name: "eventAttendanceMode",
					type: "string",
					options: {
						list: [
							{ title: "Offline", value: "OfflineEventAttendanceMode" },
							{ title: "Online", value: "OnlineEventAttendanceMode" },
							{ title: "Mixed", value: "MixedEventAttendanceMode" },
						],
					},
				},
				{ name: "organizer", type: "schemaMarkupOrganization" },
			],
		}),
		sanity.defineField({
			name: "localBusiness",
			title: "LocalBusiness Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{ name: "priceRange", type: "string", description: "e.g., $, $$, $$$" },
				{ name: "address", type: "schemaMarkupAddress" },
				{ name: "geo", type: "schemaMarkupGeo" },
				{ name: "aggregateRating", type: "schemaMarkupAggregateRating" },
			],
		}),
		// ---- Rendering / Behavior ----
		sanity.defineField({
			name: "rendering",
			title: "Rendering Options",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{
					name: "multiLocaleStrategy",
					type: "string",
					initialValue: "one-per-locale",
					options: {
						list: [
							{ title: "One <script> per locale", value: "one-per-locale" },
							{ title: "Primary locale only", value: "primary-only" },
						],
						layout: "radio",
					},
				},
			],
		}),
	],
	preview: {
		select: { baseUrl: "baseUrl", locale: "defaultLocale" },
		prepare: ({ baseUrl, locale }) => ({
			title: "Schema Markup Defaults",
			subtitle: `${baseUrl || "\u2014"} \xB7 ${locale || "locale not set"}`,
		}),
	},
});
var seoDefaults = sanity.defineType({
	name: "seoDefaults",
	title: "SEO Defaults",
	type: "document",
	groups: [
		{
			name: "metadata",
			title: "Metadata",
			default: true,
			icon: md.MdSearch,
		},
		{
			name: "social",
			title: "Social",
			icon: md.MdShare,
		},
	],
	fields: [
		sanity.defineField({
			name: "siteTitle",
			title: "Site Title",
			type: "string",
			description:
				"The title of the site. Used for each page and in schema markup.",
			validation: (Rule) => Rule.required(),
			group: "metadata",
		}),
		sanity.defineField({
			name: "pageTitleTemplate",
			title: "Page Title Template",
			type: "string",
			description:
				"Template for page titles. Use {siteTitle} and {pageTitle} for the page title. Example: {pageTitle} - {siteTitle}",
			validation: (Rule) => Rule.required(),
			initialValue: "{pageTitle} - {siteTitle}",
			group: "metadata",
		}),
		sanity.defineField({
			name: "metaDescription",
			type: "metaDescription",
			group: "metadata",
			description: "The default meta description for all pages.",
			// validation: (Rule) => Rule.required(),
		}),
		sanity.defineField({
			name: "siteUrl",
			title: "Site URL",
			type: "url",
			description:
				"Root URL of the website (e.g. https://your-domain.com). Used for canonical and OG tags.",
			validation: (Rule) => Rule.required(),
			group: "metadata",
		}),
		sanity.defineField({
			name: "favicon",
			type: "favicon",
			group: "metadata",
		}),
		sanity.defineField({
			name: "twitterHandle",
			title: "Twitter Handle",
			type: "string",
			description: "Example: @yourbrand",
			group: "social",
		}),
	],
	preview: {
		select: {
			title: "siteTitle",
			subtitle: "siteUrl",
		},
		prepare(selection) {
			return { title: "SEO Defaults" };
		},
	},
});
var socialNetworks = sanity.defineType({
	name: "socialNetworks",
	title: "Social Networks",
	type: "document",
	fields: [
		sanity.defineField({
			name: "platform",
			title: "Platform",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		sanity.defineField({
			name: "url",
			title: "URL",
			type: "url",
			validation: (Rule) => Rule.required(),
		}),
	],
});

// src/schemas/singleton/index.ts
var singleton_default = [schemaMarkupDefaults, seoDefaults, socialNetworks];

// src/index.ts
var index_default = sanity.definePlugin({
	name: "crawl-me-maybe",
	schema: {
		types: [
			...fields_default,
			...global_default,
			...entities_default,
			...singleton_default,
		],
	},
	studio: {
		components: {
			layout: SeoLayoutWrapper,
		},
	},
});

module.exports = index_default;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
