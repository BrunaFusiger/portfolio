<script setup lang="ts">
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    caption?: string
    placeholderLabel?: string
    aspect?: '16/9' | '4/3' | 'square' | '9/16'
    variant?: 'default' | 'device'
  }>(),
  {
    aspect: '16/9',
    variant: 'default',
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
    default:
      return 'aspect-video'
  }
})

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
</script>

<template>
  <figure
    class="w-full overflow-hidden ring-1 ring-inset ring-default/5 bg-surface-subtle rounded-[32px]"
    :class="variant === 'device' ? 'flex flex-col items-center p-6 md:p-8' : ''"
  >
    <div
      v-if="variant === 'device'"
      class="w-full flex justify-center"
    >
      <div
        class="w-full max-w-[280px] md:max-w-[320px] overflow-hidden rounded-[24px] ring-1 ring-inset ring-default/5"
      >
        <div :class="['relative w-full', aspectClass]">
          <NuxtImg
            v-if="showImage"
            :src="src!"
            :alt="alt ?? ''"
            class="absolute inset-0 size-full object-cover"
            :class="[transitionClass, imageOpacityClass]"
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
      v-else
      :class="['relative w-full', aspectClass]"
    >
      <NuxtImg
        v-if="showImage"
        :src="src!"
        :alt="alt ?? ''"
        class="absolute inset-0 size-full object-cover"
        :class="[transitionClass, imageOpacityClass]"
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
      v-if="caption"
      class="font-body text-sm md:text-base text-muted/90 leading-6 mt-4 max-w-prose"
      :class="
        variant === 'device'
          ? 'text-center px-2'
          : 'px-6 pb-6 md:px-8 md:pb-8'
      "
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

