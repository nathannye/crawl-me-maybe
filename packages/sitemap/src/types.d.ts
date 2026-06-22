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
	/** Absolute or site-relative URL (should start with / or be fully qualified) */
	url: string;
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
	/**
	 * Optional: An array of image URLs to associate with this entry (Google Images support)
	 * See: https://www.sitemaps.org/protocol.html#image_tag
	 */
	imageUrls?: string[];
	/**
	 * Optional: An array of video URLs to associate with this entry (Google Video/YouTube support)
	 * See: https://www.sitemaps.org/protocol.html#video_tag
	 */
	videoUrls?: string[];
	/**
	 * Optional: 0.0-1.0. Indicates the relative priority of this URL compared to other URLs on your site.
	 * See: https://www.sitemaps.org/protocol.html#prioritydef
	 */
	priority?: number;
	/**
	 * Optional: If true, this entry will not be localized even if locales are configured.
	 * Useful for pages that shouldn't have language variants (e.g., /sitemap.xml)
	 */
	skipLocalization?: boolean;
};

/**
 * Main plugin configuration object for sitemap plugin.
 */
export type SitemapConfig = {
	/** Folder to output sitemap files (default: "dist") */
	outDir?: string;
	/** Base domain for absolute URL generation. REQUIRED. */
	domain: string;
	/**
	 * Either a callback that returns all sitemap entries (for small/medium sites),
	 * or an object of logical content group names to entry callbacks (for >50k URLs/sites with large sections).
	 */
	sitemaps:
		| { [key: string]: () => Promise<SitemapEntry[]> }
		| (() => Promise<SitemapEntry[]>);
	/**
	 * (Optional) Crawler rules for robots.txt generation.
	 * Accepts a single rule object or an array of rule objects (same shape as Next.js MetadataRoute.Robots).
	 * If omitted, a sensible default allowing all crawlers is used.
	 * The correct `Sitemap:` line(s) are always appended automatically.
	 */
	robots?: RobotsRule | RobotsRule[];
	/**
	 * (Optional) Array of locale configurations for multi-language support.
	 * If provided, the plugin will generate locale variants for each URL.
	 */
	locales?: LocaleConfig[];
	/**
	 * (Optional) How to format localized URLs. Defaults to 'prefix'.
	 * - 'prefix': Adds locale code as path prefix (e.g., /fr/about)
	 * - 'subdomain': Adds locale code as subdomain (e.g., fr.example.com/about)
	 */
	localeMode?: "prefix" | "subdomain";
	/**
	 * (Optional) Whether to add a locale prefix to the default locale URL.
	 * - true: Adds locale prefix to default locale (e.g., /en/about)
	 * - false: No prefix for default locale (e.g., /about) - default behavior
	 */
	prefixDefault?: boolean;
};
