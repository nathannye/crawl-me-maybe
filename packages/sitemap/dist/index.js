// src/errors.ts
class SitemapNotFoundError extends Error {
  constructor(sitemap) {
    super(`Sitemap not found: ${sitemap}`);
    this.name = "SitemapNotFoundError";
  }
}

class SitemapPartNotFoundError extends Error {
  constructor(selector) {
    const sitemapLabel = selector.sitemap ?? "sitemap";
    super(`Sitemap part not found: ${sitemapLabel}[${selector.index}]`);
    this.name = "SitemapPartNotFoundError";
  }
}
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

// src/resolve-entries.ts
async function resolveSitemapEntrySource(source) {
  const resolved = typeof source === "function" ? await source() : source;
  if (!Array.isArray(resolved)) {
    throw new Error("Sitemap entry source must resolve to an array of entries");
  }
  return resolved;
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
async function generateSitemap(domain, options) {
  const {
    locales,
    localeMode = "prefix",
    prefixDefault = false
  } = options;
  const entries = await resolveSitemapEntrySource(options.entries);
  const processedUrls = locales && locales.length > 0 ? generateLocalizedEntries(entries, locales, domain, localeMode, prefixDefault) : entries.map(({ path, ...rest }) => ({
    ...rest,
    url: resolveUrl(path, domain)
  }));
  return createSitemapXml(processedUrls);
}
function generateSitemapIndex(domain, options) {
  try {
    const normalizedBase = normalizeDomain(domain);
    const normalizedFiles = options.sitemaps.map((f) => f.replace(/^\/+/, ""));
    const items = normalizedFiles.map((f) => `<sitemap><loc>${normalizedBase}/${f}</loc></sitemap>`).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
  } catch (err) {
    throw new Error(`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// src/manifest.ts
var DEFAULT_MAX_URLS = 50000;
var DEFAULT_BASE_PATH = "/sitemap";
function normalizeBasePath(basePath) {
  const resolved = basePath ?? DEFAULT_BASE_PATH;
  if (typeof resolved !== "string" || resolved.trim() === "") {
    throw new Error("createSitemapManifest: basePath must be a non-empty string");
  }
  const trimmed = resolved.trim().replace(/\/+$/, "");
  if (trimmed === "") {
    throw new Error("createSitemapManifest: basePath must be a non-empty string");
  }
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash.toLowerCase().endsWith(".xml")) {
    throw new Error("createSitemapManifest: basePath must not include .xml");
  }
  return withLeadingSlash;
}
function normalizeMaxUrls(maxUrls, fallback) {
  const resolved = maxUrls ?? fallback;
  if (typeof resolved !== "number" || !Number.isFinite(resolved) || !Number.isInteger(resolved) || resolved <= 0) {
    throw new Error("createSitemapManifest: maxUrls must be a positive integer");
  }
  return resolved;
}
function isSitemapDefinition(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "entries" in value;
}
function normalizeSitemapDefinitions(entries, defaultMaxUrls) {
  if (Array.isArray(entries) || typeof entries === "function") {
    return [
      {
        sitemap: null,
        entries,
        maxUrls: defaultMaxUrls
      }
    ];
  }
  if (typeof entries !== "object" || entries === null) {
    throw new Error("createSitemapManifest: entries must be a sitemap source or a named sitemap map");
  }
  const definitions = Object.entries(entries).map(([sitemap, definition]) => {
    if (!sitemap || sitemap.trim() === "") {
      throw new Error("createSitemapManifest: sitemap names must be non-empty strings");
    }
    if (Array.isArray(definition) || typeof definition === "function") {
      return {
        sitemap,
        entries: definition,
        maxUrls: defaultMaxUrls
      };
    }
    if (!isSitemapDefinition(definition)) {
      throw new Error(`createSitemapManifest: sitemap definition for "${sitemap}" must be a source or an object with entries`);
    }
    return {
      sitemap,
      entries: definition.entries,
      maxUrls: normalizeMaxUrls(definition.maxUrls, defaultMaxUrls)
    };
  });
  if (definitions.length === 0) {
    throw new Error("createSitemapManifest: entries must include at least one sitemap");
  }
  return definitions;
}
function chunkEntries(entries, maxUrls) {
  if (entries.length === 0)
    return [[]];
  const chunks = [];
  for (let index = 0;index < entries.length; index += maxUrls) {
    chunks.push(entries.slice(index, index + maxUrls));
  }
  return chunks;
}
function getChildSitemapPath(options) {
  const sitemapName = options.sitemap === null ? "" : `-${options.sitemap.replace(/^\/+/, "")}`;
  return `${options.basePath}${sitemapName}-${options.index}.xml`;
}
function validateSelectorIndex(index) {
  if (typeof index !== "number" || !Number.isFinite(index) || !Number.isInteger(index) || index < 0) {
    throw new SitemapPartNotFoundError({ index });
  }
}
function createSitemapManifest(options) {
  if (!options || typeof options !== "object") {
    throw new Error("createSitemapManifest: options is required");
  }
  if (!options.domain || typeof options.domain !== "string") {
    throw new Error("createSitemapManifest: domain must be a non-empty string");
  }
  const basePath = normalizeBasePath(options.basePath);
  const maxUrls = normalizeMaxUrls(options.maxUrls, DEFAULT_MAX_URLS);
  const definitions = normalizeSitemapDefinitions(options.entries, maxUrls);
  const {
    locales,
    localeMode = "prefix",
    prefixDefault = false
  } = options;
  const definitionCache = new Map;
  function resolveDefinition(index) {
    const cached = definitionCache.get(index);
    if (cached)
      return cached;
    const definition = definitions[index];
    if (!definition) {
      throw new SitemapPartNotFoundError({ index });
    }
    const promise = (async () => {
      const entries = await resolveSitemapEntrySource(definition.entries);
      const chunks = chunkEntries(entries, definition.maxUrls);
      const files = chunks.map((chunk, chunkIndex) => ({
        sitemap: definition.sitemap,
        index: chunkIndex,
        path: getChildSitemapPath({
          basePath,
          sitemap: definition.sitemap,
          index: chunkIndex
        }),
        entries: chunk
      }));
      return { definition, files };
    })();
    definitionCache.set(index, promise);
    return promise;
  }
  async function getAllFiles() {
    const plans = await Promise.all(definitions.map(async (_definition, index) => resolveDefinition(index)));
    return plans.flatMap((plan) => plan.files);
  }
  async function renderFileBySelector(selector) {
    validateSelectorIndex(selector.index);
    let definitionIndex = 0;
    if (definitions.length === 1) {
      if (selector.sitemap) {
        throw new SitemapNotFoundError(selector.sitemap);
      }
    } else {
      if (!selector.sitemap) {
        throw new Error("createSitemapManifest: sitemap is required when multiple sitemap definitions are configured");
      }
      definitionIndex = definitions.findIndex((definition) => definition.sitemap === selector.sitemap);
      if (definitionIndex < 0) {
        throw new SitemapNotFoundError(selector.sitemap);
      }
    }
    const plan = await resolveDefinition(definitionIndex);
    const file = plan.files[selector.index];
    if (!file) {
      throw new SitemapPartNotFoundError({
        sitemap: plan.definition.sitemap ?? undefined,
        index: selector.index
      });
    }
    return generateSitemap(options.domain, {
      entries: file.entries,
      locales,
      localeMode,
      prefixDefault
    });
  }
  return {
    async getRootSitemap() {
      const files = await getAllFiles();
      if (files.length === 1) {
        return renderFileBySelector({ index: 0 });
      }
      return generateSitemapIndex(options.domain, {
        sitemaps: files.map((file) => file.path)
      });
    },
    async getSitemap(selector) {
      return renderFileBySelector(selector);
    },
    async getSitemapFiles() {
      const files = await getAllFiles();
      return files.map(({ sitemap, index, path }) => ({ sitemap, index, path }));
    }
  };
}
export {
  generateSitemapIndex,
  generateSitemap,
  generateRobotsTxt,
  createSitemapManifest,
  SitemapPartNotFoundError,
  SitemapNotFoundError,
  DEFAULT_ROBOTS_RULES
};

//# debugId=09AAFD3E6F5DB83264756E2164756E21
//# sourceMappingURL=index.js.map
