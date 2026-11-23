/**
 * The classic paper boat, folded from an A4 sheet, worked out as hinges.
 *
 * Sheet space: A4 portrait, 1 wide and √2 tall, centred on the origin, v up.
 * The flat sheet lies in the x-y plane facing the camera (+z).
 *
 * Folds, in the order you'd make them:
 *   1. half    top half folded down behind the bottom half (crease v = 0)
 *   2. corners top corners folded down to the centre line, both layers (creases |u| = |v|)
 *   3. brims   bottom strips folded up, front one forward, back one backward (creases |v| = 0.5)
 * That gives the hat: apex at (0, 0), base at y = -0.5.
 *
 * The boat is then a shaping of the hat (see boatShape). It isn't the exact real move,
 * which needs the paper to open into a square twice, but it keeps every point of the
 * sheet in one place, so the boat can collapse into the hat without anything jumping.
 *
 * Every fold is applied to the flat sheet point in reverse order (brims, corners, half),
 * each as a rotation about its crease. Later folds ride along with earlier ones, so any
 * mix of fold amounts gives a valid pose.
 */

export const SHEET_W = 1
export const SHEET_H = Math.SQRT2
export const BRIM = 0.5 // |v| of the brim creases
const EPS = 0.0025 // gap between stacked layers

export type FoldAmounts = {
  half: number // 0 = open, 1 = folded
  corners: number
  brims: number
}

export type BoatShapeParams = {
  /** Half length of the boat at the tips. */
  tipReach: number
  /** Half length of the bottom. */
  keel: number
  /** How far the hull opens at its widest. */
  flare: number
  /** How far the tips rise. */
  tipLift: number
  /** Height of the sail, measured down from the hat's tip (the sail keeps its right angle). */
  sailSize: number
  /** How much deeper the hull is than the hat's band below the sail. */
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

/** Rotate p about the x axis through (0, cy, 0). */
function rotX(p: V3, cy: number, a: number) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const y = p.y - cy
  const z = p.z
  p.y = cy + y * c - z * s
  p.z = y * s + z * c
}

/** Rotate p about the unit axis d (in the x-y plane) through the origin. Rodrigues. */
function rotAxis(p: V3, dx: number, dy: number, a: number) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  // d × p, with d = (dx, dy, 0)
  const cx = dy * p.z
  const cy = -dx * p.z
  const cz = dx * p.y - dy * p.x
  const dot = dx * p.x + dy * p.y
  p.x = p.x * c + cx * s + dx * dot * (1 - c)
  p.y = p.y * c + cy * s + dy * dot * (1 - c)
  p.z = p.z * c + cz * s
}

/** Where sheet point (u, v) sits for the given fold amounts. */
export function foldPoint(u: number, v: number, f: FoldAmounts, out: V3): V3 {
  out.x = u
  out.y = v
  out.z = 0
  const top = v > 0

  if (v < -BRIM) {
    // front brim: up and forward, outermost layer at the front
    rotX(out, -BRIM, -Math.PI * f.brims)
    out.z += 3 * EPS * f.brims
  } else if (v > BRIM) {
    // back brim: up and backward (the top half's own front face ends up at the back)
    rotX(out, BRIM, Math.PI * f.brims)
    out.z += EPS * f.brims
  } else if (Math.abs(u) > Math.abs(v)) {
    // corner flap, folded to the front of the whole stack
    const dx = Math.sign(u) / Math.SQRT2
    // points on the half crease (v = 0) belong to the bottom half, like `top` says
    const dy = (top ? 1 : -1) / Math.SQRT2
    const toward = top ? -1 : 1 // in the top half's own frame, the front is -z
    const turn = dx * v - dy * u // z of d × p
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

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Shapes a point of the folded hat into the boat. Works in place.
 *
 * The sail is the hat's own tip, so it keeps its right angle like a real paper boat.
 * Below it, the hull walls bulge out and pinch back together into the sail in the middle,
 * and stay open towards the ends: those are the two pockets.
 */
export function boatShape(p: V3, s: BoatShapeParams) {
  const dip = -s.sailSize // where the sail meets the hull, in hat coordinates
  const side = p.z >= 0 ? 1 : -1
  const a = Math.min(1, Math.abs(p.x) / 0.5) // 0 at the middle, 1 at the ends
  const e = a * a

  if (p.y < dip) {
    // 0 at the sail's base, 1 at the bottom
    const h = Math.min(1, Math.max(0, (dip - p.y) / (dip + 0.5)))
    const up = (1 - h) * e
    p.x *= s.keel / 0.5 + (s.tipReach / 0.5 - s.keel / 0.5) * up
    p.y = dip - (dip - p.y) * s.hullDepth + s.tipLift * up * e

    // Under the sail the walls stay slim and run straight up into it; further out
    // they open into the pockets. Straight lines only, so the paper stays flat.
    const edge = s.sailSize / 0.5 // the sail's half width at its base, in the same units as a
    const underSail = Math.min(1, Math.max(0, (edge * 1.15 - a) / (edge * 0.3)))
    const open = 1 - h
    const slim = 0.22 * (h < 0.5 ? h * 2 : (1 - h) * 2)
    const profile = open + (slim - open) * underSail
    p.z += side * s.flare * profile * (1 - a)
  } else {
    // the two sail layers, almost touching
    p.z += side * 0.004
  }

  // keep the bottom where the hat's base was, so the boat sits on the same ground
  const keelY = dip - (dip + 0.5) * s.hullDepth
  p.y += -0.5 - keelY
}

/**
 * Builds the sheet grid. The grid step divides 0.5 so the brim and half creases are grid
 * lines, and each cell is split along the diagonal that matches the corner creases,
 * so every fold lands on a mesh edge.
 */
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
      uv[(j * cols + i) * 2] = us[i]
      uv[(j * cols + i) * 2 + 1] = vs[j]
    }
  }

  const index: number[] = []
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = j * cols + i
      const b = a + 1
      const c = a + cols
      const dd = c + 1
      const cu = (us[i] + us[i + 1]) / 2
      const cv = (vs[j] + vs[j + 1]) / 2
      if (cu * cv > 0) {
        // split along a-dd ( / )
        index.push(a, b, dd, a, dd, c)
      } else {
        // split along b-c ( \ )
        index.push(a, b, c, b, dd, c)
      }
    }
  }
  return { sheet: uv, index, cols, rows }
}
