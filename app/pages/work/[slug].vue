<script setup lang="ts">
import { isCaseStudySlug } from '~/constants/case-studies-data'
import { recordCaseStudyOpened } from '~/composables/useCaseStudyVisitState'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

onMounted(() => {
  const s = slug.value
  if (isCaseStudySlug(s)) recordCaseStudyOpened(s)
})
</script>

<template>
  <main class="min-h-screen flex items-center justify-center p-8">
    <h1 class="font-heading font-black text-[48px] text-default" v-text="slug" />
  </main>
</template>
