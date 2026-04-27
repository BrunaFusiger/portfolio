export function useInViewOrPriorityLoad(options: {
  hasSource: () => boolean
  priority: () => boolean
  target: Ref<HTMLElement | null>
  rootMargin?: string
}) {
  const inView = ref(false)

  const canLoad = computed(() => {
    if (!options.hasSource()) return false
    if (options.priority()) return true
    if (import.meta.server) return false
    return inView.value
  })

  useIntersectionObserver(
    options.target,
    (entries) => {
      if (entries[0]?.isIntersecting) inView.value = true
    },
    { rootMargin: options.rootMargin ?? '200px' },
  )

  return { canLoad }
}
