// src/utils/meta-title.ts
var createMetaTitle = (pageTitle = "", siteTitle = "", template = "{pageTitle} | {siteTitle}") => {
  let metaTitle = template.replace("{pageTitle}", pageTitle).replace("{siteTitle}", siteTitle);
  metaTitle = metaTitle.replace(/\s*\|\s*$/, "").replace(/^\s*\|\s*/, "");
  if (!metaTitle.trim()) {
    metaTitle = siteTitle || pageTitle || "";
  }
  return metaTitle;
};
// src/utils/sanity-image.ts
import { buildSrc } from "@sanity-image/url-builder";

// src/config.ts
var config = {};
function setConfig(newConfig) {
  config = { ...config, ...newConfig };
}
function getConfig() {
  return config;
}

// src/utils/sanity-image.ts
function urlFor(imageRef) {
  const config2 = getConfig();
  const baseUrl = `https://cdn.sanity.io/images/${config2.projectId}/${config2.dataset}/`;
  let width;
  let height;
  let format;
  let quality = 100;
  const chain = {
    size: (w, h) => {
      width = w;
      height = h;
      return chain;
    },
    format: (fm) => {
      format = fm;
      return chain;
    },
    quality: (q) => {
      if (q) {
        quality = q;
      }
      return chain;
    },
    url: () => {
      const result = buildSrc({
        id: imageRef,
        baseUrl,
        width,
        height,
        queryParams: {
          fm: format,
          q: quality
        }
      });
      return result?.src || "";
    }
  };
  return chain;
}

// src/utils/favicon.ts
var createFavicons = (favicon) => {
  if (!favicon?.asset)
    return null;
  const favicons = [];
  const imageRef = favicon.asset._ref || favicon.asset._id;
  const [assetType, id, dimensions, fileType] = imageRef.split("-");
  if (fileType === "svg") {
    const svg = urlFor(imageRef).url();
    const pngFallback = urlFor(imageRef).size(32, 32).format("png").url();
    favicons.push({
      type: "image/svg+xml",
      href: svg
    }, {
      type: "image/png",
      sizes: "32x32",
      href: pngFallback
    });
  } else {
    const png = urlFor(imageRef).size(32, 32).format("png").url();
    favicons.push({
      type: "image/png",
      sizes: "32x32",
      href: png
    });
  }
  return favicons;
};

// src/utils/merge.ts
var buildRobotsString = ({
  noIndex = false,
  noFollow = false
}) => {
  const parts = [];
  if (noIndex)
    parts.push("noindex");
  if (noFollow)
    parts.push("nofollow");
  if (parts.length === 0)
    return;
  return parts.join(",");
};
var mergeSeoData = (page, seoDefaults, seoObjectName = "meta") => {
  if (!page && !seoDefaults) {
    console.warn("mergeSeoData: No page or seoDefaults provided");
    return {
      title: undefined,
      description: undefined
    };
  }
  const pageMeta = page?.[seoObjectName];
  const schemaMarkupType = page?.schemaMarkup?.type;
  if (!page) {
    console.warn("mergeSeoData: No page data provided");
    return {
      title: seoDefaults?.siteTitle,
      description: seoDefaults?.metaDescription,
      canonicalUrl: seoDefaults?.siteUrl,
      favicons: createFavicons(seoDefaults?.favicon),
      twitterHandle: seoDefaults?.twitterHandle
    };
  }
  if (!seoDefaults) {
    console.warn("mergeSeoData: No seoDefaults provided");
    return {
      title: page.title,
      description: pageMeta?.description,
      canonicalUrl: pageMeta?.canonicalUrl,
      schemaMarkup: schemaMarkupType
    };
  }
  return {
    title: createMetaTitle(page.title, seoDefaults.siteTitle, seoDefaults.pageTitleTemplate),
    siteTitle: seoDefaults.siteTitle,
    description: pageMeta?.description || seoDefaults.metaDescription,
    canonicalUrl: pageMeta?.canonicalUrl || seoDefaults.siteUrl,
    metaImage: pageMeta?.metaImage,
    favicons: createFavicons(seoDefaults.favicon),
    twitterHandle: seoDefaults.twitterHandle,
    robots: buildRobotsString(pageMeta?.searchIndexing || { noIndex: false, noFollow: false }),
    schemaMarkup: schemaMarkupType
  };
};
export {
  urlFor,
  setConfig,
  mergeSeoData,
  getConfig,
  createMetaTitle,
  createFavicons
};

//# debugId=947655253DB364D464756E2164756E21
//# sourceMappingURL=index.js.map
