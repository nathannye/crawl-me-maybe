// src/to-next-meta.ts
var parseRobots = (robots) => {
  if (!robots)
    return;
  const directives = robots.split(",").map((part) => part.trim().toLowerCase());
  const result = {};
  if (directives.includes("noindex"))
    result.index = false;
  if (directives.includes("nofollow"))
    result.follow = false;
  return Object.keys(result).length > 0 ? result : robots;
};
function toNextMeta(meta) {
  const ogTitle = meta.openGraph?.title ?? meta.title;
  const ogDescription = meta.openGraph?.description ?? meta.description;
  const output = {
    title: meta.title,
    description: meta.description
  };
  if (meta.canonicalUrl) {
    output.alternates = { canonical: meta.canonicalUrl };
  }
  const robots = parseRobots(meta.robots);
  if (robots) {
    output.robots = robots;
  }
  if (ogTitle || ogDescription || meta.openGraph?.siteName || meta.openGraph?.url || meta.openGraph?.type || meta.metaImage) {
    output.openGraph = {
      title: ogTitle,
      description: ogDescription,
      siteName: meta.openGraph?.siteName,
      url: meta.openGraph?.url,
      type: meta.openGraph?.type,
      ...meta.metaImage ? { images: [{ url: meta.metaImage }] } : {}
    };
  }
  if (meta.twitter || meta.metaImage) {
    output.twitter = {
      card: meta.twitter?.card,
      creator: meta.twitter?.creator,
      site: meta.twitter?.site,
      title: ogTitle,
      description: ogDescription,
      ...meta.metaImage ? { images: [meta.metaImage] } : {}
    };
  }
  return output;
}
export {
  toNextMeta
};

//# debugId=2AC17F8BE522B14A64756E2164756E21
