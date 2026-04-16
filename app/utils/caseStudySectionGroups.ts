/**
 * Splits flat case study `sections` into visual groups:
 * - `type: sectionBreak` starts a new group (renders nothing; use between any blocks).
 * - `type: heading` starts a new group (heading is the first item in that group).
 * - Other blocks append to the current group.
 *
 * A single block can be its own group by placing `sectionBreak` before it (and after
 * the previous group, if any).
 */
export function groupCaseStudySections<T extends { type: string }>(sections: T[]): T[][] {
  const groups: T[][] = []
  let current: T[] = []

  const flush = () => {
    if (current.length) {
      groups.push(current)
      current = []
    }
  }

  for (const item of sections) {
    if (item.type === 'sectionBreak') {
      flush()
      continue
    }
    if (item.type === 'heading') {
      flush()
      current.push(item)
      continue
    }
    current.push(item)
  }
  flush()
  return groups
}
