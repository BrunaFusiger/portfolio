<script setup lang="ts">
const { gsap } = useGsap()

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const wrapperRef = ref<HTMLDivElement | null>(null)
const scratchedRef = ref<HTMLImageElement | null>(null)

let hoverTl: gsap.core.Timeline | null = null

function onHoverIn() {
  if (!wrapperRef.value || !scratchedRef.value) return

  hoverTl?.kill()
  hoverTl = gsap.timeline()

  hoverTl.fromTo(
    scratchedRef.value,
    { scale: 0.8, opacity: 0, rotation: -1 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'power1.inOut' },
  )
}

function onHoverOut() {
  hoverTl?.kill()
  const all = [scratchedRef.value].filter(Boolean) as HTMLElement[]
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
      class="relative bg-surface-brand text-surface-background px-7 py-4 rounded-full font-heading font-black text-body tracking-[0.02em] whitespace-nowrap cursor-pointer border-0 outline-none appearance-none overflow-hidden"
      @click="emit('click', $event)"
    >
      <slot />

      <img
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
