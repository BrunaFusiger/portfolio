<script setup lang="ts">
const prefersReducedMotion = useReducedMotion()

/** Max pixel shift; keeps motion subtle */
const MAX_OFFSET = 5
const LERP = 0.14

const rootRef = ref<HTMLElement | null>(null)

const tx = ref(0)
const ty = ref(0)
const targetTx = ref(0)
const targetTy = ref(0)

let rafId = 0
let sectionEl: HTMLElement | null = null

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function tick() {
  const dx = targetTx.value - tx.value
  const dy = targetTy.value - ty.value
  tx.value += dx * LERP
  ty.value += dy * LERP
  if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
    rafId = requestAnimationFrame(tick)
  } else {
    tx.value = targetTx.value
    ty.value = targetTy.value
    rafId = 0
  }
}

function scheduleTick() {
  if (rafId) return
  rafId = requestAnimationFrame(tick)
}

function onSectionMove(e: MouseEvent) {
  const el = rootRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  if (r.width <= 0 || r.height <= 0) return
  const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
  const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
  targetTx.value = clamp(nx, -1, 1) * MAX_OFFSET
  targetTy.value = clamp(ny, -1, 1) * MAX_OFFSET
  scheduleTick()
}

function onSectionLeave() {
  targetTx.value = 0
  targetTy.value = 0
  scheduleTick()
}

onMounted(() => {
  if (typeof window === 'undefined') return
  if (prefersReducedMotion.value) return

  const root = rootRef.value
  sectionEl = root?.closest('section') ?? null
  if (!sectionEl) return

  sectionEl.addEventListener('mousemove', onSectionMove, { passive: true })
  sectionEl.addEventListener('mouseleave', onSectionLeave)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
  if (sectionEl) {
    sectionEl.removeEventListener('mousemove', onSectionMove)
    sectionEl.removeEventListener('mouseleave', onSectionLeave)
    sectionEl = null
  }
})
</script>

<template>
  <div
    ref="rootRef"
    class="pointer-events-none absolute isolate overflow-hidden z-0 opacity-50"
    aria-hidden="true"
  >
    <div
      class="dot-grid absolute -inset-[12px] will-change-transform"
      :style="{
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
      }"
    />
  </div>
</template>
