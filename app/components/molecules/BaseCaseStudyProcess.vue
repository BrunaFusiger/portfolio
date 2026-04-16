<script setup lang="ts">
export type CaseStudyProcessStep = {
  title: string
  text?: string
  items?: string[]
}

defineProps<{
  steps: CaseStudyProcessStep[]
}>()

function stepIndex(i: number) {
  return String(i + 1).padStart(2, '0')
}
</script>

<template>
  <div class="grid w-full md:grid-cols-2 gap-x-10 gap-y-10">
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="flex flex-col gap-3"
    >
      <span
        class="font-body text-xs font-medium tabular-nums tracking-wide text-muted/60"
        aria-hidden="true"
      >
        {{ stepIndex(i) }}
      </span>
      <h4 class="font-heading font-semibold text-default text-lg md:text-xl leading-snug">
        {{ step.title }}
      </h4>
      <p v-if="step.text" class="case-study-prose">
        {{ step.text }}
      </p>
      <ul
        v-if="step.items?.length"
        class="m-0 list-none space-y-2 p-0"
      >
        <li
          v-for="(item, j) in step.items"
          :key="j"
          class="font-body text-muted text-sm md:text-base leading-6 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.55em] before:h-px before:w-2.5 before:bg-muted/35"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
