// src/index.ts
import { definePlugin } from "sanity";

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

// src/components/core/SeoLayoutWrapper.tsx
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
function SeoLayoutWrapper(props) {
  return /* @__PURE__ */ jsxDEV2(SeoDefaultsProvider, {
    children: props.renderDefault(props)
  }, undefined, false, undefined, this);
}

// src/schemas/documents/global-seo-settings.ts
import { MdSearch, MdShare } from "react-icons/md";
import { defineField, defineType } from "sanity";
var global_seo_settings_default = defineType({
  name: "globalSeoSettings",
  title: "Global SEO Settings",
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
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      description: "The title of the site injected into the Page Title Template field below.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "pageTitleTemplate",
      title: "Page Title Template",
      type: "string",
      description: "Template for page titles. Use {siteTitle} and {pageTitle} for the page title. Example: {pageTitle} - {siteTitle}",
      validation: (Rule) => Rule.required(),
      initialValue: "{pageTitle} - {siteTitle}"
    }),
    defineField({
      name: "metaDescription",
      type: "metaDescription",
      description: "The default meta description for all pages."
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "Root URL of the website (e.g. https://your-domain.com). Used for canonical and Open Graph tags.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "favicon",
      type: "favicon"
    }),
    defineField({
      name: "twitterHandle",
      title: "Twitter Handle",
      type: "string",
      description: "Example: @yourbrand",
      validation: (rule) => rule.custom((val) => {
        if (!val)
          return true;
        if (typeof val !== "string")
          return "Twitter handle must be a string";
        if (!val.startsWith("@"))
          return "Twitter handle must start with @";
        return true;
      }),
      group: "social"
    }),
    defineField({
      name: "logo",
      title: "Global Logo",
      type: "image",
      description: "Logo used behind the scenes to populate Organization and WebSite schema markup."
    })
  ],
  preview: {
    prepare() {
      return { title: "Global SEO Settings" };
    }
  }
});

// src/schemas/documents/index.ts
var documents_default = [global_seo_settings_default];

// src/schemas/fields/favicon.ts
import { defineField as defineField2 } from "sanity";

// src/components/core/Favicon/FaviconPreview.tsx
import { Box as Box2, Card, Flex as Flex3, useRootTheme as useRootTheme2 } from "@sanity/ui";
import { useMemo } from "react";

