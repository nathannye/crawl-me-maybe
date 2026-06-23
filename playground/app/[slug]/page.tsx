import { buildMetadata } from "@crawl-me-maybe/meta";
import { toNextMeta } from "@crawl-me-maybe/meta/next";
import SchemaMarkup from "@/components/SchemaMarkup";
import { getGlobalSeoSettings, getPageForMetadata } from "@/lib/seo";
import { getDocumentBySlug } from "@/lib/sanityClient";

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;
	const [defaults, page] = await Promise.all([
		getGlobalSeoSettings(),
		getPageForMetadata(slug),
	]);

	if (!page || !defaults) return {};

	return toNextMeta(buildMetadata(page, defaults));
}

export default async function DynamicPage({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;
	const page = await getDocumentBySlug("page", slug);

	return (
		<div className="mx-7 pt-10">
			<main>
				<h1 className="text-4xl font-bold">{page.title}</h1>
				<pre>{JSON.stringify(page, null, 2)}</pre>
				<SchemaMarkup />
			</main>
		</div>
	);
}
