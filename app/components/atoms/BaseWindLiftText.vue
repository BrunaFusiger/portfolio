<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    splitBy?: 'word' | 'char'
    wrapperClass?: string
  }>(),
  { splitBy: 'word', wrapperClass: '' },
)

const units = computed(() => {
  const raw = props.text ?? ''
  if (props.splitBy === 'char') {
    return []
  }
  return raw.trim() === '' ? [] : raw.trim().split(/\s+/)
})

/** Groups characters by word so inline-block units do not break mid-word (wrap only at whitespace). */
const charSegments = computed(() => {
  if (props.splitBy !== 'char') return []
  const raw = props.text ?? ''
  type Seg =
    | { kind: 'word'; chars: string[]; start: number }
    | { kind: 'space'; chars: string[]; start: number }
  const segments: Seg[] = []
  let i = 0
  let globalIndex = 0
  while (i < raw.length) {
    const c = raw[i]!
    if (/\s/.test(c)) {
      const chars: string[] = []
      while (i < raw.length && /\s/.test(raw[i]!)) {
        chars.push(raw[i]!)
        i++
      }
      segments.push({ kind: 'space', chars, start: globalIndex })
      globalIndex += chars.length
    } else {
      const chars: string[] = []
      while (i < raw.length && !/\s/.test(raw[i]!)) {
        chars.push(raw[i]!)
        i++
      }
      segments.push({ kind: 'word', chars, start: globalIndex })
      globalIndex += chars.length
    }
  }
  return segments
})

function delayMs(index: number) {
  return index * 12 + (index % 3) * 4
}

function unitStyle(index: number) {
  return { '--wind-delay': `${delayMs(index)}ms` } as Record<string, string>
}
</script>

<template>
  <span :class="['wind-lift', wrapperClass]">
    <template v-if="splitBy === 'word'">
      <template v-for="(word, i) in units" :key="i">
        <span class="wind-lift__unit" :style="unitStyle(i)">{{ word }}</span>{{ i < units.length - 1 ? ' ' : '' }}
      </template>
    </template>
    <template v-else>
      <template v-for="(seg, si) in charSegments" :key="si">
        <span v-if="seg.kind === 'word'" class="wind-lift__word">
          <span
            v-for="(ch, ci) in seg.chars"
            :key="ci"
            class="wind-lift__unit"
            :style="unitStyle(seg.start + ci)"
          >{{ ch }}</span>
        </span>
        <template v-else>
          <span
            v-for="(ch, ci) in seg.chars"
            :key="ci"
            class="wind-lift__unit wind-lift__unit--space"
            :style="unitStyle(seg.start + ci)"
          >{{ ch }}</span>
        </template>
      </template>
    </template>
  </span>
</template>
