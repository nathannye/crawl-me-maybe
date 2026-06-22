import { buildSchemaMarkup } from "@crawl-me-maybe/schema-markup";

export default function SchemaMarkup() {
	const schema = buildSchemaMarkup({
		identity: {
			name: "Crawl Me Maybe",
			url: "https://crawlmemaybe.test",
		},
		siteUrl: "https://crawlmemaybe.test",
		siteName: "Crawl Me Maybe",
		pageUrl: "https://crawlmemaybe.test/playground",
		pageTitle: "Schema Playground",
		pageDescription: "Playground page for schema markup output.",
	});

	console.log(schema);

	return schema.map((s, i) => (
		<script key={`schema-${i}`} type="application/ld+json">
			{s}
		</script>
	));
}
