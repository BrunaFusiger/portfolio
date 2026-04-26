import type { Ref } from 'vue'
import { computed } from 'vue'

type CollectionName = 'caseStudies' | 'garden'

export async function useLocalizedContentEntry<C extends CollectionName>(
  collectionName: C,
  pathPrefix: string,
  slug: Ref<string>,
  keyPrefix: string,
) {
  const { locale } = useI18n()

  /** Reactive key so slug/locale changes get correct cache entries (static key + `watch` was wrong). */
  const asyncDataKey = computed(() => `${keyPrefix}-${slug.value}-${locale.value}`)

  return useAsyncData(
    asyncDataKey,
    async () => {
      // Fire the locale-specific and English-fallback queries in parallel; the
      // fallback only runs for non-EN locales. Prefer the locale row, else fallback.
      const [primary, fallback] = await Promise.all([
        queryCollection(collectionName)
          .where('stem', '=', `${locale.value}/${pathPrefix}/${slug.value}`)
          .first(),
        locale.value !== 'en'
          ? queryCollection(collectionName)
              .where('stem', '=', `en/${pathPrefix}/${slug.value}`)
              .first()
          : Promise.resolve(null),
      ])
      return primary ?? fallback ?? null
    },
  )
}
