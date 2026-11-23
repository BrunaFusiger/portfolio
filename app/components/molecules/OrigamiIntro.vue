<script setup lang="ts">
import type { OrigamiIntroScene } from '~/utils/origami/OrigamiIntroScene'

const HIDE_CLASS = 'origami-intro'
const CONTENT_ID = 'site-content'
const SAFETY_REVEAL_MS = 9000
const SCENE_LOAD_BUDGET_MS = 2500
const PHONE_MAX_WIDTH = 768

if (import.meta.server) {
  useHead({
    script: [
      {
        key: 'origami-intro-hide',
        tagPosition: 'head',
        innerHTML: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('${HIDE_CLASS}');d.dataset.origamiReveal=String(setTimeout(function(){d.classList.remove('${HIDE_CLASS}');var c=document.getElementById('${CONTENT_ID}');if(c)c.inert=false},${SAFETY_REVEAL_MS}))}`,
      },
    ],
  })
}

const canvas = ref<HTMLCanvasElement | null>(null)
const creases = usePaperCreases()
const playing = ref(false)
const done = ref(false)

const headScriptChosePlay =
  import.meta.client && document.documentElement.classList.contains(HIDE_CLASS)

if (headScriptChosePlay) creases.value = 0

let scene: OrigamiIntroScene | null = null
let ro: ResizeObserver | null = null
let contentShown = false

function siteContent() {
  return document.getElementById(CONTENT_ID)
}

function cancelSafetyReveal() {
  clearTimeout(Number(document.documentElement.dataset.origamiReveal))
}

function showContent() {
  if (contentShown) return
  contentShown = true
  document.documentElement.classList.remove(HIDE_CLASS)
  const content = siteContent()
  if (content) content.inert = false
}

function loadWithinBudget<T>(load: Promise<T>) {
  return Promise.race([
    load,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('origami intro load budget exceeded')), SCENE_LOAD_BUDGET_MS),
    ),
  ])
}

function finish() {
  if (done.value) return
  if (import.meta.client) {
    showContent()
    window.removeEventListener('keydown', onKey)
  }
  creases.value = 1
  playing.value = false
  done.value = true
  ro?.disconnect()
  ro = null
  scene?.dispose()
  scene = null
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') finish()
}

function pressCreasesAsSheetLands(amount: number) {
  creases.value = amount
  if (amount > 0) showContent()
}

async function startScene(target: HTMLCanvasElement) {
  const { OrigamiIntroScene } = await loadWithinBudget(
    import('~/utils/origami/OrigamiIntroScene'),
  )
  if (done.value) return null
  return new OrigamiIntroScene(target, {
    onCreases: pressCreasesAsSheetLands,
    light: window.innerWidth < PHONE_MAX_WIDTH,
  })
}

onMounted(async () => {
  if (!headScriptChosePlay || !canvas.value) {
    finish()
    return
  }
  playing.value = true
  const content = siteContent()
  if (content) content.inert = true
  window.addEventListener('keydown', onKey)

  const target = canvas.value
  try {
    scene = await startScene(target)
  } catch {
    finish()
    return
  }
  if (!scene) return
  ro = new ResizeObserver(() => scene?.resize())
  ro.observe(target)
  cancelSafetyReveal()
  scene.play(finish)
})

onBeforeUnmount(finish)
</script>

<template>
  <Teleport to="#teleports">
    <canvas
      v-if="!done"
      ref="canvas"
      class="pointer-events-none fixed inset-0 z-30 block size-full max-w-none"
      aria-hidden="true"
    />
    <button
      v-if="playing"
      type="button"
      class="fixed bottom-6 left-6 z-50 rounded-full bg-surface-card px-4 py-2 font-heading text-sm font-medium text-default outline-none transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background motion-reduce:transition-none"
      @click="finish"
    >
      Skip intro
    </button>
  </Teleport>
</template>
