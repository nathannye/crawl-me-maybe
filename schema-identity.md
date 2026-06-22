# Identity Model Correction

## Problem

The current implementation allows:

```ts
identity: {
  name: string
  url?: string
}
```

This is insufficient.

The schema generator cannot determine whether the identity should be emitted as:

```txt
Person
Organization
LocalBusiness
```

from a name and URL alone.

---

# Required Change

Identity must become a discriminated union.

The identity type must be explicitly provided.

---

## Correct Identity API

```ts
type Identity =
  | PersonIdentity
  | OrganizationIdentity
  | LocalBusinessIdentity
```

---

## Person

```ts
type PersonIdentity = {
  type: "person"

  name: string

  description?: string
  image?: string

  sameAs?: string[]
}
```

Emits:

```json
{
  "@type": "Person"
}
```

---

## Organization

```ts
type OrganizationIdentity = {
  type: "organization"

  name: string

  description?: string
  logo?: string

  sameAs?: string[]
}
```

Emits:

```json
{
  "@type": "Organization"
}
```

---

## Local Business

```ts
type LocalBusinessIdentity = {
  type: "localBusiness"

  name: string

  description?: string
  logo?: string

  phone?: string
  email?: string

  address?: PostalAddress

  openingHours?: OpeningHoursSpecification[]

  sameAs?: string[]
}
```

Emits:

```json
{
  "@type": "LocalBusiness"
}
```

---

# URL Handling

Identity should NOT contain a URL field.

Remove:

```ts
identity.url
```

The schema package already receives:

```ts
siteUrl
```

through:

```ts
buildSchemaMarkup({
  identity,
  siteUrl,
  ...
})
```

or equivalent.

The generated identity schema should automatically use:

```ts
url: siteUrl
```

when appropriate.

There should be a single source of truth for the website URL.

---

# Builder Behavior

The schema package should switch on:

```ts
identity.type
```

when generating the publisher identity.

Example:

```ts
buildSchemaMarkup({
  identity: {
    type: "organization",
    name: "Acme"
  }
})
```

↓

```json
{
  "@type": "Organization"
}
```

---

```ts
buildSchemaMarkup({
  identity: {
    type: "person",
    name: "Jane Doe"
  }
})
```

↓

```json
{
  "@type": "Person"
}
```

---

```ts
buildSchemaMarkup({
  identity: {
    type: "localBusiness",
    name: "Acme Coffee"
  }
})
```

↓

```json
{
  "@type": "LocalBusiness"
}
```

---

# Rationale

Schema type selection should never be inferred.

The library should require the consumer to explicitly state whether the site publisher is:

```txt
Organization
Person
LocalBusiness
```

This keeps behavior deterministic, type-safe, and aligned with the CMS identity model.
