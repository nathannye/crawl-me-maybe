# Changelog

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

### Added

- `identityRef`: link to the site identity from page- or component-level code, e.g.
  `provider: identityRef`. `buildSchemaMarkup` resolves it to the identity node's `@id`.
- Nested builders: `buildOffer`, `buildAggregateOffer`, `buildMonetaryAmount`,
  `buildQuantitativeValue`, `buildBrand`, `buildCourseInstance`, `buildSchedule`,
  `buildPlace`, `buildPostalAddress`, `buildGeoCoordinates`, `buildPerson`,
  `buildOrganization`, `buildHowToStep`, `buildNutritionInformation`.
- `toIsoDuration(parts)`: ISO 8601 durations from named parts, e.g.
  `toIsoDuration({ hours: 1, minutes: 30 })` returns `"PT1H30M"`.
- `toIsoDate(value)`: accepts a `Date` or an ISO 8601 string. Keeps timezone offsets and
  rewrites `+hhmm` to `+hh:mm`.
- `toAbsoluteUrl(value, siteUrl)`: resolves slugs and relative paths against `siteUrl`.
- `buildImageObject` and the `ImageInput` type are now exported.

### Upgrading

- If your `siteUrl` ends in `/` and you reference generated IDs by hand, switch those
  references to `identityRef` or update them to the new format.
- Replace inline site organizations in `mainEntity`, like
  `{ "@type": "Organization", name: siteName, url: siteUrl }`, with `identityRef`. The inline
  version creates a second organization that isn't linked to your site identity.
