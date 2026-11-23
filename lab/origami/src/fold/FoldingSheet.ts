import * as THREE from 'three'
import {
  DEFAULT_BOAT_SHAPE,
  boatShape,
  buildSheetGrid,
  foldPoint,
  type BoatShapeParams,
  type FoldAmounts,
} from './foldModel'

/**
 * The unfold, as one timeline from 0 (boat) to 1 (flat sheet).
 * Four moves, overlapping a little so it reads as one motion.
 */
export const TIMELINE = {
  boatToHat: [0, 0.3],
  brims: [0.24, 0.5],
  corners: [0.44, 0.72],
  half: [0.66, 1],
} as const

function segment(t: number, [a, b]: readonly [number, number]) {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)))
  // ease in-out, a little softer than cubic at the ends
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function poseAt(t: number) {
  return {
    boat: 1 - segment(t, TIMELINE.boatToHat),
    fold: {
      brims: 1 - segment(t, TIMELINE.brims),
      corners: 1 - segment(t, TIMELINE.corners),
      half: 1 - segment(t, TIMELINE.half),
    } satisfies FoldAmounts,
  }
}

/** Procedural fibre texture for the paper's surface. */
function makeGrainTexture(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const v = 118 + Math.random() * 20
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  ctx.globalAlpha = 0.05
  ctx.strokeStyle = 'white'
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const a = Math.random() * Math.PI
    const l = 6 + Math.random() * 24
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  return tex
}

export class FoldingSheet {
  readonly mesh: THREE.Mesh
  private material: THREE.MeshStandardMaterial
  private geometry = new THREE.BufferGeometry()
  private sheet: Float32Array
  private positions: Float32Array
  private shape: BoatShapeParams = { ...DEFAULT_BOAT_SHAPE }
  private p = { x: 0, y: 0, z: 0 }
  private q = { x: 0, y: 0, z: 0 }
  progress = 0

  constructor(paperRgb: readonly [number, number, number]) {
    const grid = buildSheetGrid(20)
    this.sheet = grid.sheet
    const count = this.sheet.length / 2
    this.positions = new Float32Array(count * 3)

    const uvs = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      uvs[i * 2] = this.sheet[i * 2] + 0.5
      uvs[i * 2 + 1] = this.sheet[i * 2 + 1] / Math.SQRT2 + 0.5
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    this.geometry.setIndex(grid.index)

    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setRGB(paperRgb[0], paperRgb[1], paperRgb[2], THREE.SRGBColorSpace),
      roughness: 0.92,
      metalness: 0,
      bumpMap: makeGrainTexture(),
      bumpScale: 0.35,
      side: THREE.DoubleSide,
      flatShading: true,
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.setProgress(0)
  }

  setShape(next: Partial<BoatShapeParams>) {
    this.shape = { ...this.shape, ...next }
    this.setProgress(this.progress)
  }

  setPaper(rgb: readonly [number, number, number]) {
    this.material.color.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace)
  }

  /** 0 = boat, 1 = flat sheet. */
  setProgress(t: number) {
    this.progress = t
    const { boat, fold } = poseAt(t)
    const { p, q } = this
    const n = this.sheet.length / 2
    for (let i = 0; i < n; i++) {
      foldPoint(this.sheet[i * 2], this.sheet[i * 2 + 1], fold, p)
      if (boat > 0) {
        q.x = p.x
        q.y = p.y
        q.z = p.z
        boatShape(q, this.shape)
        p.x += (q.x - p.x) * boat
        p.y += (q.y - p.y) * boat
        p.z += (q.z - p.z) * boat
      }
      this.positions[i * 3] = p.x
      this.positions[i * 3 + 1] = p.y
      this.positions[i * 3 + 2] = p.z
    }
    this.geometry.attributes.position.needsUpdate = true
    this.geometry.computeBoundingSphere()
  }

  dispose() {
    this.geometry.dispose()
    this.material.bumpMap?.dispose()
    this.material.dispose()
  }
}