// src/components/core/Favicon/WindowControls.tsx
import { Flex } from "@sanity/ui";
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
function WindowControls() {
  const CONTROLS = [
    { bg: "#ff5f57", title: "Close" },
    { bg: "#ffbd2e", title: "Minimize" },
    { bg: "#28c940", title: "Maximize" }
  ];
  return /* @__PURE__ */ jsxDEV3(Flex, {
    align: "center",
    style: {
      gap: 6,
      paddingRight: 16
    },
    children: CONTROLS.map((c, i) => /* @__PURE__ */ jsxDEV3("span", {
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
import { Flex as Flex2, Text, useRootTheme } from "@sanity/ui";

// src/components/core/Favicon/favicon-preview.module.css
var favicon_preview_module_default = {
  card: "card_znijeg",
  "image-preview": "image-preview_znijeg"
};

// src/components/core/Favicon/BrowserTab.tsx
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
function BrowserTab({
  url = "https://example.com",
  favicon = "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
  title = "Facebook"
}) {
  const theme = useRootTheme();
  return /* @__PURE__ */ jsxDEV4(Flex2, {
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
      /* @__PURE__ */ jsxDEV4("img", {
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
      /* @__PURE__ */ jsxDEV4(Flex2, {
        direction: "column",
        justify: "center",
        align: "center",
        children: /* @__PURE__ */ jsxDEV4(Text, {
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
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
function FaviconPreview(props) {
  const defaults = useSeoDefaults();
  const theme = useRootTheme2();
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
  return /* @__PURE__ */ jsxDEV5("div", {
    className: favicon_preview_module_default.card,
    children: [
      /* @__PURE__ */ jsxDEV5(Card, {
        "data-tab-display": true,
        "data-theme": theme.scheme,
        shadow: 2,
        marginBottom: 2,
        radius: 4,
        style: {
          width: "100%"
        },
        children: /* @__PURE__ */ jsxDEV5(Flex3, {
          paddingX: 4,
          paddingY: 2,
          justify: "start",
          align: "center",
          children: [
            /* @__PURE__ */ jsxDEV5(WindowControls, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV5(BrowserTab, {
              url,
              title: defaults?.siteTitle,
              favicon: faviconUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV5(BrowserTab, {}, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV5(Box2, {
        className: favicon_preview_module_default?.["image-preview"],
        children: props.renderDefault(props)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/schemas/fields/favicon.ts
var favicon_default = defineField2({
  name: "favicon",
  type: "image",
  components: {
    input: FaviconPreview
  },
  description: "The favicon of the site. To create the sharpest fallback images possible, use an SVG. Careful with transparent backgrounds, a user might have light or dark mode enabled.",
  group: "metadata"
});

// src/schemas/fields/meta-description.ts
import { defineField as defineField3 } from "sanity";
var meta_description_default = defineField3({
  name: "metaDescription",
  title: "Meta Description",
  type: "text",
  rows: 3,
  description: "The description of the page. Used for the meta description.",
  validation: (Rule) => Rule.max(160).warning("Long descriptions (over 160 characters) will be truncated by Google.")
});

// src/components/core/InputWithGlobalDefault.tsx
import { Box as Box3 } from "@sanity/ui";
import { MdCheck, MdWarning } from "react-icons/md";

// src/components/partials/CardWithIcon.tsx
import { Card as Card2, Flex as Flex4, Text as Text3 } from "@sanity/ui";
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
function CardWithIcon({
  icon,
  text,
  tone = "nuetral"
}) {
  const Icon = icon;
  return /* @__PURE__ */ jsxDEV6(Card2, {
    marginBottom: 3,
    tone,
    padding: 3,
    children: /* @__PURE__ */ jsxDEV6(Flex4, {
      gap: 2,
      align: "center",
      children: [
        Icon && /* @__PURE__ */ jsxDEV6(Icon, {
          size: 18
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV6(Text3, {
          size: 1,
          children: text
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// src/components/core/InputWithGlobalDefault.tsx
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
function InputWithGlobalDefault(props) {
  const { seoDefaults } = useSeoDefaults();
  const defaultFieldName = props?.schemaType?.options?.matchingDefaultField;
  if (!defaultFieldName) {
    console.warn("No default field name found for input: ", props?.schemaType?.name);
  }
  const value = props?.value;
  const hasDefault = defaultFieldName ? seoDefaults?.[defaultFieldName] : false;
  return /* @__PURE__ */ jsxDEV7("div", {
    children: [
      !value && !hasDefault && /* @__PURE__ */ jsxDEV7(CardWithIcon, {
        icon: MdWarning,
        tone: "critical",
        text: "This field does not have a global default set. Make sure to fill it in here."
      }, undefined, false, undefined, this),
      !value && hasDefault && /* @__PURE__ */ jsxDEV7(CardWithIcon, {
        icon: MdCheck,
        tone: "suggest",
        text: "This field is using the global default."
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV7(Box3, {
        children: props.renderDefault(props)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/components/core/PageSeoInput/PageSeoInput.tsx
import { Box as Box8, Flex as Flex10 } from "@sanity/ui";
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
import { Button, Flex as Flex6, Text as Text5 } from "@sanity/ui";
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
function ButtonWithIcon({
  icon,
  buttonProps = {},
  label
}) {
  const Icon = icon;
  return /* @__PURE__ */ jsxDEV8(Button, {
    ...buttonProps,
    children: /* @__PURE__ */ jsxDEV8(Flex6, {
      gap: 2,
      align: "center",
      justify: "center",
      children: [
        Icon && /* @__PURE__ */ jsxDEV8(Icon, {
          size: 17
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV8(Text5, {
          size: 1,
          weight: "semibold",
          children: label
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// src/components/socials/facebook/FacebookCard.tsx
import { Stack, Text as Text6, Box as Box4, Avatar, Flex as Flex7 } from "@sanity/ui";

// src/components/socials/facebook/FacebookCard.module.css
var FacebookCard_module_default = {
  facebookCard: "facebookCard_iq-4hA",
  header: "header_iq-4hA",
  image: "image_iq-4hA",
  cardSection: "cardSection_iq-4hA"
};

// src/components/partials/SocialCardWrapper.tsx
import { Card as Card4 } from "@sanity/ui";
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
function SocialCardWrapper(props) {
  return /* @__PURE__ */ jsxDEV9(Card4, {
    width: "100%",
    border: false,
    radius: 2,
    tone: "neutral",
    children: props.children
  }, undefined, false, undefined, this);
}

// src/components/socials/facebook/FacebookCard.tsx
import { jsxDEV as jsxDEV10 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV10(SocialCardWrapper, {
    children: [
      /* @__PURE__ */ jsxDEV10(Flex7, {
        gap: 2,
        padding: 3,
        className: FacebookCard_module_default.header,
        children: [
          /* @__PURE__ */ jsxDEV10(Avatar, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV10(Stack, {
            space: 2,
            children: [
              /* @__PURE__ */ jsxDEV10(Text6, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV10(Text6, {
                size: 1,
                muted: true,
                children: data.siteUrl
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV10(Box4, {
        children: /* @__PURE__ */ jsxDEV10("img", {
          className: FacebookCard_module_default.image,
          src: data.image,
          alt: "Facebook preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV10(Box4, {
        padding: 3,
        children: /* @__PURE__ */ jsxDEV10(Stack, {
          space: 3,
          children: [
            /* @__PURE__ */ jsxDEV10(Text6, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV10(Text6, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 60)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV10(Box4, {
              marginTop: 1,
              children: /* @__PURE__ */ jsxDEV10(Text6, {
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
import { Avatar as Avatar2, Box as Box5, Flex as Flex8, Stack as Stack2, Text as Text7, useRootTheme as useRootTheme3 } from "@sanity/ui";

// src/components/socials/google/GoogleEntry.module.css
var GoogleEntry_module_default = {
  googleCard: "googleCard_yJDEgw",
  title: "title_yJDEgw",
  site: "site_yJDEgw",
  desc: "desc_yJDEgw",
  cardSection: "cardSection_yJDEgw"
};

// src/components/socials/google/GoogleEntry.tsx
import { jsxDEV as jsxDEV11 } from "react/jsx-dev-runtime";
function GoogleEntry(props) {
  const fallback = {
    title: "My Awesome Page - MyWebsite",
    description: "A compelling meta description for Google search snippet. Explain what users can find inside!",
    siteUrl: "https://mywebsite.com/page",
    favicon: "https://placehold.co/32x32"
  };
  const data = { ...fallback, ...props };
  const theme = useRootTheme3();
  return /* @__PURE__ */ jsxDEV11(SocialCardWrapper, {
    children: /* @__PURE__ */ jsxDEV11(Box5, {
      padding: 3,
      children: /* @__PURE__ */ jsxDEV11(Stack2, {
        space: 3,
        children: [
          /* @__PURE__ */ jsxDEV11(Flex8, {
            align: "center",
            marginBottom: 2,
            gap: 2,
            children: [
              /* @__PURE__ */ jsxDEV11(Avatar2, {
                size: 2,
                src: data.favicon,
                alt: "Favicon"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV11(Stack2, {
                space: 2,
                children: [
                  /* @__PURE__ */ jsxDEV11(Text7, {
                    size: 1,
                    weight: "semibold",
                    className: GoogleEntry_module_default.site,
                    children: data.siteTitle
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV11(Text7, {
                    size: 1,
                    muted: true,
                    className: GoogleEntry_module_default.site,
                    children: data.siteUrl
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV11(Text7, {
            style: {
              color: theme.scheme === "light" ? "#1D11AC" : "#99C2FF"
            },
            weight: "medium",
            size: 3,
            className: GoogleEntry_module_default.title,
            children: truncate(data.title, 60)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV11(Text7, {
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
import { Avatar as Avatar3, Box as Box6, Flex as Flex9, Stack as Stack3, Text as Text8 } from "@sanity/ui";

// src/components/socials/twitter/TwitterCard.module.css
var TwitterCard_module_default = {
  twitterCard: "twitterCard_1NtJNQ",
  userRow: "userRow_1NtJNQ",
  imageLarge: "imageLarge_1NtJNQ",
  cardSection: "cardSection_1NtJNQ"
};

// src/components/socials/twitter/TwitterCard.tsx
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV12(SocialCardWrapper, {
    children: [
      /* @__PURE__ */ jsxDEV12(Flex9, {
        gap: 2,
        padding: 3,
        className: TwitterCard_module_default.userRow,
        children: [
          /* @__PURE__ */ jsxDEV12(Avatar3, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV12(Stack3, {
            space: 2,
            children: [
              /* @__PURE__ */ jsxDEV12(Text8, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV12(Text8, {
                size: 1,
                muted: true,
                children: data.twitterHandle
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV12(Box6, {
        children: /* @__PURE__ */ jsxDEV12("img", {
          className: TwitterCard_module_default.imageLarge,
          src: data.image,
          alt: "Twitter preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV12(Box6, {
        padding: 3,
        children: /* @__PURE__ */ jsxDEV12(Flex9, {
          direction: "column",
          gap: 4,
          children: [
            /* @__PURE__ */ jsxDEV12(Text8, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV12(Text8, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 70)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV12(Text8, {
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
import { Box as Box7, Text as Text9 } from "@sanity/ui";
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
function PreviewGroup({
  title,
  children
}) {
  return /* @__PURE__ */ jsxDEV13("div", {
    children: [
      /* @__PURE__ */ jsxDEV13(Box7, {
        marginBottom: 4,
        children: /* @__PURE__ */ jsxDEV13(Text9, {
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
import { jsxDEV as jsxDEV14 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV14("div", {
    children: [
      /* @__PURE__ */ jsxDEV14(Box8, {
        marginBottom: 4,
        width: "fill",
        children: /* @__PURE__ */ jsxDEV14(Flex10, {
          gap: 2,
          width: "fill",
          children: MODES.map((m) => /* @__PURE__ */ jsxDEV14(ButtonWithIcon, {
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
      currentMode === "preview" && /* @__PURE__ */ jsxDEV14(Flex10, {
        gap: 6,
        marginTop: 6,
        direction: "column",
        children: PREVIEW_GROUPS.map((group) => /* @__PURE__ */ jsxDEV14(PreviewGroup, {
          title: group.title,
          children: /* @__PURE__ */ jsxDEV14(group.component, {
            ...seoData
          }, undefined, false, undefined, this)
        }, group.name, false, undefined, this))
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/schemas/fields/metadata.ts
var metadata_default = {
  name: "pageMetadata",
  title: "Metadata",
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

// src/schemas/fields/search-indexing.ts
import { defineField as defineField4 } from "sanity";

// src/components/core/IndexingControls.tsx
import { set } from "sanity";
import { Button as Button3, Flex as Flex11, Stack as Stack4 } from "@sanity/ui";
import { useCallback as useCallback2 } from "react";
import { MdInfo, MdPlaylistRemove } from "react-icons/md";
import { IoArrowRedo } from "react-icons/io5";
import { jsxDEV as jsxDEV15 } from "react/jsx-dev-runtime";
function getNested(obj, key) {
  return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
}
function IndexingControls(props) {
  const { value = {}, onChange } = props;
  const noFollow = !!getNested(value, "noFollow");
  const noIndex = !!getNested(value, "noIndex");
  const setValue = useCallback2((key, val) => {
    onChange?.(set(val, [key]));
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
  return /* @__PURE__ */ jsxDEV15(Stack4, {
    space: 3,
    children: [
      /* @__PURE__ */ jsxDEV15(CardWithIcon, {
        icon: MdInfo,
        tone: noIndex && noFollow ? "critical" : "suggest",
        text: note
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV15(Flex11, {
        gap: 3,
        children: [
          /* @__PURE__ */ jsxDEV15(Button3, {
            width: "fill",
            icon: IoArrowRedo,
            mode: noFollow ? "default" : "ghost",
            selected: noFollow,
            text: "No Follow",
            tone: noFollow ? "critical" : "default",
            onClick: () => setValue("noFollow", !noFollow)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV15(Button3, {
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
import { Box as Box10 } from "@sanity/ui";
import { MdCheck as MdCheck2, MdWarning as MdWarning2 } from "react-icons/md";
import { jsxDEV as jsxDEV16 } from "react/jsx-dev-runtime";
// src/schemas/fields/search-indexing.ts
var search_indexing_default = defineField4({
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

// src/schemas/fields/index.ts
var fields_default = [search_indexing_default, favicon_default, metadata_default, meta_description_default];

// src/index.ts
var src_default = definePlugin({
  name: "crawl-me-maybe",
  schema: {
    types: [...fields_default, ...documents_default]
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

//# debugId=EE0B708D0319139E64756E2164756E21
