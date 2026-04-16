import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const scrollytellingItem = z.object({
  title: z.string(),
  label: z.string(),
  image: z.string(),
})

const processStep = z.object({
  title: z.string(),
  text: z.string().optional(),
  items: z.array(z.string()).optional(),
})

const bracketStatRow = z.object({
  value: z.string(),
  description: z.string(),
})

const section = z.object({
  type: z.enum([
    /** Starts a new outer section without rendering (use so any block can begin a new section). */
    'sectionBreak',
    'heading',
    'subheading',
    'prose',
    /** Prose + one or more stat rows with a decorative curly bracket at left. */
    'bracketBlock',
    'stat',
    'bullets',
    'highlighted',
    'lottie',
    'scrollytelling',
    'video',
    'media',
    'computerMockup',
    'process',
    'beforeAfter',
    /** Tag-style chips using case study body type size (wraps in one row). */
    'inlineTags',
  ]),
  text: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  /** `bracketBlock`: stat rows inside the bracket emphasis block. */
  stats: z.array(bracketStatRow).min(1).optional(),
  value: z.string().optional(),
  description: z.string().optional(),
  /** `bullets` / `inlineTags`: string list (bullets vs tag-style chips at prose size). */
  items: z.array(z.string()).optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  placeholderLabel: z.string().optional(),
  aspect: z.enum(['16/9', '4/3', 'square', '9/16', 'auto']).optional(),
  variant: z.enum(['default', 'device', 'bare']).optional(),
  /** When true, clips the image with 32px corner radius. */
  rounded: z.boolean().optional(),
  /** Constrain media width (centered). Omitted = full column width. */
  maxWidth: z.enum(['xs', 'sm', 'md']).optional(),
  steps: z.array(processStep).optional(),
  /** `computerMockup`: laptop frame with scrollable screen area. */
  mockupSrc: z.string().optional(),
  screenImageSrc: z.string().optional(),
  screenVideoSrc: z.string().optional(),
  screenInset: z
    .object({
      top: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
      bottom: z.number().optional(),
    })
    .optional(),
  /** `beforeAfter`: left = before (e.g. wireframe), right = after (e.g. final). */
  beforeSrc: z.string().optional(),
  afterSrc: z.string().optional(),
  beforeAlt: z.string().optional(),
  afterAlt: z.string().optional(),
  beforeLabel: z.string().optional(),
  afterLabel: z.string().optional(),
  /** `beforeAfter`: fixed viewport height; images use `object-cover object-top` (cropped). `xl` = 3× `md` (60rem vs 20rem). */
  maxHeight: z.enum(['xs', 'sm', 'md', 'xl']).optional(),
})

export default defineContentConfig({
  collections: {
    caseStudies: defineCollection({
      type: 'data',
      source: '*/work/*.yml',
      schema: z.object({
        title: z.string(),
        subtitle: z.string(),
        tags: z.array(z.string()),
        /** Optional “live site” line below tags: `liveIntro` + linked `liveLinkText` (default from i18n `work.linkHere`). */
        liveIntro: z.string().optional(),
        liveLinkText: z.string().optional(),
        liveUrl: z.string().url().optional(),
        scrollytelling: z.array(scrollytellingItem).optional(),
        sections: z.array(section),
      }),
    }),
  },
})
