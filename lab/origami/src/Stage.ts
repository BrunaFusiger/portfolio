import * as THREE from 'three'
import { PaperBackground, type PaperSettings } from './paper/PaperBackground'
import { FoldingSheet, poseAt } from './fold/FoldingSheet'
import type { BoatShapeParams } from './fold/foldModel'

const SCALE = 2.1
const FOV = 28

export type StageSettings = {
  boatSize: number
  yaw: number
  cameraHeight: number
  cameraTurn: number
  keyLight: number
  fillLight: number
  bounce: number
  shadow: number

  sailTime: number
  unfoldTime: number
  landTime: number
  drift: number
  waves: number
  float: number
}

export const DEFAULT_STAGE: StageSettings = {
  boatSize: 0.65,
  yaw: 3,
  cameraHeight: 12,
  cameraTurn: 24,
  keyLight: 3.2,
  fillLight: 1.35,
  bounce: 1.2,
  shadow: 0.12,

  sailTime: 1.6,
  unfoldTime: 2.6,
  landTime: 1.1,
  drift: 0.35,
  waves: 1,
  float: 0.12,
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export class Stage {
  readonly renderer: THREE.WebGLRenderer
  readonly paper = new PaperBackground()
  readonly boat: FoldingSheet
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  private key = new THREE.DirectionalLight(0xffffff, 1)
  private fill = new THREE.HemisphereLight(0xffffff, 0xf2e8d5, 1)
  private bounce = new THREE.DirectionalLight(0xfff4e2, 1)
  private shadowMat = new THREE.ShadowMaterial({ opacity: 0.2 })
  private pivot = new THREE.Group()
  settings: StageSettings = { ...DEFAULT_STAGE }
  time = 0
  private raf = 0

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.autoClear = false
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    this.boat = new FoldingSheet(this.paper.paperRgb)
    this.boat.mesh.scale.setScalar(SCALE)
    this.pivot.add(this.boat.mesh)
    this.scene.add(this.pivot)

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), this.shadowMat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    this.key.position.set(-3.5, 6, 2.5)
    this.key.castShadow = true
    this.key.shadow.mapSize.set(2048, 2048)
    this.key.shadow.radius = 6
    this.key.shadow.bias = -0.0004
    const sc = this.key.shadow.camera
    sc.left = sc.bottom = -3
    sc.right = sc.top = 3
    sc.near = 1
    sc.far = 20
    this.bounce.position.set(0.5, 0.6, 4)
    this.scene.add(this.key, this.fill, this.bounce)

    this.apply({})
  }

  get times() {
    const s = this.settings
    const unfoldStart = s.sailTime * 0.8
    const unfoldEnd = unfoldStart + s.unfoldTime
    const landStart = unfoldEnd - Math.min(0.3, s.unfoldTime * 0.12)
    const end = landStart + s.landTime
    return { unfoldStart, unfoldEnd, landStart, end }
  }

  get duration() {
    return this.times.end
  }

  setTime(time: number) {
    this.time = time
    const s = this.settings
    const { unfoldStart, landStart } = this.times
    const landscape = this.canvas.clientWidth >= this.canvas.clientHeight

    const sail = clamp01(time / s.sailTime)
    const unfold = clamp01((time - unfoldStart) / s.unfoldTime)
    const land = easeInOut(clamp01((time - landStart) / s.landTime))
    const calm = 1 - smooth(0, 0.35, unfold)
    const turn = easeInOut(unfold)

    this.boat.setProgress(unfold)
    const open = 1 - poseAt(unfold).fold.half
    const w = s.waves * calm
    const bob = Math.sin(time * 2 * Math.PI * 0.6) * 0.035 * SCALE * w
    const standY = SCALE * (0.5 + (Math.SQRT2 / 2 - 0.5) * open)
    this.pivot.position.set(
      -s.drift * 2.4 * SCALE * (1 - easeOut(sail)),
      standY + s.float * SCALE * calm + bob,
      0,
    )
    this.pivot.rotation.set(
      THREE.MathUtils.degToRad(3.5 * w * Math.sin(time * 2 * Math.PI * 0.45 + 1.2)),
      THREE.MathUtils.degToRad(s.yaw * calm),
      THREE.MathUtils.degToRad(4.5 * w * Math.sin(time * 2 * Math.PI * 0.38)) +
        (landscape ? -Math.PI / 2 : 0) * land,
    )

    const aspect = this.camera.aspect
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const startDist = (2 * 0.62 * SCALE) / s.boatSize / (2 * tan * Math.min(1, aspect))
    const sheetW = (landscape ? Math.SQRT2 : 1) * SCALE
    const sheetH = (landscape ? 1 : Math.SQRT2) * SCALE
    const coverDist = Math.min(sheetH, sheetW / aspect) / (2 * tan)
    const dist = lerp(startDist, coverDist, land)

    const az = THREE.MathUtils.degToRad(lerp(s.cameraTurn, 0, turn))
    const el = THREE.MathUtils.degToRad(lerp(s.cameraHeight, 0, turn))
    const box = this.boat.bounds
    const midY = ((box.min.y + box.max.y) / 2) * SCALE
    const target = new THREE.Vector3(0, standY + s.float * SCALE * calm + midY, 0)
    this.camera.position.set(
      target.x + Math.sin(az) * Math.cos(el) * dist,
      target.y + Math.sin(el) * dist,
      target.z + Math.cos(az) * Math.cos(el) * dist,
    )
    this.camera.lookAt(target)

    const pageColour = smooth(0, 0.6, land)
    this.key.intensity = s.keyLight * lerp(1, 0.55, turn) * (1 - pageColour)
    this.fill.intensity = s.fillLight * (1 - pageColour)
    this.bounce.intensity = s.bounce * (1 - pageColour)
    this.boat.setPageColour(pageColour)

    this.boat.setOpacity(1 - smooth(0.55, 1, land))
    this.paper.setCreases(smooth(0.35, 1, land))
    this.shadowMat.opacity = s.shadow * (1 - turn)

    this.render()
  }

  play(onFrame?: (time: number) => void) {
    this.stop()
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(this.duration, (now - start) / 1000)
      this.setTime(t)
      onFrame?.(t)
      if (t < this.duration) this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  stop() {
    cancelAnimationFrame(this.raf)
  }

  skip() {
    this.stop()
    this.setTime(this.duration)
  }

  apply(next: Partial<StageSettings>) {
    this.settings = { ...this.settings, ...next }
    this.resize()
  }

  applyPaper(next: Partial<PaperSettings>) {
    this.paper.apply(next)
    this.boat.setPaper(this.paper.paperRgb)
    this.resize()
  }

  applyShape(next: Partial<BoatShapeParams>) {
    this.boat.setShape(next)
    this.setTime(this.time)
  }

  resize() {
    const w = this.canvas.clientWidth || 1
    const h = this.canvas.clientHeight || 1
    this.renderer.setSize(w, h, false)
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2())
    this.paper.setSize(size.x, size.y)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.setTime(Math.min(this.time, this.duration))
  }

  render() {
    this.renderer.clear()
    this.renderer.render(this.paper.scene, this.paper.camera)
    this.renderer.render(this.scene, this.camera)
  }

  exportPaperPng(width: number, height: number): string {
    const ratio = this.renderer.getPixelRatio()
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(width, height, false)
    this.paper.setSize(width, height)
    this.paper.setCreases(1)
    this.renderer.clear()
    this.renderer.render(this.paper.scene, this.paper.camera)
    const url = this.canvas.toDataURL('image/png')
    this.renderer.setPixelRatio(ratio)
    this.resize()
    return url
  }

  dispose() {
    this.stop()
    this.boat.dispose()
    this.paper.dispose()
    this.renderer.dispose()
  }
}
