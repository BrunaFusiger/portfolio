export function useMediaQuery(
  query: string,
  options?: { defaultValue?: boolean },
): Readonly<Ref<boolean>> {
  const matches = ref(options?.defaultValue ?? false)
  let mql: MediaQueryList | null = null

  function sync() {
    if (mql) matches.value = mql.matches
  }

  onMounted(() => {
    if (!import.meta.client) return
    mql = window.matchMedia(query)
    matches.value = mql.matches
    mql.addEventListener('change', sync)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', sync)
    mql = null
  })

  return readonly(matches)
}
