// src/index.ts
var { default: fs2} = (() => ({}));

// node:path
function assertPath(path) {
  if (typeof path !== "string")
    throw TypeError("Path must be a string. Received " + JSON.stringify(path));
}
function normalizeStringPosix(path, allowAboveRoot) {
  var res = "", lastSegmentLength = 0, lastSlash = -1, dots = 0, code;
  for (var i = 0;i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47)
      break;
    else
      code = 47;
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1)
        ;
      else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1)
                res = "", lastSegmentLength = 0;
              else
                res = res.slice(0, lastSlashIndex), lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              lastSlash = i, dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "", lastSegmentLength = 0, lastSlash = i, dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += "/..";
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += "/" + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i, dots = 0;
    } else if (code === 46 && dots !== -1)
      ++dots;
    else
      dots = -1;
  }
  return res;
}
function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root, base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep + base;
}
function resolve() {
  var resolvedPath = "", resolvedAbsolute = false, cwd;
  for (var i = arguments.length - 1;i >= -1 && !resolvedAbsolute; i--) {
    var path;
    if (i >= 0)
      path = arguments[i];
    else {
      if (cwd === undefined)
        cwd = process.cwd();
      path = cwd;
    }
    if (assertPath(path), path.length === 0)
      continue;
    resolvedPath = path + "/" + resolvedPath, resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  if (resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute), resolvedAbsolute)
    if (resolvedPath.length > 0)
      return "/" + resolvedPath;
    else
      return "/";
  else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var isAbsolute = path.charCodeAt(0) === 47, trailingSeparator = path.charCodeAt(path.length - 1) === 47;
  if (path = normalizeStringPosix(path, !isAbsolute), path.length === 0 && !isAbsolute)
    path = ".";
  if (path.length > 0 && trailingSeparator)
    path += "/";
  if (isAbsolute)
    return "/" + path;
  return path;
}
function isAbsolute(path) {
  return assertPath(path), path.length > 0 && path.charCodeAt(0) === 47;
}
function join() {
  if (arguments.length === 0)
    return ".";
  var joined;
  for (var i = 0;i < arguments.length; ++i) {
    var arg = arguments[i];
    if (assertPath(arg), arg.length > 0)
      if (joined === undefined)
        joined = arg;
      else
        joined += "/" + arg;
  }
  if (joined === undefined)
    return ".";
  return normalize(joined);
}
function relative(from, to) {
  if (assertPath(from), assertPath(to), from === to)
    return "";
  if (from = resolve(from), to = resolve(to), from === to)
    return "";
  var fromStart = 1;
  for (;fromStart < from.length; ++fromStart)
    if (from.charCodeAt(fromStart) !== 47)
      break;
  var fromEnd = from.length, fromLen = fromEnd - fromStart, toStart = 1;
  for (;toStart < to.length; ++toStart)
    if (to.charCodeAt(toStart) !== 47)
      break;
  var toEnd = to.length, toLen = toEnd - toStart, length = fromLen < toLen ? fromLen : toLen, lastCommonSep = -1, i = 0;
  for (;i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 47)
          return to.slice(toStart + i + 1);
        else if (i === 0)
          return to.slice(toStart + i);
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 47)
          lastCommonSep = i;
        else if (i === 0)
          lastCommonSep = 0;
      }
      break;
    }
    var fromCode = from.charCodeAt(fromStart + i), toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === 47)
      lastCommonSep = i;
  }
  var out = "";
  for (i = fromStart + lastCommonSep + 1;i <= fromEnd; ++i)
    if (i === fromEnd || from.charCodeAt(i) === 47)
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    if (toStart += lastCommonSep, to.charCodeAt(toStart) === 47)
      ++toStart;
    return to.slice(toStart);
  }
}
function _makeLong(path) {
  return path;
}
function dirname(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var code = path.charCodeAt(0), hasRoot = code === 47, end = -1, matchedSlash = true;
  for (var i = path.length - 1;i >= 1; --i)
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else
      matchedSlash = false;
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path.slice(0, end);
}
function basename(path, ext) {
  if (ext !== undefined && typeof ext !== "string")
    throw TypeError('"ext" argument must be a string');
  assertPath(path);
  var start = 0, end = -1, matchedSlash = true, i;
  if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
    if (ext.length === path.length && ext === path)
      return "";
    var extIdx = ext.length - 1, firstNonSlashEnd = -1;
    for (i = path.length - 1;i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1)
          matchedSlash = false, firstNonSlashEnd = i + 1;
        if (extIdx >= 0)
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1)
              end = i;
          } else
            extIdx = -1, end = firstNonSlashEnd;
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path.length;
    return path.slice(start, end);
  } else {
    for (i = path.length - 1;i >= 0; --i)
      if (path.charCodeAt(i) === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1)
        matchedSlash = false, end = i + 1;
    if (end === -1)
      return "";
    return path.slice(start, end);
  }
}
function extname(path) {
  assertPath(path);
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, preDotState = 0;
  for (var i = path.length - 1;i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    return "";
  return path.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object")
    throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
  return _format("/", pathObject);
}
function parse(path) {
  assertPath(path);
  var ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path.length === 0)
    return ret;
  var code = path.charCodeAt(0), isAbsolute2 = code === 47, start;
  if (isAbsolute2)
    ret.root = "/", start = 1;
  else
    start = 0;
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, i = path.length - 1, preDotState = 0;
  for (;i >= start; --i) {
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1)
      if (startPart === 0 && isAbsolute2)
        ret.base = ret.name = path.slice(1, end);
      else
        ret.base = ret.name = path.slice(startPart, end);
  } else {
    if (startPart === 0 && isAbsolute2)
      ret.name = path.slice(1, startDot), ret.base = path.slice(1, end);
    else
      ret.name = path.slice(startPart, startDot), ret.base = path.slice(startPart, end);
    ret.ext = path.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path.slice(0, startPart - 1);
  else if (isAbsolute2)
    ret.dir = "/";
  return ret;
}
var sep = "/";
var delimiter = ":";
var posix = ((p) => (p.posix = p, p))({ resolve, normalize, isAbsolute, join, relative, _makeLong, dirname, basename, extname, format, parse, sep, delimiter, win32: null, posix: null });
var path_default = posix;

