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
  urlFor: () => urlFor,
  normalizeId: () => normalizeId,
  mergeSeoData: () => mergeSeoData,
  formatSchemaDate: () => formatSchemaDate,
  createSchemaImageObject: () => createSchemaImageObject,
  createMetaTitle: () => createMetaTitle,
  createFavicons: () => createFavicons,
  composeSchema: () => composeSchema,
  buildWebSite: () => buildWebSite,
  buildWebPage: () => buildWebPage,
  buildSeoPayload: () => buildSeoPayload,
  buildProduct: () => buildProduct,
  buildPersonSchema: () => buildPersonSchema,
  buildPersonOrOrg: () => buildPersonOrOrg,
  buildOrganization: () => buildOrganization,
  buildOrgSchema: () => buildOrgSchema,
  buildFAQPage: () => buildFAQPage,
  buildEvent: () => buildEvent,
  buildContactPage: () => buildContactPage,
  buildArticle: () => buildArticle,
  buildAboutPage: () => buildAboutPage
});
module.exports = __toCommonJS(exports_src);

// src/schema-markup/automap.ts
var fieldMappings = {
  title: "title",
  description: "description",
  image: "metaImage",
  datePublished: "_createdAt",
  dateModified: "_updatedAt"
};
var shouldAutomap = (automapSettings, property) => {
  return automapSettings[property] !== false;
};
var automap = (automapSettings, baseSeoObject, extra) => {
  const automappedValues = Object.keys(fieldMappings).reduce((acc, key) => {
    if (shouldAutomap(automapSettings, key)) {
      const field = fieldMappings[key];
      acc[key] = baseSeoObject[field] || extra?.[field];
    }
    return acc;
  }, {
    title: undefined,
    description: undefined,
    image: undefined,
    datePublished: undefined,
    dateModified: undefined
  });
  return automappedValues;
};

// src/schema-markup/schema-utils.ts
function coalesce(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null)
      return value;
  }
  return;
}

