// src/to-html-tags.ts
var pushMeta = (tags, attrs) => {
  if (!attrs.content)
    return;
  tags.push(attrs);
};
function toHtmlTags(meta) {
  const tags = [];
  const links = [];
  if (meta.description) {
    pushMeta(tags, { name: "description", content: meta.description });
  }
  if (meta.robots) {
    pushMeta(tags, { name: "robots", content: meta.robots });
  }
  if (meta.openGraph?.title) {
    pushMeta(tags, {
      property: "og:title",
      content: meta.openGraph.title
    });
  }
  if (meta.openGraph?.description ?? meta.description) {
    pushMeta(tags, {
      property: "og:description",
      content: meta.openGraph?.description ?? meta.description ?? ""
    });
  }
  if (meta.openGraph?.url) {
    pushMeta(tags, { property: "og:url", content: meta.openGraph.url });
  }
  if (meta.openGraph?.type) {
    pushMeta(tags, { property: "og:type", content: meta.openGraph.type });
  }
  if (meta.openGraph?.siteName) {
    pushMeta(tags, {
      property: "og:site_name",
      content: meta.openGraph.siteName
    });
  }
  if (meta.metaImage) {
    pushMeta(tags, { property: "og:image", content: meta.metaImage });
  }
  if (meta.twitter?.card) {
    pushMeta(tags, { name: "twitter:card", content: meta.twitter.card });
  }
  const twitterTitle = meta.title ?? meta.openGraph?.title;
  if (twitterTitle) {
    pushMeta(tags, { name: "twitter:title", content: twitterTitle });
  }
  const twitterDescription = meta.description ?? meta.openGraph?.description;
  if (twitterDescription) {
    pushMeta(tags, {
      name: "twitter:description",
      content: twitterDescription
    });
  }
  if (meta.metaImage) {
    pushMeta(tags, { name: "twitter:image", content: meta.metaImage });
  }
  if (meta.twitter?.creator) {
    pushMeta(tags, {
      name: "twitter:creator",
      content: meta.twitter.creator
    });
  }
  if (meta.twitter?.site) {
    pushMeta(tags, { name: "twitter:site", content: meta.twitter.site });
  }
  if (meta.canonicalUrl) {
    links.push({ rel: "canonical", href: meta.canonicalUrl });
  }
  if (meta.faviconUrl) {
    links.push({ rel: "icon", href: meta.faviconUrl });
  }
  return {
    title: meta.title ?? "",
    tags,
    links
  };
}

// src/to-nuxt-meta.ts
function toNuxtMeta(meta) {
  const { title, tags, links } = toHtmlTags(meta);
  const output = {};
  if (title)
    output.title = title;
  if (tags.length) {
    const metaTags = [];
    for (const tag of tags) {
      if (tag.property) {
        metaTags.push({ property: tag.property, content: tag.content });
      } else if (tag.name) {
        metaTags.push({ name: tag.name, content: tag.content });
      }
    }
    output.meta = metaTags;
  }
  if (links.length) {
    output.link = links.map((link) => ({
      rel: link.rel,
      href: link.href
    }));
  }
  return output;
}
export {
  toNuxtMeta
};

//# debugId=323CB8D59FE84A5064756E2164756E21
