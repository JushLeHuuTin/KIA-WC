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
