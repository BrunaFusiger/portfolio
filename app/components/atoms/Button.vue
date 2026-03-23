<script setup lang="ts">
const { gsap } = useGsap()

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const wrapperRef = ref<HTMLDivElement | null>(null)
const scratchedRef = ref<HTMLImageElement | null>(null)
const sparkRefs = ref<(HTMLSpanElement | null)[]>([])

let hoverTl: gsap.core.Timeline | null = null

function setSparkRef(i: number) {
  return (el: any) => {
    sparkRefs.value[i] = el as HTMLSpanElement
  }
}

function onHoverIn() {
  if (!wrapperRef.value || !scratchedRef.value) return

  hoverTl?.kill()
  const sparks = sparkRefs.value.filter(Boolean) as HTMLSpanElement[]

  hoverTl = gsap.timeline()

  // Scratched texture pops in at corner
  hoverTl.fromTo(
    scratchedRef.value,
    { scale: 0, opacity: 0, rotation: -8 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'back.out(2)' },
  )

  // Sparks fly from the scratched corner
  sparks.forEach((spark, i) => {
    const angle = -0.8 + Math.random() * 1.2
    const dist = 14 + Math.random() * 22

    hoverTl!.fromTo(
      spark,
      { x: 0, y: 0, scale: 1.5, opacity: 1 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 8,
        scale: 0,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.out',
      },
      0.12 + i * 0.03,
    )
  })
}

function onHoverOut() {
  hoverTl?.kill()
  const all = [scratchedRef.value, ...sparkRefs.value].filter(Boolean) as HTMLElement[]
  gsap.to(all, { scale: 0, opacity: 0, duration: 0.15, ease: 'power2.in' })
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
      class="relative bg-surface-brand text-surface-background px-6 py-4 rounded-full font-heading font-black text-body tracking-[0.02em] whitespace-nowrap cursor-pointer border-0 outline-none appearance-none overflow-hidden"
      @click="emit('click', $event)"
    >
      <slot />

      <img
        ref="scratchedRef"
        src="/textures/scratched-white.png"
        alt=""
        class="absolute top-[-12px] right-[-8px] w-[38px] h-[38px] object-contain pointer-events-none z-10 opacity-0 -scale-y-100"
        style="transform-origin: bottom right"
        aria-hidden="true"
      />
    </button>

    <!-- Sparks from the scratched corner -->
    <span
      v-for="i in 5"
      :key="`spark-${i}`"
      :ref="setSparkRef(i - 1)"
      class="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-red-500 pointer-events-none z-20 opacity-0"
    />
  </div>
</template>
