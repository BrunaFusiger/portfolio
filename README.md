# fusiger.ch

My portfolio. Designed in Figma and built from scratch by me, end to end.

**Live: [fusiger.ch](https://www.fusiger.ch)**

I work as a Design Engineer: I design products and ship the front-end myself. This repo is the proof of how I do both at once. Everything here, from the design system to the content engine to the deployment pipeline, is mine.

## Stack

- **[Nuxt 4](https://nuxt.com)** + Vue 3 + TypeScript
- **[UnoCSS](https://unocss.dev)** with design tokens (colors, type scale, spacing) mirroring my Figma variables
- **[@nuxt/content v3](https://content.nuxt.com)** as a structured content engine (see below)
- **[@nuxtjs/i18n](https://i18n.nuxtjs.org)**: four locales (EN, DE, IT, PT), fully translated content and UI
- **[@nuxt/image](https://image.nuxt.com)**: AVIF/WebP with density-aware sizes
- **GSAP** for motion, **Swiper** for carousels, **PostHog** for analytics
- Deployed on **Vercel**

## How it works

**Content as data, not markdown.** Case studies and garden posts are YAML files validated by zod schemas (`content.config.ts`). Each post is a sequence of typed blocks (prose, media, video, carousel, process steps, before/after, scrollytelling, stat rows) rendered by a single dispatcher component. Adding a new content type means one schema entry and one component, and every existing post can use it immediately, in all four languages.

**A real design system.** Components are organized as atoms, molecules and organisms, styled through UnoCSS tokens instead of hardcoded values. The tokens mirror my Figma variables one to one, so design changes travel to code without translation loss.

**Performance as a habit.** Images ship as AVIF/WebP at the rendered size, videos load only when scrolled into view and are compressed at the source, GSAP is lazy-loaded through a composable, and `prefers-reduced-motion` is respected in every animation. Content routes are prerendered, with a custom sitemap source per locale.

**AI-native workflow.** I design in Figma and build with Figma MCP, Claude Code and Cursor in the loop. The design system is structured MCP-friendly on both sides, so agents can read the Figma file and the codebase through the same vocabulary. AI multiplies the output; the decisions stay mine.

## Running it

```bash
bun install
bun dev        # http://localhost:3000
bun run build  # production build
```

## A note on reuse

The code is public so you can read how it's built. The content, case studies, imagery and brand are mine. Please don't republish them.

---

Bruna Fusiger · [fusiger.ch](https://www.fusiger.ch) · [LinkedIn](https://www.linkedin.com/in/brunafusiger)
