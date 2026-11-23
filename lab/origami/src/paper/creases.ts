/**
 * Crease pattern left on the sheet after a paper boat is unfolded.
 *
 * Units: the sheet is A4 landscape, 1.4142 wide and 1 tall, centred on the origin, y up.
 * kind: +1 mountain (ridge towards the viewer), -1 valley (groove).
 * strength: how pressed the crease is (0..1).
 * fadeA / fadeB: whether the crease fades out at that end (it stopped mid-sheet)
 * instead of running into another crease or the sheet edge.
 *
 * Provisional: the steps after the hat are approximated. When the fold model is built
 * (lab step 1.3), this list will be generated from it so the background matches the fold.
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

const HW = SHEET_W / 2
const HH = SHEET_H / 2
/** Height of the brim strip on each half. */
const BRIM = 0.12
const C = HH - BRIM

export const BOAT_CREASES: Crease[] = [
  // 1. Fold in half, top to bottom.
  { a: [-HW, 0], b: [HW, 0], kind: -1, strength: 1 },
  // 2. Centre crease, left to right (a soft reference fold).
  { a: [0, -HH], b: [0, HH], kind: 1, strength: 0.55 },
  // 3. Top corners folded down to the centre line, through both layers.
  { a: [0, 0], b: [-HH, HH], kind: -1, strength: 0.9 },
  { a: [0, 0], b: [HH, HH], kind: -1, strength: 0.9 },
  { a: [0, 0], b: [-HH, -HH], kind: 1, strength: 0.85 },
  { a: [0, 0], b: [HH, -HH], kind: 1, strength: 0.85 },
  // 4. Brims folded up, front and back.
  { a: [-HW, C], b: [HW, C], kind: 1, strength: 0.8 },
  { a: [-HW, -C], b: [HW, -C], kind: -1, strength: 0.8 },
  // 5. Brim corners tucked around the hat.
  { a: [-C - 0.02, C], b: [-C - 0.02, HH], kind: -1, strength: 0.45 },
  { a: [C + 0.02, C], b: [C + 0.02, HH], kind: -1, strength: 0.45 },
  { a: [-C - 0.02, -C], b: [-C - 0.02, -HH], kind: 1, strength: 0.45 },
  { a: [C + 0.02, -C], b: [C + 0.02, -HH], kind: 1, strength: 0.45 },
  // 6. Hat opened into a square, bottom corners folded up (approximated).
  { a: [-HW, C * 0.5], b: [-C, C * 0.5], kind: 1, strength: 0.5, fadeB: true },
  { a: [C, C * 0.5], b: [HW, C * 0.5], kind: 1, strength: 0.5, fadeA: true },
  { a: [-HW, -C * 0.5], b: [-C, -C * 0.5], kind: -1, strength: 0.5, fadeB: true },
  { a: [C, -C * 0.5], b: [HW, -C * 0.5], kind: -1, strength: 0.5, fadeA: true },
  // 7. Pulled open into the boat: hull creases (approximated).
  { a: [-HW, -0.02], b: [-C, C], kind: -1, strength: 0.4 },
  { a: [HW, -0.02], b: [C, C], kind: -1, strength: 0.4 },
  { a: [-HW, 0.02], b: [-C, -C], kind: 1, strength: 0.4 },
  { a: [HW, 0.02], b: [C, -C], kind: 1, strength: 0.4 },
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
