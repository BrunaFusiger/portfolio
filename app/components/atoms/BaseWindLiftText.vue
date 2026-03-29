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
    return [...raw]
  }
  return raw.trim() === '' ? [] : raw.trim().split(/\s+/)
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
      <span
        v-for="(ch, i) in units"
        :key="i"
        class="wind-lift__unit"
        :class="{ 'wind-lift__unit--space': ch === ' ' }"
        :style="unitStyle(i)"
      >{{ ch }}</span>
    </template>
  </span>
</template>
