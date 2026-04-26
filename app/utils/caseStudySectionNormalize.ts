import { toRaw } from 'vue'
import type { CaseStudyBlock, MediaAspect, MediaMaxWidth } from '~/types/case-study'

const VALID_ASPECT = new Set<string>(['16/9', '4/3', '4/5', 'square', '9/16', 'auto'])
const VALID_MAX_WIDTH = new Set<string>(['xs', 'sm', 'md'])

function cloneMediaVideoBlock(block: CaseStudyBlock): Record<string, unknown> {
  const raw = toRaw(block) as Record<string, unknown>
  try {
    return structuredClone(raw) as Record<string, unknown>
  } catch {
    return { ...raw }
  }
}

/** Resolve max width from camelCase, kebab/snake case, or any key that normalizes to `maxwidth`. */
function readMaxWidth(b: Record<string, unknown>): string | undefined {
  const direct = [b.maxWidth, b['max-width'], b.max_width]
  for (const c of direct) {
    if (typeof c === 'string' && VALID_MAX_WIDTH.has(c)) return c
  }
  for (const key of Object.keys(b)) {
    const norm = key.toLowerCase().replace(/_/g, '')
    if (norm === 'maxwidth') {
      const v = b[key]
      if (typeof v === 'string' && VALID_MAX_WIDTH.has(v)) return v
    }
  }
  return undefined
}

/**
 * Repairs common case-study section mistakes before render:
 * - `aspect: xs|sm|md` (invalid aspect) → `maxWidth` + `aspect: auto`
 * - alternate keys from tooling (`max-width`, `max_width`, odd casing)
 */
export function normalizeCaseStudySectionBlock(block: CaseStudyBlock): CaseStudyBlock {
  if (block.type !== 'media' && block.type !== 'video') return block

  const b = cloneMediaVideoBlock(block)

  const mw = readMaxWidth(b)
  if (mw) b.maxWidth = mw as MediaMaxWidth

  const rawAspect = b.aspect
  if (typeof rawAspect === 'string') {
    if (VALID_MAX_WIDTH.has(rawAspect) && !VALID_ASPECT.has(rawAspect)) {
      if (b.maxWidth == null) b.maxWidth = rawAspect as MediaMaxWidth
      b.aspect = 'auto' as MediaAspect
    } else if (!VALID_ASPECT.has(rawAspect) && !VALID_MAX_WIDTH.has(rawAspect)) {
      delete b.aspect
    }
  }

  return b as CaseStudyBlock
}
