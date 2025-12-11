import fs from 'fs';
import path from 'path';

// packages/sitemap/src/index.ts

// packages/sitemap/src/robots.ts
var DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
`;
function minifyXml(xml) {
  return xml.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
}
function localizeUrl(baseUrl, locale, domain, localeMode = "prefix") {
  const normalizedUrl = baseUrl?.startsWith("/") ? baseUrl : `/${baseUrl || ""}`;
  if (locale.default) {
    return domain + normalizedUrl;
  }
  if (localeMode === "subdomain") {
    const urlObj = new URL(domain);
    const hostname = urlObj.hostname.replace(/^www\./, "");
    const subdomain = `${locale.code}.${hostname}`;
    return `${urlObj.protocol}//${subdomain}${urlObj.port ? `:${urlObj.port}` : ""}${normalizedUrl}`;
  }
  const prefix = `/${locale.code}`;
  return domain + prefix + normalizedUrl;
}
async function createSitemapXml(urls, opts) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
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
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${ns}>${items}</urlset>`;
    if (opts?.minify) {
      xmlString = minifyXml(xmlString);
    }
    return xmlString;
  } catch (err) {
    throw new Error(
      `Sitemap XML creation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
async function createIndexSitemap(files, baseUrl, opts) {
  try {
    const items = files.map((f) => `<sitemap><loc>${baseUrl}/${f}</loc></sitemap>`).join("");
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
    if (opts?.minify) {
      xmlString = minifyXml(xmlString);
    }
    return xmlString;
  } catch (err) {
    throw new Error(
      `Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
var createFile = (outputPath, filename, content) => {
  try {
    fs.writeFileSync(path.join(outputPath, filename), content);
  } catch (err) {
    throw new Error(
      `Failed to write file ${filename} to ${outputPath}: ${err instanceof Error ? err.message : String(err)}`
    );
  }
};
function generateLocalizedEntries(baseEntries, locales, domain, localeMode = "prefix") {
  const localizedEntries = [];
  const defaultLocale = locales.find((l) => l.default);
  for (const entry of baseEntries) {
    if (entry.skipLocalization) {
      localizedEntries.push({
        ...entry,
        url: domain + entry.url
      });
      continue;
    }
    const alternates = locales.map((locale) => ({
      hreflang: locale.code,
      href: localizeUrl(entry.url, locale, domain, localeMode)
    }));
    const xDefaultLocale = defaultLocale || locales[0];
    if (xDefaultLocale) {
      alternates.push({
        hreflang: "x-default",
        href: localizeUrl(entry.url, xDefaultLocale, domain, localeMode)
      });
    }
    for (const locale of locales) {
      localizedEntries.push({
        ...entry,
        url: localizeUrl(entry.url, locale, domain, localeMode),
        alternates
      });
    }
  }
  return localizedEntries;
}

// packages/sitemap/src/index.ts
var DEFAULT_CONFIG = {
  domain: "https://yoursite.com",
  outDir: "dist",
  disableMinification: false,
  sitemaps: { pages: async () => [] },
  robots: async () => DEFAULT_ROBOTS_TXT
};
function crawlMeMaybeSitemap(config = DEFAULT_CONFIG) {
  const pluginConfig = config || DEFAULT_CONFIG;
  const domain = pluginConfig?.domain;
  if (!domain) {
    throw new Error(
      "\u26A0\uFE0F No domain provided. Sitemap generation requires a domain."
    );
  }
  const outDir = pluginConfig?.outDir || "dist";
  const minify = !pluginConfig?.disableMinification;
  const locales = pluginConfig?.locales;
  const localeMode = pluginConfig?.localeMode || "prefix";
  const createRobots = async (sitemapsUrls = ["/sitemap.xml"]) => {
    let userRobots = DEFAULT_ROBOTS_TXT;
    if (pluginConfig.robots && typeof pluginConfig.robots === "function") {
      try {
        const result = await pluginConfig.robots();
        if (typeof result === "string") {
          userRobots = result;
        }
      } catch (err) {
        console.warn("[SEO] Error in user robots async callback", err);
      }
    }
    let content = userRobots.trim();
    if (!content.endsWith("\n")) content += "\n";
    const domainUrl = domain.endsWith("/") ? domain.slice(0, -1) : domain;
    for (const rel of sitemapsUrls) {
      content += `Sitemap: ${domainUrl}${rel.startsWith("/") ? rel : `${"/"}${rel}`}
`;
    }
    createFile(outDir, "robots.txt", content);
  };
  const createSitemap = async (filename, urls) => {
    const processedUrls = locales && locales.length > 0 ? generateLocalizedEntries(urls, locales, domain, localeMode) : urls.map((u) => {
      const normalizedUrl = u.url?.startsWith("/") ? u.url : `/${u.url || ""}`;
      return { ...u, url: domain + normalizedUrl };
    });
    const xml = await createSitemapXml(processedUrls, { minify });
    createFile(outDir, filename, xml);
  };
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      const pluginConfig2 = config || DEFAULT_CONFIG;
      const outDir2 = path.resolve(process.cwd(), pluginConfig2?.outDir || "dist");
      fs.mkdirSync(outDir2, { recursive: true });
      const { sitemaps } = pluginConfig2;
      if (typeof sitemaps === "function") {
        const urls = await sitemaps();
        await createSitemap("sitemap.xml", urls);
        await createRobots(["/sitemap.xml"]);
        console.log("\u2705 Generated single sitemap");
        return;
      }
      const allSitemaps = [];
      for (const [name, cb] of Object.entries(sitemaps)) {
        if (typeof cb !== "function") continue;
        const urls = await cb();
        await createSitemap(`sitemap-${name}.xml`, urls);
        allSitemaps.push(`/sitemap-${name}.xml`);
      }
      const indexXml = await createIndexSitemap(
        allSitemaps.map((s) => s.slice(1)),
        domain,
        { minify }
      );
      createFile(outDir2, "sitemap.xml", indexXml);
      await createRobots(["/sitemap.xml"]);
      console.log(
        `\u2705 Generated ${allSitemaps.length} sitemaps + index + robots.txt`
      );
    }
  };
}

export { crawlMeMaybeSitemap as default };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map