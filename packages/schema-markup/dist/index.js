// src/builders/fragments.ts
function normalizeId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function createSchemaId({
  kind,
  name,
  baseUrl = "",
  explicitId
}) {
  if (explicitId) {
    return explicitId.startsWith("http") ? explicitId : `${baseUrl}${explicitId}`;
  }
  return `${baseUrl}#${kind}-${normalizeId(name)}`;
}
function asIdReference(id) {
  return { "@id": id };
}
function buildWebsiteReference(canonicalUrl) {
  if (!canonicalUrl)
    return;
  return {
    "@type": "WebSite",
    "@id": `${canonicalUrl}#website`
  };
}
function mapContactPoints(contactPoints) {
  if (!contactPoints?.length)
    return;
  return contactPoints.map((cp) => ({
    "@type": "ContactPoint",
    contactType: cp.contactType,
    telephone: cp.telephone,
    email: cp.email,
    url: cp.url,
    areaServed: cp.areaServed,
    availableLanguage: cp.availableLanguage
  }));
}
function mapEntityReferences(entities, mapToReference, baseUrl) {
  if (!entities?.length)
    return;
  return entities.map((entity) => mapToReference(entity, baseUrl)).filter(Boolean);
}

// src/build.ts
var TYPE_PRIORITY = [
  "Organization",
  "Person",
  "LocalBusiness",
  "WebSite",
  "WebPage",
  "ProfilePage",
  "QAPage",
  "BreadcrumbList",
  "Article",
  "Course",
  "Dataset",
  "DiscussionForumPosting",
  "JobPosting",
  "Movie",
  "Product",
  "Recipe",
  "SoftwareApplication",
  "VacationRental",
  "VideoObject",
  "Event",
  "ItemList",
  "Question",
  "Answer",
  "Review",
  "Comment",
  "AggregateRating"
];
var typeWeight = new Map(TYPE_PRIORITY.map((type, index) => [type, index]));
var hasObjectShape = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};
var hasType = (value) => {
  return typeof value["@type"] === "string";
};
var hasId = (value) => {
  return typeof value["@id"] === "string" && value["@id"].length > 0;
};
var ensureContext = (node) => {
  if (hasType(node) && node["@context"] === undefined) {
    return {
      "@context": "https://schema.org",
      ...node
    };
  }
  return node;
};
var assembleNodes = (nodes) => {
  const collected = [];
  const seenIds = new Set;
  const processingIds = new Set;
  let orderCounter = 0;
  const addNode = (node) => {
    const normalized = ensureContext(node);
    if (hasId(normalized)) {
      if (seenIds.has(normalized["@id"]))
        return;
      seenIds.add(normalized["@id"]);
    }
    collected.push({
      node: normalized,
      order: orderCounter++
    });
  };
  const processValue = (value, isRoot = false) => {
    if (Array.isArray(value)) {
      return value.map((item) => processValue(item, false));
    }
    if (!hasObjectShape(value))
      return value;
    if (!isRoot && hasType(value) && hasId(value)) {
      registerEntity(value);
      return { "@id": value["@id"] };
    }
    const output = {};
    for (const [key, child] of Object.entries(value)) {
      output[key] = processValue(child, false);
    }
    return output;
  };
  const registerEntity = (entity) => {
    const id = entity["@id"];
    if (seenIds.has(id) || processingIds.has(id))
      return;
    processingIds.add(id);
    const processedEntity = processValue(entity, true);
    if (hasObjectShape(processedEntity)) {
      addNode(processedEntity);
    }
    processingIds.delete(id);
  };
  for (const node of nodes) {
    if (!node)
      continue;
    const processed = processValue(node, true);
    if (!hasObjectShape(processed))
      continue;
    addNode(processed);
  }
  const ranked = collected.sort((a, b) => {
    const aType = hasType(a.node) ? a.node["@type"] : "";
    const bType = hasType(b.node) ? b.node["@type"] : "";
    const aWeight = typeWeight.get(aType) ?? Number.MAX_SAFE_INTEGER;
    const bWeight = typeWeight.get(bType) ?? Number.MAX_SAFE_INTEGER;
    if (aWeight !== bWeight)
      return aWeight - bWeight;
    return a.order - b.order;
  });
  return ranked.map(({ node }) => JSON.stringify(node));
};
var buildIdentityNodes = (identity, siteUrl) => {
  switch (identity.type) {
    case "person": {
      const id = createSchemaId({
        kind: "person",
        name: identity.name,
        baseUrl: siteUrl
      });
      return {
        node: {
          "@type": "Person",
          "@id": id,
          name: identity.name,
          description: identity.description,
          image: identity.image,
          sameAs: identity.sameAs,
          url: siteUrl
        },
        ref: { "@id": id }
      };
    }
    case "organization": {
      const id = createSchemaId({
        kind: "organization",
        name: identity.name,
        baseUrl: siteUrl
      });
      return {
        node: {
          "@type": "Organization",
          "@id": id,
          name: identity.name,
          description: identity.description,
          logo: identity.logo,
          sameAs: identity.sameAs,
          url: siteUrl
        },
        ref: { "@id": id }
      };
    }
    case "localBusiness": {
      const id = createSchemaId({
        kind: "local-business",
        name: identity.name,
        baseUrl: siteUrl
      });
      return {
        node: {
          "@type": "LocalBusiness",
          "@id": id,
          name: identity.name,
          description: identity.description,
          logo: identity.logo,
          telephone: identity.phone,
          email: identity.email,
          address: identity.address,
          openingHoursSpecification: identity.openingHours,
          sameAs: identity.sameAs,
          url: siteUrl
        },
        ref: { "@id": id }
      };
    }
  }
};
var buildSchemaMarkup = (input) => {
  const { node: identityNode, ref: identityRef } = buildIdentityNodes(input.identity, input.siteUrl);
  const websiteId = `${input.siteUrl}#website`;
  const websiteNode = {
    "@type": "WebSite",
    "@id": websiteId,
    name: input.siteName,
    url: input.siteUrl,
    description: input.siteDescription,
    publisher: identityRef
  };
  const webpageNode = {
    "@type": "WebPage",
    "@id": `${input.pageUrl}#webpage`,
    url: input.pageUrl,
    name: input.pageTitle,
    description: input.pageDescription,
    isPartOf: { "@id": websiteId },
    breadcrumb: input.breadcrumb,
    mainEntity: input.mainEntity
  };
  return assembleNodes([identityNode, websiteNode, webpageNode]);
};
// src/define-builder.ts
function defineBuilder(type) {
  return (input) => ({
    "@context": "https://schema.org",
    "@type": type,
    ...input
  });
}

