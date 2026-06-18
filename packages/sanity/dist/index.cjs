var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/index.ts
var exports_src = {};
__export(exports_src, {
  default: () => src_default
});
module.exports = __toCommonJS(exports_src);
var import_sanity27 = require("sanity");

// src/schemas/entities/webpage-entity.ts
var import_sanity = require("sanity");
var schemaMarkupWebPageFields = import_sanity.defineType({
  name: "schemaMarkupWebPageFields",
  title: "WebPage Fields",
  type: "object",
  fields: [
    import_sanity.defineField({ name: "name", type: "string" }),
    import_sanity.defineField({ name: "description", type: "text" }),
    import_sanity.defineField({ name: "inLanguage", type: "string" }),
    import_sanity.defineField({ name: "datePublished", type: "datetime" }),
    import_sanity.defineField({ name: "dateModified", type: "datetime" }),
    import_sanity.defineField({
      name: "about",
      title: "About (Entities)",
      type: "array",
      of: [
        { type: "schemaMarkupPerson" },
        { type: "schemaMarkupOrganization" }
      ]
    })
  ],
  preview: {
    select: { title: "name", subtitle: "dateModified" },
    prepare: ({ title, subtitle }) => ({ title: title || "WebPage", subtitle })
  }
});

// src/schemas/entities/article-entity.ts
var import_sanity2 = require("sanity");
var schemaMarkupArticleFields = import_sanity2.defineType({
  name: "schemaMarkupArticleFields",
  title: "Article Fields",
  type: "object",
  fields: [
    import_sanity2.defineField({
      name: "headline",
      type: "string",
      validation: (r) => r.required()
    }),
    import_sanity2.defineField({
      name: "author",
      title: "Author(s)",
      type: "array",
      of: [
        { type: "schemaMarkupPerson" },
        { type: "schemaMarkupOrganization" }
      ]
    }),
    import_sanity2.defineField({
      name: "publisher",
      title: "Publisher",
      type: "schemaMarkupOrganization"
    })
  ],
  preview: {
    select: { title: "headline", subtitle: "articleSection" },
    prepare: ({ title, subtitle }) => ({ title: title || "Article", subtitle })
  }
});

// src/schemas/entities/product-entity.ts
var import_sanity3 = require("sanity");
var schemaMarkupProductFields = import_sanity3.defineType({
  name: "schemaMarkupProductFields",
  title: "Product Fields",
  type: "object",
  fields: [
    import_sanity3.defineField({
      name: "brand",
      title: "Brand",
      type: "schemaMarkupOrganization"
    }),
    import_sanity3.defineField({
      name: "mpn",
      type: "string",
      description: "Manufacturer part number."
    }),
    import_sanity3.defineField({
      name: "gtin",
      type: "string",
      description: "GTIN (8/12/13/14)."
    })
  ],
  preview: {
    select: { title: "name" },
    prepare: ({ title }) => ({ title: title || "Product" })
  }
});

// src/schemas/entities/event-entity.ts
var import_sanity4 = require("sanity");
var schemaMarkupEventFields = import_sanity4.defineType({
  name: "schemaMarkupEventFields",
  title: "Event Fields",
  type: "object",
  fields: [
    import_sanity4.defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required()
    }),
    import_sanity4.defineField({ name: "description", type: "text" }),
    import_sanity4.defineField({
      name: "startDate",
      type: "datetime",
      validation: (r) => r.required()
    }),
    import_sanity4.defineField({ name: "endDate", type: "datetime" }),
    import_sanity4.defineField({
      name: "eventAttendanceMode",
      type: "string",
      options: {
        list: [
          { title: "Offline", value: "OfflineEventAttendanceMode" },
          { title: "Online", value: "OnlineEventAttendanceMode" },
          { title: "Mixed", value: "MixedEventAttendanceMode" }
        ]
      }
    }),
    import_sanity4.defineField({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        import_sanity4.defineField({ name: "name", type: "string" }),
        import_sanity4.defineField({ name: "url", type: "url" }),
        import_sanity4.defineField({ name: "address", type: "schemaMarkupAddress" }),
        import_sanity4.defineField({ name: "geo", type: "schemaMarkupGeo" })
      ]
    }),
    import_sanity4.defineField({
      name: "organizer",
      title: "Organizer",
      type: "array",
      of: [
        { type: "schemaMarkupOrganization" },
        { type: "schemaMarkupPerson" }
      ]
    }),
    import_sanity4.defineField({
      name: "performer",
      title: "Performer(s)",
      type: "array",
      of: [
        { type: "schemaMarkupPerson" },
        { type: "schemaMarkupOrganization" }
      ]
    })
  ],
  preview: {
    select: { title: "name", subtitle: "startDate" },
    prepare: ({ title, subtitle }) => ({ title: title || "Event", subtitle })
  }
});

// src/schemas/entities/faq-entity.ts
var import_sanity5 = require("sanity");
var schemaMarkupFAQPageFields = import_sanity5.defineType({
  name: "schemaMarkupFAQPageFields",
  title: "FAQ Page Fields",
  type: "object",
  fields: [
    import_sanity5.defineField({
      name: "mainEntity",
      title: "FAQ Items",
      type: "array",
      of: [{ type: "schemaMarkupFAQItem" }],
      validation: (r) => r.min(1)
    })
  ],
  preview: {
    select: { count: "mainEntity.length" },
    prepare: ({ count }) => ({
      title: "FAQPage",
      subtitle: `${count || 0} item(s)`
    })
  }
});

// src/schemas/entities/person-entity.ts
var import_sanity6 = require("sanity");
var schemaMarkupPersonFields = import_sanity6.defineType({
  name: "schemaMarkupPersonFields",
  title: "Person Fields",
  type: "object",
  fields: [
    import_sanity6.defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required()
    }),
    import_sanity6.defineField({
      name: "sameAs",
      title: "Profiles (sameAs)",
      type: "array",
      of: [{ type: "url" }]
    }),
    import_sanity6.defineField({
      name: "affiliation",
      title: "Affiliation (Organizations)",
      type: "array",
      of: [{ type: "schemaMarkupOrganization" }]
    })
  ],
  preview: {
    select: { title: "name", subtitle: "jobTitle" },
    prepare: ({ title, subtitle }) => ({ title: title || "Person", subtitle })
  }
});

