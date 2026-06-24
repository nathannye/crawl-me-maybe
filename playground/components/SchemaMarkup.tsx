import { buildSchemaMarkup } from "@crawl-me-maybe/schema";

export default function SchemaMarkup() {
	const schema = buildSchemaMarkup({
		identity: {
			type: "organization",
			name: "Crawl Me Maybe",
		},
		siteUrl: "https://crawlmemaybe.test",
		siteName: "Crawl Me Maybe",
		pageUrl: "https://crawlmemaybe.test/playground",
		pageTitle: "Schema Playground",
		pageDescription: "Playground page for schema markup output.",
	});

	return schema.map((s) => (
		<script key={s} type="application/ld+json">
			{s}
		</script>
	));
}
