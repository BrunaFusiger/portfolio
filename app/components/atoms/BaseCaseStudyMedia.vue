<script setup lang="ts">
import { useReducedMotion } from '~/composables/useReducedMotion'

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

const imageFitClass = computed(() =>
  props.variant === 'bare' ? 'object-contain' : 'object-cover',
)

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
      :class="['relative w-full', roundedClipClass]"
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
      class="font-body text-sm md:text-base text-subtle leading-6 mt-4 max-w-prose"
      :class="
        variant === 'device'
          ? 'text-center px-2'
          : variant === 'bare'
            ? 'text-left'
            : 'px-6 pb-6 md:px-8 md:pb-8'
      "
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

