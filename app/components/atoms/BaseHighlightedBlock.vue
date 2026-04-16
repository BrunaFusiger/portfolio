<script setup lang="ts">
const props = defineProps<{
  text: string
}>()

type Segment = { type: 'text'; value: string } | { type: 'em'; value: string }

function parseEmphasis(text: string): Segment[] {
  const segments: Segment[] = []
  const re = /\*([^*]+)\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      segments.push({ type: 'text', value: text.slice(last, m.index) })
    }
    segments.push({ type: 'em', value: m[1] ?? '' })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last) })
  }
  if (!segments.length) {
    segments.push({ type: 'text', value: text })
  }
  return segments
}

const segments = computed(() => parseEmphasis(props.text))
</script>

<template>
  <div class="bg-surface-subtle flex items-center justify-center p-6 md:p-8 rounded-[32px] w-full">
    <p class="case-study-prose">
      <template v-for="(seg, i) in segments" :key="i">
        <em v-if="seg.type === 'em'">{{ seg.value }}</em>
        <span v-else>{{ seg.value }}</span>
      </template>
    </p>
  </div>
</template>
