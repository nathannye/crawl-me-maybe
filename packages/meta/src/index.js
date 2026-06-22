// src/config.ts
var config = {};
function setConfig(newConfig) {
  config = { ...config, ...newConfig };
}
function getConfig() {
  return config;
}
// src/utils/sanity-image.ts
import { buildSrc } from "@sanity-image/url-builder";
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
// src/utils/meta-title.ts
var createMetaTitle = (pageTitle = "", siteTitle = "", template = "{pageTitle} | {siteTitle}") => {
  let metaTitle = template.replace("{pageTitle}", pageTitle).replace("{siteTitle}", siteTitle);
  metaTitle = metaTitle.replace(/\s*\|\s*$/, "").replace(/^\s*\|\s*/, "");
  if (!metaTitle.trim()) {
    metaTitle = siteTitle || pageTitle || "";
  }
  return metaTitle;
};

// src/utils/url.ts
var normalizeUrl = (baseUrl, path) => {
  return new URL(path, baseUrl).toString();
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
var createCanonicalUrl = ({
  slug = "/",
  siteUrl,
  disableSelfCanonical,
  canonicalUrl
}) => {
  if (disableSelfCanonical)
    return canonicalUrl || undefined;
  return normalizeUrl(siteUrl, slug);
};
var buildMetadata = (page, seoDefaults, options) => {
  const { disableSelfCanonical = false } = options || {};
  if (!page && !seoDefaults) {
    console.warn("buildMetadata: No page or seoDefaults provided");
    return {
      title: undefined,
      description: undefined,
      canonicalUrl: undefined,
      favicons: undefined,
      twitterHandle: undefined,
      robots: undefined,
      schemaMarkup: undefined,
      siteTitle: undefined
    };
  }
  const pageMeta = page;
  if (!page) {
    console.warn("buildMetadata: No page data provided");
    return {
      title: seoDefaults?.siteTitle,
      description: seoDefaults?.metaDescription,
      canonicalUrl: seoDefaults?.siteUrl,
      favicons: createFavicons(seoDefaults?.favicon),
      twitterHandle: seoDefaults?.twitterHandle
    };
  }
  if (!seoDefaults) {
    console.warn("buildMetadata: No seoDefaults provided");
    return {
      title: page.title,
      description: pageMeta?.description,
      canonicalUrl: pageMeta?.canonicalUrl
    };
  }
  const canonicalUrl = createCanonicalUrl({
    slug: page?.slug?.current,
    siteUrl: seoDefaults?.siteUrl,
    disableSelfCanonical,
    canonicalUrl: page?.canonicalUrl
  });
  const robots = buildRobotsString(pageMeta?.searchIndexing || { noIndex: false, noFollow: false });
  const metaTitle = createMetaTitle(page.title, seoDefaults.siteTitle, seoDefaults.pageTitleTemplate);
  const description = pageMeta?.description || seoDefaults.metaDescription;
  const favicons = createFavicons(seoDefaults.favicon);
  return {
    title: metaTitle,
    description,
    canonicalUrl,
    metaImage: pageMeta?.metaImage,
    favicons,
    twitterHandle: seoDefaults.twitterHandle,
    robots
  };
};
export {
  setConfig,
  getConfig,
  createMetaTitle,
  createFavicons,
  buildMetadata
};

//# debugId=0FD29D04C951947664756E2164756E21
//# sourceMappingURL=index.js.map
