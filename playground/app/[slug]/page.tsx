import { buildMetadata } from "@crawl-me-maybe/meta";
import { buildSchemaMarkup } from "@crawl-me-maybe/schema-markup";
import SchemaMarkup from "@/components/SchemaMarkup";
import { getDocumentBySlug, getDocumentByType } from "@/lib/sanityClient";

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;
	const defaults = await getDocumentByType("globalSeoSettings");
	const page = await getDocumentBySlug("page", slug);
	const metadata = buildMetadata(page, defaults);

	return metadata;
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