// src/schema-markup/builders/webpage.ts
function buildWebPage({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.webPage || {};
  const autoMap = schemaDefaults?.autoMap || {};
  const { title: name, description, image } = automap(autoMap, seo, extra);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: coalesce(name, extra?.name),
    description: coalesce(description, extra?.description),
    url: coalesce(seo.canonicalUrl, extra?.url),
    image,
    inLanguage: coalesce(extra?.inLanguage, defaults.inLanguage),
    datePublished: coalesce(extra?.datePublished, extra?._createdAt),
    dateModified: coalesce(extra?.dateModified, extra?._updatedAt),
    about: extra?.about,
    isPartOf: seo.canonicalUrl ? {
      "@type": "WebSite",
      "@id": `${seo.canonicalUrl}#website`
    } : undefined
  };
}
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
var import_url_builder = require("@sanity-image/url-builder");

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
      const result = import_url_builder.buildSrc({
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
    robots: buildRobotsString(pageMeta?.searchVisibility || { noIndex: false, noFollow: false }),
    schemaMarkup: schemaMarkupType
  };
};
// src/utils/image.ts
var formatImageUrl = (imageReference) => {
  if (!imageReference)
    return null;
  const MAX_WIDTH = 2000;
  const QUALITY = 85;
  const parts = imageReference.split("-");
  if (parts.length < 3)
    return null;
  const [_, id, dimensions, _fileType] = parts;
  const [width, height] = dimensions.split("x").map(Number);
  const aspectRatio = Number(width) / Number(height);
  let w = width;
  let h = height;
  const shouldClamp = width > MAX_WIDTH;
  if (shouldClamp) {
    const newWidth = Math.min(width, MAX_WIDTH);
    const newHeight = Math.round(newWidth / aspectRatio);
    w = newWidth;
    h = newHeight;
    return {
      url: urlFor(imageReference).size(newWidth, newHeight).quality(QUALITY).url(),
      width: String(newWidth),
      height: String(newHeight)
    };
  }
  return {
    url: urlFor(imageReference).quality(QUALITY).url(),
    width: String(w),
    height: String(h)
  };
};
function createSchemaImageObject(image, fallback) {
  if (!image && !fallback)
    return;
  const imageToUse = image || fallback;
  const isDereferencedImage = typeof imageToUse === "object" && "asset" in imageToUse && imageToUse.asset;
  const reference = isDereferencedImage ? imageToUse.asset?._id : imageToUse?.asset?._ref;
  const imageData = formatImageUrl(reference || "");
  if (!imageData)
    return;
  return {
    "@type": "ImageObject",
    url: imageData.url,
    width: imageData.width,
    height: imageData.height
  };
}
// src/schema-markup/builders/utils.ts
function normalizeId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function buildPersonSchema(person, asReference = false, baseUrl) {
  if (!person)
    return;
  const base = baseUrl || "";
  const id = person["@id"] ? person["@id"].startsWith("http") ? person["@id"] : `${base}${person["@id"]}` : `${base}#person-${normalizeId(person.name)}`;
  if (asReference) {
    return { "@id": id };
  }
  return {
    "@type": "Person",
    "@id": id,
    name: person.name,
    url: person.url,
    sameAs: person.sameAs,
    jobTitle: person.jobTitle,
    image: createSchemaImageObject(person.image)
  };
}
function buildOrgSchema(org, asReference = false, baseUrl) {
  if (!org)
    return;
  const base = baseUrl || org.url || "";
  const id = org["@id"] ? org["@id"].startsWith("http") ? org["@id"] : `${base}${org["@id"]}` : `${base}#organization-${normalizeId(org.name)}`;
  if (asReference) {
    return { "@id": id };
  }
  const departments = org.department ? org.department.map((dept) => buildOrgSchema(dept, true, baseUrl)).filter(Boolean) : undefined;
  const contactPoint = org.contactPoint ? org.contactPoint.map((cp) => ({
    "@type": "ContactPoint",
    contactType: cp.contactType,
    telephone: cp.telephone,
    email: cp.email,
    url: cp.url,
    areaServed: cp.areaServed,
    availableLanguage: cp.availableLanguage
  })) : undefined;
  return {
    "@type": "Organization",
    "@id": id,
    name: org.name,
    url: org.url,
    logo: createSchemaImageObject(org.logo),
    sameAs: org.sameAs,
    department: departments,
    contactPoint
  };
}
function buildPersonOrOrg(entity, asReference = false, baseUrl) {
  if (!entity)
    return;
  if ("jobTitle" in entity || !("logo" in entity)) {
    return buildPersonSchema(entity, asReference, baseUrl);
  }
  return buildOrgSchema(entity, asReference, baseUrl);
}
function formatSchemaDate(date) {
  if (!date)
    return;
  if (typeof date === "string") {
    return date;
  }
  return date.toISOString();
}

