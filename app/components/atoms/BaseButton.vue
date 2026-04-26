<script setup lang="ts">

const { gsap } = useGsap()

type ButtonVariant = 'solid-dark' | 'solid-red' | 'dotted' | 'text-link'

const props = withDefaults(
  defineProps<{
    /** Uno icon classes (e.g. `i-hugeicons-arrow-up-01 size-[1.125rem]`). Prefer over `#icon-left` when set. */
    icon?: string
    variant?: ButtonVariant
    full?: boolean
    /** When set, renders as `<NuxtLink>` so Nuxt prefetches the route in the viewport. */
    to?: string
  }>(),
  { variant: 'solid-dark', full: false, icon: undefined, to: undefined },
)

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const slots = useSlots()
const isSolid = computed(
  () => props.variant === 'solid-dark' || props.variant === 'solid-red',
)

/** `useSlots()` uses camelCase keys for hyphenated `v-slot:icon-left`. */
const hasIconLeftSlot = computed(() => {
  const s = slots as Record<string, (() => unknown[]) | undefined>
  return typeof s['icon-left'] === 'function' || typeof s.iconLeft === 'function'
})

const usePulsingIcon = computed(
  () =>
    isSolid.value
    || (props.variant === 'text-link' && !!(props.icon || hasIconLeftSlot.value)),
)

const wrapperRef = ref<HTMLDivElement | null>(null)
/** Native wrapper so GSAP always gets a real HTMLElement (component $el is unreliable here). */
const scratchedRef = ref<HTMLDivElement | null>(null)

let hoverTl: gsap.core.Timeline | null = null
const prefersReducedMotion = useReducedMotion()

function onHoverIn() {
  if (prefersReducedMotion.value) return
  if (!isSolid.value || !wrapperRef.value || !scratchedRef.value) return

  hoverTl?.kill()
  hoverTl = gsap.timeline()

  hoverTl.fromTo(
    scratchedRef.value,
    { scale: 0.8, opacity: 0, rotation: -1 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'power1.inOut' },
  )
}

function onHoverOut() {
  if (prefersReducedMotion.value) return
  if (!isSolid.value) return
  hoverTl?.kill()
  const el = scratchedRef.value
  if (el) gsap.to(el, { scale: 0, opacity: 0, duration: 0.15, ease: 'power1.in' })
}

onBeforeUnmount(() => {
  hoverTl?.kill()
  hoverTl = null
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="relative"
    :class="full ? 'flex w-full' : 'inline-flex'"
    @mouseenter="onHoverIn"
    @mouseleave="onHoverOut"
  >
    <component
      :is="to ? 'NuxtLink' : 'button'"
      :to="to || undefined"
      :type="to ? undefined : 'button'"
      class="relative inline-flex cursor-pointer items-center outline-none appearance-none"
      :class="[
        to && 'no-underline',
        variant === 'text-link'
          ? 'gap-1.5 border-0 bg-transparent p-0 font-body text-sm font-medium text-brand transition-opacity motion-reduce:transition-none hover:opacity-85 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--color-text-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-background)] dark:focus-visible:ring-offset-neutral-900'
          : 'gap-2 whitespace-nowrap pl-6 pr-7 font-heading font-black text-body tracking-[0.02em]',
        full && 'w-full justify-center',
        variant === 'solid-dark' &&
          'overflow-hidden rounded-full border-0 bg-surface-inverse py-4 text-inverse',
        variant === 'solid-red' &&
          'overflow-hidden rounded-full border-0 bg-surface-brand py-4 text-white',
        variant === 'dotted' &&
          'rounded-full border border-dashed border-[var(--color-text-brand)] bg-transparent py-2 text-brand transition-colors hover:bg-white/30 dark:hover:bg-background-default',
      ]"
      @click="emit('click', $event)"
    >
      <!-- Pulsing on the node that carries Uno icon classes (mask/::before); slot path matches garden CTA. -->
      <span v-if="icon" class="inline-flex shrink-0">
        <div
          class="inline-flex items-center justify-center"
          :class="[icon, usePulsingIcon && 'pulsing-icon']"
          aria-hidden="true"
        />
      </span>
      <span
        v-else-if="$slots['icon-left']"
        class="inline-flex shrink-0"
        :class="usePulsingIcon && 'pulsing-icon'"
      >
        <slot name="icon-left" />
      </span>

      <slot />

      <span v-if="$slots['icon-right']" class="shrink-0 inline-flex">
        <slot name="icon-right" />
      </span>

      <div
        v-if="isSolid"
        ref="scratchedRef"
        class="absolute top-[-24px] right-[-20px] w-[50px] h-[60px] pointer-events-none z-10 opacity-0"
        style="transform-origin: top right"
        aria-hidden="true"
      >
        <TornPaperDecor />
      </div>
    </component>
  </div>
</template>
