# claude.md

Guidance for Claude Code when working inside `cms-kia/` — the Sanity Studio for the Kia OMBC
("49th Team") FIFA World Cup 2026 landing page.

## Project overview

Standalone Sanity Studio, paired with the frontend at `../KIA-WC-2026/` (Vite + React SPA).
This is **not** a multi-page/blog-style CMS — the frontend is a single one-page landing site,
so every schema document type here is a **singleton** (exactly one instance: one `hero`, one
`header`, etc.), never a list of many documents. See `structure.ts`.

Full conventions for how a section moves from schema → GROQ query → frontend component are
documented in `../KIA-WC-2026/CLAUDE.md` under **"CMS (Sanity)"** — read that before adding a
new section type, since the two repos must stay in lockstep (schema field names have to match
the frontend's `<Section>Data` interface exactly, field for field). This file only covers
things specific to working inside the Studio itself.

## Commands

- `bun run dev` — start Studio locally at `localhost:3333`
- `bun run build` — production build
- `bun run deploy` — deploy the Studio (hosted Sanity Studio)
- `bun x sanity cors add <url> --credentials` — allow a new frontend origin to call the API
  (needed once per frontend dev/prod URL; already added for `http://localhost:5173`)
- Package manager is **bun** (`bun.lock` present) — do not use `npm`/`yarn` here, the frontend
  repo (`KIA-WC-2026/`) uses npm instead, they are independent.
- No standalone typecheck script; `bun x tsc --noEmit` reports unrelated pre-existing errors
  from inside `node_modules/@sanity/sdk`'s own source files (not this project's code) — ignore
  those and verify instead by running `bun run dev` and checking the Studio loads without a
  runtime error overlay.

## Schema conventions

- One file per document type at `schemaTypes/documents/<kebab-case-name>.ts`, registered in
  `schemaTypes/index.ts`.
- Every type needs an icon from `@sanity/icons`, imported from its **specific subpath** (e.g.
  `import { ImageIcon } from '@sanity/icons/Image'`), not the package root — most root-level
  named icon exports are deprecated/stubbed to `never` in the installed version and crash the
  Studio at runtime with `does not provide an export named 'XyzIcon'`, even though it only
  surfaces as a hint (not a type error) in the editor.
- Field names: camelCase, and must exactly match the frontend's fetch/interface field names —
  no renaming between schema and GROQ projection.
- New singleton document type → add its `name` to the `SINGLETONS` array in `structure.ts`, or
  it'll render as a generic (and pointless, since only one will ever exist) document list
  instead of a fixed-ID singleton entry.
- Follow the project's general schema philosophy (data over presentation, `defineField`/
  `defineType`/`defineArrayMember` always, references only for genuinely reusable content) —
  see the `sanity-best-practices` skill's `schema` reference for the full rules.

## Project ID / dataset

`projectId: '4k3v8aiu'`, `dataset: 'production'` (see `sanity.config.ts` / `sanity.cli.ts`).
Not secret — the frontend's `.env` holds the same values under `VITE_SANITY_PROJECT_ID` /
`VITE_SANITY_DATASET`.
