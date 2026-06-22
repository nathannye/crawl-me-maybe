export function getSiteUrl(): string {
	const url = process.env.SITE_URL ?? "http://localhost:3000";
	return url.replace(/\/+$/, "");
}
