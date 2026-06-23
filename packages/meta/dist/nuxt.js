// src/to-nuxt-meta.ts
function toNuxtMeta(meta) {
  const ogTitle = meta.openGraph?.title ?? meta.title;
  const ogDescription = meta.openGraph?.description ?? meta.description;
  const output = {};
  if (meta.description)
    output.description = meta.description;
  if (meta.robots)
    output.robots = meta.robots;
  if (ogTitle)
    output.ogTitle = ogTitle;
  if (ogDescription)
    output.ogDescription = ogDescription;
  if (meta.openGraph?.url)
    output.ogUrl = meta.openGraph.url;
  if (meta.openGraph?.type) {
    output.ogType = meta.openGraph.type;
  }
  if (meta.openGraph?.siteName)
    output.ogSiteName = meta.openGraph.siteName;
  if (meta.metaImage)
    output.ogImage = meta.metaImage;
  if (meta.twitter?.card)
    output.twitterCard = meta.twitter.card;
  if (ogTitle)
    output.twitterTitle = ogTitle;
  if (ogDescription)
    output.twitterDescription = ogDescription;
  if (meta.metaImage)
    output.twitterImage = meta.metaImage;
  if (meta.twitter?.creator)
    output.twitterCreator = meta.twitter.creator;
  if (meta.twitter?.site)
    output.twitterSite = meta.twitter.site;
  return output;
}
export {
  toNuxtMeta
};

//# debugId=BB46711CC0B6406E64756E2164756E21
