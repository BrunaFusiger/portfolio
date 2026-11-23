<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import GUI from 'lil-gui'
import { DEFAULT_SETTINGS, PAPER_TONES } from './paper/PaperBackground'
import { DEFAULT_BOAT_SHAPE as DEFAULT_SHAPE } from './fold/foldModel'
import { DEFAULT_STAGE, Stage } from './Stage'

const canvas = ref<HTMLCanvasElement | null>(null)
const preview = ref<'desktop' | 'mobile'>('desktop')

let stage: Stage | null = null
let gui: GUI | null = null
let ro: ResizeObserver | null = null

onMounted(() => {
  if (!canvas.value) return
  stage = new Stage(canvas.value)
  // lab only: lets us drive the scene from the browser console
  ;(window as unknown as { stage: Stage }).stage = stage

  ro = new ResizeObserver(() => stage?.resize())
  ro.observe(canvas.value)

  const paper = { ...DEFAULT_SETTINGS }
  const scene = { ...DEFAULT_STAGE }
  const shape = { ...DEFAULT_SHAPE }
  const updatePaper = () => stage?.applyPaper(paper)
  const updateScene = () => stage?.apply(scene)
  const updateShape = () => stage?.applyShape(shape)

  gui = new GUI({ title: 'Origami lab' })

  const view = gui.addFolder('View')
  view
    .add(preview, 'value', ['desktop', 'mobile'])
    .name('preview')
    .onChange(async () => {
      await nextTick()
      stage?.resize(true)
    })
  view.add(paper, 'fit', ['cover', 'contain']).onChange(updatePaper)
  view.add(paper, 'orientation', ['auto', 'landscape', 'portrait']).onChange(updatePaper)
  view.add(paper, 'debug').name('show crease map').onChange(updatePaper)

  const boat = gui.addFolder('Boat')
  boat.add(scene, 'showBoat').name('show boat').onChange(updateScene)
  boat.add(scene, 'boatSize', 0.2, 1, 0.01).name('size').onChange(updateScene)
  boat.add(scene, 'yaw', -180, 180, 1).name('turn').onChange(updateScene)
  boat.add(scene, 'cameraHeight', 0, 80, 1).name('camera height').onChange(updateScene)
  boat.add(scene, 'keyLight', 0, 6, 0.05).name('main light').onChange(updateScene)
  boat.add(scene, 'fillLight', 0, 3, 0.05).name('soft light').onChange(updateScene)
  boat.add(scene, 'bounce', 0, 3, 0.05).name('bounce light').onChange(updateScene)
  boat.add(scene, 'shadow', 0, 0.6, 0.01).onChange(updateScene)

  const form = boat.addFolder('Shape')
  form.add(shape, 'tipReach', 0.4, 0.9, 0.01).name('tip reach').onChange(updateShape)
  form.add(shape, 'tipLift', 0, 0.3, 0.005).name('tip lift').onChange(updateShape)
  form.add(shape, 'keel', 0.2, 0.5, 0.01).name('bottom length').onChange(updateShape)
  form.add(shape, 'flare', 0.02, 0.45, 0.01).name('hull width').onChange(updateShape)
  form.add(shape, 'sailSize', 0.2, 0.42, 0.005).name('sail size').onChange(updateShape)
  form.add(shape, 'hullDepth', 1, 2.5, 0.05).name('hull depth').onChange(updateShape)
  form.close()

  const unfold = { progress: 0, duration: 2.6 }
  const anim = gui.addFolder('Unfold')
  const progressCtrl = anim
    .add(unfold, 'progress', 0, 1, 0.001)
    .name('timeline (scrub)')
    .onChange((t: number) => {
      stage?.stop()
      stage?.setProgress(t)
    })
  anim.add(unfold, 'duration', 1, 6, 0.1).name('duration (s)')
  anim
    .add(
      {
        play: () =>
          stage?.play(unfold.duration, (t) => {
            unfold.progress = t
            progressCtrl.updateDisplay()
          }),
      },
      'play',
    )
    .name('▶ play unfold')
  anim
    .add(
      {
        back: () => {
          stage?.stop()
          unfold.progress = 0
          progressCtrl.updateDisplay()
          stage?.setProgress(0)
        },
      },
      'back',
    )
    .name('back to boat')

  const sheet = gui.addFolder('Paper')
  sheet.add(paper, 'strength', 0, 1, 0.01).name('background strength').onChange(updatePaper)
  sheet.add(paper, 'tone', Object.keys(PAPER_TONES)).onChange(updatePaper)
  sheet.add(paper, 'grain', 0, 0.12, 0.005).onChange(updatePaper)
  sheet.add(paper, 'fibre', 0, 0.2, 0.005).onChange(updatePaper)
  sheet.add(paper, 'warp', 0, 1.5, 0.05).name('not flat').onChange(updatePaper)
  sheet.add(paper, 'stray').name('handling creases').onChange(updatePaper)
  sheet.add(paper, 'seed', 0, 50, 1).onChange(updatePaper)
  sheet.add(paper, 'depth', 0, 1.5, 0.01).name('crease bend').onChange(updatePaper)
  sheet.add(paper, 'spread', 0.02, 0.3, 0.005).name('crease reach').onChange(updatePaper)
  sheet.add(paper, 'sharp', 0.0005, 0.006, 0.0001).name('crease width').onChange(updatePaper)
  sheet.add(paper, 'line', 0, 0.25, 0.005).name('crease line').onChange(updatePaper)
  sheet.add(paper, 'lightAngle', 0, 360, 1).name('light direction').onChange(updatePaper)
  sheet.add(paper, 'lightElevation', 5, 85, 1).name('light height').onChange(updatePaper)
  sheet.add(paper, 'contrast', 0, 3, 0.05).name('light contrast').onChange(updatePaper)
  sheet.close()

  const actions = {
    copySettings: () =>
      navigator.clipboard.writeText(JSON.stringify({ paper, scene, shape }, null, 2)),
    reset: () => {
      Object.assign(paper, DEFAULT_SETTINGS)
      Object.assign(scene, DEFAULT_STAGE)
      Object.assign(shape, DEFAULT_SHAPE)
      gui?.controllersRecursive().forEach((c) => c.updateDisplay())
      updatePaper()
      updateShape()
      updateScene()
    },
    exportDesktop: () => download(stage!.exportPaperPng(2560, 1440), 'paper-2560x1440.png'),
    exportMobile: () => download(stage!.exportPaperPng(1170, 2532), 'paper-1170x2532.png'),
  }
  gui.add(actions, 'copySettings').name('copy settings')
  gui.add(actions, 'reset')
  gui.add(actions, 'exportDesktop').name('export paper PNG (desktop)')
  gui.add(actions, 'exportMobile').name('export paper PNG (mobile)')
})

function download(url: string, name: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
}

onBeforeUnmount(() => {
  ro?.disconnect()
  gui?.destroy()
  stage?.dispose()
})
</script>

<template>
  <div
    :style="{
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      background: preview === 'mobile' ? 'rgb(40 40 40)' : 'transparent',
    }"
  >
    <canvas
      ref="canvas"
      :style="
        preview === 'mobile'
          ? { width: '390px', height: '844px', borderRadius: '24px', display: 'block' }
          : { width: '100%', height: '100%', display: 'block', cursor: 'grab' }
      "
    />
  </div>
</template>
