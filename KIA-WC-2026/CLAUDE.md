# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repo is the in-progress React implementation of a Kia FIFA World Cup 2026 campaign
microsite ("OMBC" — Official Match Ball Carrier / "49th Team"), built section by section
from a Figma design and the client's own asset exports. It is **not** self-contained — it
lives inside a larger folder structure that is the actual source of truth:

- `../../Landing page/OMBC Website New/01. Figma File/` — the `.fig` source file. The live
  file is also connected via the Figma MCP server (`get_design_context`, `get_metadata`,
  `download_assets`, `get_screenshot`) — use it to pull exact copy text, colors, spacing and
  to export icons/logos. Figma asset URLs expire after ~7 days, so download anything you
  fetch immediately into `public/`.
- `../../Landing page/OMBC Website New/02. Assets/{PC,MW}/<NN. Section Name>/` — the real
  photo/video assets for each section, numbered to match the Figma sections: `01. KV`,
  `02. OMBC Cup Main Film`, `03. OMBC Cup`, `04.–07. Phase 1–4`, `08. OMBC Playlist`,
  `09. Additional Info`, `10. Connect Store`, `11. Outro`. PC and MW (mobile web) have
  separate exports.
- `../../Landing page/OMBC Website New/03. Interaction Guide/OMBC_Interaction Guide.pdf` —
  the client's authoritative spec for scroll/hover/click behavior, described separately for
  PC and MW.

**Always copy real assets from the numbered `02. Assets` folder into `public/media/...`
instead of using placeholders, and check the Interaction Guide PDF for a section's expected
animation/interaction before building it.** The one thing genuinely missing from the client's
assets is real YouTube video IDs — every video embed uses a placeholder ID and is marked
`// TODO: replace videoId`. The Kia brand font ("Kia Signature") is also not in the provided
assets; text currently falls back to the system font stack.

**Before building or editing any section, load the `ombc-interaction-guide` skill.** It has
the full PDF rule text (PC rules 1–11, MW rules 1–5) already transcribed, plus a table mapping
each rule number to its Figma frame name, asset folder, and component file — built up the hard
way over several sessions (Figma frame names are unreliable for figuring out page order; asset
folder numbers are the reliable anchor). It also documents gotchas specific to this client's
files (e.g. Figma's dot-indicator previews default to 5 dots regardless of real item count —
always count real files in the asset folder instead) and the PowerShell crop recipe for reading
`00_Section Name.png` (11324×13547px, exceeds the image-read size limit) when the Figma MCP
server is rate-limited, which happens often on the Starter plan.

## Commands

- `npm run dev` — start the Vite dev server (default port 5173; auto-increments if busy)
- `npm run build` — typecheck (`tsc -b`) then production build
- `npm run lint` — ESLint
- `npx tsc -b --noEmit` — typecheck only; run this after every edit
- There is no test suite/runner configured.

### Verifying changes

There are no automated tests. Changes are verified by actually running the dev server and
driving it with Playwright: install it ad hoc (`npm install -D playwright`), kill any stray
`node.exe`, start `npm run dev` in the background, poll with `curl` until it responds, then
script navigation/scroll/click and `page.screenshot()` to visually confirm — checking
`getComputedStyle()` where precise values matter, since Tailwind v4 sets scale/translate via
the CSS `scale`/`translate` properties, not the legacy `transform` shorthand (reading
`getComputedStyle(el).transform` will read `"none"` even when `scale-*` is applied and
working). Uninstall Playwright again (`npm uninstall playwright`) once done — it is not a
permanent dependency.

## Architecture

- Vite + React 19 + TypeScript. Tailwind CSS v4 via the `@tailwindcss/vite` plugin — there is
  no `tailwind.config.js`; theme tokens are declared inline in `src/index.css` via `@theme`.
- Animation: `motion` (the renamed successor to `framer-motion` — import from `motion/react`,
  the `framer-motion` package itself is not installed). **Known bug**: chaining multiple
  `useTransform()` calls off one `useScroll()` value produces wrong, non-monotonic output past
  the declared range in this environment (values "bounce" back instead of clamping once two or
  more derived transforms share a source). Don't use `useTransform` for that case — instead
  read scroll progress with `useMotionValueEvent` and drive plain `useMotionValue`s manually
  using the `remap`/`clamp` helpers in `src/lib/scroll.ts`. See `Hero.tsx` for the working
  pattern (scroll-driven video pause/blur + staged text crossfade).
- Carousels: `swiper` (`swiper/react`). **Known bug**: Swiper's native `loop: true` does not
  reliably duplicate slides when using `slidesPerView="auto"` in this app — verified it freezes
  after one transition instead of looping. `MainFilmCarousel.tsx` fakes the infinite loop
  manually: repeats the slide data 3x and silently re-centers the track (`slideTo(idx, 0)`)
  once the active index drifts into the first/last copy. Follow this pattern for other
  looping carousels rather than trusting `loop: true`. Two related gotchas already hit and
  fixed there, worth re-reading before touching it: (1) the re-center jump must run in a
  `setTimeout` after the slide transition finishes, not immediately in `onSlideChange`, or it
  cancels the visible animation; and (2) a *second* click fired before that timeout resolves
  needs the previous timeout cleared, or a stale correction fires mid-animation.
- Sections are one component per Figma section, in `src/components/sections/`, composed
  together in `App.tsx`. Shared pieces live in `src/components/layout/` (site chrome, e.g.
  `Header.tsx`) and `src/components/ui/` (reusable widgets, e.g. `YouTubePlayer.tsx`).
- Responsive strategy: **one component per section**, not separate PC/MW components. Tailwind
  breakpoints (`lg:`, 1024px) handle layout differences; the `useIsDesktop()` hook
  (`src/hooks/useMediaQuery.ts`) is used when actual behavior or asset choice differs (e.g.
  picking the PC vs MW video/image source), not just CSS.
