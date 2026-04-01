import { CASE_STUDIES, isCaseStudySlug } from '~/constants/case-studies-data'

const STORAGE_KEY = 'case-studies-opened'

function readOpened(): string[] {
  if (import.meta.server) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function writeOpened(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(slugs)]))
}

/** Persist a visit to a known case study page (client only). */
export function recordCaseStudyOpened(slug: string) {
  if (import.meta.server || !isCaseStudySlug(slug)) return
  const opened = readOpened()
  if (!opened.includes(slug)) {
    opened.push(slug)
    writeOpened(opened)
  }
}

/**
 * Random slug among case studies not in localStorage; if all visited, clears storage and picks from full list.
 */
export function pickRandomUnvisitedSlug(): string {
  const opened = new Set(readOpened())
  let candidates = CASE_STUDIES.filter((c) => !opened.has(c.slug))
  if (candidates.length === 0) {
    writeOpened([])
    candidates = [...CASE_STUDIES]
  }
  const i = Math.floor(Math.random() * candidates.length)
  return candidates[i]!.slug
}
