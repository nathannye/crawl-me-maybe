/**
 * A single crawler rule block for robots.txt generation.
 * Mirrors the Next.js MetadataRoute.Robots rule shape.
 */
export type RobotsRule = {
    /** User-agent string(s) this rule applies to (e.g. "*", "Googlebot", or an array) */
    userAgent: string | string[];
    /** Path(s) the crawler is allowed to access */
    allow?: string | string[];
    /** Path(s) the crawler is disallowed from accessing */
    disallow?: string | string[];
};
/**
 * Configuration for automatic locale-aware sitemap generation.
 */
export type SitemapLocaleConfig = {
    /** All locales the sitemap can emit. */
    locales: string[];
    /** The canonical default locale. */
    defaultLocale: string;
    /** How locale URLs are addressed. */
    mode?: "prefix" | "subdomain" | "domain";
    /** In prefix mode, whether the default locale also receives a prefix. */
    prefixDefault?: boolean;
    /** Base domain per locale, required for subdomain and domain modes. */
    domainByLocale?: Record<string, string>;
    /** Whether to emit hreflang alternates. Defaults to `true`. */
    alternates?: boolean;
    /** Optional x-default handling. */
    xDefault?: boolean | string;
};
/**
 * An entry describing a page for the sitemap.
 * See: https://www.sitemaps.org/protocol.html
 */
export type SitemapEntry = {
    /** Site-relative path or slug (e.g. "/about" or "about") */
    path: string;
    /** Optional ISO date or yyyy-mm-dd string for the last modification timestamp */
    lastmod?: string;
    /** Change frequency relative hint for crawlers */
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    /** Optional image URLs to associate with this entry (Google Images support) */
    imageUrls?: string[];
    /** Optional video URLs to associate with this entry (Google Video support) */
    videoUrls?: string[];
    /** 0.0–1.0 relative priority hint for crawlers */
    priority?: number;
    /** Locales this page exists in. Defaults to all configured locales. */
    locales?: string[];
    /** Locale-specific path overrides keyed by locale code. */
    localePaths?: Record<string, string>;
};
/** Resolved sitemap entry used for XML output after path localization. */
export type SitemapEntryWithAlternates = Omit<SitemapEntry, "path"> & {
    /** Fully resolved absolute URL for sitemap XML output */
    url: string;
    /** hreflang alternates for localized entries */
    alternates?: {
        hreflang: string;
        href: string;
    }[];
};
/** A single sitemap entry source: a static array or a sync/async callback. */
export type SitemapEntrySource = SitemapEntry[] | (() => SitemapEntry[] | Promise<SitemapEntry[]>);
/** Promise-friendly helper for sitemap entry sources. */
export type MaybePromise<T> = T | Promise<T>;
/** A sitemap definition used by the manifest. */
export type SitemapDefinition = SitemapEntrySource | {
    entries: SitemapEntrySource;
    maxUrls?: number;
};
/** Low-level options for {@link generateSitemap}. */
export type GenerateSitemapOptions = {
    entries: SitemapEntrySource;
    locales?: SitemapLocaleConfig;
};
/** Low-level options for {@link generateSitemapIndex}. */
export type GenerateSitemapIndexOptions = {
    /** Sitemap paths without a leading slash. */
    sitemaps: string[];
};
/** Selector for a concrete sitemap child file. */
export type SitemapSelector = {
    /** Named sitemap key; omit for single-sitemap manifests. */
    sitemap?: string;
    /** Zero-based child file index. */
    index: number;
};
/** Metadata for a concrete sitemap child file. */
export type SitemapFile = {
    /** Named sitemap key, or null for a single sitemap manifest. */
    sitemap: string | null;
    /** Zero-based child file index. */
    index: number;
    /** Stable child route path. */
    path: string;
};
/** Manifest options for runtime sitemap orchestration. */
export type CreateSitemapManifestOptions = {
    /** Site origin for absolute URL generation. */
    domain: string;
    /** Stable route base path for child files, defaulting to "/sitemap". */
    basePath?: string;
    /** Default maximum URLs per child file, defaulting to 50_000. */
    maxUrls?: number;
    /** Single sitemap source or named sitemap definitions. */
    entries: SitemapEntrySource | Record<string, SitemapDefinition>;
    /** Locale configurations for automatic locale-aware sitemap generation. */
    locales?: SitemapLocaleConfig;
};
/** Runtime manifest interface. */
export type SitemapManifest = {
    getRootSitemap(): Promise<string>;
    getSitemap(selector: SitemapSelector): Promise<string>;
    getSitemapFiles(): Promise<SitemapFile[]>;
};
/** A single resolved file for the manifest internals. */
export type ResolvedSitemapFile = {
    sitemap: string | null;
    index: number;
    path: string;
    entries: SitemapEntryWithAlternates[];
};
/**
 * Main plugin configuration object.
 */
export type SitemapConfig = {
    /** Folder to output sitemap files (default: "dist") */
    outDir?: string;
    /** Base domain for absolute URL generation. REQUIRED. */
    domain: string;
    /**
     * A single sitemap source or a named sitemap map. Named sitemaps can use
     * the same source shape as the runtime manifest, including per-sitemap
     * `maxUrls` overrides.
     */
    sitemaps: SitemapEntrySource | Record<string, SitemapDefinition>;
    /** Default maximum URLs per sitemap file when a sitemap definition omits `maxUrls`. */
    maxUrls?: number;
    /**
     * Crawler rules for robots.txt generation (same shape as Next.js MetadataRoute.Robots).
     * Falls back to a sensible default when omitted.
     * The correct `Sitemap:` lines are always appended automatically.
     */
    robots?: RobotsRule | RobotsRule[];
    /** Locale configurations for automatic locale-aware sitemap generation. */
    locales?: SitemapLocaleConfig;
};
