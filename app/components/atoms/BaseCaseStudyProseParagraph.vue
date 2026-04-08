<script setup lang="ts">
const props = defineProps<{
  text: string
}>()

const localePath = useLocalePath()

type Segment =
  | { type: 'text'; value: string }
  | { type: 'link'; label: string; href: string }

function parseParagraph(text: string): Segment[] {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  const segments: Segment[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      segments.push({ type: 'text', value: text.slice(last, m.index) })
    }
    segments.push({ type: 'link', label: m[1], href: m[2] })
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

const segments = computed(() => parseParagraph(props.text))

function isExternal(href: string) {
  return /^https?:\/\//i.test(href)
}
</script>

<template>
  <p
    class="font-body text-muted text-base leading-6 md:text-lg md:leading-7 xl:text-2xl xl:leading-7"
  >
    <template v-for="(seg, i) in segments" :key="i">
      <span v-if="seg.type === 'text'">{{ seg.value }}</span>
      <a
        v-else-if="isExternal(seg.href)"
        :href="seg.href"
        class="font-body text-link underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
      >{{ seg.label }}</a>
      <NuxtLink
        v-else
        :to="localePath(seg.href)"
        class="font-body text-link underline underline-offset-2"
      >{{ seg.label }}</NuxtLink>
    </template>
  </p>
</template>
