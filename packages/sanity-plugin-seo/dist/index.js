
(function() {
  var id = "__crawl-me-maybe-seo-styles__";
  if (typeof document === "undefined" || document.getElementById(id)) return;
  var style = document.createElement("style");
  style.id = id;
  style.textContent = "/* src/components/core/Favicon/favicon-preview.module.css */\n.card_znijeg[data-theme=\"dark\"] {\n  --card-bg: #22242a;\n  --tab-bg: #22242a;\n  --tab-shadow: 0px 1.5px 3px 0px #181a1f, 0px .5px .5px .2px #23272b;\n  --tab-border: 1.5px solid #32353b;\n  --tab-favicon-bg: #22242a;\n  --tab-favicon-border: 1px solid #44464a;\n  --tab-url-text-color: #e1e6f0;\n}\n\n.card_znijeg[data-theme=\"light\"] {\n  --card-bg: #fff;\n  --tab-bg: #fff;\n  --tab-shadow: 0px 1.5px 3px 0px #ececec, 0px .5px .5px .2px #d4d9db;\n  --tab-border: 1.5px solid #e7ebed;\n  --tab-favicon-bg: #fff;\n  --tab-favicon-border: 1px solid #e5e5e5;\n  --tab-url-text-color: #242629;\n}\n\n.card_znijeg [data-tab-display] {\n  background: var(--tab-bg);\n  font-family: \"system-ui\", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;\n}\n\n.image-preview_znijeg img {\n  background: #ececec !important;\n}\n\n/* src/components/socials/facebook/FacebookCard.module.css */\n.facebookCard_iq-4hA {\n  box-sizing: border-box;\n  overflow: hidden;\n  background: #fff;\n  border: 1px solid #1877f2;\n  width: 100%;\n  margin: 0 auto;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}\n\n.header_iq-4hA {\n  display: flex;\n  border-bottom: 1px solid #f0f2f5;\n  align-items:  center;\n  gap: 1.2rem;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n.imageWrapper_iq-4hA {\n  overflow: hidden;\n  width: 100%;\n  max-width: 100%;\n}\n\n.image_iq-4hA {\n  aspect-ratio: 1.91;\n  object-fit: cover;\n  display: block;\n  border-bottom: 1px solid #f0f2f5;\n  width: 100%;\n  max-width: 100%;\n}\n\n@media (max-width: 600px) {\n  .facebookCard_iq-4hA {\n    max-width: 100%;\n  }\n\n  .header_iq-4hA {\n    gap: .6rem;\n  }\n}\n\n/* src/components/socials/google/GoogleEntry.module.css */\n.googleCard_yJDEgw {\n  box-sizing: border-box;\n  background: #fff;\n  border: 1px solid #e1e4e8;\n  max-width: 550px;\n  margin: 0 auto 24px;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}\n\n.title_yJDEgw {\n  color: #1a0dab;\n  margin-bottom: .25em;\n}\n\n.site_yJDEgw {\n  color: #202124;\n  margin-bottom: .2em;\n  font-size: .97em;\n}\n\n.desc_yJDEgw {\n  color: #4d5156;\n}\n\n.cardSection_yJDEgw {\n  margin: 16px 0;\n}\n\n@media (max-width: 600px) {\n  .googleCard_yJDEgw {\n    max-width: 99vw;\n  }\n}\n\n/* src/components/socials/linkedin/LinkedInCard.module.css */\n.linkedInCard_EFV6Wg {\n  box-sizing: border-box;\n  overflow: hidden;\n  background: #fff;\n  border: 1px solid #0a66c2;\n  width: 100%;\n  margin: 0 auto;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}\n\n.header_EFV6Wg {\n  display: flex;\n  border-bottom: 1px solid #e6edf5;\n  align-items:  center;\n  gap: 1.2rem;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n.imageWrapper_EFV6Wg {\n  overflow: hidden;\n  width: 100%;\n  max-width: 100%;\n}\n\n.image_EFV6Wg {\n  aspect-ratio: 1.91;\n  object-fit: cover;\n  display: block;\n  border-bottom: 1px solid #e6edf5;\n  width: 100%;\n  max-width: 100%;\n}\n\n@media (max-width: 600px) {\n  .linkedInCard_EFV6Wg {\n    max-width: 100%;\n  }\n\n  .header_EFV6Wg {\n    gap: .6rem;\n  }\n}\n\n/* src/components/socials/twitter/TwitterCard.module.css */\n.twitterCard_1NtJNQ {\n  box-sizing: border-box;\n  overflow: hidden;\n  background: #fff;\n  border: 1px solid #1da1f2;\n  width: 100%;\n  max-width: 500px;\n  margin: 0 auto;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}\n\n.userRow_1NtJNQ {\n  display: flex;\n  border-bottom: 1px solid #eaf5fe;\n  align-items:  center;\n  gap: 1.2rem;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n.imageWrapper_1NtJNQ {\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  padding: 0 12px;\n}\n\n.imageLarge_1NtJNQ {\n  aspect-ratio: 1.91;\n  object-fit: cover;\n  display: block;\n  border-radius: 12px;\n  width: 100%;\n  max-width: 100%;\n  margin: 12px 0 18px;\n}\n\n@media (max-width: 600px) {\n  .twitterCard_1NtJNQ {\n    max-width: 100%;\n  }\n\n  .userRow_1NtJNQ {\n    gap: .6rem;\n  }\n}\n";
  document.head.appendChild(style);
})();
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
  const sub = useCallback((query, property) => {
    return client.listen(query).subscribe((update) => {
      if (update.result) {
        setDefaults((prev) => ({
          ...prev,
          [property]: update.result
        }));
      }
    });
  }, [client]);
  useEffect(() => {
    const seoSub = sub(`*[_type == "globalSeoSettings"][0]`, "seoDefaults");
    const schemaSub = sub(`*[_type == "schemaMarkupDefaults"][0]`, "schemaDefaults");
    cleanup.seoSub = seoSub;
    cleanup.schemaSub = schemaSub;
    client.fetch(`*[_type == "globalSeoSettings"][0]`).then((seoDefaults) => setDefaults((prev) => ({
      ...prev,
      seoDefaults
    })));
    client.fetch(`*[_type == "schemaMarkupDefaults"][0]`).then((schemaDefaults) => setDefaults((prev) => ({
      ...prev,
      schemaDefaults
    })));
    return cleanup;
  }, [client, cleanup, sub]);
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

