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
 * Configuration for a locale/language.
 */
export type LocaleConfig = {
	/** Language/locale code (e.g., 'en', 'fr', 'es') */
	code: string;
	/** Whether this is the default locale (doesn't get prefix/subdomain) */
	default?: boolean;
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
	changefreq?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	/** Optional image URLs to associate with this entry (Google Images support) */
	imageUrls?: string[];
	/** Optional video URLs to associate with this entry (Google Video support) */
	videoUrls?: string[];
	/** 0.0–1.0 relative priority hint for crawlers */
	priority?: number;
	/** If true, this entry is not localized even when locales are configured */
	skipLocalization?: boolean;
};

export type SitemapEntryWithAlternates = Omit<SitemapEntry, "path"> & {
	/** Fully resolved absolute URL for sitemap XML output */
	url: string;
	alternates?: { hreflang: string; href: string }[];
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
	 * Either a callback returning all sitemap entries, or an object of named
	 * content-group callbacks for multi-sitemap mode.
	 */
	sitemaps:
		| { [key: string]: () => Promise<SitemapEntry[]> }
		| (() => Promise<SitemapEntry[]>);
	/**
	 * Crawler rules for robots.txt generation (same shape as Next.js MetadataRoute.Robots).
	 * Falls back to a sensible default when omitted.
	 * The correct `Sitemap:` lines are always appended automatically.
	 */
	robots?: RobotsRule | RobotsRule[];
	/** Locale configurations for multi-language sitemap support */
	locales?: LocaleConfig[];
	/**
	 * How to format localized URLs (default: "prefix").
	 * - "prefix": /fr/about
	 * - "subdomain": fr.example.com/about
	 */
	localeMode?: "prefix" | "subdomain";
	/** Whether to add a locale prefix to the default locale URL (default: false) */
	prefixDefault?: boolean;
};
