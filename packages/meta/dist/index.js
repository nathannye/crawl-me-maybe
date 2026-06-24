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
var isAbsoluteUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
var isCanonicalPath = (value) => {
  const trimmed = value.trim();
  return trimmed.startsWith("/") && !trimmed.startsWith("//");
};
var resolveCanonicalUrl = (siteUrl, canonicalOrPath) => {
  const trimmed = canonicalOrPath.trim();
  if (isAbsoluteUrl(trimmed)) {
    return trimmed;
  }
  if (isCanonicalPath(trimmed)) {
    return normalizeUrl(siteUrl, trimmed);
  }
  return normalizeUrl(siteUrl, trimmed);
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
  if (canonicalUrl?.trim()) {
    return resolveCanonicalUrl(siteUrl, canonicalUrl);
  }
  if (disableSelfCanonical)
    return;
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
      twitterHandle: seoDefaults?.twitterHandle,
      metaImage: seoDefaults?.defaultMetaImage,
      faviconUrl: seoDefaults?.faviconUrl
    };
  }
  if (!seoDefaults) {
    console.warn("buildMetadata: No seoDefaults provided");
    return {
      title: page.title,
      description: pageMeta?.description,
      canonicalUrl: pageMeta?.canonicalUrl && isAbsoluteUrl(pageMeta.canonicalUrl.trim()) ? pageMeta.canonicalUrl.trim() : undefined,
      metaImage: pageMeta?.metaImage
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
    metaImage: pageMeta?.metaImage ?? seoDefaults.defaultMetaImage,
    faviconUrl: seoDefaults.faviconUrl,
    twitter,
    openGraph,
    robots,
    ...options?.metadata || {}
  };
};
// src/to-html-tags.ts
var pushMeta = (tags, attrs) => {
  if (!attrs.content)
    return;
  tags.push(attrs);
};
function toHtmlTags(meta) {
  const tags = [];
  const links = [];
  if (meta.description) {
    pushMeta(tags, { name: "description", content: meta.description });
  }
  if (meta.robots) {
    pushMeta(tags, { name: "robots", content: meta.robots });
  }
  if (meta.openGraph?.title) {
    pushMeta(tags, {
      property: "og:title",
      content: meta.openGraph.title
    });
  }
  if (meta.openGraph?.description ?? meta.description) {
    pushMeta(tags, {
      property: "og:description",
      content: meta.openGraph?.description ?? meta.description ?? ""
    });
  }
  if (meta.openGraph?.url) {
    pushMeta(tags, { property: "og:url", content: meta.openGraph.url });
  }
  if (meta.openGraph?.type) {
    pushMeta(tags, { property: "og:type", content: meta.openGraph.type });
  }
  if (meta.openGraph?.siteName) {
    pushMeta(tags, {
      property: "og:site_name",
      content: meta.openGraph.siteName
    });
  }
  if (meta.metaImage) {
    pushMeta(tags, { property: "og:image", content: meta.metaImage });
  }
  if (meta.twitter?.card) {
    pushMeta(tags, { name: "twitter:card", content: meta.twitter.card });
  }
  const twitterTitle = meta.title ?? meta.openGraph?.title;
  if (twitterTitle) {
    pushMeta(tags, { name: "twitter:title", content: twitterTitle });
  }
  const twitterDescription = meta.description ?? meta.openGraph?.description;
  if (twitterDescription) {
    pushMeta(tags, {
      name: "twitter:description",
      content: twitterDescription
    });
  }
  if (meta.metaImage) {
    pushMeta(tags, { name: "twitter:image", content: meta.metaImage });
  }
  if (meta.twitter?.creator) {
    pushMeta(tags, {
      name: "twitter:creator",
      content: meta.twitter.creator
    });
  }
  if (meta.twitter?.site) {
    pushMeta(tags, { name: "twitter:site", content: meta.twitter.site });
  }
  if (meta.canonicalUrl) {
    links.push({ rel: "canonical", href: meta.canonicalUrl });
  }
  if (meta.faviconUrl) {
    links.push({ rel: "icon", href: meta.faviconUrl });
  }
  return {
    title: meta.title ?? "",
    tags,
    links
  };
}
export {
  toHtmlTags,
  createMetaTitle,
  buildMetadata
};

//# debugId=760C4DE7847108F464756E2164756E21