- `YouTubePlayer.tsx` is the shared video component: renders a thumbnail + play button and
  swaps to a real `<iframe>` embed on click. Reuse it for every video section instead of
  building a new embed.

## CMS (Sanity)

The site is being migrated section-by-section onto Sanity as a headless CMS. The Studio lives
in a **sibling folder**, `../cms-kia/` (not inside this repo) — a standalone Sanity Studio
project (`bun run dev` there, on `localhost:3333`), paired with this Vite app as the frontend.
Do the migration **one section component at a time**, matching the pattern below, and wait for
the user's confirmation before moving to the next one. `Hero.tsx` is the reference
implementation — copy its shape exactly for every subsequent section.

### Studio side (`../cms-kia/`)

- Schema files live at `schemaTypes/documents/<name>.ts` (kebab-case filename, e.g.
  `main-film-carousel.ts`), each exporting a `defineType({ name: '<camelCase>', type:
  'document', ... })` and registered in `schemaTypes/index.ts`.
- Every section is a **singleton** (this is a one-page site — there is never more than one
  `hero`, one `header`, etc.), enforced via `structure.ts`, not a schema option. Add the new
  type's `name` to the `SINGLETONS` array in `structure.ts` and it gets a fixed-ID entry via
  `createSingleton()` instead of appearing as a document list.
- Give every document type an icon from `@sanity/icons` — import from the **specific subpath**
  (e.g. `@sanity/icons/Image`), not the package root: root-level named exports for most icons
  are deprecated/stubbed to `never` in the installed version and crash the Studio at runtime
  (`does not provide an export named 'XyzIcon'`) even though they still typecheck as a hint,
  not an error.
- Field names are camelCase and match 1:1 with the frontend's `<Section>Data` interface (see
  below) — e.g. schema field `kvTitle` → frontend field `kvTitle`. Keep this mapping exact so
  the GROQ projection can stay a flat list of field names with no renaming.
- Video/poster/logo fields use plain Sanity `file`/`image` types. Package manager for this
  sub-project is **bun** (`bun.lock` present), not npm — use `bun run dev` / `bun x <cmd>`.
- After creating or renaming a schema type, the frontend origin must be re-added to CORS if the
  Studio project doesn't already allow it: `bun x sanity cors add http://localhost:5173
  --credentials` (run from `cms-kia/`).

### Frontend side (this repo)

- `src/lib/client.ts` — the shared `sanityClient` (`@sanity/client`, `useCdn: true`, read-only,
  no token needed since the dataset is public) and `urlFor()` image-url builder. Configured via
  `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET` / `VITE_SANITY_API_VERSION` in `.env`
  (gitignored, but these values are not secret — they're already public in the CDN URL).
- `src/lib/queries.ts` — one exported GROQ query constant per section, named
  `<SECTION>_QUERY` (e.g. `HERO_QUERY`), each a singleton lookup by fixed `_id` (`*[_id ==
  "hero"][0]{ ... }`), not by `_type` (faster, matches the Studio's fixed-ID singleton). For
  `file`/`image` fields, project a **dereferenced URL string** directly in GROQ —
  `"pcVideoUrl": pcVideo.asset->url` — rather than returning the raw asset reference and
  building the URL client-side with `urlFor()`. Only reach for `urlFor()` when an image
  actually needs Sanity's on-the-fly transforms (crop/resize); these are full-bleed
  video/poster assets, so a plain dereferenced URL is enough.
- `src/hooks/useSanityData.ts` — one small generic hook (`useSanityData<T>(query)`,
  `useState`/`useEffect`, no external cache library — the page has ~10 singleton documents,
  not enough content volume to justify react-query) shared by every section.
- Each section component declares a `<Section>Data` interface (all fields `string | null` /
  `string[] | null` — Sanity returns `null` for anything not yet filled in) and a module-level
  `FALLBACK` object holding the section's current hardcoded copy/asset paths. Merge **field by
  field** with `??`, not by spreading the whole fetched object — `data?.kvTitle ??
  FALLBACK.kvTitle` — so that a partially-filled-in CMS document (some fields still empty while
  the user is mid-edit in Studio) degrades gracefully field-by-field instead of the whole
  section reverting to fallback or rendering `null` text. See `Hero.tsx` for the full pattern.
- **Never fall back to `?? ''` for anything rendered as an `<img src>` / passed to a component
  prop that becomes one.** An empty-string `src` makes the browser re-request the current
  document (React warns: "may cause the browser to download the whole page again"). Use `??
  undefined` instead so the attribute is omitted, and where practical render a neutral
  placeholder block (`bg-[#1c1f21]`) instead of a broken `<img>` when the CMS field is genuinely
  empty (e.g. a content editor has filled in text but not uploaded the image yet — a real,
  expected mid-edit state, not just a theoretical one). `videoId`/`title` string props are fine
  with `?? ''` since they're not `src` attributes and don't trigger eager network fetches.
- **Site-wide data that isn't owned by any one section** (logo, social links, default SEO
  title/description/OG image) lives in its own `siteSettings` singleton, not duplicated across
  the sections that happen to display it — e.g. the Kia logo shown in both `Header.tsx` and
  `Footer.tsx` is one `siteSettings.logo` field, not a `header.logo` + separately hardcoded
  Footer logo. Consumed via the shared `useSiteSettings()` hook
  (`src/hooks/useSiteSettings.ts`), not a per-component query. `App.tsx`'s `useSeo()` sets
  `document.title` / the meta-description tag from this same hook on mount (no `react-helmet` —
  a single `useEffect` is enough for a one-page SPA).
