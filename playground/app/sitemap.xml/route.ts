import { generateSitemap } from "@crawl-me-maybe/sitemap";
import { getSiteUrl } from "@/lib/site";
import { getPageSitemapEntries } from "@/lib/sitemap/pages";

export const dynamic = "force-dynamic";

export async function GET() {
	const xml = generateSitemap({
		domain: getSiteUrl(),
		entries: await getPageSitemapEntries(),
	});

	return new Response(xml, {
		headers: { "Content-Type": "application/xml" },
	});
}
