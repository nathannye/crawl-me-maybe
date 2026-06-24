export function slugToTitle(segment: string): string {
	const decoded = decodeURIComponent(segment || "");
	const normalized = decoded
		.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!normalized) return "";

	return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}
