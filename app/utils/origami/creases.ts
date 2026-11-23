export const SHEET_W = Math.SQRT2
export const SHEET_H = 1

export type CreaseKind = 1 | -1

export type Crease = {
  a: [number, number]
  b: [number, number]
  kind: CreaseKind
  strength: number
  fadeA?: boolean
  fadeB?: boolean
}

const MOUNTAIN: CreaseKind = 1
const VALLEY: CreaseKind = -1
const HALF_H = SHEET_H / 2
const BRIM_OFFSET = 0.5

export const BOAT_CREASES: Crease[] = [
  { a: [0, -HALF_H], b: [0, HALF_H], kind: VALLEY, strength: 1 },
  { a: [0, 0], b: [BRIM_OFFSET, HALF_H], kind: MOUNTAIN, strength: 0.9 },
  { a: [0, 0], b: [BRIM_OFFSET, -HALF_H], kind: MOUNTAIN, strength: 0.9 },
  { a: [0, 0], b: [-BRIM_OFFSET, HALF_H], kind: VALLEY, strength: 0.85 },
  { a: [0, 0], b: [-BRIM_OFFSET, -HALF_H], kind: VALLEY, strength: 0.85 },
  { a: [BRIM_OFFSET, -HALF_H], b: [BRIM_OFFSET, HALF_H], kind: MOUNTAIN, strength: 0.8 },
  { a: [-BRIM_OFFSET, -HALF_H], b: [-BRIM_OFFSET, HALF_H], kind: VALLEY, strength: 0.8 },
  { a: [-SHEET_W / 2, 0], b: [SHEET_W / 2, 0], kind: MOUNTAIN, strength: 0.35 },
]

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
      kind: rnd() > 0.5 ? MOUNTAIN : VALLEY,
      strength: 0.12 + rnd() * 0.1,
      fadeA: true,
      fadeB: true,
    })
  }
  return out
}
