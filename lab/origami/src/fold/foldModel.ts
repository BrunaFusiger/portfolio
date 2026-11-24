export const SHEET_W = 1
export const SHEET_H = Math.SQRT2
export const BRIM = 0.5
const EPS = 0.0025

export type FoldAmounts = {
  half: number
  corners: number
  brims: number
}

export type BoatShapeParams = {
  tipReach: number
  keel: number
  flare: number
  tipLift: number
  sailSize: number
  hullDepth: number
}

export const DEFAULT_BOAT_SHAPE: BoatShapeParams = {
  tipReach: 0.62,
  keel: 0.38,
  flare: 0.24,
  tipLift: 0.12,
  sailSize: 0.32,
  hullDepth: 1.5,
}

type V3 = { x: number; y: number; z: number }

function rotX(p: V3, cy: number, a: number) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const y = p.y - cy
  const z = p.z
  p.y = cy + y * c - z * s
  p.z = y * s + z * c
}

function rotAxis(p: V3, dx: number, dy: number, a: number) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const cx = dy * p.z
  const cy = -dx * p.z
  const cz = dx * p.y - dy * p.x
  const dot = dx * p.x + dy * p.y
  p.x = p.x * c + cx * s + dx * dot * (1 - c)
  p.y = p.y * c + cy * s + dy * dot * (1 - c)
  p.z = p.z * c + cz * s
}

export function foldPoint(u: number, v: number, f: FoldAmounts, out: V3): V3 {
  out.x = u
  out.y = v
  out.z = 0
  const top = v > 0

  if (v < -BRIM) {
    rotX(out, -BRIM, -Math.PI * f.brims)
    out.z += 3 * EPS * f.brims
  } else if (v > BRIM) {
    rotX(out, BRIM, Math.PI * f.brims)
    out.z += EPS * f.brims
  } else if (Math.abs(u) > Math.abs(v)) {
    const dx = Math.sign(u) / Math.SQRT2
    const dy = (top ? 1 : -1) / Math.SQRT2
    const toward = top ? -1 : 1
    const turn = dx * v - dy * u
    const sign = toward * Math.sign(turn || 1)
    rotAxis(out, dx, dy, sign * Math.PI * f.corners)
    out.z += toward * (top ? 3 : 1) * EPS * f.corners
  }

  if (top) {
    rotX(out, 0, -Math.PI * f.half)
    out.z -= EPS * f.half
  }
  return out
}

export function boatShape(p: V3, s: BoatShapeParams) {
  const dip = -s.sailSize
  const side = p.z >= 0 ? 1 : -1
  const a = Math.min(1, Math.abs(p.x) / 0.5)
  const e = a * a

  if (p.y < dip) {
    const h = Math.min(1, Math.max(0, (dip - p.y) / (dip + 0.5)))
    const up = (1 - h) * e
    p.x *= s.keel / 0.5 + (s.tipReach / 0.5 - s.keel / 0.5) * up
    p.y = dip - (dip - p.y) * s.hullDepth + s.tipLift * up * e

    const edge = s.sailSize / 0.5
    const underSail = Math.min(1, Math.max(0, (edge * 1.15 - a) / (edge * 0.3)))
    const open = 1 - h
    const slim = 0.22 * (h < 0.5 ? h * 2 : (1 - h) * 2)
    const profile = open + (slim - open) * underSail
    p.z += side * s.flare * profile * (1 - a)
  } else {
    p.z += side * 0.004
  }

  const keelY = dip - (dip + 0.5) * s.hullDepth
  p.y += -0.5 - keelY
}

export function valueAt(values: ArrayLike<number>, index: number): number {
  const value = values[index]
  if (value === undefined) throw new RangeError(`No value at index ${index}`)
  return value
}

export function buildSheetGrid(stepsPerHalf = 20) {
  const d = 0.5 / stepsPerHalf
  const us: number[] = []
  for (let i = -stepsPerHalf; i <= stepsPerHalf; i++) us.push(i * d)
  const vs: number[] = [-SHEET_H / 2]
  const k = Math.floor(SHEET_H / 2 / d - 1e-6)
  for (let j = -k; j <= k; j++) vs.push(j * d)
  vs.push(SHEET_H / 2)

  const cols = us.length
  const rows = vs.length
  const uv = new Float32Array(cols * rows * 2)
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      uv[(j * cols + i) * 2] = valueAt(us, i)
      uv[(j * cols + i) * 2 + 1] = valueAt(vs, j)
    }
  }

  const index: number[] = []
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = j * cols + i
      const b = a + 1
      const c = a + cols
      const dd = c + 1
      const cu = (valueAt(us, i) + valueAt(us, i + 1)) / 2
      const cv = (valueAt(vs, j) + valueAt(vs, j + 1)) / 2
      if (cu * cv > 0) {
        index.push(a, b, dd, a, dd, c)
      } else {
        index.push(a, b, c, b, dd, c)
      }
    }
  }
  return { sheet: uv, index, cols, rows }
}
