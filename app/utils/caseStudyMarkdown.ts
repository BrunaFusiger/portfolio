/** Markdown link labels shown via `work.linkHere` for the active locale. */
export const CASE_STUDY_LINK_HERE_LABELS = new Set(['here', 'aqui', 'qui', 'hier'])

export type CaseStudyMarkdownSegment =
  | { type: 'text'; value: string }
  | { type: 'link'; label: string; href: string }

/** Parses `[label](href)` segments (same rules as case study prose). */
export function parseCaseStudyMarkdown(text: string): CaseStudyMarkdownSegment[] {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  const segments: CaseStudyMarkdownSegment[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      segments.push({ type: 'text', value: text.slice(last, m.index) })
    }
    segments.push({ type: 'link', label: m[1], href: m[2] })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last) })
  }
  if (!segments.length) {
    segments.push({ type: 'text', value: text })
  }
  return segments
}

export function caseStudyLinkDisplayLabel(label: string, linkHereTranslation: string) {
  if (CASE_STUDY_LINK_HERE_LABELS.has(label.trim().toLowerCase())) return linkHereTranslation
  return label
}