// src/schemas/entities/about-page-entity.ts
var import_sanity7 = require("sanity");
var schemaMarkupAboutPageFields = import_sanity7.defineType({
  name: "schemaMarkupAboutPageFields",
  title: "About Page Fields",
  type: "object",
  fields: [
    import_sanity7.defineField({
      name: "name",
      type: "string",
      description: "Name of the about page (defaults to page title)"
    }),
    import_sanity7.defineField({
      name: "description",
      type: "text",
      description: "Description of the about page (defaults to meta description)"
    }),
    import_sanity7.defineField({
      name: "inLanguage",
      type: "string",
      description: "Language code (e.g., 'en-US')"
    }),
    import_sanity7.defineField({
      name: "datePublished",
      type: "datetime",
      description: "When the page was first published"
    }),
    import_sanity7.defineField({
      name: "dateModified",
      type: "datetime",
      description: "When the page was last modified"
    }),
    import_sanity7.defineField({
      name: "about",
      title: "About (Entities)",
      type: "array",
      description: "People or organizations this page is about",
      of: [
        { type: "schemaMarkupPerson" },
        { type: "schemaMarkupOrganization" }
      ]
    })
  ],
  preview: {
    select: { title: "name" },
    prepare: ({ title }) => ({ title: title || "About Page" })
  }
});

// src/schemas/entities/contact-page-entity.ts
var import_sanity8 = require("sanity");
var schemaMarkupContactPageFields = import_sanity8.defineType({
  name: "schemaMarkupContactPageFields",
  title: "Contact Page Fields",
  type: "object",
  fields: [
    import_sanity8.defineField({
      name: "name",
      type: "string",
      description: "Name of the contact page (defaults to page title)"
    }),
    import_sanity8.defineField({
      name: "description",
      type: "text",
      description: "Description of the contact page (defaults to meta description)"
    }),
    import_sanity8.defineField({
      name: "inLanguage",
      type: "string",
      description: "Language code (e.g., 'en-US')"
    }),
    import_sanity8.defineField({
      name: "datePublished",
      type: "datetime",
      description: "When the page was first published"
    }),
    import_sanity8.defineField({
      name: "dateModified",
      type: "datetime",
      description: "When the page was last modified"
    })
  ],
  preview: {
    select: { title: "name" },
    prepare: ({ title }) => ({ title: title || "Contact Page" })
  }
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
  schemaMarkupContactPageFields
];

// src/schemas/global/organization.ts
var import_md = require("react-icons/md");
var import_sanity9 = require("sanity");
var schemaMarkupOrganization = import_sanity9.defineType({
  name: "schemaMarkupOrganization",
  icon: import_md.MdBusiness,
  title: "Organization",
  type: "document",
  validation: (Rule) => Rule.custom((val) => {
    if (!val)
      return true;
    const hasRef = !!val.organization?._ref;
    const hasInline = !!val.name;
    return hasRef || hasInline || "Provide an organization reference or set a Name.";
  }),
  fields: [
    import_sanity9.defineField({
      name: "name",
      title: "Name (Inline)",
      type: "string",
      description: "Inline fallback/override if no reference is set."
    }),
    import_sanity9.defineField({
      name: "url",
      title: "URL (Inline)",
      type: "url"
    }),
    import_sanity9.defineField({
      name: "logo",
      title: "Logo (Inline)",
      type: "image"
    }),
    import_sanity9.defineField({
      name: "department",
      title: "Department (Inline)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "schemaMarkupOrganization" }] }]
    }),
    import_sanity9.defineField({
      name: "contactPoint",
      title: "Contact Points",
      type: "array",
      description: "Contact information for the organization",
      of: [
        {
          type: "object",
          fields: [
            import_sanity9.defineField({
              name: "contactType",
              title: "Contact Type",
              type: "string",
              description: "e.g., customer service, sales, support",
              validation: (Rule) => Rule.required()
            }),
            import_sanity9.defineField({
              name: "telephone",
              title: "Telephone",
              type: "string",
              description: "Phone number including country code"
            }),
            import_sanity9.defineField({
              name: "email",
              title: "Email",
              type: "string",
              validation: (Rule) => Rule.email()
            }),
            import_sanity9.defineField({
              name: "url",
              title: "Contact URL",
              type: "url",
              description: "URL to contact form or page"
            }),
            import_sanity9.defineField({
              name: "areaServed",
              title: "Area Served",
              type: "array",
              of: [{ type: "string" }],
              description: "Geographic areas served (e.g., US, GB, Worldwide)",
              options: { layout: "tags" }
            }),
            import_sanity9.defineField({
              name: "availableLanguage",
              title: "Available Languages",
              type: "array",
              of: [{ type: "string" }],
              description: "Languages available for this contact point",
              options: { layout: "tags" }
            })
          ],
          preview: {
            select: {
              contactType: "contactType",
              telephone: "telephone",
              email: "email"
            },
            prepare: ({ contactType, telephone, email }) => ({
              title: contactType || "Contact Point",
              subtitle: telephone || email || ""
            })
          }
        }
      ]
    }),
    import_sanity9.defineField({
      name: "sameAs",
      title: "Profiles (sameAs)",
      type: "array",
      of: [{ type: "url" }],
      options: { layout: "tags" }
    })
  ],
  preview: {
    select: {
      refName: "organization.name",
      refUrl: "organization.url",
      inlineName: "name",
      inlineUrl: "url",
      logoUrl: "logo.asset.url"
    },
    prepare: ({ refName, inlineName }) => {
      const title = refName || inlineName || "Organization";
      return {
        title
      };
    }
  }
});

// src/schemas/global/person.ts
var import_md2 = require("react-icons/md");
var import_sanity10 = require("sanity");
var schemaMarkupPerson = import_sanity10.defineType({
  name: "schemaMarkupPerson",
  title: "Person",
  type: "document",
  icon: import_md2.MdPerson,
  validation: (Rule) => Rule.custom((val) => {
    if (!val)
      return true;
    const hasRef = !!val.person?._ref;
    const hasInline = !!val.name;
    return hasRef || hasInline || "Provide a person reference or set a Name.";
  }),
  fields: [
    import_sanity10.defineField({
      name: "name",
      title: "Name (Inline)",
      type: "string",
      description: "Inline fallback or override if no reference is set."
    }),
    import_sanity10.defineField({
      name: "url",
      title: "URL (Inline)",
      type: "url",
      description: "Personal website or profile URL."
    }),
    import_sanity10.defineField({
      name: "sameAs",
      title: "Profiles (sameAs)",
      type: "array",
      of: [{ type: "url" }],
      options: { layout: "tags" },
      description: "Social or professional profiles associated with this person."
    }),
    import_sanity10.defineField({
      name: "jobTitle",
      title: "Job Title (Optional)",
      type: "string",
      description: "Role or title, if relevant (optional, ignored by Google)."
    }),
    import_sanity10.defineField({
      name: "affiliation",
      title: "Affiliation (Optional)",
      type: "array",
      of: [{ type: "schemaMarkupOrganization" }],
      description: "Organizations this person is affiliated with."
    })
  ],
  preview: {
    select: {
      refName: "person.name",
      inlineName: "name",
      refImage: "person.image",
      inlineImage: "image"
    },
    prepare: ({ refName, inlineName }) => ({
      title: refName || inlineName || "Person",
      subtitle: refName ? "Referenced" : "Inline"
    })
  }
});

// src/schemas/global/faq-item.ts
var import_sanity11 = require("sanity");
var schemaMarkupFAQItem = import_sanity11.defineType({
  name: "schemaMarkupFAQItem",
  title: "FAQ Item",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    import_sanity11.defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The question being answered. (Used as the Question name in JSON-LD)"
    }),
    import_sanity11.defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
      description: "The answer text. (Plain text is fine; HTML will be stripped in JSON-LD output)"
    })
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
    prepare({ title, subtitle }) {
      const shortAnswer = subtitle && subtitle.length > 60 ? subtitle.slice(0, 57).trim() + "…" : subtitle;
      return {
        title: title || "Untitled FAQ",
        subtitle: shortAnswer || ""
      };
    }
  }
});

