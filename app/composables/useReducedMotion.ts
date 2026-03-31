let shared: Ref<boolean> | null = null
let listenerCount = 0
let mql: MediaQueryList | null = null

function onChange() {
  if (shared && mql) shared.value = mql.matches
}

export function useReducedMotion(): Readonly<Ref<boolean>> {
  if (!shared) {
    shared = ref(false)
  }

  onMounted(() => {
    if (!import.meta.client) return
    if (!mql) {
      mql = window.matchMedia('(prefers-reduced-motion: reduce)')
      shared!.value = mql.matches
      mql.addEventListener('change', onChange)
    } else {
      shared!.value = mql.matches
    }
    listenerCount++
  })

  onBeforeUnmount(() => {
    listenerCount--
    if (listenerCount <= 0 && mql) {
      mql.removeEventListener('change', onChange)
      mql = null
      listenerCount = 0
    }
  })

  return readonly(shared)
}
