export function useIntersectionObserver(
  target: Ref<HTMLElement | null> | (() => HTMLElement | null),
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) {
  let observer: IntersectionObserver | null = null

  function cleanup() {
    observer?.disconnect()
    observer = null
  }

  onMounted(() => {
    if (!import.meta.client) return
    nextTick(() => {
      const el = typeof target === 'function' ? target() : target.value
      if (!el || typeof IntersectionObserver === 'undefined') return

      observer = new IntersectionObserver(callback, options)
      observer.observe(el)
    })
  })

  onBeforeUnmount(cleanup)

  return { stop: cleanup }
}
