import type { ComponentPublicInstance } from 'vue'

export function unwrapElement(el: Element | ComponentPublicInstance | null): HTMLElement | null {
  if (el == null) return null
  if (typeof el === 'object' && '$el' in el) {
    const node = (el as ComponentPublicInstance).$el
    return node instanceof HTMLElement ? node : null
  }
  return el instanceof HTMLElement ? el : null
}
