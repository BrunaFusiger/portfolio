/**
 * Crease pattern left on the sheet after the boat in fold/foldModel.ts is unfolded.
 *
 * The boat's sheet is A4 portrait (u across, v up). On a landscape screen it lands turned
 * a quarter turn clockwise, so here it's stored landscape: x = v, y = -u.
 * The sheet is 1.4142 wide and 1 tall in this frame, centred on the origin, y up.
 * The pattern is symmetric under a half turn, so it also reads correctly on portrait screens.
 *
 * kind: +1 mountain (ridge towards the viewer), -1 valley (groove).
 * strength: how pressed the crease is (0..1).
 * fadeA / fadeB: whether the crease fades out at that end instead of running into
 * another crease or the sheet edge.
 */

export const SHEET_W = Math.SQRT2
export const SHEET_H = 1

export type Crease = {
  a: [number, number]
  b: [number, number]
  kind: 1 | -1
  strength: number
  fadeA?: boolean
  fadeB?: boolean
}

const HH = SHEET_H / 2
const BRIM = 0.5 // |v| of the brim creases in the fold model

export const BOAT_CREASES: Crease[] = [
  // 1. Folded in half (v = 0).
  { a: [0, -HH], b: [0, HH], kind: -1, strength: 1 },
  // 2. Corners folded to the centre (|u| = |v| up to the brims).
  { a: [0, 0], b: [BRIM, HH], kind: 1, strength: 0.9 },
  { a: [0, 0], b: [BRIM, -HH], kind: 1, strength: 0.9 },
  { a: [0, 0], b: [-BRIM, HH], kind: -1, strength: 0.85 },
  { a: [0, 0], b: [-BRIM, -HH], kind: -1, strength: 0.85 },
  // 3. Brims folded up (|v| = 0.5).
  { a: [BRIM, -HH], b: [BRIM, HH], kind: 1, strength: 0.8 },
  { a: [-BRIM, -HH], b: [-BRIM, HH], kind: -1, strength: 0.8 },
  // 4. Shaping the boat leaves a soft line down the middle of the sail and hull (u = 0).
  { a: [-SHEET_W / 2, 0], b: [SHEET_W / 2, 0], kind: 1, strength: 0.35 },
]

/** A few faint handling creases, so the sheet doesn't look computer perfect. */
export function strayCreases(seed: number): Crease[] {
  let s = seed * 9301 + 49297
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const out: Crease[] = []
  for (let i = 0; i < 3; i++) {
    const cx = (rnd() - 0.5) * SHEET_W * 0.9
    const cy = (rnd() - 0.5) * SHEET_H * 0.9
    const ang = rnd() * Math.PI
    const len = 0.08 + rnd() * 0.18
    const dx = (Math.cos(ang) * len) / 2
    const dy = (Math.sin(ang) * len) / 2
    out.push({
      a: [cx - dx, cy - dy],
      b: [cx + dx, cy + dy],
      kind: rnd() > 0.5 ? 1 : -1,
      strength: 0.12 + rnd() * 0.1,
      fadeA: true,
      fadeB: true,
    })
  }
  return out
}
