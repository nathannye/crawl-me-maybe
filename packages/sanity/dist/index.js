// src/index.ts
import { definePlugin } from "sanity";

// src/schemas/entities/webpage-entity.ts
import { defineType, defineField } from "sanity";
var schemaMarkupWebPageFields = defineType({
  name: "schemaMarkupWebPageFields",
  title: "WebPage Fields",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "inLanguage", type: "string" }),
    defineField({ name: "datePublished", type: "datetime" }),
    defineField({ name: "dateModified", type: "datetime" }),
    defineField({
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
import { defineType as defineType2, defineField as defineField2 } from "sanity";
var schemaMarkupArticleFields = defineType2({
  name: "schemaMarkupArticleFields",
  title: "Article Fields",
  type: "object",
  fields: [
    defineField2({
      name: "headline",
      type: "string",
      validation: (r) => r.required()
    }),
    defineField2({
      name: "author",
      title: "Author(s)",
      type: "array",
      of: [
        { type: "schemaMarkupPerson" },
        { type: "schemaMarkupOrganization" }
      ]
    }),
    defineField2({
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
import { defineType as defineType3, defineField as defineField3 } from "sanity";
var schemaMarkupProductFields = defineType3({
  name: "schemaMarkupProductFields",
  title: "Product Fields",
  type: "object",
  fields: [
    defineField3({
      name: "brand",
      title: "Brand",
      type: "schemaMarkupOrganization"
    }),
    defineField3({
      name: "mpn",
      type: "string",
      description: "Manufacturer part number."
    }),
    defineField3({
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
import { defineType as defineType4, defineField as defineField4 } from "sanity";
var schemaMarkupEventFields = defineType4({
  name: "schemaMarkupEventFields",
  title: "Event Fields",
  type: "object",
  fields: [
    defineField4({
      name: "name",
      type: "string",
      validation: (r) => r.required()
    }),
    defineField4({ name: "description", type: "text" }),
    defineField4({
      name: "startDate",
      type: "datetime",
      validation: (r) => r.required()
    }),
    defineField4({ name: "endDate", type: "datetime" }),
    defineField4({
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
    defineField4({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        defineField4({ name: "name", type: "string" }),
        defineField4({ name: "url", type: "url" }),
        defineField4({ name: "address", type: "schemaMarkupAddress" }),
        defineField4({ name: "geo", type: "schemaMarkupGeo" })
      ]
    }),
    defineField4({
      name: "organizer",
      title: "Organizer",
      type: "array",
      of: [
        { type: "schemaMarkupOrganization" },
        { type: "schemaMarkupPerson" }
      ]
    }),
    defineField4({
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
import { defineType as defineType5, defineField as defineField5 } from "sanity";
var schemaMarkupFAQPageFields = defineType5({
  name: "schemaMarkupFAQPageFields",
  title: "FAQ Page Fields",
  type: "object",
  fields: [
    defineField5({
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
import { defineType as defineType6, defineField as defineField6 } from "sanity";
var schemaMarkupPersonFields = defineType6({
  name: "schemaMarkupPersonFields",
  title: "Person Fields",
  type: "object",
  fields: [
    defineField6({
      name: "name",
      type: "string",
      validation: (r) => r.required()
    }),
    defineField6({
      name: "sameAs",
      title: "Profiles (sameAs)",
      type: "array",
      of: [{ type: "url" }]
    }),
    defineField6({
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
import { defineType as defineType7, defineField as defineField7 } from "sanity";
var schemaMarkupAboutPageFields = defineType7({
  name: "schemaMarkupAboutPageFields",
  title: "About Page Fields",
  type: "object",
  fields: [
    defineField7({
      name: "name",
      type: "string",
      description: "Name of the about page (defaults to page title)"
    }),
    defineField7({
      name: "description",
      type: "text",
      description: "Description of the about page (defaults to meta description)"
    }),
    defineField7({
      name: "inLanguage",
      type: "string",
      description: "Language code (e.g., 'en-US')"
    }),
    defineField7({
      name: "datePublished",
      type: "datetime",
      description: "When the page was first published"
    }),
    defineField7({
      name: "dateModified",
      type: "datetime",
      description: "When the page was last modified"
    }),
    defineField7({
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
import { defineType as defineType8, defineField as defineField8 } from "sanity";
var schemaMarkupContactPageFields = defineType8({
  name: "schemaMarkupContactPageFields",
  title: "Contact Page Fields",
  type: "object",
  fields: [
    defineField8({
      name: "name",
      type: "string",
      description: "Name of the contact page (defaults to page title)"
    }),
    defineField8({
      name: "description",
      type: "text",
      description: "Description of the contact page (defaults to meta description)"
    }),
    defineField8({
      name: "inLanguage",
      type: "string",
      description: "Language code (e.g., 'en-US')"
    }),
    defineField8({
      name: "datePublished",
      type: "datetime",
      description: "When the page was first published"
    }),
    defineField8({
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
import { MdBusiness } from "react-icons/md";
import { defineType as defineType9, defineField as defineField9 } from "sanity";
var schemaMarkupOrganization = defineType9({
  name: "schemaMarkupOrganization",
  icon: MdBusiness,
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
    defineField9({
      name: "name",
      title: "Name (Inline)",
      type: "string",
      description: "Inline fallback/override if no reference is set."
    }),
    defineField9({
      name: "url",
      title: "URL (Inline)",
      type: "url"
    }),
    defineField9({
      name: "logo",
      title: "Logo (Inline)",
      type: "image"
    }),
    defineField9({
      name: "department",
      title: "Department (Inline)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "schemaMarkupOrganization" }] }]
    }),
    defineField9({
      name: "contactPoint",
      title: "Contact Points",
      type: "array",
      description: "Contact information for the organization",
      of: [
        {
          type: "object",
          fields: [
            defineField9({
              name: "contactType",
              title: "Contact Type",
              type: "string",
              description: "e.g., customer service, sales, support",
              validation: (Rule) => Rule.required()
            }),
            defineField9({
              name: "telephone",
              title: "Telephone",
              type: "string",
              description: "Phone number including country code"
            }),
            defineField9({
              name: "email",
              title: "Email",
              type: "string",
              validation: (Rule) => Rule.email()
            }),
            defineField9({
              name: "url",
              title: "Contact URL",
              type: "url",
              description: "URL to contact form or page"
            }),
            defineField9({
              name: "areaServed",
              title: "Area Served",
              type: "array",
              of: [{ type: "string" }],
              description: "Geographic areas served (e.g., US, GB, Worldwide)",
              options: { layout: "tags" }
            }),
            defineField9({
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
    defineField9({
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
import { MdPerson } from "react-icons/md";
import { defineType as defineType10, defineField as defineField10 } from "sanity";
var schemaMarkupPerson = defineType10({
  name: "schemaMarkupPerson",
  title: "Person",
  type: "document",
  icon: MdPerson,
  validation: (Rule) => Rule.custom((val) => {
    if (!val)
      return true;
    const hasRef = !!val.person?._ref;
    const hasInline = !!val.name;
    return hasRef || hasInline || "Provide a person reference or set a Name.";
  }),
  fields: [
    defineField10({
      name: "name",
      title: "Name (Inline)",
      type: "string",
      description: "Inline fallback or override if no reference is set."
    }),
    defineField10({
      name: "url",
      title: "URL (Inline)",
      type: "url",
      description: "Personal website or profile URL."
    }),
    defineField10({
      name: "sameAs",
      title: "Profiles (sameAs)",
      type: "array",
      of: [{ type: "url" }],
      options: { layout: "tags" },
      description: "Social or professional profiles associated with this person."
    }),
    defineField10({
      name: "jobTitle",
      title: "Job Title (Optional)",
      type: "string",
      description: "Role or title, if relevant (optional, ignored by Google)."
    }),
    defineField10({
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
import { defineType as defineType11, defineField as defineField11 } from "sanity";
var schemaMarkupFAQItem = defineType11({
  name: "schemaMarkupFAQItem",
  title: "FAQ Item",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField11({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The question being answered. (Used as the Question name in JSON-LD)"
    }),
    defineField11({
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
import { defineType as defineType12, defineField as defineField12 } from "sanity";
var schemaMarkupAddress = defineType12({
  name: "schemaMarkupAddress",
  title: "Postal Address",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField12({
      name: "streetAddress",
      title: "Street Address",
      type: "string",
      description: 'Street and number, e.g. "123 Main St".'
    }),
    defineField12({
      name: "addressLocality",
      title: "City / Locality",
      type: "string"
    }),
    defineField12({
      name: "addressRegion",
      title: "State / Region",
      type: "string"
    }),
    defineField12({
      name: "postalCode",
      title: "Postal Code",
      type: "string"
    }),
    defineField12({
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
import { defineType as defineType13, defineField as defineField13 } from "sanity";
var schemaMarkupAggregateRating = defineType13({
  name: "schemaMarkupAggregateRating",
  title: "Aggregate Rating",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField13({
      name: "ratingValue",
      title: "Rating Value",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).precision(1),
      description: "Average rating value (usually between 1.0 and 5.0)."
    }),
    defineField13({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
      validation: (Rule) => Rule.min(0),
      description: "Total number of reviews included in this aggregate."
    }),
    defineField13({
      name: "bestRating",
      title: "Best Rating (Optional)",
      type: "number",
      description: "Optional maximum rating value (defaults to 5 if omitted)."
    }),
    defineField13({
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
import { defineType as defineType14 } from "sanity";
var schemaMarkupGeo = defineType14({
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
import { defineField as defineField14 } from "sanity";
var meta_description_default = defineField14({
  name: "metaDescription",
  title: "Meta Description",
  type: "text",
  rows: 3,
  description: "The description of the page. Used for the meta description.",
  validation: (Rule) => Rule.max(160).warning("Long descriptions (over 160 characters) will be truncated by Google.")
});

// src/components/core/InputWithGlobalDefault.tsx
import { Box } from "@sanity/ui";

// src/context/SeoDefaultsContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { useClient } from "sanity";
import { jsxDEV } from "react/jsx-dev-runtime";
var SeoDefaultsContext = createContext(null);
var SeoDefaultsProvider = ({ children }) => {
  const client = useClient({ apiVersion: "2025-01-11" });
  const [defaults, setDefaults] = useState({
    seoDefaults: null,
    schemaDefaults: null
  });
  const cleanup = useCallback(() => {
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
  useEffect(() => {
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
  return /* @__PURE__ */ jsxDEV(SeoDefaultsContext.Provider, {
    value: defaults,
    children
  }, undefined, false, undefined, this);
};
var useSeoDefaults = () => useContext(SeoDefaultsContext);

// src/components/core/InputWithGlobalDefault.tsx
import { MdCheck, MdWarning } from "react-icons/md";

// src/components/partials/CardWithIcon.tsx
import { Card, Flex, Text } from "@sanity/ui";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
function CardWithIcon({
  icon,
  text,
  tone = "nuetral"
}) {
  const Icon = icon;
  return /* @__PURE__ */ jsxDEV2(Card, {
    marginBottom: 3,
    tone,
    padding: 3,
    children: /* @__PURE__ */ jsxDEV2(Flex, {
      gap: 2,
      align: "center",
      children: [
        Icon && /* @__PURE__ */ jsxDEV2(Icon, {
          size: 18
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV2(Text, {
          size: 1,
          children: text
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// src/components/core/InputWithGlobalDefault.tsx
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
function InputWithGlobalDefault(props) {
  const { seoDefaults } = useSeoDefaults();
  const defaultFieldName = props?.schemaType?.options?.matchingDefaultField;
  if (!defaultFieldName) {
    console.warn("No default field name found for input: ", props?.schemaType?.name);
  }
  const value = props?.value;
  const hasDefault = defaultFieldName ? seoDefaults?.[defaultFieldName] : false;
  return /* @__PURE__ */ jsxDEV3("div", {
    children: [
      !value && !hasDefault && /* @__PURE__ */ jsxDEV3(CardWithIcon, {
        icon: MdWarning,
        tone: "critical",
        text: "This field does not have a global default set. Make sure to fill it in here."
      }, undefined, false, undefined, this),
      !value && hasDefault && /* @__PURE__ */ jsxDEV3(CardWithIcon, {
        icon: MdCheck,
        tone: "suggest",
        text: "This field is using the global default."
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV3(Box, {
        children: props.renderDefault(props)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/components/core/PageSeoInput/PageSeoInput.tsx
import { Box as Box6, Flex as Flex7 } from "@sanity/ui";
import { useEffect as useEffect2, useState as useState2 } from "react";
import { MdEdit, MdPreview } from "react-icons/md";
import { useClient as useClient2, useFormValue } from "sanity";

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
import { Button, Flex as Flex3, Text as Text3 } from "@sanity/ui";
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
function ButtonWithIcon({
  icon,
  buttonProps = {},
  label
}) {
  const Icon = icon;
  return /* @__PURE__ */ jsxDEV4(Button, {
    ...buttonProps,
    children: /* @__PURE__ */ jsxDEV4(Flex3, {
      gap: 2,
      align: "center",
      justify: "center",
      children: [
        Icon && /* @__PURE__ */ jsxDEV4(Icon, {
          size: 17
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV4(Text3, {
          size: 1,
          weight: "semibold",
          children: label
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// src/components/socials/facebook/FacebookCard.tsx
import { Stack, Text as Text4, Box as Box2, Avatar, Flex as Flex4 } from "@sanity/ui";

// src/components/socials/facebook/FacebookCard.module.css
var FacebookCard_module_default = {
  facebookCard: "facebookCard_iq-4hA",
  header: "header_iq-4hA",
  image: "image_iq-4hA",
  cardSection: "cardSection_iq-4hA"
};

// src/components/partials/SocialCardWrapper.tsx
import { Card as Card3 } from "@sanity/ui";
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
function SocialCardWrapper(props) {
  return /* @__PURE__ */ jsxDEV5(Card3, {
    border: false,
    radius: 2,
    tone: "neutral",
    children: props.children
  }, undefined, false, undefined, this);
}

// src/components/socials/facebook/FacebookCard.tsx
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV6(SocialCardWrapper, {
    children: [
      /* @__PURE__ */ jsxDEV6(Flex4, {
        gap: 2,
        padding: 3,
        className: FacebookCard_module_default.header,
        children: [
          /* @__PURE__ */ jsxDEV6(Avatar, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV6(Stack, {
            space: 2,
            children: [
              /* @__PURE__ */ jsxDEV6(Text4, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV6(Text4, {
                size: 1,
                muted: true,
                children: data.siteUrl
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV6(Box2, {
        children: /* @__PURE__ */ jsxDEV6("img", {
          className: FacebookCard_module_default.image,
          src: data.image,
          alt: "Facebook preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV6(Box2, {
        padding: 3,
        children: /* @__PURE__ */ jsxDEV6(Stack, {
          space: 3,
          children: [
            /* @__PURE__ */ jsxDEV6(Text4, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV6(Text4, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 60)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV6(Box2, {
              marginTop: 1,
              children: /* @__PURE__ */ jsxDEV6(Text4, {
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
import { Stack as Stack2, Text as Text5, Box as Box3, Flex as Flex5, Avatar as Avatar2 } from "@sanity/ui";

// src/components/socials/google/GoogleEntry.module.css
var GoogleEntry_module_default = {
  googleCard: "googleCard_yJDEgw",
  title: "title_yJDEgw",
  site: "site_yJDEgw",
  desc: "desc_yJDEgw",
  cardSection: "cardSection_yJDEgw"
};

// src/components/socials/google/GoogleEntry.tsx
import { useRootTheme } from "@sanity/ui";
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
function GoogleEntry(props) {
  const fallback = {
    title: "My Awesome Page - MyWebsite",
    description: "A compelling meta description for Google search snippet. Explain what users can find inside!",
    siteUrl: "https://mywebsite.com/page",
    favicon: "https://placehold.co/32x32"
  };
  const data = { ...fallback, ...props };
  const theme = useRootTheme();
  return /* @__PURE__ */ jsxDEV7(SocialCardWrapper, {
    children: /* @__PURE__ */ jsxDEV7(Box3, {
      padding: 3,
      children: /* @__PURE__ */ jsxDEV7(Stack2, {
        space: 3,
        children: [
          /* @__PURE__ */ jsxDEV7(Flex5, {
            align: "center",
            marginBottom: 2,
            gap: 2,
            children: [
              /* @__PURE__ */ jsxDEV7(Avatar2, {
                size: 2,
                src: data.favicon,
                alt: "Favicon"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV7(Stack2, {
                space: 2,
                children: [
                  /* @__PURE__ */ jsxDEV7(Text5, {
                    size: 1,
                    weight: "semibold",
                    className: GoogleEntry_module_default.site,
                    children: data.siteTitle
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV7(Text5, {
                    size: 1,
                    muted: true,
                    className: GoogleEntry_module_default.site,
                    children: data.siteUrl
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV7(Text5, {
            style: {
              color: theme.scheme === "light" ? "#1D11AC" : "#99C2FF"
            },
            weight: "medium",
            size: 3,
            className: GoogleEntry_module_default.title,
            children: truncate(data.title, 60)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV7(Text5, {
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
import { Stack as Stack3, Text as Text6, Box as Box4, Avatar as Avatar3, Flex as Flex6 } from "@sanity/ui";

// src/components/socials/twitter/TwitterCard.module.css
var TwitterCard_module_default = {
  twitterCard: "twitterCard_1NtJNQ",
  userRow: "userRow_1NtJNQ",
  imageLarge: "imageLarge_1NtJNQ",
  cardSection: "cardSection_1NtJNQ"
};

// src/components/socials/twitter/TwitterCard.tsx
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV8(SocialCardWrapper, {
    children: [
      /* @__PURE__ */ jsxDEV8(Flex6, {
        gap: 2,
        padding: 3,
        className: TwitterCard_module_default.userRow,
        children: [
          /* @__PURE__ */ jsxDEV8(Avatar3, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV8(Stack3, {
            space: 2,
            children: [
              /* @__PURE__ */ jsxDEV8(Text6, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV8(Text6, {
                size: 1,
                muted: true,
                children: data.twitterHandle
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV8(Box4, {
        children: /* @__PURE__ */ jsxDEV8("img", {
          className: TwitterCard_module_default.imageLarge,
          src: data.image,
          alt: "Twitter preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV8(Box4, {
        padding: 3,
        children: /* @__PURE__ */ jsxDEV8(Flex6, {
          direction: "column",
          gap: 4,
          children: [
            /* @__PURE__ */ jsxDEV8(Text6, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV8(Text6, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 70)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV8(Text6, {
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
import { Box as Box5, Text as Text7 } from "@sanity/ui";
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
function PreviewGroup({
  title,
  children
}) {
  return /* @__PURE__ */ jsxDEV9("div", {
    children: [
      /* @__PURE__ */ jsxDEV9(Box5, {
        marginBottom: 4,
        children: /* @__PURE__ */ jsxDEV9(Text7, {
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
import { jsxDEV as jsxDEV10 } from "react/jsx-dev-runtime";
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
  const client = useClient2({ apiVersion: "2025-01-11" });
  const MODES = [
    { name: "fields", title: "Fields", icon: MdEdit },
    { name: "preview", title: "Preview", icon: MdPreview }
  ];
  const [currentMode, setCurrentMode] = useState2(MODES[0]?.name);
  const [seoDefaults, setSeoDefaults] = useState2(null);
  useEffect2(() => {
    client.fetch(`*[_type == "seoDefaults"][0]`).then(setSeoDefaults);
  }, [client]);
  const document = useFormValue([]) || {};
  const seoData = {
    ...seoDefaults || {},
    ...props.value || {},
    title: concatenatePageTitle(document?.title, seoDefaults?.siteTitle, seoDefaults?.pageTitleTemplate)
  };
  return /* @__PURE__ */ jsxDEV10("div", {
    children: [
      /* @__PURE__ */ jsxDEV10(Box6, {
        marginBottom: 4,
        width: "fill",
        children: /* @__PURE__ */ jsxDEV10(Flex7, {
          gap: 2,
          width: "fill",
          children: MODES.map((m) => /* @__PURE__ */ jsxDEV10(ButtonWithIcon, {
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
      currentMode === "preview" && /* @__PURE__ */ jsxDEV10(Flex7, {
        gap: 6,
        marginTop: 6,
        direction: "column",
        children: PREVIEW_GROUPS.map((group) => /* @__PURE__ */ jsxDEV10(PreviewGroup, {
          title: group.title,
          children: /* @__PURE__ */ jsxDEV10(group.component, {
            ...seoData
          }, undefined, false, undefined, this)
        }, group.name, false, undefined, this))
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/schemas/fields/metadata/metadata.ts
var metadata_default = {
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
      name: "searchIndexing",
      type: "searchIndexing"
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
import { defineType as defineType15, defineField as defineField15 } from "sanity";

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
import { jsxDEV as jsxDEV11 } from "react/jsx-dev-runtime";
function PageSchemaMarkupInput(props) {
  return /* @__PURE__ */ jsxDEV11("div", {
    children: props.renderDefault(props)
  }, undefined, false, undefined, this);
}

// src/components/core/PageSchemaMarkupInput/SchemaMarkupTypeSelector.tsx
import { Box as Box7, Grid, useToast } from "@sanity/ui";
import { set } from "sanity";
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
function ButtonSelector(props) {
  const toast = useToast();
  const {
    elementProps: { id, onBlur, onFocus, placeholder, readOnly, ref, value },
    onChange,
    schemaType,
    validation
  } = props;
  const options = schemaType.options.list;
  const handleChange = (option) => {
    onChange(set(option));
  };
  const c = (c2) => {
    c2 = c2?.replaceAll("#", "")?.toLowerCase().trim();
    return c2;
  };
  return /* @__PURE__ */ jsxDEV12(Box7, {
    children: /* @__PURE__ */ jsxDEV12(Grid, {
      columns: 3,
      gap: 3,
      children: options.map((option, index) => {
        const { title, value: value2, icon, color } = option;
        const Icon = icon;
        return /* @__PURE__ */ jsxDEV12(ButtonWithIcon, {
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
import {
  MdArticle,
  MdBusiness as MdBusiness2,
  MdEvent,
  MdPageview,
  MdQuestionAnswer,
  MdShoppingBag,
  MdWeb,
  MdPerson as MdPerson2,
  MdStore,
  MdCreate,
  MdPeople,
  MdEmail
} from "react-icons/md";
var SCHEMA_MARKUP_TYPES = {
  AboutPage: { title: "AboutPage", value: "AboutPage", icon: MdPeople },
  ContactPage: { title: "ContactPage", value: "ContactPage", icon: MdEmail },
  Article: { title: "Article", value: "Article", icon: MdArticle },
  CreativeWork: {
    title: "CreativeWork",
    value: "CreativeWork",
    icon: MdCreate
  },
  Event: { title: "Event", value: "Event", icon: MdEvent },
  FAQPage: { title: "FAQPage", value: "FAQPage", icon: MdQuestionAnswer },
  LocalBusiness: {
    title: "LocalBusiness",
    value: "LocalBusiness",
    icon: MdStore
  },
  Organization: {
    title: "Organization",
    value: "Organization",
    icon: MdBusiness2
  },
  Person: { title: "Person", value: "Person", icon: MdPerson2 },
  Product: { title: "Product", value: "Product", icon: MdShoppingBag },
  WebPage: { title: "WebPage", value: "WebPage", icon: MdPageview },
  WebSite: { title: "WebSite", value: "WebSite", icon: MdWeb }
};

// src/schemas/fields/schema-markup/schemaMarkup.ts
var schemaMarkup = defineType15({
  name: "schemaMarkup",
  title: "Schema Markup",
  components: {
    input: PageSchemaMarkupInput
  },
  type: "object",
  fields: [
    defineField15({
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
    defineField15({
      name: "name",
      type: "string",
      hidden: ({ parent }) => !needs(parent, "name")
    }),
    defineField15({
      name: "description",
      type: "text",
      rows: 3,
      hidden: ({ parent }) => !needs(parent, "description")
    }),
    defineField15({
      name: "inLanguage",
      type: "string",
      hidden: ({ parent }) => !needs(parent, "inLanguage")
    }),
    defineField15({
      name: "article",
      type: "schemaMarkupArticleFields",
      hidden: ({ parent }) => parent?.type !== "Article"
    }),
    defineField15({
      name: "product",
      type: "schemaMarkupProductFields",
      hidden: ({ parent }) => parent?.type !== "Product"
    })
  ],
  preview: { select: { title: "type", subtitle: "name" } }
});

// src/schemas/fields/metadata/indexing.ts
import { defineField as defineField16 } from "sanity";

// src/components/core/IndexingControls.tsx
import { set as set2 } from "sanity";
import { Button as Button4, Flex as Flex9, Stack as Stack4 } from "@sanity/ui";
import { useCallback as useCallback2 } from "react";
import { MdInfo, MdPlaylistRemove } from "react-icons/md";
import { IoArrowRedo } from "react-icons/io5";
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
function getNested(obj, key) {
  return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
}
function IndexingControls(props) {
  const { value = {}, onChange } = props;
  const noFollow = !!getNested(value, "noFollow");
  const noIndex = !!getNested(value, "noIndex");
  const setValue = useCallback2((key, val) => {
    onChange?.(set2(val, [key]));
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
  return /* @__PURE__ */ jsxDEV13(Stack4, {
    space: 3,
    children: [
      /* @__PURE__ */ jsxDEV13(CardWithIcon, {
        icon: MdInfo,
        tone: noIndex && noFollow ? "critical" : "suggest",
        text: note
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV13(Flex9, {
        gap: 3,
        children: [
          /* @__PURE__ */ jsxDEV13(Button4, {
            width: "fill",
            icon: IoArrowRedo,
            mode: noFollow ? "default" : "ghost",
            selected: noFollow,
            text: "No Follow",
            tone: noFollow ? "critical" : "default",
            onClick: () => setValue("noFollow", !noFollow)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV13(Button4, {
            width: "fill",
            icon: MdPlaylistRemove,
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
import { Box as Box9 } from "@sanity/ui";
import { MdCheck as MdCheck2, MdWarning as MdWarning2 } from "react-icons/md";
import { jsxDEV as jsxDEV14 } from "react/jsx-dev-runtime";
// src/components/core/SeoLayoutWrapper.tsx
import { jsxDEV as jsxDEV15 } from "react/jsx-dev-runtime";
function SeoLayoutWrapper(props) {
  return /* @__PURE__ */ jsxDEV15(SeoDefaultsProvider, {
    children: props.renderDefault(props)
  }, undefined, false, undefined, this);
}
// src/schemas/fields/metadata/indexing.ts
var indexing_default = defineField16({
  name: "searchIndexing",
  title: "Search Indexing",
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
import { defineField as defineField17 } from "sanity";

// src/components/core/Favicon/FaviconPreview.tsx
import { Box as Box11, Card as Card9, Flex as Flex13, useRootTheme as useRootTheme3 } from "@sanity/ui";
import { useMemo } from "react";

// src/components/core/Favicon/WindowControls.tsx
import { Flex as Flex11 } from "@sanity/ui";
import { jsxDEV as jsxDEV16 } from "react/jsx-dev-runtime";
function WindowControls() {
  const CONTROLS = [
    { bg: "#ff5f57", title: "Close" },
    { bg: "#ffbd2e", title: "Minimize" },
    { bg: "#28c940", title: "Maximize" }
  ];
  return /* @__PURE__ */ jsxDEV16(Flex11, {
    align: "center",
    style: {
      gap: 6,
      paddingRight: 16
    },
    children: CONTROLS.map((c, i) => /* @__PURE__ */ jsxDEV16("span", {
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
import { Flex as Flex12, Text as Text12, useRootTheme as useRootTheme2 } from "@sanity/ui";

// src/components/core/Favicon/favicon-preview.module.css
var favicon_preview_module_default = {
  card: "card_znijeg",
  "image-preview": "image-preview_znijeg"
};

// src/components/core/Favicon/BrowserTab.tsx
import { jsxDEV as jsxDEV17 } from "react/jsx-dev-runtime";
function BrowserTab({
  url = "https://example.com",
  favicon = "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
  title = "Facebook"
}) {
  const theme = useRootTheme2();
  return /* @__PURE__ */ jsxDEV17(Flex12, {
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
      /* @__PURE__ */ jsxDEV17("img", {
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
      /* @__PURE__ */ jsxDEV17(Flex12, {
        direction: "column",
        justify: "center",
        align: "center",
        children: /* @__PURE__ */ jsxDEV17(Text12, {
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
import { buildSrc } from "@sanity-image/url-builder";
import { useDataset, useProjectId } from "sanity";
import { jsxDEV as jsxDEV18 } from "react/jsx-dev-runtime";
function FaviconPreview(props) {
  const defaults = useSeoDefaults();
  const theme = useRootTheme3();
  const dataset = useDataset();
  const projectId = useProjectId();
  const url = useMemo(() => {
    const domain = defaults?.siteUrl ? defaults.siteUrl : "https://example.com";
    return domain.replace("https://", "");
  }, [defaults]);
  const faviconUrl = useMemo(() => {
    return props.value?.asset?._ref ? buildSrc({
      id: props.value?.asset?._ref,
      baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`
    })?.src : null;
  }, [props.value?.asset?._ref, projectId, dataset]);
  return /* @__PURE__ */ jsxDEV18("div", {
    className: favicon_preview_module_default.card,
    children: [
      /* @__PURE__ */ jsxDEV18(Card9, {
        "data-tab-display": true,
        "data-theme": theme.scheme,
        shadow: 2,
        marginBottom: 2,
        radius: 4,
        style: {
          width: "100%"
        },
        children: /* @__PURE__ */ jsxDEV18(Flex13, {
          paddingX: 4,
          paddingY: 2,
          justify: "start",
          align: "center",
          children: [
            /* @__PURE__ */ jsxDEV18(WindowControls, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV18(BrowserTab, {
              url,
              title: defaults?.siteTitle,
              favicon: faviconUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV18(BrowserTab, {}, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV18(Box11, {
        className: favicon_preview_module_default?.["image-preview"],
        children: props.renderDefault(props)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/schemas/fields/metadata/favicon.ts
var favicon_default = defineField17({
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
  metadata_default,
  meta_description_default
];

// src/schemas/singleton/schema-defaults.ts
import { AiOutlineGlobal } from "react-icons/ai";
import { MdSettingsSuggest } from "react-icons/md";
import { defineType as defineType16, defineField as defineField18 } from "sanity";
import { IoSparklesSharp } from "react-icons/io5";
var schemaMarkupDefaults = defineType16({
  name: "schemaMarkupDefaults",
  title: "Schema Markup Defaults",
  type: "document",
  groups: [
    {
      name: "global",
      title: "Global Defaults",
      default: true,
      icon: AiOutlineGlobal
    },
    {
      name: "automapping",
      title: "Automapping",
      icon: IoSparklesSharp
    },
    {
      name: "type-specific",
      title: "Type-Specific Defaults",
      icon: MdSettingsSuggest
    }
  ],
  fields: [
    defineField18({
      name: "sameAs",
      title: "Global Profiles (sameAs)",
      type: "array",
      group: "global",
      of: [{ type: "url" }],
      description: "Social/profile URLs applied when relevant."
    }),
    defineField18({
      name: "organization",
      title: "Default Organization",
      group: "global",
      type: "reference",
      to: [{ type: "schemaMarkupOrganization" }],
      description: "Used as publisher/brand when none specified."
    }),
    defineField18({
      name: "publisher",
      title: "Default Publisher (Overrides Organization)",
      group: "global",
      type: "reference",
      to: [{ type: "schemaMarkupOrganization" }]
    }),
    defineField18({
      name: "logo",
      title: "Global Logo",
      group: "global",
      type: "image",
      description: "Default logo used for Organization and WebSite schemas when no specific logo is provided."
    }),
    defineField18({
      name: "imageFallback",
      title: "Default Image",
      group: "global",
      type: "image",
      description: "Used if an entity has no image set or auto-mapped."
    }),
    defineField18({
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
    defineField18({
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
    defineField18({
      name: "webSite",
      title: "WebSite Defaults",
      group: "type-specific",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "publisher", type: "schemaMarkupOrganization" },
        defineField18({
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
    defineField18({
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
    defineField18({
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
    defineField18({
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
    defineField18({
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
    defineField18({
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
    defineField18({
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
import { MdSearch, MdShare } from "react-icons/md";
import { defineField as defineField19, defineType as defineType17 } from "sanity";
var seoDefaults = defineType17({
  name: "seoDefaults",
  title: "SEO Defaults",
  type: "document",
  groups: [
    {
      name: "metadata",
      title: "Metadata",
      default: true,
      icon: MdSearch
    },
    {
      name: "social",
      title: "Social",
      icon: MdShare
    }
  ],
  fields: [
    defineField19({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      description: "The title of the site. Used for each page and in schema markup.",
      validation: (Rule) => Rule.required(),
      group: "metadata"
    }),
    defineField19({
      name: "pageTitleTemplate",
      title: "Page Title Template",
      type: "string",
      description: "Template for page titles. Use {siteTitle} and {pageTitle} for the page title. Example: {pageTitle} - {siteTitle}",
      validation: (Rule) => Rule.required(),
      initialValue: "{pageTitle} - {siteTitle}",
      group: "metadata"
    }),
    defineField19({
      name: "metaDescription",
      type: "metaDescription",
      group: "metadata",
      description: "The default meta description for all pages."
    }),
    defineField19({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "Root URL of the website (e.g. https://your-domain.com). Used for canonical and OG tags.",
      validation: (Rule) => Rule.required(),
      group: "metadata"
    }),
    defineField19({
      name: "favicon",
      type: "favicon",
      group: "metadata"
    }),
    defineField19({
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
import { defineField as defineField20, defineType as defineType18 } from "sanity";
var socialNetworks = defineType18({
  name: "socialNetworks",
  title: "Social Networks",
  type: "document",
  fields: [
    defineField20({
      name: "platform",
      title: "Platform",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField20({
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
var src_default = definePlugin({
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
export {
  src_default as default
};

//# debugId=05534D09A401D7C364756E2164756E21
