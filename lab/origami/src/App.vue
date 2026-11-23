<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import GUI, { type Controller } from 'lil-gui'
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
  const timeline = { time: 0 }
  let timeCtrl: Controller | null = null

  const syncTimeline = () => {
    if (!stage || !timeCtrl) return
    timeCtrl.max(stage.duration)
    timeline.time = stage.time
    timeCtrl.updateDisplay()
  }
  const updatePaper = () => stage?.applyPaper(paper)
  const updateScene = () => {
    stage?.apply(scene)
    syncTimeline()
  }
  const updateShape = () => stage?.applyShape(shape)

  gui = new GUI({ title: 'Origami lab' })

  // ---- playback ----
  const play = gui.addFolder('Intro')
  play
    .add(
      {
        play: () =>
          stage?.play((t) => {
            timeline.time = t
            timeCtrl?.updateDisplay()
          }),
      },
      'play',
    )
    .name('▶ play the whole intro')
  timeCtrl = play
    .add(timeline, 'time', 0, stage.duration, 0.01)
    .name('timeline (s)')
    .onChange((t: number) => {
      stage?.stop()
      stage?.setTime(t)
    })
  play
    .add(
      {
        skip: () => {
          stage?.skip()
          syncTimeline()
        },
      },
      'skip',
    )
    .name('skip to the page')
  play
    .add(
      {
        restart: () => {
          stage?.stop()
          stage?.setTime(0)
          syncTimeline()
        },
      },
      'restart',
    )
    .name('back to the start')
  play.add(scene, 'sailTime', 0, 4, 0.1).name('sailing (s)').onChange(updateScene)
  play.add(scene, 'unfoldTime', 1, 6, 0.1).name('unfold (s)').onChange(updateScene)
  play.add(scene, 'landTime', 0.3, 3, 0.1).name('landing (s)').onChange(updateScene)

  const sea = gui.addFolder('Sailing')
  sea.add(scene, 'waves', 0, 3, 0.05).name('waves').onChange(updateScene)
  sea.add(scene, 'float', 0, 0.4, 0.01).name('float height').onChange(updateScene)
  sea.add(scene, 'drift', 0, 1, 0.01).name('sails in from').onChange(updateScene)
  sea.add(scene, 'yaw', -40, 40, 1).name('boat turn').onChange(updateScene)
  sea.close()

  const cam = gui.addFolder('Camera')
  cam.add(scene, 'boatSize', 0.2, 1.2, 0.01).name('boat size').onChange(updateScene)
  cam.add(scene, 'cameraTurn', -60, 60, 1).name('start angle').onChange(updateScene)
  cam.add(scene, 'cameraHeight', 0, 60, 1).name('start height').onChange(updateScene)
  cam.close()

  const light = gui.addFolder('Light')
  light.add(scene, 'keyLight', 0, 6, 0.05).name('main light').onChange(updateScene)
  light.add(scene, 'fillLight', 0, 3, 0.05).name('soft light').onChange(updateScene)
  light.add(scene, 'bounce', 0, 3, 0.05).name('bounce light').onChange(updateScene)
  light.add(scene, 'shadow', 0, 0.6, 0.01).onChange(updateScene)
  light.close()

  const form = gui.addFolder('Boat shape')
  form.add(shape, 'tipReach', 0.4, 0.9, 0.01).name('tip reach').onChange(updateShape)
  form.add(shape, 'tipLift', 0, 0.3, 0.005).name('tip lift').onChange(updateShape)
  form.add(shape, 'keel', 0.2, 0.5, 0.01).name('bottom length').onChange(updateShape)
  form.add(shape, 'flare', 0.02, 0.45, 0.01).name('hull width').onChange(updateShape)
  form.add(shape, 'sailSize', 0.2, 0.42, 0.005).name('sail size').onChange(updateShape)
  form.add(shape, 'hullDepth', 1, 2.5, 0.05).name('hull depth').onChange(updateShape)
  form.close()

  const view = gui.addFolder('View')
  view
    .add(preview, 'value', ['desktop', 'mobile'])
    .name('preview')
    .onChange(async () => {
      await nextTick()
      stage?.resize()
    })
  view.add(paper, 'debug').name('show crease map').onChange(updatePaper)
  view.close()

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
  gui.add(actions, 'exportDesktop').name('export page PNG (desktop)')
  gui.add(actions, 'exportMobile').name('export page PNG (mobile)')
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
          : { width: '100%', height: '100%', display: 'block' }
      "
    />
  </div>
</template>
