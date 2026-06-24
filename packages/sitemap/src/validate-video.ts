import type { SitemapVideo } from "./types";

function formatEntryContext(entryPath?: string): string {
	return entryPath ? ` for sitemap entry "${entryPath}"` : "";
}

/**
 * Validates video metadata before XML emission.
 * Requires title, description, thumbnailUrl, and at least one of contentUrl or playerUrl.
 */
export function validateSitemapVideos(
	videos: SitemapVideo[],
	entryPath?: string,
): void {
	const context = formatEntryContext(entryPath);

	for (const [index, video] of videos.entries()) {
		const label = `sitemap video[${index}]${context}`;

		if (!video.title?.trim()) {
			throw new Error(`${label} must include a non-empty title`);
		}

		if (!video.description?.trim()) {
			throw new Error(`${label} must include a non-empty description`);
		}

		if (!video.thumbnailUrl?.trim()) {
			throw new Error(`${label} must include a non-empty thumbnailUrl`);
		}

		if (!video.contentUrl?.trim() && !video.playerUrl?.trim()) {
			throw new Error(
				`${label} must include contentUrl or playerUrl (at least one)`,
			);
		}

		if (video.duration !== undefined) {
			if (!Number.isInteger(video.duration) || video.duration <= 0) {
				throw new Error(
					`${label} duration must be a positive integer (seconds)`,
				);
			}
		}
	}
}
