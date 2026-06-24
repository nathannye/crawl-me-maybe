import { generateSitemap } from "@crawl-me-maybe/sitemap";
import { getSiteUrl } from "@/lib/site";
import { getPageSitemapEntries } from "@/lib/sitemap/pages";

export const dynamic = "force-dynamic";

export async function GET() {
	const xml = await generateSitemap(getSiteUrl(), {
		entries: getPageSitemapEntries,
	});

	return new Response(xml, {
		headers: { "Content-Type": "application/xml" },
	});
}
