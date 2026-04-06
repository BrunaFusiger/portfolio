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

const section = z.object({
  type: z.enum([
    'heading',
    'subheading',
    'prose',
    'stat',
    'bullets',
    'highlighted',
    'lottie',
    'scrollytelling',
    'video',
    'media',
    'process',
  ]),
  text: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  value: z.string().optional(),
  description: z.string().optional(),
  items: z.array(z.string()).optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  placeholderLabel: z.string().optional(),
  aspect: z.enum(['16/9', '4/3', 'square', '9/16']).optional(),
  variant: z.enum(['default', 'device']).optional(),
  steps: z.array(processStep).optional(),
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
        scrollytelling: z.array(scrollytellingItem).optional(),
        sections: z.array(section),
      }),
    }),
  },
})
