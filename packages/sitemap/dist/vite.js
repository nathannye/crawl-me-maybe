// src/vite-plugin.ts
import path2 from "node:path";

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

// src/resolve-entries.ts
async function resolveSitemapEntrySource(source) {
  const resolved = typeof source === "function" ? await source() : source;
  if (!Array.isArray(resolved)) {
    throw new Error("Sitemap entry source must resolve to an array of entries");
  }
  return resolved;
}

// src/domain.ts
function normalizeDomain(domain) {
  return domain.replace(/\/+$/, "");
}
function normalizeDomainBase(domain) {
  return `${normalizeDomain(domain)}/`;
}

// src/localize.ts
function resolveUrl(path, domain) {
  const slug = path.startsWith("/") ? path.slice(1) : path;
  return new URL(slug, normalizeDomainBase(domain)).href;
}
function validateLocaleConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("sitemap locales config must be an object");
  }
  if (!Array.isArray(config.locales) || config.locales.length === 0) {
    throw new Error("sitemap locales config must include at least one locale");
  }
  if (new Set(config.locales).size !== config.locales.length) {
    throw new Error("sitemap locales config locales must not contain duplicates");
  }
  if (!config.defaultLocale || typeof config.defaultLocale !== "string") {
    throw new Error("sitemap locales config must include a defaultLocale");
  }
  if (!config.locales.includes(config.defaultLocale)) {
    throw new Error(`sitemap locales config defaultLocale "${config.defaultLocale}" must exist in locales`);
  }
  const mode = config.mode ?? "prefix";
  if (!["prefix", "subdomain", "domain"].includes(mode)) {
    throw new Error(`sitemap locales config mode "${mode}" is not supported`);
  }
  if (mode !== "prefix") {
    if (!config.domainByLocale || typeof config.domainByLocale !== "object") {
      throw new Error(`sitemap locales config domainByLocale is required for ${mode} mode`);
    }
    for (const locale of config.locales) {
      const base = config.domainByLocale[locale];
      if (!base || typeof base !== "string") {
        throw new Error(`sitemap locales config domainByLocale must include a valid base domain for locale "${locale}"`);
      }
    }
  }
  if (typeof config.xDefault === "string" && !config.locales.includes(config.xDefault)) {
    throw new Error(`sitemap locales config xDefault locale "${config.xDefault}" must exist in locales`);
  }
}
function getLocaleBaseDomain(domain, config, localeCode) {
  const mode = config.mode ?? "prefix";
  if (mode === "prefix")
    return domain;
  const mappedDomain = config.domainByLocale?.[localeCode];
  if (!mappedDomain) {
    throw new Error(`sitemap locales config domainByLocale is missing a base domain for locale "${localeCode}"`);
  }
  return mappedDomain;
}
function localizeUrl(path, localeCode, config, domain) {
  const mode = config.mode ?? "prefix";
  const baseDomain = getLocaleBaseDomain(domain, config, localeCode);
  if (mode === "prefix") {
    if (localeCode === config.defaultLocale && !config.prefixDefault) {
      return resolveUrl(path, domain);
    }
    const prefixedBase = `${normalizeDomain(baseDomain)}/${localeCode}/`;
    return resolveUrl(path, prefixedBase);
  }
  return resolveUrl(path, baseDomain);
}
function getEntryLocaleCodes(entry, config) {
  const configuredLocales = new Set(config.locales);
  const entryLocales = entry.locales ?? config.locales;
  if (entryLocales.length === 0) {
    return [];
  }
  if (new Set(entryLocales).size !== entryLocales.length) {
    throw new Error("sitemap entry locales must not contain duplicates");
  }
  for (const locale of entryLocales) {
    if (!configuredLocales.has(locale)) {
      throw new Error(`sitemap entry locale "${locale}" is not present in the sitemap locales config`);
    }
  }
  if (entry.localePaths) {
    for (const locale of Object.keys(entry.localePaths)) {
      if (!configuredLocales.has(locale)) {
        throw new Error(`sitemap entry localePaths locale "${locale}" is not present in the sitemap locales config`);
      }
    }
  }
  return entryLocales;
}
function buildAlternates(entryPathByLocale, config, domain) {
  const alternates = Array.from(entryPathByLocale.entries()).map(([localeCode, path]) => ({
    hreflang: localeCode,
    href: localizeUrl(path, localeCode, config, domain)
  }));
  const xDefaultTarget = config.xDefault === true ? config.defaultLocale : typeof config.xDefault === "string" ? config.xDefault : undefined;
  if (xDefaultTarget && entryPathByLocale.has(xDefaultTarget)) {
    const path = entryPathByLocale.get(xDefaultTarget);
    if (path) {
      alternates.push({
        hreflang: "x-default",
        href: localizeUrl(path, xDefaultTarget, config, domain)
      });
    }
  }
  return alternates;
}
function expandLocalizedEntries(baseEntries, domain, locales) {
  if (!locales) {
    return baseEntries.map(({ path, locales: _locales, localePaths: _localePaths, ...rest }) => ({
      ...rest,
      url: resolveUrl(path, domain)
    }));
  }
  validateLocaleConfig(locales);
  const localizedEntries = [];
  for (const entry of baseEntries) {
    const { path, locales: entryLocales, localePaths, ...rest } = entry;
    const localeCodes = getEntryLocaleCodes(entry, locales);
    if (localeCodes.length === 0)
      continue;
    const entryPathByLocale = new Map;
    for (const localeCode of localeCodes) {
      const resolvedPath = localeCode === locales.defaultLocale ? path : localePaths?.[localeCode] ?? path;
      entryPathByLocale.set(localeCode, resolvedPath);
    }
    const alternates = locales.alternates === false ? undefined : buildAlternates(entryPathByLocale, locales, domain);
    for (const localeCode of localeCodes) {
      const resolvedPath = entryPathByLocale.get(localeCode) ?? path;
      localizedEntries.push({
        ...rest,
        url: localizeUrl(resolvedPath, localeCode, locales, domain),
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
  const { locales } = options;
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
      const concreteEntries = expandLocalizedEntries(entries, options.domain, locales);
      const chunks = chunkEntries(concreteEntries, definition.maxUrls);
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
    if (selector.sitemap) {
      definitionIndex = definitions.findIndex((definition) => definition.sitemap === selector.sitemap);
      if (definitionIndex < 0) {
        throw new SitemapNotFoundError(selector.sitemap);
      }
    } else if (definitions.length > 1) {
      throw new Error("createSitemapManifest: sitemap is required when multiple sitemap definitions are configured");
    }
    const plan = await resolveDefinition(definitionIndex);
    const file = plan.files[selector.index];
    if (!file) {
      throw new SitemapPartNotFoundError({
        sitemap: plan.definition.sitemap ?? undefined,
        index: selector.index
      });
    }
    return createSitemapXml(file.entries);
  }
  return {
    async getRootSitemap() {
      const files = await getAllFiles();
      if (files.length === 1) {
        return createSitemapXml(files[0].entries);
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

// src/validate-config.ts
function validateConfig(config) {
  if (!config) {
    throw new Error("vitePluginSitemap: config is required");
  }
  if (!config.domain || typeof config.domain !== "string") {
    throw new Error("vitePluginSitemap: domain must be a non-empty string");
  }
  try {
    new URL(config.domain);
  } catch {
    throw new Error(`vitePluginSitemap: domain must be a valid URL origin (received "${config.domain}")`);
  }
  if (!config.sitemaps) {
    throw new Error("vitePluginSitemap: sitemaps is required");
  }
  if (typeof config.sitemaps === "object" && !Array.isArray(config.sitemaps) && Object.keys(config.sitemaps).length === 0) {
    throw new Error("vitePluginSitemap: sitemaps object must include at least one sitemap definition");
  }
  return config;
}

// src/file.ts
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
var createFile = (outputPath, filename, content) => {
  try {
    const targetPath = path.join(outputPath, filename);
    mkdirSync(path.dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, content);
  } catch (err) {
    throw new Error(`Failed to write file ${filename} to ${outputPath}: ${err instanceof Error ? err.message : String(err)}`);
  }
};

// src/vite-plugin.ts
function vitePluginSitemap(config) {
  const pluginConfig = validateConfig(config);
  const domain = pluginConfig.domain;
  const outDir = pluginConfig.outDir || "dist";
  const resolvedOutDir = path2.resolve(process.cwd(), outDir);
  const manifest = createSitemapManifest({
    domain,
    entries: pluginConfig.sitemaps,
    maxUrls: pluginConfig.maxUrls,
    locales: pluginConfig.locales
  });
  const writeRobots = (sitemapIndex = "sitemap.xml") => {
    const content = generateRobotsTxt(domain, sitemapIndex, pluginConfig.robots);
    createFile(resolvedOutDir, "robots.txt", content);
  };
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      const files = await manifest.getSitemapFiles();
      const rootXml = await manifest.getRootSitemap();
      createFile(resolvedOutDir, "sitemap.xml", rootXml);
      if (files.length > 1) {
        for (const file of files) {
          const xml = await manifest.getSitemap({
            sitemap: file.sitemap ?? undefined,
            index: file.index
          });
          createFile(resolvedOutDir, file.path, xml);
        }
      }
      writeRobots("sitemap.xml");
      if (files.length === 1) {
        console.log("✅ Generated sitemap.xml + robots.txt");
      } else {
        console.log(`✅ Generated sitemap.xml, ${files.length} child sitemap file(s), and robots.txt`);
      }
    }
  };
}
export {
  vitePluginSitemap
};

//# debugId=06E28A08D3295F9564756E2164756E21
//# sourceMappingURL=vite.js.map
