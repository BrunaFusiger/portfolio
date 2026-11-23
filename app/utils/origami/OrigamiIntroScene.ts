import * as THREE from 'three'
import { FoldingSheet, poseAt } from './FoldingSheet'
import { INTRO, PAPER } from './paperSettings'

const SCALE = 2.1
const FOV = 28

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const UNFOLD_START = INTRO.sailTime * 0.8
const LAND_START = UNFOLD_START + INTRO.unfoldTime - Math.min(0.3, INTRO.unfoldTime * 0.12)
const INTRO_END = LAND_START + INTRO.landTime

export type IntroOptions = {
  onCreases: (amount: number) => void
  light?: boolean
}

export class OrigamiIntroScene {
  private renderer: THREE.WebGLRenderer
  private boat: FoldingSheet
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  private key = new THREE.DirectionalLight(0xffffff, 1)
  private fill = new THREE.HemisphereLight(0xffffff, 0xf2e8d5, 1)
  private bounce = new THREE.DirectionalLight(0xfff4e2, 1)
  private shadowMat = new THREE.ShadowMaterial({ opacity: INTRO.shadow })
  private groundGeometry = new THREE.PlaneGeometry(20, 20)
  private pivot = new THREE.Group()
  private target = new THREE.Vector3()
  private raf = 0
  private time = 0

  readonly duration = INTRO_END

  constructor(
    private canvas: HTMLCanvasElement,
    private options: IntroOptions,
  ) {
    const light = options.light ?? false
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !light, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, light ? 1.5 : 2))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    this.boat = new FoldingSheet(PAPER.colour, light ? 12 : 20)
    this.boat.mesh.scale.setScalar(SCALE)
    this.pivot.add(this.boat.mesh)
    this.scene.add(this.pivot)

    const shadowOnlyGround = new THREE.Mesh(this.groundGeometry, this.shadowMat)
    shadowOnlyGround.rotation.x = -Math.PI / 2
    shadowOnlyGround.receiveShadow = true
    this.scene.add(shadowOnlyGround)

    this.key.position.set(-3.5, 6, 2.5)
    this.key.castShadow = true
    const map = light ? 1024 : 2048
    this.key.shadow.mapSize.set(map, map)
    this.key.shadow.radius = 6
    this.key.shadow.bias = -0.0004
    const sc = this.key.shadow.camera
    sc.left = sc.bottom = -3
    sc.right = sc.top = 3
    sc.near = 1
    sc.far = 20
    this.bounce.position.set(0.5, 0.6, 4)
    this.scene.add(this.key, this.fill, this.bounce)

    this.resize()
  }

  setTime(time: number) {
    this.time = time
    const s = INTRO
    const landscape = this.canvas.clientWidth >= this.canvas.clientHeight

    const sail = clamp01(time / s.sailTime)
    const unfold = clamp01((time - UNFOLD_START) / s.unfoldTime)
    const land = easeInOut(clamp01((time - LAND_START) / s.landTime))
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
    const target = this.target.set(0, standY + s.float * SCALE * calm + midY, 0)
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
    this.options.onCreases(smooth(0.35, 1, land))
    this.shadowMat.opacity = s.shadow * (1 - turn)

    this.renderer.render(this.scene, this.camera)
  }

  play(onDone: () => void) {
    this.stop()
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(this.duration, (now - start) / 1000)
      this.setTime(t)
      if (t < this.duration) this.raf = requestAnimationFrame(tick)
      else onDone()
    }
    this.raf = requestAnimationFrame(tick)
  }

  stop() {
    cancelAnimationFrame(this.raf)
  }

  resize() {
    const w = this.canvas.clientWidth || 1
    const h = this.canvas.clientHeight || 1
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.setTime(this.time)
  }

  dispose() {
    this.stop()
    this.boat.dispose()
    this.shadowMat.dispose()
    this.groundGeometry.dispose()
    this.key.dispose()
    this.bounce.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}
