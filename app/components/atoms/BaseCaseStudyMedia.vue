<script setup lang="ts">
import { useReducedMotion } from '~/composables/useReducedMotion'
import {
  caseStudyLinkDisplayLabel,
  parseCaseStudyMarkdown,
} from '~/utils/caseStudyMarkdown'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    caption?: string
    placeholderLabel?: string
    aspect?: '16/9' | '4/3' | 'square' | '9/16' | 'auto'
    variant?: 'default' | 'device' | 'bare'
    rounded?: boolean
    maxWidth?: 'xs' | 'sm' | 'md'
  }>(),
  {
    aspect: '16/9',
    variant: 'default',
    rounded: false,
  },
)

const reducedMotion = useReducedMotion()
const loaded = ref(false)
const localePath = useLocalePath()
const { t } = useI18n()

function linkDisplayLabel(label: string) {
  return caseStudyLinkDisplayLabel(label, t('work.linkHere'))
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href)
}

const captionSegments = computed(() => parseCaseStudyMarkdown(props.caption?.trim() ?? ''))

const aspectClass = computed(() => {
  switch (props.aspect) {
    case '4/3':
      return 'aspect-[4/3]'
    case 'square':
      return 'aspect-square'
    case '9/16':
      return 'aspect-[9/16]'
    case 'auto':
      return ''
    default:
      return 'aspect-video'
  }
})

const isAutoAspect = computed(() => props.aspect === 'auto')

const showImage = computed(() => Boolean(props.src?.trim()))

const transitionClass = computed(() =>
  reducedMotion.value ? '' : 'transition-opacity duration-300 ease-out',
)

const imageOpacityClass = computed(() => {
  if (reducedMotion.value || loaded.value) return 'opacity-100'
  return 'opacity-0'
})

const stripeStyle = {
  background:
    'repeating-linear-gradient(135deg, transparent, transparent 10px, color-mix(in srgb, var(--color-text-default) 6%, transparent) 10px, color-mix(in srgb, var(--color-text-default) 6%, transparent) 11px)',
}

watch(
  () => props.src,
  () => {
    loaded.value = false
  },
)

const widthClass = computed(() => {
  switch (props.maxWidth) {
    case 'xs':
      return 'mx-auto w-full max-w-xs'
    case 'sm':
      return 'mx-auto w-full max-w-sm'
    case 'md':
      return 'mx-auto w-full max-w-md'
    default:
      return 'w-full'
  }
})

const roundedClipClass = computed(() =>
  props.rounded ? 'overflow-hidden rounded-[32px]' : '',
)

const figureClass = computed(() => {
  if (props.variant === 'bare') return widthClass.value
  if (props.variant === 'device') {
    return 'w-full overflow-hidden border border-surface-border bg-surface-subtle rounded-[32px] flex flex-col items-center p-6 md:p-8'
  }
  return 'w-full overflow-hidden border border-surface-border bg-surface-subtle rounded-[32px]'
})

/** Contain keeps full screenshot/UI visible inside the aspect box (no edge crop). */
const imageFitClass = 'object-contain'

const showCaption = computed(() => Boolean(props.caption?.trim()))
</script>

<template>
  <figure :class="figureClass">
    <div
      v-if="variant === 'device'"
      class="w-full flex justify-center"
    >
      <div
        class="w-full max-w-[280px] md:max-w-[320px] overflow-hidden rounded-[24px] border border-surface-border"
      >
        <div :class="['relative w-full', aspectClass, roundedClipClass]">
          <NuxtImg
            v-if="showImage"
            :src="src!"
            :alt="alt ?? ''"
            class="absolute inset-0 size-full"
            :class="[imageFitClass, transitionClass, imageOpacityClass]"
            loading="lazy"
            @load="loaded = true"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center"
            :style="stripeStyle"
          >
            <span
              class="font-heading text-[10px] md:text-xs font-medium uppercase tracking-widest text-muted/70 px-4 text-center"
            >
              {{ placeholderLabel ?? 'Media' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="isAutoAspect"
      :class="['relative w-full min-h-[200px]', roundedClipClass]"
    >
      <NuxtImg
        v-if="showImage"
        :src="src!"
        :alt="alt ?? ''"
        class="block h-auto w-full max-w-full"
        :class="[transitionClass, imageOpacityClass]"
        loading="lazy"
        @load="loaded = true"
      />
      <div
        v-else
        class="flex min-h-[200px] w-full items-center justify-center"
        :style="stripeStyle"
      >
        <span
          class="font-heading text-[10px] md:text-xs font-medium uppercase tracking-widest text-muted/70 px-4 text-center"
        >
          {{ placeholderLabel ?? 'Media' }}
        </span>
      </div>
    </div>

    <div
      v-else
      :class="['relative w-full', aspectClass, roundedClipClass]"
    >
      <NuxtImg
        v-if="showImage"
        :src="src!"
        :alt="alt ?? ''"
        class="absolute inset-0 size-full"
        :class="[imageFitClass, transitionClass, imageOpacityClass]"
        loading="lazy"
        @load="loaded = true"
      />
      <div
        v-else
        class="absolute inset-0 flex items-center justify-center"
        :style="stripeStyle"
      >
        <span
          class="font-heading text-[10px] md:text-xs font-medium uppercase tracking-widest text-muted/70 px-4 text-center"
        >
          {{ placeholderLabel ?? 'Media' }}
        </span>
      </div>
    </div>

    <figcaption
      v-if="showCaption"
      class="font-body text-sm md:text-base text-subtle leading-6 mt-4 text-center w-full"
      :class="
        variant === 'device'
          ? 'text-center px-2'
          : variant === 'bare'
            ? 'text-center'
            : 'px-6 pb-6 md:px-8 md:pb-8'
      "
    >
      <template v-for="(seg, i) in captionSegments" :key="i">
        <span v-if="seg.type === 'text'">{{ seg.value }}</span>
        <a
          v-else-if="isExternal(seg.href)"
          :href="seg.href"
          class="font-body text-link underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >{{ linkDisplayLabel(seg.label) }}</a>
        <NuxtLink
          v-else
          :to="localePath(seg.href)"
          class="font-body text-link underline underline-offset-2"
        >{{ linkDisplayLabel(seg.label) }}</NuxtLink>
      </template>
    </figcaption>
  </figure>
</template>

