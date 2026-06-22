// src/config.ts
var config = {};
function setConfig(newConfig) {
  config = { ...config, ...newConfig };
}
function getConfig() {
  return config;
}
// src/meta-title.ts
var createMetaTitle = (pageTitle = "", siteTitle = "", template = "{pageTitle} | {siteTitle}") => {
  let metaTitle = template.replace("{pageTitle}", pageTitle).replace("{siteTitle}", siteTitle);
  metaTitle = metaTitle.replace(/\s*\|\s*$/, "").replace(/^\s*\|\s*/, "");
  if (!metaTitle.trim()) {
    metaTitle = siteTitle || pageTitle || "";
  }
  return metaTitle;
};

// src/url.ts
var normalizeUrl = (baseUrl, path) => {
  return new URL(path, baseUrl).toString();
};

// src/merge.ts
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
var buildOpenGraphMetadata = ({
  siteUrl,
  siteTitle,
  pageTitle,
  pageDescription,
  ogType
}) => {
  const obj = {
    siteName: siteTitle,
    url: siteUrl,
    title: pageTitle,
    description: pageDescription,
    type: ogType || "website"
  };
  return obj;
};
var buildTwitterMetadata = ({
  siteUrl,
  twitterHandle,
  twitterCardStyle
}) => {
  return {
    card: twitterCardStyle || "summary_large_image",
    creator: twitterHandle,
    site: siteUrl
  };
};
var buildMetadata = (page, seoDefaults, options) => {
  const { disableSelfCanonical = false } = options || {};
  if (!page && !seoDefaults) {
    console.warn("buildMetadata: No page or seoDefaults provided");
    return {
      title: undefined,
      description: undefined,
      canonicalUrl: undefined,
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
  const openGraph = buildOpenGraphMetadata({
    siteUrl: seoDefaults.siteUrl,
    pageTitle: page.title,
    pageDescription: page.description,
    siteTitle: seoDefaults.siteTitle,
    ogType: options?.ogType
  });
  const twitter = buildTwitterMetadata({
    siteUrl: seoDefaults.siteUrl,
    twitterHandle: seoDefaults.twitterHandle,
    twitterCardStyle: options?.twitterCardStyle
  });
  return {
    title: metaTitle,
    description,
    canonicalUrl,
    metaImage: pageMeta?.metaImage,
    twitter,
    openGraph,
    robots,
    ...options?.metadata || {}
  };
};
export {
  setConfig,
  getConfig,
  createMetaTitle,
  buildMetadata
};

//# debugId=4D831CF00F09646064756E2164756E21
