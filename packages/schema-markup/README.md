# @crawl-me-maybe/schema-markup

Schema markup should be generated from your content model, not rebuilt beside it. At all costs, avoid breaking the guarantee that schema markup reflects the content model.

## Table of contents

- [Install](#install)
- [Why this exists](#why-this-exists)
- [Supported schemas](#supported-schemas)

## Install

```bash
npm install @crawl-me-maybe/schema-markup
pnpm add @crawl-me-maybe/schema-markup
bun add @crawl-me-maybe/schema-markup
yarn add @crawl-me-maybe/schema-markup
```

---

## Why this exists

Schema markup from CMS → frontend is usually handled with a bulk of fields that editors are forced to fill in, often duplicating content that's already present. This library takes advantage of more developer work up front to reduce the load on editors.

---

## Supported schemas

[Complete list of Google-supported rich result schemas](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
