<script setup lang="ts">
import {
  caseStudyLinkDisplayLabel,
  parseCaseStudyMarkdown,
} from '~/utils/caseStudyMarkdown'

const props = defineProps<{
  text: string
}>()

const localePath = useLocalePath()
const { t } = useI18n()

function linkDisplayLabel(label: string) {
  return caseStudyLinkDisplayLabel(label, t('work.linkHere'))
}

const segments = computed(() => parseCaseStudyMarkdown(props.text))

function isExternal(href: string) {
  return /^https?:\/\//i.test(href)
}
</script>

<template>
  <div class="flex gap-4 items-center w-full">
    <div class="size-1 shrink-0 rounded-full bg-[var(--color-text-link)]" />
    <p class="flex-1 case-study-prose">
      <template v-for="(seg, i) in segments" :key="i">
        <span v-if="seg.type === 'text'">{{ seg.value }}</span>
        <a
          v-else-if="isExternal(seg.href)"
          :href="seg.href"
          class="font-body text-link underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >{{ linkDisplayLabel(seg.label) }}</a>
        <NuxtLink
          v-else
          :to="localePath(seg.href)"
          class="font-body text-link underline underline-offset-2"
        >{{ linkDisplayLabel(seg.label) }}</NuxtLink>
      </template>
    </p>
  </div>
</template>