// src/builders/about-page.ts
var buildAboutPage = defineBuilder("AboutPage");
// src/builders/aggregate-rating.ts
var buildAggregateRating = defineBuilder("AggregateRating");
// src/builders/answer.ts
var buildAnswer = defineBuilder("Answer");
// src/builders/article.ts
var buildArticle = defineBuilder("Article");
// src/builders/internal/slug-to-title.ts
function slugToTitle(segment) {
  const decoded = decodeURIComponent(segment || "");
  const normalized = decoded.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!normalized)
    return "";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

// src/builders/breadcrumb-list.ts
function normalizePath(path) {
  if (!path)
    return "/";
  const withoutHash = path.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  const prefixed = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  return prefixed.replace(/\/+$/, "") || "/";
}
function createDerivedParentItems(pageUrl) {
  const normalized = normalizePath(pageUrl);
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length <= 1)
    return [];
  return segments.slice(0, -1).map((segment, index) => ({
    title: slugToTitle(segment),
    url: `/${segments.slice(0, index + 1).join("/")}`
  }));
}
function toListItems(items) {
  return items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.title,
    item: item.url
  }));
}
function buildBreadcrumbListSchema({
  pageUrl,
  pageTitle,
  items
}) {
  const parentItems = items?.length ? items : createDerivedParentItems(pageUrl);
  const finalItems = [
    ...parentItems,
    {
      title: pageTitle,
      url: normalizePath(pageUrl)
    }
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: toListItems(finalItems)
  };
}
// src/builders/comment.ts
var buildComment = defineBuilder("Comment");
// src/builders/contact-page.ts
var buildContactPage = defineBuilder("ContactPage");
// src/builders/course.ts
var buildCourse = defineBuilder("Course");
// src/builders/dataset.ts
var buildDataset = defineBuilder("Dataset");
// src/builders/discussion-forum-posting.ts
var buildDiscussionForumPosting = defineBuilder("DiscussionForumPosting");
// src/builders/event.ts
var buildEvent = defineBuilder("Event");
// src/builders/faq.ts
var buildFAQPage = defineBuilder("FAQPage");
// src/builders/item-list.ts
var buildItemList = defineBuilder("ItemList");
// src/builders/job-posting.ts
var buildJobPosting = defineBuilder("JobPosting");
// src/builders/local-business.ts
var buildLocalBusiness = defineBuilder("LocalBusiness");
// src/builders/movie.ts
var buildMovie = defineBuilder("Movie");
// src/builders/utils.ts
function buildOrganizationCore(org, baseUrl) {
  const base = baseUrl || org.url || "";
  const id = createSchemaId({
    kind: "organization",
    name: org.name,
    baseUrl: base,
    explicitId: org["@id"]
  });
  const departments = org.department ? org.department.map((dept) => buildOrgSchema(dept, true, baseUrl)).filter(Boolean) : undefined;
  const contactPoint = mapContactPoints(org.contactPoint);
  return {
    "@type": "Organization",
    "@id": id,
    name: org.name,
    url: org.url,
    logo: org.logo,
    sameAs: org.sameAs,
    department: departments,
    contactPoint
  };
}
function buildPersonSchema(person, asReference = false, baseUrl) {
  if (!person)
    return;
  const base = baseUrl || "";
  const id = createSchemaId({
    kind: "person",
    name: person.name,
    baseUrl: base,
    explicitId: person["@id"]
  });
  if (asReference) {
    return asIdReference(id);
  }
  return {
    "@type": "Person",
    "@id": id,
    name: person.name,
    url: person.url,
    sameAs: person.sameAs,
    jobTitle: person.jobTitle,
    image: person.image
  };
}
function buildOrgSchema(org, asReference = false, baseUrl) {
  if (!org)
    return;
  const base = baseUrl || org.url || "";
  const id = createSchemaId({
    kind: "organization",
    name: org.name,
    baseUrl: base,
    explicitId: org["@id"]
  });
  if (asReference) {
    return asIdReference(id);
  }
  return buildOrganizationCore(org, baseUrl);
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

// src/builders/organization.ts
function buildOrganization(organization, baseUrl, asReference = false) {
  const base = baseUrl || organization.url || "";
  const id = createSchemaId({
    kind: "organization",
    name: organization.name,
    baseUrl: base,
    explicitId: organization["@id"]
  });
  if (asReference) {
    return asIdReference(id);
  }
  return {
    "@context": "https://schema.org",
    ...buildOrganizationCore(organization, baseUrl)
  };
}
// src/builders/profile-page.ts
var buildProfilePage = defineBuilder("ProfilePage");
// src/builders/product.ts
var buildProduct = defineBuilder("Product");
// src/builders/qa-page.ts
var buildQAPage = defineBuilder("QAPage");
// src/builders/question.ts
var buildQuestion = defineBuilder("Question");
// src/builders/recipe.ts
var buildRecipe = defineBuilder("Recipe");
// src/builders/review.ts
var buildReview = defineBuilder("Review");
// src/builders/software-application.ts
var buildSoftwareApplication = defineBuilder("SoftwareApplication");
// src/builders/vacation-rental.ts
var buildVacationRental = defineBuilder("VacationRental");
// src/builders/video-object.ts
var buildVideoObject = defineBuilder("VideoObject");
// src/builders/webpage.ts
var buildWebPage = defineBuilder("WebPage");
// src/builders/website.ts
var buildWebSite = defineBuilder("WebSite");
export {
  normalizeId,
  mapEntityReferences,
  mapContactPoints,
  formatSchemaDate,
  createSchemaId,
  buildWebsiteReference,
  buildWebSite,
  buildWebPage,
  buildVideoObject,
  buildVacationRental,
  buildSoftwareApplication,
  buildSchemaMarkup,
  buildReview,
  buildRecipe,
  buildQuestion,
  buildQAPage,
  buildProfilePage,
  buildProduct,
  buildPersonSchema,
  buildPersonOrOrg,
  buildOrganizationCore,
  buildOrganization,
  buildOrgSchema,
  buildMovie,
  buildLocalBusiness,
  buildJobPosting,
  buildItemList,
  buildFAQPage,
  buildEvent,
  buildDiscussionForumPosting,
  buildDataset,
  buildCourse,
  buildContactPage,
  buildComment,
  buildBreadcrumbListSchema,
  buildArticle,
  buildAnswer,
  buildAggregateRating,
  buildAboutPage,
  asIdReference
};

//# debugId=8B5E021735BBDB0164756E2164756E21
//# sourceMappingURL=index.js.map
