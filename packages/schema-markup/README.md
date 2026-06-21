# @crawl-me-maybe/schema-markup
Schema markup should be generated from your content model, not rebuilt beside it. At all costs, avoid breaking the guarantee that schema markup reflects the content model.


## Why this exists
Schema markup from CMS > Frontend is usually handled with a bulk of fields that editors are forced to fill in, often duplicating content thats already present. This library takes advantage of more developer work up front to reduce the load on editors. (something about compounding and the leverage of dev work)


## Installation

```bash
npm install @crawl-me-maybe/schema-markup
pnpm add @crawl-me-maybe/schema-markup
bun add @crawl-me-maybe/schema-markup
```
