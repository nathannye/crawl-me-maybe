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
// src/builders/article.ts
var buildArticle = defineBuilder("Article");
// src/builders/contact-page.ts
var buildContactPage = defineBuilder("ContactPage");
// src/builders/event.ts
var buildEvent = defineBuilder("Event");
// src/builders/faq.ts
var buildFAQPage = defineBuilder("FAQPage");
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
    image: person.image
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
    logo: org.logo,
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

// src/builders/organization.ts
function buildOrganization(organization, baseUrl, asReference = false) {
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
    logo: organization.logo,
    sameAs: organization.sameAs,
    department: departments,
    contactPoint
  };
}
// src/builders/product.ts
var buildProduct = defineBuilder("Product");
// src/builders/webpage.ts
var buildWebPage = defineBuilder("WebPage");
// src/builders/website.ts
var buildWebSite = defineBuilder("WebSite");
// src/schema-utils.ts
function coalesce(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null)
      return value;
  }
  return;
}
export {
  normalizeId,
  formatSchemaDate,
  coalesce,
  buildWebSite,
  buildWebPage,
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

//# debugId=8BE6B73C22E51F1464756E2164756E21
//# sourceMappingURL=index.js.map
