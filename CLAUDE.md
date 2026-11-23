# fusiger.ch

Bruna Fusiger's portfolio. Nuxt 4 (`app/` layout), Vue 3, TypeScript, UnoCSS (presetWind4), Nuxt Content v3, Nuxt Image, GSAP, three.js (origami intro only). Package manager: Bun.

## Commands

Bun lives in `~/.bun/bin` and is not on the default PATH: `export PATH="$HOME/.bun/bin:$PATH"`.

- `bun run dev`: dev server (port 3000, or the next free one)
- `bun run build`: production build, run it before calling work done
- `bunx eslint .`: lint
- `lab/origami`: standalone Vite prototype for the origami intro, `bun run dev` inside it (port 5180)

## Git

- `main` is production, `develop` is integration. Branch from `develop`, open PRs into `develop`.
- Branch names: `<type>/<short-kebab-description>`, e.g. `feat/origami-intro`, `fix/carousel-sizing`, `chore/remove-i18n`.
- Commits follow Conventional Commits with a gitmoji, the way the history already does:
  `<type>: :<gitmoji>: <summary in the imperative, lower case>`
  - `feat: :sparkles:` new feature
  - `fix: :bug:` bug fix (`:art:` for visual fixes)
  - `refactor: :recycle:` restructure without behaviour change (`:zap:` for performance, `:fire:` for removals)
  - `style: :lipstick:` UI and styling
  - `docs: :memo:` documentation
  - `chore: :wrench:` tooling and config (`:arrow_up:` for dependency upgrades, `:lock:` for security fixes)
  - `feat: :speech_balloon:` new copy or content files (`fix: :pencil2:` for typos)
- One logical change per commit. Never commit or push unless asked. Never commit secrets (`.env`).

## Code rules

- **No comments in code.** Names, small functions and types carry the meaning. If something needs explaining, rename or extract it. This includes templates (`<!-- -->`), scripts and shaders. Commit messages and PR descriptions are where the "why" goes.
- **Change only what was asked.** Don't touch surrounding code, copy or values. Mention anything adjacent that looks wrong instead of fixing it.
- **Styling is UnoCSS only.** Utility classes in the template, design tokens from `uno.config.ts` (`text-default`, `text-muted`, `bg-surface-*`, `neutral-*`, `red-*`).
  - No `<style>` blocks, except `all: unset` resets or GSAP targets that utilities can't express.
  - No inline `style` attributes for colours, fonts or spacing, no `var(--...)` in styles, no hex colours.
  - Semantic colours are CSS variables exposed through rules, not `theme.colors` (Wind 4 wraps theme colours in `color-mix()`, which breaks nested variables).
- **Dependencies are pinned to exact versions.** No `^` or `~`. When `package.json` changes, update both `bun.lock` and `package-lock.json`.
  - Local npm 10 crashes on this tree. Regenerate the npm lock in a scratch folder that holds only `package.json` and `package-lock.json`: `npx npm@11 install --package-lock-only --ignore-scripts`, then copy it back.
  - `bun update <transitive>` adds it as a direct dependency: revert those lines.
- TypeScript everywhere, no `any`. Prefer `type` aliases and narrow unions.

## Nuxt practices

- Components live in `app/components/{atoms,molecules,organisms}` and are auto-imported without a path prefix. Pages stay thin and compose organisms.
- Shared logic goes in `app/composables/useX.ts`, pure helpers in `app/utils/`. Subfolders of `utils` are not auto-imported, import them explicitly.
- Shared state goes through `useState`, never module-level refs that leak between SSR requests.
- Browser-only code runs in `onMounted` or behind `import.meta.client`. Never let `window`, `document` or `matchMedia` change the first render, or hydration breaks. Decide such things before paint (a head script) or after mount.
- Use `<NuxtImg>` for images, `Lazy` prefixed components for anything below the fold, and `useHead` / `useSeoMeta` for head tags.
- Heavy libraries (three.js, lottie) are loaded with dynamic `import()` only when needed, never in the entry chunk.
- Clean up everything you start: listeners, observers, `requestAnimationFrame` loops, GSAP tweens, WebGL contexts (`dispose()` and `forceContextLoss()`).

## Performance and accessibility

- Watch LCP and CLS. Reserve space for media, don't shift layout after load, keep the hero's text in the HTML.
- No animation loop runs when nothing moves. Static WebGL draws once and on resize.
- Respect `prefers-reduced-motion`: show the final state, no intro.
- Decorative canvases and images are `aria-hidden`. Everything interactive works with the keyboard and has a visible focus state.
- Cap device pixel ratio for WebGL at 2 (1.5 on phones) and use the lighter path on small screens.

## The origami intro

- Tuned in `lab/origami` first, then ported to `app/utils/origami`. Keep the two in step: values live in `app/utils/origami/paperSettings.ts`.
- `PaperBackground` draws the paper with plain WebGL (no three.js). It's the hero's background only. Other sections keep the dot grid.
- `OrigamiIntro` plays on the first load of the homepage. A head script hides the content before first paint (class `origami-intro` on `<html>`), the content fades in as the sheet lands, and three.js is disposed at the end. Skip button and Esc end it. Reduced motion skips it.

## Copy

Published copy sounds like Bruna: plain English, complete sentences, conversational, honest. No em dashes, no buzzwords, nothing that reads like AI copywriting. Facts and numbers must match her CV.
