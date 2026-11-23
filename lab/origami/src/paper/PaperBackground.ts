import * as THREE from 'three'
import fragmentShader from './paper.frag.glsl?raw'
import { BOAT_CREASES, SHEET_H, SHEET_W, strayCreases, type Crease } from './creases'

const MAX_CREASES = 32

const vertexShader =  `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const PAPER_TONES = {
  'Warm white': [0.972, 0.965, 0.948],
  'Cool white': [0.962, 0.964, 0.962],
  Cream: [0.966, 0.949, 0.912],
} as const

export type PaperTone = keyof typeof PAPER_TONES

export type PaperSettings = {
  tone: PaperTone
  fit: 'cover' | 'contain'
  orientation: 'auto' | 'landscape' | 'portrait'
  margin: number
  lightAngle: number
  lightElevation: number
  depth: number
  spread: number
  sharp: number
  line: number
  contrast: number
  warp: number
  grain: number
  fibre: number
  stray: boolean
  seed: number
  strength: number
  debug: boolean
}

export const DEFAULT_SETTINGS: PaperSettings = {
  tone: 'Cream',
  fit: 'cover',
  orientation: 'auto',
  margin: 0.02,
  lightAngle: 179,
  lightElevation: 71,
  depth: 0.43,
  spread: 0.055,
  sharp: 0.0026,
  line: 0.085,
  contrast: 0.1,
  warp: 0.65,
  grain: 0.06,
  fibre: 0.04,
  stray: true,
  seed: 24,
  strength: 0.4,
  debug: false,
}

export class PaperBackground {
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.Camera()
  private material: THREE.ShaderMaterial
  private size = new THREE.Vector2(1, 1)
  settings: PaperSettings = { ...DEFAULT_SETTINGS }

  constructor() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uRes: { value: new THREE.Vector2() },
        uSheet: { value: new THREE.Vector2(SHEET_W, SHEET_H) },
        uFit: { value: 0 },
        uMargin: { value: 0 },
        uRotate: { value: 0 },
        uSeg: { value: Array.from({ length: MAX_CREASES }, () => new THREE.Vector4()) },
        uInfo: { value: Array.from({ length: MAX_CREASES }, () => new THREE.Vector4()) },
        uCount: { value: 0 },
        uPaper: { value: new THREE.Vector3() },
        uBg: { value: new THREE.Vector3(0.86, 0.855, 0.84) },
        uLight: { value: new THREE.Vector3() },
        uSeed: { value: 0 },
        uDepth: { value: 0 },
        uSpread: { value: 0 },
        uSharp: { value: 0 },
        uLine: { value: 0 },
        uContrast: { value: 0 },
        uWarp: { value: 0 },
        uGrain: { value: 0 },
        uFibre: { value: 0 },
        uCreases: { value: 1 },
        uStrength: { value: 1 },
        uDebug: { value: 0 },
      },
    })
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material))
    this.apply(this.settings)
  }

  get paperRgb(): readonly [number, number, number] {
    return PAPER_TONES[this.settings.tone]
  }

  apply(next: Partial<PaperSettings>) {
    this.settings = { ...this.settings, ...next }
    const s = this.settings
    const u = this.material.uniforms

    const creases: Crease[] = [...BOAT_CREASES, ...(s.stray ? strayCreases(s.seed) : [])].slice(
      0,
      MAX_CREASES,
    )
    creases.forEach((c, i) => {
      u.uSeg.value[i].set(c.a[0], c.a[1], c.b[0], c.b[1])
      u.uInfo.value[i].set(c.kind, c.strength, c.fadeA ? 1 : 0, c.fadeB ? 1 : 0)
    })
    u.uCount.value = creases.length

    const [r, g, b] = PAPER_TONES[s.tone]
    u.uPaper.value.set(r, g, b)
    u.uFit.value = s.fit === 'contain' ? 1 : 0
    u.uMargin.value = s.margin

    const az = THREE.MathUtils.degToRad(s.lightAngle)
    const el = THREE.MathUtils.degToRad(s.lightElevation)
    u.uLight.value.set(Math.cos(az) * Math.cos(el), Math.sin(az) * Math.cos(el), Math.sin(el))

    u.uSeed.value = s.seed
    u.uDepth.value = s.depth
    u.uSpread.value = s.spread
    u.uSharp.value = s.sharp
    u.uLine.value = s.line
    u.uContrast.value = s.contrast
    u.uWarp.value = s.warp
    u.uGrain.value = s.grain
    u.uFibre.value = s.fibre
    u.uStrength.value = s.strength
    u.uDebug.value = s.debug ? 1 : 0
    this.setSize(this.size.x, this.size.y)
  }

  setSize(width: number, height: number) {
    this.size.set(width, height)
    this.material.uniforms.uRes.value.set(width, height)
    const o = this.settings.orientation
    const portrait = o === 'portrait' || (o === 'auto' && height > width)
    this.material.uniforms.uRotate.value = portrait ? 1 : 0
  }

  setCreases(amount: number) {
    this.material.uniforms.uCreases.value = amount
  }

  dispose() {
    this.material.dispose()
  }
}