// src/robots.ts
var DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
`;

// src/utils.ts
var { default: fs} = (() => ({}));
function minifyXml(xml) {
  return xml.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
}
function localizeUrl(baseUrl, locale, domain, localeMode = "prefix", prefixDefault = false) {
  const normalizedUrl = baseUrl?.startsWith("/") ? baseUrl : `/${baseUrl || ""}`;
  if (locale.default) {
    if (!prefixDefault) {
      return domain + normalizedUrl;
    }
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
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${ns}>${items}</urlset>`;
    if (opts?.minify) {
      xmlString = minifyXml(xmlString);
    }
    return xmlString;
  } catch (err) {
    throw new Error(`Sitemap XML creation failed: ${err instanceof Error ? err.message : String(err)}`);
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
    throw new Error(`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
var createFile = (outputPath, filename, content) => {
  try {
    fs.writeFileSync(path_default.join(outputPath, filename), content);
  } catch (err) {
    throw new Error(`Failed to write file ${filename} to ${outputPath}: ${err instanceof Error ? err.message : String(err)}`);
  }
};
function generateLocalizedEntries(baseEntries, locales, domain, localeMode = "prefix", prefixDefault = false) {
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
      href: localizeUrl(entry.url, locale, domain, localeMode, prefixDefault)
    }));
    const xDefaultLocale = defaultLocale || locales[0];
    if (xDefaultLocale) {
      alternates.push({
        hreflang: "x-default",
        href: localizeUrl(entry.url, xDefaultLocale, domain, localeMode, prefixDefault)
      });
    }
    for (const locale of locales) {
      localizedEntries.push({
        ...entry,
        url: localizeUrl(entry.url, locale, domain, localeMode, prefixDefault),
        alternates
      });
    }
  }
  return localizedEntries;
}

// src/index.ts
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
    throw new Error("⚠️ No domain provided. Sitemap generation requires a domain.");
  }
  const outDir = pluginConfig?.outDir || "dist";
  const resolvedOutDir = path_default.resolve(process.cwd(), outDir);
  const minify = !pluginConfig?.disableMinification;
  const locales = pluginConfig?.locales;
  const localeMode = pluginConfig?.localeMode || "prefix";
  const prefixDefault = pluginConfig?.prefixDefault ?? false;
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
    if (!content.endsWith(`
`))
      content += `
`;
    const domainUrl = domain.endsWith("/") ? domain.slice(0, -1) : domain;
    for (const rel of sitemapsUrls) {
      content += `Sitemap: ${domainUrl}${rel.startsWith("/") ? rel : `${"/"}${rel}`}
`;
    }
    createFile(resolvedOutDir, "robots.txt", content);
  };
  const createSitemap = async (filename, urls) => {
    const processedUrls = locales && locales.length > 0 ? generateLocalizedEntries(urls, locales, domain, localeMode, prefixDefault) : urls.map((u) => {
      const normalizedUrl = u.url?.startsWith("/") ? u.url : `/${u.url || ""}`;
      return { ...u, url: domain + normalizedUrl };
    });
    const xml = await createSitemapXml(processedUrls, { minify });
    createFile(resolvedOutDir, filename, xml);
  };
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      fs2.mkdirSync(resolvedOutDir, { recursive: true });
      const { sitemaps } = pluginConfig;
      if (!sitemaps) {
        console.warn("⚠️ No sitemaps configuration found");
        return;
      }
      if (typeof sitemaps === "function") {
        const urls = await sitemaps();
        await createSitemap("sitemap.xml", urls);
        await createRobots(["/sitemap.xml"]);
        console.log("✅ Generated single sitemap");
        return;
      }
      const allSitemaps = [];
      for (const [name, cb] of Object.entries(sitemaps)) {
        if (typeof cb !== "function")
          continue;
        const urls = await cb();
        await createSitemap(`sitemap-${name}.xml`, urls);
        allSitemaps.push(`/sitemap-${name}.xml`);
      }
      const indexXml = await createIndexSitemap(allSitemaps.map((s) => s.slice(1)), domain, { minify });
      createFile(resolvedOutDir, "sitemap.xml", indexXml);
      await createRobots(["/sitemap.xml"]);
      console.log(`✅ Generated ${allSitemaps.length} sitemaps + index + robots.txt`);
    }
  };
}
export {
  crawlMeMaybeSitemap as default
};

//# debugId=530CB96175F1E00464756E2164756E21
//# sourceMappingURL=index.js.map