// src/schemas/global/index.ts
var global_default = [
  schemaMarkupPerson,
  schemaMarkupOrganization,
  schemaMarkupFAQItem
];

// src/schemas/fields/schema-markup/address.ts
var import_sanity12 = require("sanity");
var schemaMarkupAddress = import_sanity12.defineType({
  name: "schemaMarkupAddress",
  title: "Postal Address",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    import_sanity12.defineField({
      name: "streetAddress",
      title: "Street Address",
      type: "string",
      description: 'Street and number, e.g. "123 Main St".'
    }),
    import_sanity12.defineField({
      name: "addressLocality",
      title: "City / Locality",
      type: "string"
    }),
    import_sanity12.defineField({
      name: "addressRegion",
      title: "State / Region",
      type: "string"
    }),
    import_sanity12.defineField({
      name: "postalCode",
      title: "Postal Code",
      type: "string"
    }),
    import_sanity12.defineField({
      name: "addressCountry",
      title: "Country",
      type: "string",
      description: 'ISO 3166-1 alpha-2 or country name (e.g. "US" or "United States").'
    })
  ],
  preview: {
    select: {
      street: "streetAddress",
      city: "addressLocality",
      region: "addressRegion",
      country: "addressCountry"
    },
    prepare({ street, city, region, country }) {
      const line1 = street ? street : "Address";
      const line2 = [city, region, country].filter(Boolean).join(", ");
      return {
        title: line1,
        subtitle: line2 || ""
      };
    }
  }
});

// src/schemas/fields/schema-markup/aggregate-rating.ts
var import_sanity13 = require("sanity");
var schemaMarkupAggregateRating = import_sanity13.defineType({
  name: "schemaMarkupAggregateRating",
  title: "Aggregate Rating",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    import_sanity13.defineField({
      name: "ratingValue",
      title: "Rating Value",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).precision(1),
      description: "Average rating value (usually between 1.0 and 5.0)."
    }),
    import_sanity13.defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
      validation: (Rule) => Rule.min(0),
      description: "Total number of reviews included in this aggregate."
    }),
    import_sanity13.defineField({
      name: "bestRating",
      title: "Best Rating (Optional)",
      type: "number",
      description: "Optional maximum rating value (defaults to 5 if omitted)."
    }),
    import_sanity13.defineField({
      name: "worstRating",
      title: "Worst Rating (Optional)",
      type: "number",
      description: "Optional minimum rating value (defaults to 1 if omitted)."
    })
  ],
  preview: {
    select: {
      value: "ratingValue",
      count: "reviewCount"
    },
    prepare({ value, count }) {
      return {
        title: value ? `⭐️ ${value.toFixed(1)} / 5` : "Aggregate Rating",
        subtitle: count ? `${count} reviews` : ""
      };
    }
  }
});

// src/schemas/fields/schema-markup/geo.ts
var import_sanity14 = require("sanity");
var schemaMarkupGeo = import_sanity14.defineType({
  name: "schemaMarkupGeo",
  title: "Geo Coordinates",
  type: "object",
  options: { collapsible: true, collapsed: true, columns: 2 },
  fields: [
    { name: "latitude", type: "number", validation: (r) => r.min(-90).max(90) },
    {
      name: "longitude",
      type: "number",
      validation: (r) => r.min(-180).max(180)
    }
  ],
  preview: {
    select: { lat: "latitude", lon: "longitude" },
    prepare: ({ lat, lon }) => ({
      title: lat && lon ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : "Geo Coordinates"
    })
  }
});

// src/schemas/fields/metadata/meta-description.ts
var import_sanity15 = require("sanity");
var meta_description_default = import_sanity15.defineField({
  name: "metaDescription",
  title: "Meta Description",
  type: "text",
  rows: 3,
  description: "The description of the page. Used for the meta description.",
  validation: (Rule) => Rule.max(160).warning("Long descriptions (over 160 characters) will be truncated by Google.")
});

// src/components/core/InputWithGlobalDefault.tsx
var import_ui2 = require("@sanity/ui");

// src/context/SeoDefaultsContext.tsx
var import_react = require("react");
var import_sanity16 = require("sanity");
var jsx_dev_runtime = require("react/jsx-dev-runtime");
var SeoDefaultsContext = import_react.createContext(null);
var SeoDefaultsProvider = ({ children }) => {
  const client = import_sanity16.useClient({ apiVersion: "2025-01-11" });
  const [defaults, setDefaults] = import_react.useState({
    seoDefaults: null,
    schemaDefaults: null
  });
  const cleanup = import_react.useCallback(() => {
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
          [property]: update.result
        }));
      }
    });
  };
  import_react.useEffect(() => {
    const seoSub = sub(`*[_type == "seoDefaults"][0]`, "seoDefaults");
    const schemaSub = sub(`*[_type == "schemaMarkupDefaults"][0]`, "schemaDefaults");
    cleanup.seoSub = seoSub;
    cleanup.schemaSub = schemaSub;
    client.fetch(`*[_type == "seoDefaults"][0]`).then((seoDefaults) => setDefaults((prev) => ({
      ...prev,
      seoDefaults
    })));
    client.fetch(`*[_type == "schemaMarkupDefaults"][0]`).then((schemaDefaults) => setDefaults((prev) => ({
      ...prev,
      schemaDefaults
    })));
    return cleanup;
  }, [client]);
  return /* @__PURE__ */ jsx_dev_runtime.jsxDEV(SeoDefaultsContext.Provider, {
    value: defaults,
    children
  }, undefined, false, undefined, this);
};
var useSeoDefaults = () => import_react.useContext(SeoDefaultsContext);

// src/components/core/InputWithGlobalDefault.tsx
var import_md3 = require("react-icons/md");

