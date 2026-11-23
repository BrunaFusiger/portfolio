import type { Ref } from 'vue'
import { computed } from 'vue'

type CollectionName = 'caseStudies' | 'garden'

export function contentEntryMatchesSlug(
  doc: { stem?: string } | null | undefined,
  pathPrefix: string,
  slug: string,
): boolean {
  if (!doc?.stem) return false
  return doc.stem.endsWith(`/${pathPrefix}/${slug}`)
}

export function useContentEntry<C extends CollectionName>(
  collectionName: C,
  pathPrefix: string,
  slug: Ref<string>,
  keyPrefix: string,
) {
  const asyncDataKey = computed(() => `${keyPrefix}-${slug.value}`)

  return useLazyAsyncData(
    asyncDataKey,
    () =>
      queryCollection(collectionName)
        .where('stem', '=', `en/${pathPrefix}/${slug.value}`)
        .first(),
    { default: () => null },
  )
}