// src/components/core/PageTitleTemplateInput.tsx
import { Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { useRef, useState as useState2 } from "react";
import { set } from "sanity";
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
var TEMPLATE_TOKENS = ["pageTitle", "siteTitle"];
var TOKEN_REGEX = /\{(pageTitle|siteTitle)\}/g;
function findTokenRangeForDelete(value, caret, key) {
  let match = TOKEN_REGEX.exec(value);
  while (match !== null) {
    const tokenStart = match.index;
    const tokenEnd = tokenStart + match[0].length;
    if (key === "Backspace") {
      if (caret > tokenStart && caret <= tokenEnd) {
        return { start: tokenStart, end: tokenEnd };
      }
    } else if (caret >= tokenStart && caret < tokenEnd) {
      return { start: tokenStart, end: tokenEnd };
    }
    match = TOKEN_REGEX.exec(value);
  }
  return null;
}
function PageTitleTemplateInput(props) {
  const inputRef = useRef(null);
  const [showTokenHints, setShowTokenHints] = useState2(false);
  const value = typeof props.value === "string" ? props.value : "";
  const applyValue = (nextValue, caretPosition) => {
    props.onChange(set(nextValue));
    if (caretPosition === undefined)
      return;
    requestAnimationFrame(() => {
      if (!inputRef.current)
        return;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(caretPosition, caretPosition);
    });
  };
  const insertToken = (tokenName) => {
    const tokenText = `{${tokenName}}`;
    const selectionStart = inputRef.current?.selectionStart ?? value.length;
    const selectionEnd = inputRef.current?.selectionEnd ?? selectionStart;
    const shouldReplaceLeadingBrace = selectionStart > 0 && selectionStart === selectionEnd && value[selectionStart - 1] === "{";
    const start = shouldReplaceLeadingBrace ? selectionStart - 1 : selectionStart;
    const nextValue = value.slice(0, start) + tokenText + value.slice(selectionEnd);
    applyValue(nextValue, start + tokenText.length);
    setShowTokenHints(false);
  };
  return /* @__PURE__ */ jsxDEV3(Stack, {
    space: 3,
    children: [
      /* @__PURE__ */ jsxDEV3(TextInput, {
        value,
        ref: (node) => {
          inputRef.current = node;
        },
        onChange: (event) => {
          props.onChange(set(event.currentTarget.value));
        },
        onKeyDown: (event) => {
          if (event.key === "{") {
            setShowTokenHints(true);
            return;
          }
          if (event.key === "Escape") {
            setShowTokenHints(false);
            return;
          }
          if ((event.key === "Backspace" || event.key === "Delete") && inputRef.current?.selectionStart === inputRef.current?.selectionEnd) {
            const caret = inputRef.current?.selectionStart ?? 0;
            const tokenRange = findTokenRangeForDelete(value, caret, event.key);
            if (tokenRange) {
              event.preventDefault();
              const nextValue = value.slice(0, tokenRange.start) + value.slice(tokenRange.end);
              applyValue(nextValue, tokenRange.start);
            }
          }
        },
        onBlur: () => {
          setTimeout(() => setShowTokenHints(false), 80);
        },
        placeholder: "{pageTitle} - {siteTitle}"
      }, undefined, false, undefined, this),
      showTokenHints && /* @__PURE__ */ jsxDEV3(Card, {
        tone: "primary",
        border: true,
        radius: 2,
        padding: 2,
        children: /* @__PURE__ */ jsxDEV3(Stack, {
          gap: 3,
          children: [
            /* @__PURE__ */ jsxDEV3(Text, {
              size: 1,
              muted: true,
              children: "Insert template variable"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV3(Flex, {
              gap: 2,
              children: TEMPLATE_TOKENS.map((tokenName) => /* @__PURE__ */ jsxDEV3("button", {
                type: "button",
                onMouseDown: (event) => {
                  event.preventDefault();
                  insertToken(tokenName);
                },
                style: {
                  border: "1px solid var(--card-border-color)",
                  borderRadius: 6,
                  background: "var(--card-bg-color)",
                  padding: "10px 10px",
                  cursor: "pointer"
                },
                children: /* @__PURE__ */ jsxDEV3(Text, {
                  size: 1,
                  children: `{${tokenName}}`
                }, undefined, false, undefined, this)
              }, tokenName, false, undefined, this))
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/schemas/documents/global-seo-settings.ts
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
      components: {
        input: PageTitleTemplateInput
      },
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
      validation: (Rule) => Rule.custom((value) => {
        if (!value)
          return "Site URL is required";
        if (typeof value !== "string")
          return "Site URL must be a string";
        if (!value.startsWith("https://"))
          return "Site URL must start with https://";
        return true;
      })
    }),
    defineField({
      name: "defaultMetaImage",
      type: "metaImage",
      description: "The default meta image for all pages if not overridden on the page."
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
import { Box, Card as Card2, Flex as Flex4, useRootTheme } from "@sanity/ui";
import { buildSrc } from "@sanity-image/url-builder";
import { useEffect as useEffect2, useMemo, useRef as useRef2, useState as useState3 } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useDataset, useProjectId } from "sanity";

// src/components/core/Favicon/BrowserTab.tsx
import { Flex as Flex2, Text as Text2 } from "@sanity/ui";

// src/components/core/Favicon/favicon-preview.module.css
var favicon_preview_module_default = {
  card: "card_znijeg",
  "image-preview": "image-preview_znijeg"
};

// src/components/core/Favicon/BrowserTab.tsx
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
function BrowserTab({
  favicon = "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
  title = "Your Site",
  scheme = "light"
}) {
  return /* @__PURE__ */ jsxDEV4(Flex2, {
    gap: 2,
    "data-theme": scheme,
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
        src: favicon ?? undefined,
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
        children: /* @__PURE__ */ jsxDEV4(Text2, {
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

// src/components/core/Favicon/WindowControls.tsx
import { Flex as Flex3 } from "@sanity/ui";
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
function WindowControls() {
  const CONTROLS = [
    { bg: "#ff5f57", title: "Close" },
    { bg: "#ffbd2e", title: "Minimize" },
    { bg: "#28c940", title: "Maximize" }
  ];
  return /* @__PURE__ */ jsxDEV5(Flex3, {
    align: "center",
    style: {
      gap: 6,
      paddingRight: 16
    },
    children: CONTROLS.map((c, i) => /* @__PURE__ */ jsxDEV5("span", {
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

// src/components/core/Favicon/FaviconPreview.tsx
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
function FaviconPreview(props) {
  const defaults = useSeoDefaults();
  const theme = useRootTheme();
  const dataset = useDataset();
  const projectId = useProjectId();
  const [previewSchemeOverride, setPreviewSchemeOverride] = useState3(null);
  const lastGlobalScheme = useRef2(theme.scheme);
  const faviconUrl = useMemo(() => {
    return props.value?.asset?._ref ? buildSrc({
      id: props.value?.asset?._ref,
      baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`
    })?.src : null;
  }, [props.value?.asset?._ref, projectId, dataset]);
  useEffect2(() => {
    if (lastGlobalScheme.current !== theme.scheme) {
      lastGlobalScheme.current = theme.scheme;
      setPreviewSchemeOverride(null);
    }
  }, [theme.scheme]);
  const previewScheme = previewSchemeOverride ?? theme.scheme;
  return /* @__PURE__ */ jsxDEV6("div", {
    className: favicon_preview_module_default.card,
    children: [
      /* @__PURE__ */ jsxDEV6(Card2, {
        "data-tab-display": true,
        "data-theme": previewScheme,
        shadow: 2,
        marginBottom: 2,
        radius: 4,
        style: {
          width: "100%"
        },
        children: /* @__PURE__ */ jsxDEV6(Flex4, {
          paddingX: 4,
          paddingY: 2,
          justify: "flex-start",
          align: "center",
          children: [
            /* @__PURE__ */ jsxDEV6(WindowControls, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV6(BrowserTab, {
              title: defaults?.siteTitle,
              favicon: faviconUrl,
              scheme: previewScheme
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV6(BrowserTab, {
              title: "Facebook",
              scheme: previewScheme
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV6("button", {
              type: "button",
              title: "Toggle favicon preview theme",
              "aria-label": "Toggle favicon preview theme",
              onClick: () => {
                const currentScheme = previewSchemeOverride ?? theme.scheme;
                setPreviewSchemeOverride(currentScheme === "dark" ? "light" : "dark");
              },
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "auto",
                width: 24,
                height: 24,
                borderRadius: 999,
                border: "1px solid var(--card-border-color)",
                background: "var(--card-bg-color)",
                color: "var(--card-muted-fg-color)",
                cursor: "pointer"
              },
              children: previewScheme === "dark" ? /* @__PURE__ */ jsxDEV6(MdLightMode, {
                size: 14
              }, undefined, false, undefined, this) : /* @__PURE__ */ jsxDEV6(MdDarkMode, {
                size: 14
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV6(Box, {
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
var MIN_CHARACTERS = 120;
var MAX_CHARACTERS = 160;
var meta_description_default = defineField3({
  name: "metaDescription",
  title: "Meta Description",
  type: "text",
  rows: 3,
  description: `The description of the page used in meta tags. ${MIN_CHARACTERS}-${MAX_CHARACTERS} characters is recommended to avoid truncation.`,
  validation: (Rule) => Rule.custom((value) => {
    if (typeof value === "string" && value.length > 0 && value.length < MIN_CHARACTERS) {
      return `Short descriptions (under ${MIN_CHARACTERS} characters) could be more descriptive.`;
    }
    if (typeof value === "string" && value.length > MAX_CHARACTERS) {
      return `Long descriptions (over ${MAX_CHARACTERS} characters) will be truncated in search results.`;
    }
    return true;
  }).warning()
});

// src/schemas/fields/meta-image.ts
import { defineField as defineField4 } from "sanity";
var meta_image_default = defineField4({
  name: "metaImage",
  title: "Meta Image",
  type: "image",
  description: "An image displayed on social media platforms when the site is linked"
});

// src/schemas/fields/meta-title.ts
import { defineField as defineField5 } from "sanity";
var MIN_CHARACTERS2 = 50;
var MAX_CHARACTERS2 = 60;
var meta_title_default = defineField5({
  name: "metaTitle",
  title: "Meta Title",
  type: "string",
  description: "The title of the page used in meta tags.",
  validation: (Rule) => Rule.custom((value) => {
    if (typeof value === "string" && value.length > 0 && value.length < MIN_CHARACTERS2) {
      return `Short titles (under ${MIN_CHARACTERS2} characters) could be more descriptive.`;
    }
    if (typeof value === "string" && value.length > MAX_CHARACTERS2) {
      return `Long titles (over ${MAX_CHARACTERS2} characters) will be truncated in search results.`;
    }
    return true;
  }).warning()
});

// src/components/core/InputWithGlobalDefault.tsx
import { Box as Box2, Card as Card4, Flex as Flex6, Stack as Stack2, Text as Text4 } from "@sanity/ui";
import { buildSrc as buildSrc2 } from "@sanity-image/url-builder";
import { useMemo as useMemo2 } from "react";
import { MdCheck, MdWarning } from "react-icons/md";
import { useDataset as useDataset2, useProjectId as useProjectId2 } from "sanity";

// src/components/partials/CardWithIcon.tsx
import { Card as Card3, Flex as Flex5, Text as Text3 } from "@sanity/ui";
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
function CardWithIcon({
  icon,
  text,
  tone = "nuetral"
}) {
  const Icon = icon;
  return /* @__PURE__ */ jsxDEV7(Card3, {
    marginBottom: 3,
    tone,
    padding: 3,
    children: /* @__PURE__ */ jsxDEV7(Flex5, {
      gap: 2,
      align: "center",
      children: [
        Icon && /* @__PURE__ */ jsxDEV7(Icon, {
          size: 18
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV7(Text3, {
          size: 1,
          children: text
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// src/components/core/InputWithGlobalDefault.tsx
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
function hasContent(value) {
  if (typeof value === "string")
    return value.trim().length > 0;
  return value !== null && value !== undefined;
}
function InputWithGlobalDefault(props) {
  const { seoDefaults } = useSeoDefaults();
  const dataset = useDataset2();
  const projectId = useProjectId2();
  const defaultFieldName = props?.schemaType?.options?.matchingDefaultField;
  if (!defaultFieldName) {
    console.warn("No default field name found for input: ", props?.schemaType?.name);
  }
  const value = props?.value;
  const defaultValue = defaultFieldName ? seoDefaults?.[defaultFieldName] : null;
  const hasDefault = hasContent(defaultValue);
  const hasValue = hasContent(value);
  const isImageField = props?.schemaType?.name === "metaImage";
  const defaultText = typeof defaultValue === "string" ? defaultValue.trim() : null;
  const imageFallbackUrl = useMemo2(() => {
    if (!isImageField || !defaultValue || typeof defaultValue !== "object") {
      return null;
    }
    const assetRef = defaultValue?.asset?._ref ?? null;
    if (!assetRef)
      return null;
    const src = buildSrc2({
      id: assetRef,
      baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`
    })?.src;
    if (!src)
      return null;
    try {
      const imageUrl = new URL(src);
      imageUrl.searchParams.set("w", "300");
      imageUrl.searchParams.set("h", "157");
      imageUrl.searchParams.set("fit", "crop");
      imageUrl.searchParams.set("auto", "format");
      return imageUrl.toString();
    } catch {
      return src;
    }
  }, [dataset, defaultValue, isImageField, projectId]);
  const propsWithPlaceholder = !hasValue && defaultText ? {
    ...props,
    elementProps: {
      ...props.elementProps,
      placeholder: defaultText,
      title: defaultText
    }
  } : props;
  return /* @__PURE__ */ jsxDEV8("div", {
    children: [
      !hasValue && !hasDefault && /* @__PURE__ */ jsxDEV8(CardWithIcon, {
        icon: MdWarning,
        tone: "critical",
        text: "This field does not have a global default set. Make sure to fill it in here."
      }, undefined, false, undefined, this),
      !hasValue && hasDefault && !isImageField && /* @__PURE__ */ jsxDEV8(CardWithIcon, {
        icon: MdCheck,
        tone: "suggest",
        text: "This field is using the global default as placeholder."
      }, undefined, false, undefined, this),
      !hasValue && hasDefault && isImageField && /* @__PURE__ */ jsxDEV8(Card4, {
        marginBottom: 3,
        tone: "positive",
        padding: 3,
        children: /* @__PURE__ */ jsxDEV8(Flex6, {
          gap: 3,
          align: "center",
          justify: "space-between",
          children: [
            /* @__PURE__ */ jsxDEV8(Flex6, {
              gap: 2,
              align: "center",
              children: [
                /* @__PURE__ */ jsxDEV8(MdCheck, {
                  size: 18
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV8(Stack2, {
                  gap: 2,
                  children: [
                    /* @__PURE__ */ jsxDEV8(Text4, {
                      size: 1,
                      weight: "semibold",
                      children: "Using the global default image."
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV8(Text4, {
                      size: 0,
                      muted: true,
                      children: "Add an image below to override."
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            imageFallbackUrl && /* @__PURE__ */ jsxDEV8("img", {
              src: imageFallbackUrl,
              alt: "Global default preview",
              style: {
                width: "90px",
                flexShrink: 0,
                aspectRatio: "1.91 / 1",
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid var(--card-border-color)"
              }
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV8(Box2, {
        style: { position: "relative" },
        children: [
          props.renderDefault(propsWithPlaceholder),
          !hasValue && hasDefault && isImageField && /* @__PURE__ */ jsxDEV8(Flex6, {
            align: "center",
            justify: "center",
            style: {
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "rgba(255,255,255,0.55)",
              border: "1px dashed var(--card-border-color)",
              borderRadius: "4px"
            },
            children: /* @__PURE__ */ jsxDEV8(Text4, {
              size: 1,
              muted: true,
              children: "Using global default image"
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/components/core/PageSeoInput/PageSeoInput.tsx
import { buildSrc as buildSrc3 } from "@sanity-image/url-builder";
import { Box as Box8, Flex as Flex12 } from "@sanity/ui";
import { useEffect as useEffect3, useMemo as useMemo3, useState as useState4 } from "react";
import { MdEdit, MdPreview } from "react-icons/md";
import {
  useClient as useClient2,
  useDataset as useDataset3,
  useFormValue,
  useProjectId as useProjectId3
} from "sanity";

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
import { Button, Flex as Flex7, Text as Text5 } from "@sanity/ui";
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
function ButtonWithIcon({
  icon,
  buttonProps = {},
  label
}) {
  const Icon = icon;
  return /* @__PURE__ */ jsxDEV9(Button, {
    ...buttonProps,
    children: /* @__PURE__ */ jsxDEV9(Flex7, {
      gap: 2,
      align: "center",
      justify: "center",
      children: [
        Icon && /* @__PURE__ */ jsxDEV9(Icon, {
          size: 17
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV9(Text5, {
          size: 1,
          weight: "semibold",
          children: label
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// src/components/socials/facebook/FacebookCard.tsx
import { Avatar, Box as Box3, Flex as Flex8, Stack as Stack3, Text as Text6 } from "@sanity/ui";

// src/components/partials/SocialCardWrapper.tsx
import { Card as Card5 } from "@sanity/ui";
import { jsxDEV as jsxDEV10 } from "react/jsx-dev-runtime";
function SocialCardWrapper(props) {
  return /* @__PURE__ */ jsxDEV10(Card5, {
    width: "100%",
    border: false,
    radius: 2,
    tone: "neutral",
    className: props.className,
    children: props.children
  }, undefined, false, undefined, this);
}

// src/components/socials/facebook/FacebookCard.module.css
var FacebookCard_module_default = {
  facebookCard: "facebookCard_iq-4hA",
  header: "header_iq-4hA",
  imageWrapper: "imageWrapper_iq-4hA",
  image: "image_iq-4hA"
};

// src/components/socials/facebook/FacebookCard.tsx
import { jsxDEV as jsxDEV11 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV11(SocialCardWrapper, {
    className: FacebookCard_module_default.facebookCard,
    children: [
      /* @__PURE__ */ jsxDEV11(Flex8, {
        gap: 2,
        padding: 3,
        className: FacebookCard_module_default.header,
        children: [
          /* @__PURE__ */ jsxDEV11(Avatar, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV11(Stack3, {
            gap: 2,
            children: [
              /* @__PURE__ */ jsxDEV11(Text6, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV11(Text6, {
                size: 1,
                muted: true,
                children: data.siteUrl
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV11(Box3, {
        className: FacebookCard_module_default.imageWrapper,
        children: /* @__PURE__ */ jsxDEV11("img", {
          className: FacebookCard_module_default.image,
          src: data.image,
          alt: "Facebook preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV11(Box3, {
        padding: 3,
        children: /* @__PURE__ */ jsxDEV11(Stack3, {
          space: 3,
          children: [
            /* @__PURE__ */ jsxDEV11(Text6, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV11(Text6, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 60)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV11(Box3, {
              marginTop: 1,
              children: /* @__PURE__ */ jsxDEV11(Text6, {
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
import { Avatar as Avatar2, Box as Box4, Flex as Flex9, Stack as Stack4, Text as Text7, useRootTheme as useRootTheme2 } from "@sanity/ui";

// src/components/socials/google/GoogleEntry.module.css
var GoogleEntry_module_default = {
  googleCard: "googleCard_yJDEgw",
  title: "title_yJDEgw",
  site: "site_yJDEgw",
  desc: "desc_yJDEgw",
  cardSection: "cardSection_yJDEgw"
};

// src/components/socials/google/GoogleEntry.tsx
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
function GoogleEntry(props) {
  const fallback = {
    title: "My Awesome Page - MyWebsite",
    description: "A compelling meta description for Google search snippet. Explain what users can find inside!",
    siteUrl: "https://mywebsite.com/page",
    favicon: "https://placehold.co/32x32"
  };
  const data = { ...fallback, ...props };
  const theme = useRootTheme2();
  return /* @__PURE__ */ jsxDEV12(SocialCardWrapper, {
    children: /* @__PURE__ */ jsxDEV12(Box4, {
      padding: 3,
      children: /* @__PURE__ */ jsxDEV12(Stack4, {
        space: 3,
        children: [
          /* @__PURE__ */ jsxDEV12(Flex9, {
            align: "center",
            marginBottom: 2,
            gap: 2,
            children: [
              /* @__PURE__ */ jsxDEV12(Avatar2, {
                size: 2,
                src: data.favicon,
                alt: "Favicon"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV12(Stack4, {
                space: 2,
                children: [
                  /* @__PURE__ */ jsxDEV12(Text7, {
                    size: 1,
                    weight: "semibold",
                    className: GoogleEntry_module_default.site,
                    children: data.siteTitle
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV12(Text7, {
                    size: 1,
                    muted: true,
                    className: GoogleEntry_module_default.site,
                    children: data.siteUrl
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV12(Text7, {
            style: {
              color: theme.scheme === "light" ? "#1D11AC" : "#99C2FF"
            },
            weight: "medium",
            size: 3,
            className: GoogleEntry_module_default.title,
            children: truncate(data.title, 60)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV12(Text7, {
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

// src/components/socials/linkedin/LinkedInCard.tsx
import { Avatar as Avatar3, Box as Box5, Flex as Flex10, Stack as Stack5, Text as Text8 } from "@sanity/ui";

// src/components/socials/linkedin/LinkedInCard.module.css
var LinkedInCard_module_default = {
  linkedInCard: "linkedInCard_EFV6Wg",
  header: "header_EFV6Wg",
  imageWrapper: "imageWrapper_EFV6Wg",
  image: "image_EFV6Wg"
};

// src/components/socials/linkedin/LinkedInCard.tsx
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
function LinkedInCard(props) {
  const fallback = {
    title: "My Awesome Page",
    description: "A concise preview crafted for LinkedIn feeds. Keep it clear, professional, and easy to scan.",
    image: "https://placehold.co/1200x627",
    siteUrl: "mywebsite.com",
    siteTitle: "My Website",
    avatar: "https://placehold.co/40x40"
  };
  const data = { ...fallback, ...props };
  return /* @__PURE__ */ jsxDEV13(SocialCardWrapper, {
    className: LinkedInCard_module_default.linkedInCard,
    children: [
      /* @__PURE__ */ jsxDEV13(Flex10, {
        gap: 2,
        padding: 3,
        className: LinkedInCard_module_default.header,
        children: [
          /* @__PURE__ */ jsxDEV13(Avatar3, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV13(Stack5, {
            space: 2,
            children: [
              /* @__PURE__ */ jsxDEV13(Text8, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV13(Text8, {
                size: 1,
                muted: true,
                children: data.siteUrl
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV13(Box5, {
        className: LinkedInCard_module_default.imageWrapper,
        children: /* @__PURE__ */ jsxDEV13("img", {
          className: LinkedInCard_module_default.image,
          src: data.image,
          alt: "LinkedIn preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV13(Box5, {
        padding: 3,
        children: /* @__PURE__ */ jsxDEV13(Stack5, {
          space: 3,
          children: [
            /* @__PURE__ */ jsxDEV13(Text8, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV13(Text8, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 70)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV13(Text8, {
              size: 2,
              children: truncate(data.description, 140)
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
var LinkedInCard_default = LinkedInCard;

// src/components/socials/twitter/TwitterCard.tsx
import { Avatar as Avatar4, Box as Box6, Flex as Flex11, Stack as Stack6, Text as Text9 } from "@sanity/ui";

// src/components/socials/twitter/TwitterCard.module.css
var TwitterCard_module_default = {
  twitterCard: "twitterCard_1NtJNQ",
  userRow: "userRow_1NtJNQ",
  imageWrapper: "imageWrapper_1NtJNQ",
  imageLarge: "imageLarge_1NtJNQ"
};

// src/components/socials/twitter/TwitterCard.tsx
import { jsxDEV as jsxDEV14 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV14(SocialCardWrapper, {
    className: TwitterCard_module_default.twitterCard,
    children: [
      /* @__PURE__ */ jsxDEV14(Flex11, {
        gap: 2,
        padding: 3,
        className: TwitterCard_module_default.userRow,
        children: [
          /* @__PURE__ */ jsxDEV14(Avatar4, {
            src: data.avatar,
            size: 3
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV14(Stack6, {
            space: 2,
            children: [
              /* @__PURE__ */ jsxDEV14(Text9, {
                weight: "semibold",
                size: 2,
                children: data.siteTitle
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV14(Text9, {
                size: 1,
                muted: true,
                children: data.twitterHandle
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV14(Box6, {
        className: TwitterCard_module_default.imageWrapper,
        children: /* @__PURE__ */ jsxDEV14("img", {
          className: TwitterCard_module_default.imageLarge,
          src: data.image,
          alt: "Twitter preview"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV14(Box6, {
        padding: 3,
        children: /* @__PURE__ */ jsxDEV14(Flex11, {
          direction: "column",
          gap: 4,
          children: [
            /* @__PURE__ */ jsxDEV14(Text9, {
              size: 1,
              muted: true,
              children: data.siteUrl
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV14(Text9, {
              weight: "semibold",
              size: 3,
              children: truncate(data.title, 70)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV14(Text9, {
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
import { Box as Box7, Text as Text10 } from "@sanity/ui";
import { jsxDEV as jsxDEV15 } from "react/jsx-dev-runtime";
function PreviewGroup({
  title,
  children
}) {
  return /* @__PURE__ */ jsxDEV15("div", {
    children: [
      /* @__PURE__ */ jsxDEV15(Box7, {
        marginBottom: 4,
        children: /* @__PURE__ */ jsxDEV15(Text10, {
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
import { jsxDEV as jsxDEV16 } from "react/jsx-dev-runtime";
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
    name: "LinkedIn",
    component: LinkedInCard_default,
    title: "LinkedIn"
  },
  {
    name: "Google",
    component: GoogleEntry_default,
    title: "Google"
  }
];
function PageSeoInput(props) {
  const client = useClient2({ apiVersion: "2025-01-11" });
  const dataset = useDataset3();
  const projectId = useProjectId3();
  const MODES = [
    { name: "fields", title: "Fields", icon: MdEdit },
    { name: "preview", title: "Preview", icon: MdPreview }
  ];
  const [currentMode, setCurrentMode] = useState4(MODES[0]?.name);
  const [seoDefaults, setSeoDefaults] = useState4(null);
  useEffect3(() => {
    client.fetch(`*[_type == "globalSeoSettings"][0]`).then(setSeoDefaults);
  }, [client]);
  const document = useFormValue([]) || {};
  const pageValue = props.value || {};
  const defaults = seoDefaults || {};
  const previewImageUrl = useMemo3(() => {
    const effectiveMetaImage = pageValue.metaImage ?? defaults.defaultMetaImage;
    const assetRef = effectiveMetaImage?.asset?._ref;
    if (!assetRef)
      return;
    return buildSrc3({
      id: assetRef,
      baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`
    })?.src;
  }, [dataset, defaults.defaultMetaImage, pageValue.metaImage, projectId]);
  const seoData = {
    ...defaults,
    ...pageValue,
    image: previewImageUrl,
    title: concatenatePageTitle(document?.title, defaults.siteTitle, defaults.pageTitleTemplate)
  };
  return /* @__PURE__ */ jsxDEV16("div", {
    children: [
      /* @__PURE__ */ jsxDEV16(Box8, {
        marginBottom: 4,
        width: "fill",
        children: /* @__PURE__ */ jsxDEV16(Flex12, {
          gap: 2,
          width: "fill",
          children: MODES.map((m) => /* @__PURE__ */ jsxDEV16(ButtonWithIcon, {
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
      currentMode === "preview" && /* @__PURE__ */ jsxDEV16(Flex12, {
        gap: 6,
        marginTop: 6,
        direction: "column",
        children: PREVIEW_GROUPS.map((group) => /* @__PURE__ */ jsxDEV16(PreviewGroup, {
          title: group.title,
          children: /* @__PURE__ */ jsxDEV16(group.component, {
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
      type: "metaDescription"
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
        matchingDefaultField: "defaultMetaImage"
      },
      description: "Displayed when the site link is posted on social media, defaults to a screenshot of the homepage.",
      type: "metaImage"
    }
  ]
};

// src/schemas/fields/search-indexing.ts
import { defineField as defineField6 } from "sanity";

// src/components/core/IndexingControls.tsx
import { set as set2 } from "sanity";
import { Button as Button2, Flex as Flex13, Stack as Stack7 } from "@sanity/ui";
import { useCallback as useCallback2 } from "react";
import { MdInfo, MdPlaylistRemove } from "react-icons/md";
import { IoArrowRedo } from "react-icons/io5";
import { jsxDEV as jsxDEV17 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV17(Stack7, {
    space: 3,
    children: [
      /* @__PURE__ */ jsxDEV17(CardWithIcon, {
        icon: MdInfo,
        tone: noIndex && noFollow ? "critical" : "suggest",
        text: note
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV17(Flex13, {
        gap: 3,
        children: [
          /* @__PURE__ */ jsxDEV17(Button2, {
            width: "fill",
            icon: IoArrowRedo,
            mode: noFollow ? "default" : "ghost",
            selected: noFollow,
            text: "No Follow",
            tone: noFollow ? "critical" : "default",
            onClick: () => setValue("noFollow", !noFollow)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV17(Button2, {
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
import { jsxDEV as jsxDEV18 } from "react/jsx-dev-runtime";
// src/schemas/fields/search-indexing.ts
var search_indexing_default = defineField6({
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
var fields_default = [
  search_indexing_default,
  favicon_default,
  metadata_default,
  meta_description_default,
  meta_title_default,
  meta_image_default
];

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

//# debugId=22583FBBD72810F364756E2164756E21
