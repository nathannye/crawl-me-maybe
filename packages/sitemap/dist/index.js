// src/domain.ts
function normalizeDomain(domain) {
  return domain.replace(/\/+$/, "");
}
function normalizeDomainBase(domain) {
  return `${normalizeDomain(domain)}/`;
}

// src/robots.ts
var DEFAULT_ROBOTS_RULES = [
  {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/api/"]
  }
];
function serializeRobotsRules(rules) {
  const ruleArray = Array.isArray(rules) ? rules : [rules];
  return ruleArray.map((rule) => {
    const agents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];
    const lines = agents.map((a) => `User-agent: ${a}`);
    if (rule.allow) {
      const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
      for (const a of allows)
        lines.push(`Allow: ${a}`);
    }
    if (rule.disallow) {
      const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
      for (const d of disallows)
        lines.push(`Disallow: ${d}`);
    }
    return lines.join(`
`);
  }).join(`

`);
}
function toSitemapPath(filename) {
  const trimmed = filename.replace(/^\/+/, "");
  return `/${trimmed}`;
}
function toSitemapUrl(domain, filename) {
  return `${normalizeDomain(domain)}${toSitemapPath(filename)}`;
}
function generateRobotsTxt(domain, sitemapIndex = "sitemap.xml", rules) {
  if (!domain || typeof domain !== "string") {
    throw new Error("generateRobotsTxt: domain must be a non-empty string");
  }
  if (!sitemapIndex || typeof sitemapIndex !== "string") {
    throw new Error("generateRobotsTxt: sitemapIndex must be a non-empty string");
  }
  let content = serializeRobotsRules(rules ?? DEFAULT_ROBOTS_RULES).trim();
  if (!content.endsWith(`
`))
    content += `
`;
  content += `Sitemap: ${toSitemapUrl(domain, sitemapIndex)}
`;
  return content;
}
// src/localize.ts
function resolveUrl(path, domain) {
  const slug = path.startsWith("/") ? path.slice(1) : path;
  return new URL(slug, normalizeDomainBase(domain)).href;
}
function localizeUrl(path, locale, domain, localeMode = "prefix", prefixDefault = false) {
  if (locale.default && !prefixDefault) {
    return resolveUrl(path, domain);
  }
  if (localeMode === "subdomain") {
    const urlObj = new URL(domain);
    const hostname = urlObj.hostname.replace(/^www\./, "");
    const subdomain = `${locale.code}.${hostname}`;
    const port = urlObj.port ? `:${urlObj.port}` : "";
    const subdomainBase = `${urlObj.protocol}//${subdomain}${port}/`;
    return resolveUrl(path, subdomainBase);
  }
  const domainWithLocale = `${normalizeDomain(domain)}/${locale.code}/`;
  return resolveUrl(path, domainWithLocale);
}
function generateLocalizedEntries(baseEntries, locales, domain, localeMode = "prefix", prefixDefault = false) {
  const localizedEntries = [];
  const defaultLocale = locales.find((l) => l.default);
  for (const entry of baseEntries) {
    const { path, ...rest } = entry;
    if (entry.skipLocalization) {
      localizedEntries.push({
        ...rest,
        url: resolveUrl(path, domain)
      });
      continue;
    }
    const alternates = locales.map((locale) => ({
      hreflang: locale.code,
      href: localizeUrl(path, locale, domain, localeMode, prefixDefault)
    }));
    const xDefaultLocale = defaultLocale || locales[0];
    if (xDefaultLocale) {
      alternates.push({
        hreflang: "x-default",
        href: localizeUrl(path, xDefaultLocale, domain, localeMode, prefixDefault)
      });
    }
    for (const locale of locales) {
      localizedEntries.push({
        ...rest,
        url: localizeUrl(path, locale, domain, localeMode, prefixDefault),
        alternates
      });
    }
  }
  return localizedEntries;
}

// src/xml.ts
function createSitemapXml(urls) {
  try {
    const now = new Date().toISOString();
    let imageNS = false;
    let videoNS = false;
    let xhtmlNS = false;
    const items = urls.map((u) => {
      let xml = `<url><loc>${u.url}</loc><lastmod>${u.lastmod ?? now}</lastmod>`;
      if (u.changefreq) {
        xml += `<changefreq>${u.changefreq}</changefreq>`;
      }
      if (typeof u.priority === "number") {
        xml += `<priority>${u.priority.toFixed(1)}</priority>`;
      }
      if (u.alternates?.length) {
        xhtmlNS = true;
        for (const alt of u.alternates) {
          xml += `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`;
        }
      }
      if (u.imageUrls?.length) {
        imageNS = true;
        for (const img of u.imageUrls) {
          xml += `<image:image><image:loc>${img}</image:loc></image:image>`;
        }
      }
      if (u.videoUrls?.length) {
        videoNS = true;
        for (const vid of u.videoUrls) {
          xml += `<video:video><video:content_loc>${vid}</video:content_loc></video:video>`;
        }
      }
      xml += "</url>";
      return xml;
    }).join("");
    const ns = [
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      xhtmlNS ? 'xmlns:xhtml="http://www.w3.org/1999/xhtml"' : null,
      imageNS ? 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : null,
      videoNS ? 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"' : null
    ].filter(Boolean).join(" ");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${ns}>${items}</urlset>`;
  } catch (err) {
    throw new Error(`Sitemap XML creation failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// src/sitemap.ts
function generateSitemap(config) {
  const {
    domain,
    entries,
    locales,
    localeMode = "prefix",
    prefixDefault = false
  } = config;
  const processedUrls = locales && locales.length > 0 ? generateLocalizedEntries(entries, locales, domain, localeMode, prefixDefault) : entries.map(({ path, ...rest }) => ({
    ...rest,
    url: resolveUrl(path, domain)
  }));
  return createSitemapXml(processedUrls);
}
function generateIndexSitemap(baseUrl, childSitemapNames) {
  try {
    const normalizedBase = normalizeDomain(baseUrl);
    const normalizedFiles = childSitemapNames.map((f) => f.replace(/^\/+/, ""));
    const items = normalizedFiles.map((f) => `<sitemap><loc>${normalizedBase}/${f}</loc></sitemap>`).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
  } catch (err) {
    throw new Error(`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
export {
  generateSitemap,
  generateRobotsTxt,
  generateIndexSitemap,
  DEFAULT_ROBOTS_RULES
};

//# debugId=1E4AA3AB54EDE05D64756E2164756E21
//# sourceMappingURL=index.js.map
