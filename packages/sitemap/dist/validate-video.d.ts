import type { SitemapVideo } from "./types";
/**
 * Validates video metadata before XML emission.
 * Requires title, description, thumbnailUrl, and at least one of contentUrl or playerUrl.
 */
export declare function validateSitemapVideos(videos: SitemapVideo[], entryPath?: string): void;
