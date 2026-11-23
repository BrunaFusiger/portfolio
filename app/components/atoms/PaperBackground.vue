<script setup lang="ts">
import type { PaperRenderer } from '~/utils/origami/PaperRenderer'

const canvas = ref<HTMLCanvasElement | null>(null)
const creases = usePaperCreases()

let paper: PaperRenderer | null = null
let ro: ResizeObserver | null = null
let unmounted = false

function createPaper(target: HTMLCanvasElement, Renderer: typeof PaperRenderer) {
  try {
    return new Renderer(target)
  } catch {
    return null
  }
}

onMounted(async () => {
  if (!canvas.value) return
  const { PaperRenderer } = await import('~/utils/origami/PaperRenderer')
  if (unmounted || !canvas.value) return
  paper = createPaper(canvas.value, PaperRenderer)
  if (!paper) return
  paper.setCreases(creases.value)
  paper.resize()
  ro = new ResizeObserver(() => paper?.resize())
  ro.observe(canvas.value)
})

watch(creases, (amount) => paper?.setCreases(amount))

onBeforeUnmount(() => {
  unmounted = true
  ro?.disconnect()
  ro = null
  paper?.dispose()
  paper = null
})
</script>

<template>
  <div class="pointer-events-none" aria-hidden="true">
    <canvas ref="canvas" class="block size-full max-w-none" />
  </div>
</template>
