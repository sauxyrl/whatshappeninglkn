# Content directory

This is the source of truth for all site content. Every file here is
validated at build time by Zod schemas in `src/lib/content.ts`.

Schemas and workflows live in [`docs/CONTENT-SCHEMA.md`](../../../docs/CONTENT-SCHEMA.md).

Do not commit:

- Draft files prefixed with `_` (ignored by loaders — use for work-in-progress).
- Real imagery here — imagery lives in `public/images/`, manifested in `_image-manifest.json`.
