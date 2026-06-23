import type { GlobalSeoSettings, RawPageMetadata } from "@crawl-me-maybe/meta";
import { defineQuery } from "next-sanity";
import { client } from "@/lib/sanityClient";

const globalSeoSettingsQuery = defineQuery(`
  *[_type == "globalSeoSettings"][0]{
    siteTitle,
    pageTitleTemplate,
    metaDescription,
    siteUrl,
    twitterHandle,
    "defaultMetaImage": defaultMetaImage.asset->url
  }
`);

const pageForMetadataQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    "slug": { "current": slug.current },
    "description": seo.description,
  "searchIndexing": seo.searchIndexing,
  "metaImage": seo.metaImage.asset->url,
  "canonicalUrl": seo.canonicalUrl
}
`);

export async function getGlobalSeoSettings(): Promise<GlobalSeoSettings | null> {
	return client.fetch<GlobalSeoSettings | null>(globalSeoSettingsQuery);
}

export async function getPageForMetadata(
	slug: string,
): Promise<RawPageMetadata | null> {
	return client.fetch<RawPageMetadata | null>(pageForMetadataQuery, { slug });
}
