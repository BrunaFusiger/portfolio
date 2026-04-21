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
  <p class="case-study-prose">
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
</template>
