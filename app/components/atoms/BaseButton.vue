<script setup lang="ts">

const { gsap } = useGsap()

type ButtonVariant = 'solid-dark' | 'solid-red' | 'dotted'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
  }>(),
  { variant: 'solid-dark' },
)

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const wrapperRef = ref<HTMLDivElement | null>(null)
const scratchedRef = ref<ComponentPublicInstance | null>(null)
const scratchedEl = computed(() => scratchedRef.value?.$el as HTMLElement | undefined)
const isSolid = computed(() => props.variant !== 'dotted')

let hoverTl: gsap.core.Timeline | null = null

function onHoverIn() {
  if (!isSolid.value || !wrapperRef.value || !scratchedEl.value) return

  hoverTl?.kill()
  hoverTl = gsap.timeline()

  hoverTl.fromTo(
    scratchedEl.value,
    { scale: 0.8, opacity: 0, rotation: -1 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'power1.inOut' },
  )
}

function onHoverOut() {
  if (!isSolid.value) return
  hoverTl?.kill()
  const all = [scratchedEl.value].filter(Boolean) as HTMLElement[]
  gsap.to(all, { scale: 0, opacity: 0, duration: 0.15, ease: 'power1.in' })
}

onBeforeUnmount(() => {
  hoverTl?.kill()
  hoverTl = null
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="relative inline-flex"
    @mouseenter="onHoverIn"
    @mouseleave="onHoverOut"
  >
    <button
      type="button"
      class="relative inline-flex items-center gap-2 px-6 font-heading font-black text-body tracking-[0.02em] whitespace-nowrap cursor-pointer outline-none appearance-none"
      :class="[
        variant === 'solid-dark' &&
          'bg-surface-inverse text-inverse py-4 rounded-full border-0 overflow-hidden',
        variant === 'solid-red' &&
          'bg-surface-brand  text-white py-4 rounded-full border-0 overflow-hidden',
        variant === 'dotted' &&
          'bg-transparent text-neutral-500 py-2 rounded-lg border border-dashed border-neutral-500 hover:bg-white/30 transition-colors',
      ]"
      @click="emit('click', $event)"
    >
      <span v-if="$slots['icon-left']" class="shrink-0 inline-flex">
        <slot name="icon-left" />
      </span>

      <slot />

      <span v-if="$slots['icon-right']" class="shrink-0 inline-flex">
        <slot name="icon-right" />
      </span>

      <NuxtImg
        v-if="isSolid"
        ref="scratchedRef"
        src="/textures/scratched-white.png"
        alt=""
        class="absolute top-[-18px] right-[-20px] w-[50px] h-[60px] object-contain pointer-events-none z-10 opacity-0 -scale-y-100"
        style="transform-origin: top right"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
