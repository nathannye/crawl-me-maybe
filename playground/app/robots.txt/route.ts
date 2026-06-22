import { generateRobotsTxt } from "@crawl-me-maybe/sitemap";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
	const robots = generateRobotsTxt(getSiteUrl(), "sitemap.xml", {
		userAgent: "*",
		allow: "/",
		disallow: "/api/",
	});

	return new Response(robots, {
		headers: { "Content-Type": "text/plain" },
	});
}
