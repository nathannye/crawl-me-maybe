# Changelog

## 0.2.1

### Fixed

- **0.2.0 shipped a broken bundle.** `dist/index.js` exported `buildSchemaMarkup`,
  `identityRef`, `buildImageObject`, `toIsoDuration`, `toIsoDate`, and `toAbsoluteUrl` without
  defining them, so importing the package failed with
  `Export 'buildSchemaMarkup' is not defined in module`. The cause was a Bun 1.3+ bundler
  regression: with `"sideEffects": false`, Bun drops modules that the entry file re-exports
  by name. `sideEffects` now lists the entry file, which keeps those modules in the bundle and
  is still treated as side-effect-free by consumers' bundlers, since `src/` isn't published.
- The build now fails if any exported name is missing from the bundle.

If you installed 0.2.0, upgrade to 0.2.1. There are no API changes.

## 0.2.0

### Changed

These change the JSON-LD that `buildSchemaMarkup` emits. No exports were removed or renamed.

- **Generated `@id`s ignore trailing slashes on `siteUrl`.** `https://example.com/` and
  `https://example.com` now produce the same IDs, e.g. `https://example.com#website` and
  `https://example.com#organization-acme`. If you passed a `siteUrl` ending in `/`, these IDs
  change. Any hand-written references to the old IDs need updating. Use `identityRef` instead
  of hardcoding the identity ID.
- **Empty values are dropped from the graph.** `null`, empty or whitespace-only strings, empty
  arrays, and objects with nothing besides `@type` are removed. `0` and `false` are kept.
  GROQ projections no longer need `coalesce()` just to keep `null` out of the markup.
- **Nested nodes no longer carry `@context`.** Only top-level nodes include it, so nesting
  builders (e.g. `buildAggregateRating` inside `buildProduct`) produces clean output.
- **`buildImageObject` emits `contentUrl`** alongside `url`, with the same value. This also
  applies to identity logos and images. Its return type is now `ImageObjectLeaf`, so the
  output can be passed straight to builder `image` and `logo` fields.
- **`schema-dts` upgraded to 2.0.** Builder types now follow Schema.org v30. `Quantity`
  types such as `Duration`, `Distance`, `Energy`, and `Mass` are now plain strings, so object
  forms like `{ "@type": "Duration", ... }` no longer type-check. Use ISO 8601 strings, e.g.
  from `toIsoDuration`.

### Added

- `inLanguage` on `buildSchemaMarkup`: a BCP 47 tag for the page content, emitted on the
  `WebPage` node, e.g. `inLanguage: "fr"`.
- `identityRef`: link to the site identity from page- or component-level code, e.g.
  `provider: identityRef`. `buildSchemaMarkup` resolves it to the identity node's `@id`.
- Nested builders: `buildOffer`, `buildAggregateOffer`, `buildMonetaryAmount`,
  `buildQuantitativeValue`, `buildBrand`, `buildCourseInstance`, `buildSchedule`,
  `buildPlace`, `buildPostalAddress`, `buildGeoCoordinates`, `buildPerson`,
  `buildOrganization`, `buildHowToStep`, `buildNutritionInformation`,
  `buildOfferShippingDetails`, `buildMerchantReturnPolicy`.
- `toIsoDuration(parts)`: ISO 8601 durations from named parts, e.g.
  `toIsoDuration({ hours: 1, minutes: 30 })` returns `"PT1H30M"`.
- `toIsoDate(value)`: accepts a `Date` or an ISO 8601 string. Keeps timezone offsets and
  rewrites `+hhmm` to `+hh:mm`.
- `toAbsoluteUrl(value, siteUrl)`: resolves slugs and relative paths against `siteUrl`.
- `buildImageObject` and the `ImageInput` type are now exported. The object input also accepts
  Google's image metadata fields: `caption`, `creditText`, `copyrightNotice`, `license`,
  `acquireLicensePage`, and `creator`.

### Upgrading

- If your `siteUrl` ends in `/` and you reference generated IDs by hand, switch those
  references to `identityRef` or update them to the new format.
- Replace inline site organizations in `mainEntity`, like
  `{ "@type": "Organization", name: siteName, url: siteUrl }`, with `identityRef`. The inline
  version creates a second organization that isn't linked to your site identity.
- If you pass `Duration`, `Distance`, `Energy`, or `Mass` as objects, switch to strings,
  e.g. `cookTime: toIsoDuration({ minutes: 45 })` or `calories: "240 calories"`.
