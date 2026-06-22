// src/build.ts
var schemaBuilders = {
  WebPage: buildWebPage
};
// src/schema-utils.ts
function coalesce(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null)
      return value;
  }
  return;
}

// src/utils/image.ts
import { urlFor } from "@crawl-me-maybe/meta";
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

// src/builders/about-page.ts
function buildAboutPage({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.webPage || {};
  const name = coalesce(extra?.name, extra?.title, seo.title);
  const description = coalesce(extra?.description, seo.description);
  const image = createSchemaImageObject(coalesce(extra?.image, seo.metaImage), schemaDefaults?.imageFallback);
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name,
    description,
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
// src/builders/utils.ts
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

// src/builders/article.ts
function buildArticle({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.article || {};
  const headline = coalesce(extra?.headline, extra?.title, seo.title);
  const description = coalesce(extra?.description, seo.description);
  const image = createSchemaImageObject(coalesce(extra?.image, seo.metaImage), schemaDefaults?.imageFallback);
  const authors = extra?.author || [];
  const authorSchema = authors.length > 0 ? authors.map((author) => buildPersonOrOrg(author, true, seo.canonicalUrl)).filter(Boolean) : undefined;
  const publisher = coalesce(extra?.publisher, defaults.publisher, schemaDefaults?.publisher, schemaDefaults?.organization);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    datePublished: formatSchemaDate(coalesce(extra?.datePublished, extra?._createdAt)),
    dateModified: formatSchemaDate(coalesce(extra?.dateModified, extra?._updatedAt)),
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
// src/builders/contact-page.ts
function buildContactPage({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.webPage || {};
  const name = coalesce(extra?.name, extra?.title, seo.title);
  const description = coalesce(extra?.description, seo.description);
  const image = createSchemaImageObject(coalesce(extra?.image, seo.metaImage), schemaDefaults?.imageFallback);
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    description,
    url: coalesce(seo.canonicalUrl, extra?.url),
    image,
    inLanguage: extra?.inLanguage || defaults.inLanguage,
    datePublished: extra?.datePublished || extra?._createdAt,
    dateModified: extra?.dateModified || extra?._updatedAt,
    isPartOf: seo.canonicalUrl ? {
      "@type": "WebSite",
      "@id": `${seo.canonicalUrl}#website`
    } : undefined
  };
}
// src/builders/event.ts
function buildEvent({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.event || {};
  const name = coalesce(extra?.name, extra?.title, seo.title);
  const description = coalesce(extra?.description, seo.description);
  const image = createSchemaImageObject(coalesce(extra?.image, seo.metaImage), schemaDefaults?.imageFallback);
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
    name,
    description,
    image,
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
// src/builders/faq.ts
function buildFAQPage({
  seo,
  extra
}) {
  const name = coalesce(extra?.name, extra?.title, seo.title);
  const description = coalesce(extra?.description, seo.description);
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
// src/builders/organization.ts
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
// src/builders/product.ts
function buildProduct({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.product || {};
  const name = coalesce(extra?.name, extra?.title, seo.title);
  const description = coalesce(extra?.description, seo.description);
  const image = createSchemaImageObject(coalesce(extra?.image, seo.metaImage), schemaDefaults?.imageFallback);
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
    name,
    description,
    image,
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
// src/builders/webpage.ts
function buildWebPage2({
  seo,
  schemaDefaults,
  extra
}) {
  const defaults = schemaDefaults?.webPage || {};
  const name = coalesce(extra?.name, extra?.title, seo.title);
  const description = coalesce(extra?.description, seo.description);
  const image = createSchemaImageObject(coalesce(extra?.image, seo.metaImage), schemaDefaults?.imageFallback);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
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
// src/builders/website.ts
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
// src/compose.ts
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
    WebPage: buildWebPage2,
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
export {
  normalizeId,
  formatSchemaDate,
  createSchemaImageObject,
  composeSchema,
  coalesce,
  buildWebSite,
  buildWebPage2 as buildWebPage,
  buildProduct,
  buildPersonSchema,
  buildPersonOrOrg,
  buildOrganization,
  buildOrgSchema,
  buildFAQPage,
  buildEvent,
  buildContactPage,
  buildArticle,
  buildAboutPage
};

//# debugId=0D1DC7CEB030E8FA64756E2164756E21
//# sourceMappingURL=index.js.map