// src/components/partials/CardWithIcon.tsx
var import_ui = require("@sanity/ui");
var jsx_dev_runtime2 = require("react/jsx-dev-runtime");
function CardWithIcon({
  icon,
  text,
  tone = "nuetral"
}) {
  const Icon = icon;
  return /* @__PURE__ */ jsx_dev_runtime2.jsxDEV(import_ui.Card, {
    marginBottom: 3,
    tone,
    padding: 3,
    children: /* @__PURE__ */ jsx_dev_runtime2.jsxDEV(import_ui.Flex, {
      gap: 2,
      align: "center",
      children: [
        Icon && /* @__PURE__ */ jsx_dev_runtime2.jsxDEV(Icon, {
          size: 18
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime2.jsxDEV(import_ui.Text, {
          size: 1,
          children: text
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// src/components/core/InputWithGlobalDefault.tsx
var jsx_dev_runtime3 = require("react/jsx-dev-runtime");
function InputWithGlobalDefault(props) {
  const { seoDefaults } = useSeoDefaults();
  const defaultFieldName = props?.schemaType?.options?.matchingDefaultField;
  if (!defaultFieldName) {
    console.warn("No default field name found for input: ", props?.schemaType?.name);
  }
  const value = props?.value;
  const hasDefault = defaultFieldName ? seoDefaults?.[defaultFieldName] : false;
  return /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("div", {
    children: [
      !value && !hasDefault && /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(CardWithIcon, {
        icon: import_md3.MdWarning,
        tone: "critical",
        text: "This field does not have a global default set. Make sure to fill it in here."
      }, undefined, false, undefined, this),
      !value && hasDefault && /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(CardWithIcon, {
        icon: import_md3.MdCheck,
        tone: "suggest",
        text: "This field is using the global default."
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(import_ui2.Box, {
        children: props.renderDefault(props)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/components/core/PageSeoInput/PageSeoInput.tsx
var import_ui10 = require("@sanity/ui");
var import_react2 = require("react");
var import_md4 = require("react-icons/md");
var import_sanity17 = require("sanity");

// src/utils/string.ts
function truncate(text, len) {
  if (!text)
    return "";
  if (text.length <= len)
    return text;
  let out = text.slice(0, len);
  const lastSpace = out.lastIndexOf(" ");
  if (lastSpace > 40)
    out = out.slice(0, lastSpace);
  return `${out}…`;
}
var concatenatePageTitle = (pageTitle, siteTitle, template) => {
  if (!pageTitle)
    return siteTitle;
  if (!siteTitle)
    return pageTitle;
  if (!template)
    return `${pageTitle} | ${siteTitle}`;
  return template.replace("{pageTitle}", pageTitle || "").replace("{siteTitle}", siteTitle || "");
};

// src/components/partials/ButtonWithIcon.tsx
var import_ui3 = require("@sanity/ui");
var jsx_dev_runtime4 = require("react/jsx-dev-runtime");
function ButtonWithIcon({
  icon,
  buttonProps = {},
  label
}) {
  const Icon = icon;
  return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(import_ui3.Button, {
    ...buttonProps,
    children: /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(import_ui3.Flex, {
      gap: 2,
      align: "center",
      justify: "center",
      children: [
        Icon && /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Icon, {
          size: 17
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(import_ui3.Text, {
          size: 1,
          weight: "semibold",
          children: label
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// src/components/socials/facebook/FacebookCard.tsx
var import_ui5 = require("@sanity/ui");

// src/components/socials/facebook/FacebookCard.module.css
var FacebookCard_module_default = {
  facebookCard: "facebookCard_iq-4hA",
  header: "header_iq-4hA",
  image: "image_iq-4hA",
  cardSection: "cardSection_iq-4hA"
};

// src/components/partials/SocialCardWrapper.tsx
var import_ui4 = require("@sanity/ui");
var jsx_dev_runtime5 = require("react/jsx-dev-runtime");
function SocialCardWrapper(props) {
  return /* @__PURE__ */ jsx_dev_runtime5.jsxDEV(import_ui4.Card, {
    border: false,
    radius: 2,
    tone: "neutral",
    children: props.children
  }, undefined, false, undefined, this);
}

// src/components/socials/facebook/FacebookCard.tsx
var jsx_dev_runtime6 = require("react/jsx-dev-runtime");
function FacebookCard(props) {
  const fallback = {
    title: "My Awesome Page",
    description: "This is an engaging summary preview of your content for Facebook! Enjoy maximum clickthrough.",
    image: "https://placehold.co/600x315",
    siteUrl: "mywebsite.com",
    author: "Your Brand",
    avatar: "https://placehold.co/40x40"
  };
  const data = { ...fallback, ...props };
  return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(SocialCardWrapper, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Flex, {
        gap: 2,
        padding: 3,
        className: FacebookCard_module_default.header,
        children: [
          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Avatar, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Stack, {
            space: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Text, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Text, {
                size: 1,
                muted: true,
                children: data.siteUrl
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Box, {
        children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("img", {
          className: FacebookCard_module_default.image,
          src: data.image,
          alt: "Facebook preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Box, {
        padding: 3,
        children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Stack, {
          space: 3,
          children: [
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Text, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Text, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 60)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Box, {
              marginTop: 1,
              children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(import_ui5.Text, {
                size: 2,
                children: truncate(data.description, 110)
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
var FacebookCard_default = FacebookCard;

// src/components/socials/google/GoogleEntry.tsx
var import_ui6 = require("@sanity/ui");

// src/components/socials/google/GoogleEntry.module.css
var GoogleEntry_module_default = {
  googleCard: "googleCard_yJDEgw",
  title: "title_yJDEgw",
  site: "site_yJDEgw",
  desc: "desc_yJDEgw",
  cardSection: "cardSection_yJDEgw"
};

// src/components/socials/google/GoogleEntry.tsx
var import_ui7 = require("@sanity/ui");
var jsx_dev_runtime7 = require("react/jsx-dev-runtime");
function GoogleEntry(props) {
  const fallback = {
    title: "My Awesome Page - MyWebsite",
    description: "A compelling meta description for Google search snippet. Explain what users can find inside!",
    siteUrl: "https://mywebsite.com/page",
    favicon: "https://placehold.co/32x32"
  };
  const data = { ...fallback, ...props };
  const theme = import_ui7.useRootTheme();
  return /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(SocialCardWrapper, {
    children: /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Box, {
      padding: 3,
      children: /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Stack, {
        space: 3,
        children: [
          /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Flex, {
            align: "center",
            marginBottom: 2,
            gap: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Avatar, {
                size: 2,
                src: data.favicon,
                alt: "Favicon"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Stack, {
                space: 2,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Text, {
                    size: 1,
                    weight: "semibold",
                    className: GoogleEntry_module_default.site,
                    children: data.siteTitle
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Text, {
                    size: 1,
                    muted: true,
                    className: GoogleEntry_module_default.site,
                    children: data.siteUrl
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Text, {
            style: {
              color: theme.scheme === "light" ? "#1D11AC" : "#99C2FF"
            },
            weight: "medium",
            size: 3,
            className: GoogleEntry_module_default.title,
            children: truncate(data.title, 60)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(import_ui6.Text, {
            size: 2,
            muted: true,
            className: GoogleEntry_module_default.desc,
            children: truncate(data.description, 155)
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this);
}
var GoogleEntry_default = GoogleEntry;

// src/components/socials/twitter/TwitterCard.tsx
var import_ui8 = require("@sanity/ui");

// src/components/socials/twitter/TwitterCard.module.css
var TwitterCard_module_default = {
  twitterCard: "twitterCard_1NtJNQ",
  userRow: "userRow_1NtJNQ",
  imageLarge: "imageLarge_1NtJNQ",
  cardSection: "cardSection_1NtJNQ"
};

// src/components/socials/twitter/TwitterCard.tsx
var jsx_dev_runtime8 = require("react/jsx-dev-runtime");
function TwitterCard(props) {
  const fallback = {
    siteTitle: "Why Static Site Generators Rock",
    description: "Exploring the benefits of JAMstack and web dev with static content. Fast, secure, scalable.",
    image: "https://placehold.co/800x418",
    siteUrl: "mywebsite.com",
    username: "@yoursite",
    avatar: "https://placehold.co/40x40"
  };
  const data = {
    ...fallback,
    ...props
  };
  return /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(SocialCardWrapper, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Flex, {
        gap: 2,
        padding: 3,
        className: TwitterCard_module_default.userRow,
        children: [
          /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Avatar, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Stack, {
            space: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Text, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Text, {
                size: 1,
                muted: true,
                children: data.twitterHandle
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Box, {
        children: /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("img", {
          className: TwitterCard_module_default.imageLarge,
          src: data.image,
          alt: "Twitter preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Box, {
        padding: 3,
        children: /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Flex, {
          direction: "column",
          gap: 4,
          children: [
            /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Text, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Text, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 70)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(import_ui8.Text, {
              size: 2,
              children: truncate(data.description, 120)
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
var TwitterCard_default = TwitterCard;

// src/components/core/PageSeoInput/PreviewGroup.tsx
var import_ui9 = require("@sanity/ui");
var jsx_dev_runtime9 = require("react/jsx-dev-runtime");
function PreviewGroup({
  title,
  children
}) {
  return /* @__PURE__ */ jsx_dev_runtime9.jsxDEV("div", {
    children: [
      /* @__PURE__ */ jsx_dev_runtime9.jsxDEV(import_ui9.Box, {
        marginBottom: 4,
        children: /* @__PURE__ */ jsx_dev_runtime9.jsxDEV(import_ui9.Text, {
          weight: "semibold",
          size: 2,
          children: title
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      children
    ]
  }, undefined, true, undefined, this);
}

// src/components/core/PageSeoInput/PageSeoInput.tsx
var jsx_dev_runtime10 = require("react/jsx-dev-runtime");
var PREVIEW_GROUPS = [
  {
    name: "Facebook",
    component: FacebookCard_default,
    title: "Facebook"
  },
  {
    name: "Twitter / X",
    component: TwitterCard_default,
    title: "Twitter"
  },
  {
    name: "Google",
    component: GoogleEntry_default,
    title: "Google"
  }
];
function PageSeoInput(props) {
  const client = import_sanity17.useClient({ apiVersion: "2025-01-11" });
  const MODES = [
    { name: "fields", title: "Fields", icon: import_md4.MdEdit },
    { name: "preview", title: "Preview", icon: import_md4.MdPreview }
  ];
  const [currentMode, setCurrentMode] = import_react2.useState(MODES[0]?.name);
  const [seoDefaults, setSeoDefaults] = import_react2.useState(null);
  import_react2.useEffect(() => {
    client.fetch(`*[_type == "seoDefaults"][0]`).then(setSeoDefaults);
  }, [client]);
  const document = import_sanity17.useFormValue([]) || {};
  const seoData = {
    ...seoDefaults || {},
    ...props.value || {},
    title: concatenatePageTitle(document?.title, seoDefaults?.siteTitle, seoDefaults?.pageTitleTemplate)
  };
  return /* @__PURE__ */ jsx_dev_runtime10.jsxDEV("div", {
    children: [
      /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(import_ui10.Box, {
        marginBottom: 4,
        width: "fill",
        children: /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(import_ui10.Flex, {
          gap: 2,
          width: "fill",
          children: MODES.map((m) => /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(ButtonWithIcon, {
            buttonProps: {
              padding: 2,
              width: "fill",
              mode: m.name === currentMode ? "default" : "ghost",
              onClick: () => setCurrentMode(m.name)
            },
            label: m.title,
            icon: m.icon
          }, m.name, false, undefined, this))
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      currentMode === "fields" && props.renderDefault(props),
      currentMode === "preview" && /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(import_ui10.Flex, {
        gap: 6,
        marginTop: 6,
        direction: "column",
        children: PREVIEW_GROUPS.map((group) => /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(PreviewGroup, {
          title: group.title,
          children: /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(group.component, {
            ...seoData
          }, undefined, false, undefined, this)
        }, group.name, false, undefined, this))
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/schemas/fields/metadata/page-metadata.ts
var page_metadata_default = {
  name: "metadata",
  title: "Metadata",
  group: "seo",
  components: {
    input: PageSeoInput
  },
  type: "object",
  fields: [
    {
      name: "description",
      title: "Meta Description",
      components: {
        input: InputWithGlobalDefault
      },
      options: {
        matchingDefaultField: "metaDescription"
      },
      type: "text",
      rows: 3,
      description: "The description displayed when a user finds the site in search results. Defaults to the description provided in Settings > SEO.",
      validation: (Rule) => Rule.max(160).warning("Long titles (over 160 characters) will be truncated by Google.")
    },
    {
      name: "searchVisibility",
      type: "searchVisibility"
    },
    {
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "If this webpage has multiple URLs, specify the primary canonical URL that Google should index here"
    },
    {
      name: "metaImage",
      components: {
        input: InputWithGlobalDefault
      },
      options: {
        matchingDefaultField: "metaImage"
      },
      title: "Meta Image",
      description: "Displayed when the site link is posted on social media, defaults to a screenshot of the homepage.",
      type: "image"
    }
  ]
};

// src/schemas/fields/schema-markup/schemaMarkup.ts
var import_sanity19 = require("sanity");

// src/utils/needs.ts
var COMMON_BY_TYPE = {
  WebSite: new Set(["name", "inLanguage", "image"]),
  WebPage: new Set(["name", "description", "inLanguage", "image"]),
  Article: new Set(["name", "description", "inLanguage", "image"]),
  Product: new Set(["name", "description", "image"]),
  Event: new Set(["name", "description", "image"]),
  FAQPage: new Set(["name", "description"]),
  BreadcrumbList: new Set([]),
  Organization: new Set(["name", "image"]),
  Person: new Set(["name", "image"]),
  LocalBusiness: new Set(["name", "description", "image"])
};
function needs(parent, key) {
  const t = parent?.type;
  if (!t)
    return false;
  const set = COMMON_BY_TYPE[t];
  return set ? set.has(key) : false;
}
var REQUIRED_BY_TYPE = {
  WebSite: new Set(["name"]),
  WebPage: new Set(["name"]),
  Article: new Set(["name"]),
  Product: new Set(["name"]),
  Event: new Set(["name"])
};

// src/components/core/PageSchemaMarkupInput/PageSchemaMarkupInput.tsx
var jsx_dev_runtime11 = require("react/jsx-dev-runtime");
function PageSchemaMarkupInput(props) {
  return /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
    children: props.renderDefault(props)
  }, undefined, false, undefined, this);
}

// src/components/core/PageSchemaMarkupInput/SchemaMarkupTypeSelector.tsx
var import_ui11 = require("@sanity/ui");
var import_sanity18 = require("sanity");
var jsx_dev_runtime12 = require("react/jsx-dev-runtime");
function ButtonSelector(props) {
  const toast = import_ui11.useToast();
  const {
    elementProps: { id, onBlur, onFocus, placeholder, readOnly, ref, value },
    onChange,
    schemaType,
    validation
  } = props;
  const options = schemaType.options.list;
  const handleChange = (option) => {
    onChange(import_sanity18.set(option));
  };
  const c = (c2) => {
    c2 = c2?.replaceAll("#", "")?.toLowerCase().trim();
    return c2;
  };
  return /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(import_ui11.Box, {
    children: /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(import_ui11.Grid, {
      columns: 3,
      gap: 3,
      children: options.map((option, index) => {
        const { title, value: value2, icon, color } = option;
        const Icon = icon;
        return /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(ButtonWithIcon, {
          buttonProps: {
            paddingY: 4,
            mode: c(props?.value) === c(value2) ? "default" : "ghost",
            onClick: () => handleChange(value2)
          },
          label: title,
          icon
        }, value2, false, undefined, this);
      })
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this);
}

// src/globals.ts
var import_md5 = require("react-icons/md");
var SCHEMA_MARKUP_TYPES = {
  AboutPage: { title: "AboutPage", value: "AboutPage", icon: import_md5.MdPeople },
  ContactPage: { title: "ContactPage", value: "ContactPage", icon: import_md5.MdEmail },
  Article: { title: "Article", value: "Article", icon: import_md5.MdArticle },
  CreativeWork: {
    title: "CreativeWork",
    value: "CreativeWork",
    icon: import_md5.MdCreate
  },
  Event: { title: "Event", value: "Event", icon: import_md5.MdEvent },
  FAQPage: { title: "FAQPage", value: "FAQPage", icon: import_md5.MdQuestionAnswer },
  LocalBusiness: {
    title: "LocalBusiness",
    value: "LocalBusiness",
    icon: import_md5.MdStore
  },
  Organization: {
    title: "Organization",
    value: "Organization",
    icon: import_md5.MdBusiness
  },
  Person: { title: "Person", value: "Person", icon: import_md5.MdPerson },
  Product: { title: "Product", value: "Product", icon: import_md5.MdShoppingBag },
  WebPage: { title: "WebPage", value: "WebPage", icon: import_md5.MdPageview },
  WebSite: { title: "WebSite", value: "WebSite", icon: import_md5.MdWeb }
};

// src/schemas/fields/schema-markup/schemaMarkup.ts
var schemaMarkup = import_sanity19.defineType({
  name: "schemaMarkup",
  title: "Schema Markup",
  components: {
    input: PageSchemaMarkupInput
  },
  type: "object",
  fields: [
    import_sanity19.defineField({
      name: "type",
      title: "Schema Type",
      type: "string",
      components: {
        input: ButtonSelector
      },
      options: {
        list: [...Object.values(SCHEMA_MARKUP_TYPES)],
        layout: "radio"
      },
      validation: (Rule) => Rule.required()
    }),
    import_sanity19.defineField({
      name: "name",
      type: "string",
      hidden: ({ parent }) => !needs(parent, "name")
    }),
    import_sanity19.defineField({
      name: "description",
      type: "text",
      rows: 3,
      hidden: ({ parent }) => !needs(parent, "description")
    }),
    import_sanity19.defineField({
      name: "inLanguage",
      type: "string",
      hidden: ({ parent }) => !needs(parent, "inLanguage")
    }),
    import_sanity19.defineField({
      name: "article",
      type: "schemaMarkupArticleFields",
      hidden: ({ parent }) => parent?.type !== "Article"
    }),
    import_sanity19.defineField({
      name: "product",
      type: "schemaMarkupProductFields",
      hidden: ({ parent }) => parent?.type !== "Product"
    })
  ],
  preview: { select: { title: "type", subtitle: "name" } }
});

// src/schemas/fields/metadata/indexing.ts
var import_sanity21 = require("sanity");

// src/components/core/IndexingControls.tsx
var import_sanity20 = require("sanity");
var import_ui12 = require("@sanity/ui");
var import_react3 = require("react");
var import_md6 = require("react-icons/md");
var import_io5 = require("react-icons/io5");
var jsx_dev_runtime13 = require("react/jsx-dev-runtime");
function getNested(obj, key) {
  return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
}
function IndexingControls(props) {
  const { value = {}, onChange } = props;
  const noFollow = !!getNested(value, "noFollow");
  const noIndex = !!getNested(value, "noIndex");
  const setValue = import_react3.useCallback((key, val) => {
    onChange?.(import_sanity20.set(val, [key]));
  }, [onChange]);
  let note = "";
  if (!noIndex && !noFollow) {
    note = "This page will be indexed by search engines, and links on this page will be crawled and considered for ranking.";
  } else if (!noIndex && noFollow) {
    note = "This page will be indexed by search engines, but links on this page will not be crawled or considered for ranking.";
  } else if (noIndex && !noFollow) {
    note = "This page will not be indexed by search engines, but links on this page will be crawled and considered for ranking.";
  } else if (noIndex && noFollow) {
    note = "This page will not be indexed by search engines, and links on this page will not be crawled or considered for ranking.";
  }
  return /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(import_ui12.Stack, {
    space: 3,
    children: [
      /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(CardWithIcon, {
        icon: import_md6.MdInfo,
        tone: noIndex && noFollow ? "critical" : "suggest",
        text: note
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(import_ui12.Flex, {
        gap: 3,
        children: [
          /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(import_ui12.Button, {
            width: "fill",
            icon: import_io5.IoArrowRedo,
            mode: noFollow ? "default" : "ghost",
            selected: noFollow,
            text: "No Follow",
            tone: noFollow ? "critical" : "default",
            onClick: () => setValue("noFollow", !noFollow)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(import_ui12.Button, {
            width: "fill",
            icon: import_md6.MdPlaylistRemove,
            mode: noIndex ? "default" : "ghost",
            selected: noIndex,
            text: "No Index",
            tone: noIndex ? "critical" : "default",
            onClick: () => setValue("noIndex", !noIndex)
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
// src/components/core/SchemaFieldWithDefault.tsx
var import_ui13 = require("@sanity/ui");
var import_md7 = require("react-icons/md");
var jsx_dev_runtime14 = require("react/jsx-dev-runtime");
// src/components/core/SeoLayoutWrapper.tsx
var jsx_dev_runtime15 = require("react/jsx-dev-runtime");
function SeoLayoutWrapper(props) {
  return /* @__PURE__ */ jsx_dev_runtime15.jsxDEV(SeoDefaultsProvider, {
    children: props.renderDefault(props)
  }, undefined, false, undefined, this);
}
// src/schemas/fields/metadata/indexing.ts
var indexing_default = import_sanity21.defineField({
  name: "searchVisibility",
  title: "Search Visibility",
  type: "object",
  components: {
    input: IndexingControls
  },
  fields: [
    {
      name: "noFollow",
      title: "No Follow",
      type: "boolean"
    },
    {
      name: "noIndex",
      title: "No Index",
      type: "boolean"
    }
  ]
});

// src/schemas/fields/metadata/favicon.ts
var import_sanity23 = require("sanity");

// src/components/core/Favicon/FaviconPreview.tsx
var import_ui16 = require("@sanity/ui");
var import_react4 = require("react");

// src/components/core/Favicon/WindowControls.tsx
var import_ui14 = require("@sanity/ui");
var jsx_dev_runtime16 = require("react/jsx-dev-runtime");
function WindowControls() {
  const CONTROLS = [
    { bg: "#ff5f57", title: "Close" },
    { bg: "#ffbd2e", title: "Minimize" },
    { bg: "#28c940", title: "Maximize" }
  ];
  return /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(import_ui14.Flex, {
    align: "center",
    style: {
      gap: 6,
      paddingRight: 16
    },
    children: CONTROLS.map((c, i) => /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("span", {
      title: c.title,
      style: {
        display: "inline-block",
        width: 11,
        height: 11,
        borderRadius: "50%",
        background: c.bg,
        border: "0.5px solid #bfbfbf",
        boxSizing: "border-box",
        boxShadow: i === 0 ? "0 0.5px 0.5px #c14545" : i === 2 ? "0 0.5px 0.5px #30993d" : "0 0.5px 0.5px #bfa350"
      }
    }, i, false, undefined, this))
  }, undefined, false, undefined, this);
}

// src/components/core/Favicon/BrowserTab.tsx
var import_ui15 = require("@sanity/ui");

// src/components/core/Favicon/favicon-preview.module.css
var favicon_preview_module_default = {
  card: "card_znijeg",
  "image-preview": "image-preview_znijeg"
};

// src/components/core/Favicon/BrowserTab.tsx
var jsx_dev_runtime17 = require("react/jsx-dev-runtime");
function BrowserTab({
  url = "https://example.com",
  favicon = "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
  title = "Facebook"
}) {
  const theme = import_ui15.useRootTheme();
  return /* @__PURE__ */ jsx_dev_runtime17.jsxDEV(import_ui15.Flex, {
    gap: 2,
    "data-theme": theme.scheme,
    className: favicon_preview_module_default.card,
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
      borderBottom: "none"
    },
    children: [
      /* @__PURE__ */ jsx_dev_runtime17.jsxDEV("img", {
        src: favicon,
        width: 16,
        height: 16,
        alt: "Favicon on tab",
        style: {
          borderRadius: 4,
          background: "var(--tab-favicon-bg)",
          display: "block"
        }
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime17.jsxDEV(import_ui15.Flex, {
        direction: "column",
        justify: "center",
        align: "center",
        children: /* @__PURE__ */ jsx_dev_runtime17.jsxDEV(import_ui15.Text, {
          size: 1,
          style: {
            fontWeight: 500,
            color: "var(--tab-url-text-color)",
            opacity: 0.93,
            height: "100%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            userSelect: "none",
            fontFamily: "inherit"
          },
          children: title
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/components/core/Favicon/FaviconPreview.tsx
var import_url_builder = require("@sanity-image/url-builder");
var import_sanity22 = require("sanity");
var jsx_dev_runtime18 = require("react/jsx-dev-runtime");
function FaviconPreview(props) {
  const defaults = useSeoDefaults();
  const theme = import_ui16.useRootTheme();
  const dataset = import_sanity22.useDataset();
  const projectId = import_sanity22.useProjectId();
  const url = import_react4.useMemo(() => {
    const domain = defaults?.siteUrl ? defaults.siteUrl : "https://example.com";
    return domain.replace("https://", "");
  }, [defaults]);
  const faviconUrl = import_react4.useMemo(() => {
    return props.value?.asset?._ref ? import_url_builder.buildSrc({
      id: props.value?.asset?._ref,
      baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`
    })?.src : null;
  }, [props.value?.asset?._ref, projectId, dataset]);
  return /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
    className: favicon_preview_module_default.card,
    children: [
      /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(import_ui16.Card, {
        "data-tab-display": true,
        "data-theme": theme.scheme,
        shadow: 2,
        marginBottom: 2,
        radius: 4,
        style: {
          width: "100%"
        },
        children: /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(import_ui16.Flex, {
          paddingX: 4,
          paddingY: 2,
          justify: "start",
          align: "center",
          children: [
            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(WindowControls, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(BrowserTab, {
              url,
              title: defaults?.siteTitle,
              favicon: faviconUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(BrowserTab, {}, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(import_ui16.Box, {
        className: favicon_preview_module_default?.["image-preview"],
        children: props.renderDefault(props)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/schemas/fields/metadata/favicon.ts
var favicon_default = import_sanity23.defineField({
  name: "favicon",
  type: "image",
  components: {
    input: FaviconPreview
  },
  description: "The favicon of the site. To create the sharpest fallback images possible, use an SVG. Careful with transparent backgrounds, a user might have light or dark mode enabled.",
  group: "metadata"
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
  meta_description_default
];

// src/schemas/singleton/schema-defaults.ts
var import_ai = require("react-icons/ai");
var import_md8 = require("react-icons/md");
var import_sanity24 = require("sanity");
var import_io52 = require("react-icons/io5");
var schemaMarkupDefaults = import_sanity24.defineType({
  name: "schemaMarkupDefaults",
  title: "Schema Markup Defaults",
  type: "document",
  groups: [
    {
      name: "global",
      title: "Global Defaults",
      default: true,
      icon: import_ai.AiOutlineGlobal
    },
    {
      name: "automapping",
      title: "Automapping",
      icon: import_io52.IoSparklesSharp
    },
    {
      name: "type-specific",
      title: "Type-Specific Defaults",
      icon: import_md8.MdSettingsSuggest
    }
  ],
  fields: [
    import_sanity24.defineField({
      name: "sameAs",
      title: "Global Profiles (sameAs)",
      type: "array",
      group: "global",
      of: [{ type: "url" }],
      description: "Social/profile URLs applied when relevant."
    }),
    import_sanity24.defineField({
      name: "organization",
      title: "Default Organization",
      group: "global",
      type: "reference",
      to: [{ type: "schemaMarkupOrganization" }],
      description: "Used as publisher/brand when none specified."
    }),
    import_sanity24.defineField({
      name: "publisher",
      title: "Default Publisher (Overrides Organization)",
      group: "global",
      type: "reference",
      to: [{ type: "schemaMarkupOrganization" }]
    }),
    import_sanity24.defineField({
      name: "logo",
      title: "Global Logo",
      group: "global",
      type: "image",
      description: "Default logo used for Organization and WebSite schemas when no specific logo is provided."
    }),
    import_sanity24.defineField({
      name: "imageFallback",
      title: "Default Image",
      group: "global",
      type: "image",
      description: "Used if an entity has no image set or auto-mapped."
    }),
    import_sanity24.defineField({
      name: "imageFieldMapping",
      hidden: true,
      title: "Image Auto-Map Order",
      group: "global",
      type: "array",
      of: [{ type: "string" }],
      description: "Field paths (dot notation) searched on the document to auto-map an image. First match wins. Example: coverImage, seo.image, ogImage",
      options: { layout: "tags" },
      initialValue: ["coverImage", "seo.image", "ogImage", "mainImage"]
    }),
    import_sanity24.defineField({
      name: "autoMap",
      title: "Automatic Field Mapping",
      group: "automapping",
      type: "object",
      fields: [
        {
          name: "title",
          type: "boolean",
          initialValue: true,
          description: "Map doc title → name/headline."
        },
        {
          name: "description",
          type: "boolean",
          initialValue: true,
          description: "Map doc excerpt/description → description."
        },
        {
          name: "image",
          type: "boolean",
          initialValue: true,
          description: "Use imageFieldMapping to find an image."
        },
        {
          name: "dates",
          type: "boolean",
          initialValue: true,
          description: "Map publishedAt/updatedAt → datePublished/dateModified."
        },
        {
          name: "authors",
          type: "boolean",
          initialValue: true,
          description: "Map authors[] → Person/Organization authors."
        }
      ]
    }),
    import_sanity24.defineField({
      name: "webSite",
      title: "WebSite Defaults",
      group: "type-specific",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "publisher", type: "schemaMarkupOrganization" },
        import_sanity24.defineField({
          name: "searchAction",
          title: "SearchAction",
          type: "object",
          fields: [
            {
              name: "target",
              type: "url",
              description: "e.g. https://example.com/search?q={search_term_string}"
            },
            {
              name: "queryInput",
              type: "string",
              description: "e.g. required name=search_term_string"
            }
          ]
        })
      ]
    }),
    import_sanity24.defineField({
      name: "webPage",
      title: "WebPage Defaults",
      group: "type-specific",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "inLanguage", type: "string" },
        { name: "primaryImageOfPage", type: "image" }
      ]
    }),
    import_sanity24.defineField({
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
          description: "Default ArticleSection."
        }
      ]
    }),
    import_sanity24.defineField({
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
          description: "ISO 4217, e.g., USD, EUR."
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
              { title: "Discontinued", value: "Discontinued" }
            ]
          }
        }
      ]
    }),
    import_sanity24.defineField({
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
              { title: "Mixed", value: "MixedEventAttendanceMode" }
            ]
          }
        },
        { name: "organizer", type: "schemaMarkupOrganization" }
      ]
    }),
    import_sanity24.defineField({
      name: "localBusiness",
      title: "LocalBusiness Defaults",
      group: "type-specific",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "priceRange", type: "string", description: "e.g., $, $$, $$$" },
        { name: "address", type: "schemaMarkupAddress" },
        { name: "geo", type: "schemaMarkupGeo" },
        { name: "aggregateRating", type: "schemaMarkupAggregateRating" }
      ]
    }),
    import_sanity24.defineField({
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
              { title: "Primary locale only", value: "primary-only" }
            ],
            layout: "radio"
          }
        }
      ]
    })
  ],
  preview: {
    select: { baseUrl: "baseUrl", locale: "defaultLocale" },
    prepare: ({ baseUrl, locale }) => ({
      title: "Schema Markup Defaults",
      subtitle: `${baseUrl || "—"} · ${locale || "locale not set"}`
    })
  }
});

// src/schemas/singleton/seo-defaults.ts
var import_md9 = require("react-icons/md");
var import_sanity25 = require("sanity");
var seoDefaults = import_sanity25.defineType({
  name: "seoDefaults",
  title: "SEO Defaults",
  type: "document",
  groups: [
    {
      name: "metadata",
      title: "Metadata",
      default: true,
      icon: import_md9.MdSearch
    },
    {
      name: "social",
      title: "Social",
      icon: import_md9.MdShare
    }
  ],
  fields: [
    import_sanity25.defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      description: "The title of the site. Used for each page and in schema markup.",
      validation: (Rule) => Rule.required(),
      group: "metadata"
    }),
    import_sanity25.defineField({
      name: "pageTitleTemplate",
      title: "Page Title Template",
      type: "string",
      description: "Template for page titles. Use {siteTitle} and {pageTitle} for the page title. Example: {pageTitle} - {siteTitle}",
      validation: (Rule) => Rule.required(),
      initialValue: "{pageTitle} - {siteTitle}",
      group: "metadata"
    }),
    import_sanity25.defineField({
      name: "metaDescription",
      type: "metaDescription",
      group: "metadata",
      description: "The default meta description for all pages."
    }),
    import_sanity25.defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "Root URL of the website (e.g. https://your-domain.com). Used for canonical and OG tags.",
      validation: (Rule) => Rule.required(),
      group: "metadata"
    }),
    import_sanity25.defineField({
      name: "favicon",
      type: "favicon",
      group: "metadata"
    }),
    import_sanity25.defineField({
      name: "twitterHandle",
      title: "Twitter Handle",
      type: "string",
      description: "Example: @yourbrand",
      group: "social"
    })
  ],
  preview: {
    select: {
      title: "siteTitle",
      subtitle: "siteUrl"
    },
    prepare(selection) {
      return { title: "SEO Defaults" };
    }
  }
});

// src/schemas/singleton/social-networks.ts
var import_sanity26 = require("sanity");
var socialNetworks = import_sanity26.defineType({
  name: "socialNetworks",
  title: "Social Networks",
  type: "document",
  fields: [
    import_sanity26.defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    import_sanity26.defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required()
    })
  ]
});

// src/schemas/singleton/index.ts
var singleton_default = [schemaMarkupDefaults, seoDefaults, socialNetworks];

// src/index.ts
var src_default = import_sanity27.definePlugin({
  name: "crawl-me-maybe",
  schema: {
    types: [...fields_default, ...global_default, ...entities_default, ...singleton_default]
  },
  studio: {
    components: {
      layout: SeoLayoutWrapper
    }
  }
});
