export function useRouteLoading(threshold = 130, minDisplay = 250) {
  const { isLoading } = useLoadingIndicator()
  const isVisible = ref(false)
  let showTimer: ReturnType<typeof setTimeout> | null = null
  let shownAt = 0

  watch(isLoading, (loading) => {
    if (loading) {
      if (showTimer) clearTimeout(showTimer)
      showTimer = setTimeout(() => {
        isVisible.value = true
        shownAt = performance.now()
      }, threshold)
      return
    }
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }
    if (!isVisible.value) return
    const elapsed = performance.now() - shownAt
    setTimeout(() => {
      isVisible.value = false
    }, Math.max(0, minDisplay - elapsed))
  })

  return { isVisible }
}
