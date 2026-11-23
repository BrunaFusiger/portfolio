import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PaperBackground, type PaperSettings } from './paper/PaperBackground'
import { FoldingSheet, poseAt } from './fold/FoldingSheet'
import type { BoatShapeParams } from './fold/foldModel'

/** World size of the sheet model (the boat is about 1.2 x this long). */
const SCALE = 2.1

export type StageSettings = {
  showBoat: boolean
  /** Boat length as a share of the viewport's short side. */
  boatSize: number
  yaw: number
  cameraHeight: number
  keyLight: number
  fillLight: number
  /** Light bouncing back from the table and the sheet, keeps shaded paper light. */
  bounce: number
  shadow: number
}

export const DEFAULT_STAGE: StageSettings = {
  showBoat: true,
  boatSize: 1,
  yaw: 3,
  cameraHeight: 12,
  keyLight: 3.2,
  fillLight: 1.35,
  bounce: 1.2,
  shadow: 0.12,
}

const FOV = 28

/** One renderer: the paper sheet first, then the 3D scene with the boat on top. */
export class Stage {
  readonly renderer: THREE.WebGLRenderer
  readonly paper = new PaperBackground()
  readonly boat: FoldingSheet
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  private controls: OrbitControls
  private key = new THREE.DirectionalLight(0xffffff, 1)
  private fill = new THREE.HemisphereLight(0xffffff, 0xf2e8d5, 1)
  private bounce = new THREE.DirectionalLight(0xfff4e2, 1)
  private shadowMat = new THREE.ShadowMaterial({ opacity: 0.2 })
  private boatPivot = new THREE.Group()
  settings: StageSettings = { ...DEFAULT_STAGE }

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.autoClear = false
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    this.boat = new FoldingSheet(this.paper.paperRgb)
    this.boat.mesh.scale.setScalar(SCALE)
    this.boatPivot.add(this.boat.mesh)
    this.boatPivot.position.y = SCALE * 0.5
    this.scene.add(this.boatPivot)

    // Ground that only shows the boat's shadow, so the paper sheet stays visible.
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
    sc.left = sc.bottom = -2.5
    sc.right = sc.top = 2.5
    sc.near = 1
    sc.far = 20
    this.bounce.position.set(0.5, 0.6, 4)
    this.scene.add(this.key, this.fill, this.bounce)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.target.set(0, SCALE * 0.25, 0)
    this.controls.enableDamping = false
    this.controls.enablePan = false
    this.controls.addEventListener('change', () => this.render())

    this.apply({})
  }

  apply(next: Partial<StageSettings>) {
    this.settings = { ...this.settings, ...next }
    const s = this.settings
    this.boatPivot.visible = s.showBoat
    this.boatPivot.rotation.y = THREE.MathUtils.degToRad(s.yaw)
    this.key.intensity = s.keyLight
    this.fill.intensity = s.fillLight
    this.bounce.intensity = s.bounce
    this.shadowMat.opacity = s.shadow
    this.resize(true)
  }

  applyPaper(next: Partial<PaperSettings>) {
    this.paper.apply(next)
    this.boat.setPaper(this.paper.paperRgb)
    this.resize()
  }

  applyShape(next: Partial<BoatShapeParams>) {
    this.boat.setShape(next)
    this.render()
  }

  /** 0 = boat, 1 = flat sheet. */
  setProgress(t: number) {
    this.boat.setProgress(t)
    // The boat sits on its bottom; as the half fold opens, the sheet stands on its lower edge.
    const open = 1 - poseAt(t).fold.half
    this.boatPivot.position.y = SCALE * (0.5 + (Math.SQRT2 / 2 - 0.5) * open)
    this.render()
  }

  private raf = 0

  /** Plays the unfold from the start. Calls onFrame with the progress on every frame. */
  play(duration: number, onFrame?: (t: number) => void) {
    this.stop()
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      this.setProgress(t)
      onFrame?.(t)
      if (t < 1) this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  stop() {
    cancelAnimationFrame(this.raf)
  }

  /** Places the camera so the boat fills the chosen share of the screen. */
  private frameCamera() {
    const w = this.canvas.clientWidth || 1
    const h = this.canvas.clientHeight || 1
    this.camera.aspect = w / h
    const halfLen = 0.62 * SCALE
    const visibleShort = (2 * halfLen) / this.settings.boatSize
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const dist = visibleShort / (2 * tan * Math.min(1, this.camera.aspect))
    const el = THREE.MathUtils.degToRad(this.settings.cameraHeight)
    const t = this.controls.target
    this.camera.position.set(t.x, t.y + Math.sin(el) * dist, t.z + Math.cos(el) * dist)
    this.camera.updateProjectionMatrix()
    this.controls.update()
  }

  resize(reframe = false) {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    this.renderer.setSize(w, h, false)
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2())
    this.paper.setSize(size.x, size.y)
    if (reframe || this.camera.aspect !== w / h) this.frameCamera()
    this.render()
  }

  render() {
    this.renderer.clear()
    this.renderer.render(this.paper.scene, this.paper.camera)
    this.renderer.render(this.scene, this.camera)
  }

  /** The paper alone at a fixed size, for the static background image. */
  exportPaperPng(width: number, height: number): string {
    const ratio = this.renderer.getPixelRatio()
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(width, height, false)
    this.paper.setSize(width, height)
    this.renderer.clear()
    this.renderer.render(this.paper.scene, this.paper.camera)
    const url = this.canvas.toDataURL('image/png')
    this.renderer.setPixelRatio(ratio)
    this.resize()
    return url
  }

  dispose() {
    this.stop()
    this.controls.dispose()
    this.boat.dispose()
    this.paper.dispose()
    this.renderer.dispose()
  }
}