// src/schema-markup/builders/article.ts
function buildArticle({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.article || {};
  const autoMap = schemaDefaults?.autoMap || {};
  const headline = autoMap.title !== false ? seo.title : extra?.headline;
  const description = autoMap.description !== false ? seo.description : extra?.description;
  const image2 = createSchemaImageObject(autoMap.image !== false ? seo.metaImage : extra?.image, schemaDefaults?.imageFallback);
  const authors = extra?.author || [];
  const authorSchema = autoMap.authors !== false && authors.length > 0 ? authors.map((author) => buildPersonOrOrg(author, true, seo.canonicalUrl)).filter(Boolean) : undefined;
  const publisher = coalesce(extra?.publisher, defaults.publisher, schemaDefaults?.publisher, schemaDefaults?.organization);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: coalesce(headline, extra?.headline),
    description: coalesce(description, extra?.description),
    image: image2,
    datePublished: formatSchemaDate(autoMap.dates !== false ? extra?._createdAt || extra?.datePublished : extra?.datePublished),
    dateModified: formatSchemaDate(autoMap.dates !== false ? extra?._updatedAt || extra?.dateModified : extra?.dateModified),
    author: authorSchema,
    publisher: buildOrgSchema(publisher, true, seo.canonicalUrl),
    mainEntityOfPage: coalesce(seo.canonicalUrl, extra?.mainEntityOfPage),
    articleSection: coalesce(extra?.articleSection, defaults.section),
    url: coalesce(seo.canonicalUrl, extra?.url),
    isPartOf: seo.canonicalUrl ? {
      "@type": "WebSite",
      "@id": `${seo.canonicalUrl}#website`
    } : undefined
  };
}
// src/schema-markup/builders/product.ts
function buildProduct({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.product || {};
  const autoMap = schemaDefaults?.autoMap || {};
  const name = autoMap.title !== false ? seo.title : extra?.name;
  const description = autoMap.description !== false ? seo.description : extra?.description;
  const image2 = createSchemaImageObject(autoMap.image !== false ? seo.metaImage : extra?.image, schemaDefaults?.imageFallback);
  const brand = extra?.brand || defaults.brand;
  const offers = extra?.offers || (extra?.price ? {
    "@type": "Offer",
    price: extra.price,
    priceCurrency: extra.priceCurrency || defaults.priceCurrency || "USD",
    availability: `https://schema.org/${extra.availability || defaults.availability || "InStock"}`,
    url: seo.canonicalUrl
  } : undefined);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name || extra?.name,
    description: description || extra?.description,
    image: image2,
    brand: brand ? buildOrgSchema(brand, true, seo.canonicalUrl) : undefined,
    sku: extra?.sku,
    mpn: extra?.mpn,
    gtin: extra?.gtin,
    offers,
    aggregateRating: extra?.aggregateRating,
    review: extra?.review,
    url: seo.canonicalUrl
  };
}
// src/schema-markup/builders/event.ts
function buildEvent({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.event || {};
  const autoMap = schemaDefaults?.autoMap || {};
  const name = autoMap.title !== false ? seo.title : extra?.name;
  const description = autoMap.description !== false ? seo.description : extra?.description;
  const image2 = createSchemaImageObject(autoMap.image !== false ? seo.metaImage : extra?.image, schemaDefaults?.imageFallback);
  const locationData = extra?.location;
  const location = locationData ? {
    "@type": locationData.url ? "VirtualLocation" : "Place",
    name: locationData.name,
    url: locationData.url,
    address: locationData.address,
    geo: locationData.geo ? {
      "@type": "GeoCoordinates",
      latitude: locationData.geo.latitude,
      longitude: locationData.geo.longitude
    } : undefined
  } : undefined;
  const organizer = coalesce(extra?.organizer, defaults.organizer, schemaDefaults?.organization);
  const organizerSchema = Array.isArray(organizer) ? organizer.map((org) => buildPersonOrOrg(org, true, seo.canonicalUrl)).filter(Boolean) : buildPersonOrOrg(organizer, true, seo.canonicalUrl);
  const performer = extra?.performer ? extra.performer.map((perf) => buildPersonOrOrg(perf, true, seo.canonicalUrl)).filter(Boolean) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: coalesce(name, extra?.name),
    description: coalesce(description, extra?.description),
    image: image2,
    startDate: formatSchemaDate(extra?.startDate),
    endDate: formatSchemaDate(extra?.endDate),
    eventStatus: extra?.eventStatus ? `https://schema.org/${extra.eventStatus}` : undefined,
    eventAttendanceMode: coalesce(extra?.eventAttendanceMode, defaults.eventAttendanceMode) ? `https://schema.org/${extra?.eventAttendanceMode || defaults.eventAttendanceMode}` : undefined,
    location,
    organizer: organizerSchema,
    performer,
    offers: extra?.offers,
    url: seo.canonicalUrl
  };
}
// src/schema-markup/builders/faq.ts
function buildFAQPage({
  seo,
  schemaDefaults,
  extra
}) {
  const autoMap = schemaDefaults?.autoMap || {};
  const name = autoMap.title !== false ? seo.title : extra?.name;
  const description = autoMap.description !== false ? seo.description : extra?.description;
  const mainEntity = extra?.mainEntity ? extra.mainEntity.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  })) : [];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name,
    description,
    mainEntity,
    url: seo.canonicalUrl,
    isPartOf: seo.canonicalUrl ? {
      "@type": "WebSite",
      "@id": `${seo.canonicalUrl}#website`
    } : undefined
  };
}
// src/schema-markup/builders/website.ts
function buildWebSite({
  name,
  url,
  publisher,
  searchAction,
  inLanguage
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": url ? `${url}#website` : undefined,
    name,
    url,
    publisher: buildOrgSchema(publisher, true, url),
    inLanguage,
    potentialAction: searchAction?.target ? {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchAction.target
      },
      "query-input": searchAction.queryInput || "required name=search_term_string"
    } : undefined
  };
}
// src/schema-markup/builders/organization.ts
function buildOrganization(organization, schemaDefaults, baseUrl, asReference = false) {
  const base = baseUrl || organization.url || "";
  const id = organization["@id"] ? organization["@id"].startsWith("http") ? organization["@id"] : `${base}${organization["@id"]}` : `${base}#organization-${normalizeId(organization.name)}`;
  if (asReference) {
    return { "@id": id };
  }
  const departments = organization.department ? organization.department.map((dept) => buildOrgSchema(dept, true, baseUrl)).filter(Boolean) : undefined;
  const contactPoint = organization.contactPoint ? organization.contactPoint.map((cp) => ({
    "@type": "ContactPoint",
    contactType: cp.contactType,
    telephone: cp.telephone,
    email: cp.email,
    url: cp.url,
    areaServed: cp.areaServed,
    availableLanguage: cp.availableLanguage
  })) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": id,
    name: organization.name,
    url: organization.url,
    logo: createSchemaImageObject(organization.logo, coalesce(schemaDefaults?.logo, schemaDefaults?.imageFallback)),
    sameAs: coalesce(organization.sameAs, schemaDefaults?.sameAs),
    department: departments,
    contactPoint
  };
}
// src/schema-markup/builders/about-page.ts
function buildAboutPage({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.webPage || {};
  const autoMap = schemaDefaults?.autoMap || {};
  const { title, description, image: image2, dateModified, datePublished } = automap(autoMap, seo, extra);
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description: coalesce(description, extra?.description),
    url: coalesce(seo.canonicalUrl, extra?.url),
    image: image2,
    inLanguage: coalesce(extra?.inLanguage, defaults.inLanguage),
    datePublished: coalesce(extra?.datePublished, extra?._createdAt),
    dateModified: coalesce(extra?.dateModified, extra?._updatedAt),
    about: extra?.about,
    isPartOf: seo.canonicalUrl ? {
      "@type": "WebSite",
      "@id": `${seo.canonicalUrl}#website`
    } : undefined
  };
}
// src/schema-markup/builders/contact-page.ts
function buildContactPage({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.webPage || {};
  const autoMap = schemaDefaults?.autoMap || {};
  const { title: name, description, image: image2, dateModified, datePublished } = automap(autoMap, seo, extra);
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: coalesce(name, extra?.name),
    description: coalesce(description, extra?.description),
    url: coalesce(seo.canonicalUrl, extra?.url),
    image: image2,
    inLanguage: extra?.inLanguage || defaults.inLanguage,
    datePublished: extra?.datePublished || extra?._createdAt,
    dateModified: extra?.dateModified || extra?._updatedAt,
    isPartOf: seo.canonicalUrl ? {
      "@type": "WebSite",
      "@id": `${seo.canonicalUrl}#website`
    } : undefined
  };
}
// src/schema-markup/compose.ts
function composeSchema({
  seo,
  schemaDefaults,
  type = "WebPage",
  extra,
  isHomepage = false
}) {
  const schemas = [];
  const entities = new Set;
  const baseUrl = seo.canonicalUrl || "";
  const addEntity = (entity, buildFn) => {
    if (!entity)
      return;
    const schema = buildFn(entity);
    if (schema?.["@id"] && !entities.has(schema["@id"])) {
      entities.add(schema["@id"]);
      schemas.push(schema);
    }
  };
  const addOrgWithDepartments = (org) => {
    const orgWithDefaults = {
      ...org,
      logo: org.logo || schemaDefaults?.logo
    };
    addEntity(orgWithDefaults, (o) => buildOrganization(o, schemaDefaults, baseUrl));
    if (org.department && Array.isArray(org.department)) {
      for (const dept of org.department) {
        addOrgWithDepartments(dept);
      }
    }
  };
  if (schemaDefaults?.organization) {
    addOrgWithDepartments(schemaDefaults.organization);
  }
  if (schemaDefaults?.publisher && schemaDefaults.publisher !== schemaDefaults.organization) {
    addOrgWithDepartments(schemaDefaults.publisher);
  }
  if (extra?.author && Array.isArray(extra.author)) {
    for (const author of extra.author) {
      if (author && typeof author === "object" && "name" in author) {
        addEntity(author, (person) => buildPersonOrOrg(person, false, baseUrl));
      }
    }
  }
  if (extra?.contributor && Array.isArray(extra.contributor)) {
    for (const contributor of extra.contributor) {
      if (contributor && typeof contributor === "object" && "name" in contributor) {
        addEntity(contributor, (person) => buildPersonOrOrg(person, false, baseUrl));
      }
    }
  }
  if (extra?.organizer && Array.isArray(extra.organizer)) {
    for (const organizer of extra.organizer) {
      if (organizer && typeof organizer === "object" && "name" in organizer) {
        const entityWithDefaults = "jobTitle" in organizer ? organizer : { ...organizer, logo: organizer.logo || schemaDefaults?.logo };
        addEntity(entityWithDefaults, (entity) => buildPersonOrOrg(entity, false, baseUrl));
      }
    }
  }
  if (extra?.performer && Array.isArray(extra.performer)) {
    for (const performer of extra.performer) {
      if (performer && typeof performer === "object" && "name" in performer) {
        const entityWithDefaults = "jobTitle" in performer ? performer : { ...performer, logo: performer.logo || schemaDefaults?.logo };
        addEntity(entityWithDefaults, (entity) => buildPersonOrOrg(entity, false, baseUrl));
      }
    }
  }
  if (extra?.brand && typeof extra.brand === "object" && "name" in extra.brand) {
    addOrgWithDepartments(extra.brand);
  }
  if (schemaDefaults?.webSite || isHomepage) {
    schemas.push(buildWebSite({
      ...schemaDefaults?.webSite || {},
      name: seo.siteTitle,
      url: seo.canonicalUrl,
      publisher: schemaDefaults?.webSite?.publisher || schemaDefaults?.publisher || schemaDefaults?.organization,
      searchAction: schemaDefaults?.webSite?.searchAction
    }));
  }
  const builders = {
    Article: buildArticle,
    Product: buildProduct,
    Event: buildEvent,
    FAQPage: buildFAQPage,
    WebPage: buildWebPage,
    AboutPage: buildAboutPage,
    ContactPage: buildContactPage
  };
  if (builders[type]) {
    schemas.push(builders[type]({
      seo,
      schemaDefaults,
      extra
    }));
  }
  return schemas.filter(Boolean);
}
// src/build.ts
function buildSeoPayload({
  pageMetadata,
  globalSeoDefaults,
  schemaDefaults,
  pageSchemaType = "WebPage",
  seoFieldName = "metadata",
  isHomepage = false,
  extraSchemaData,
  projectId,
  dataset
}) {
  if (!projectId || !dataset) {
    console.warn("No projectId or dataset provided to buildSeoPayload, favicons and image Objects will not be created");
  }
  setConfig({ projectId, dataset });
  const merged = mergeSeoData(pageMetadata, globalSeoDefaults, seoFieldName);
  const schemas = schemaDefaults ? composeSchema({
    seo: merged,
    schemaDefaults,
    type: pageSchemaType || "WebPage",
    extra: extraSchemaData,
    isHomepage
  }) : undefined;
  return {
    meta: merged,
    schemas
  };
}
