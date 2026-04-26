<script setup lang="ts">
import { SKILLS } from '~/constants/skills-data'

const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <SectionBase variant="wide">
    <div class="relative flex w-full flex-col items-center gap-16">
      <div
        class="relative w-full border-0 rounded-none md:overflow-hidden md:rounded-4xl md:border md:border-2 md:border-surface-subtle"
      >
        <BaseRulesRulerDecoration side="left" />
        <BaseRulesRulerDecoration side="right" />
        <div
          class="relative z-1 flex w-full flex-col items-center gap-16 py-16 px-4 md:px-10 lg:px-0"
        >
      <BaseSectionTitle :title="t('skills.title')">
        <template #description>{{ t('skills.description') }}</template>
      </BaseSectionTitle>

      <BaseIconMarquee />

      <div
        class="w-full max-w-[736px] grid grid-cols-1 gap-y-0 gap-x-8 md:grid-cols-2 md:gap-y-12"
      >
        <BaseSkillItem
          v-for="skill in SKILLS"
          :key="skill.key"
          :title="t(`skills.items.${skill.key}.title`)"
          :description="t(`skills.items.${skill.key}.description`)"
          :dialog-description="t(`skills.items.${skill.key}.dialogDescription`)"
          :image="skill.image"
          :image-alt="t(`skills.items.${skill.key}.title`)"
          :to="localePath(`/work/${skill.slug}`)"
          :link-label="t('skills.readCaseStudy')"
        >
          <template #icon>
            <BaseSkillIcon :name="skill.icon" />
          </template>
        </BaseSkillItem>
      </div>
        </div>
      </div>

      <span
        class="pointer-events-none absolute hidden md:block -top-10 z-20 w-[min(32vw,9.5rem)] origin-top-right rotate-10 -right-16"
        aria-hidden="true"
      >
        <BaseTape alt="" sizes="152px" />
      </span>
      <span
        class="pointer-events-none absolute -bottom-14 -left-20  z-20 w-[min(36vw,10.5rem)] origin-bottom-left rotate-10 max-md:hidden"
        aria-hidden="true"
      >
        <BaseTape alt="" sizes="168px" />
      </span>
    </div>
  </SectionBase>
</template>
