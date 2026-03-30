<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()

const skills = computed(() => [
  {
    key: 'userCentered',
    icon: 'user-star',
    slug: 'intentional-design',
    image: '/images/work/euvetia-quiz.webp',
  },
  {
    key: 'designThinking',
    icon: 'search',
    slug: 'design-thinking',
    image: '/images/work/euvetia-design-thinking.webp',
  },
  {
    key: 'b2bSaas',
    icon: 'computer',
    slug: 'zycreate',
    image: '/images/work/zycreate.webp',
  },
  {
    key: 'startupPace',
    icon: 'rocket',
    slug: 'zyhub',
    image: '/images/work/zyhub.webp',
  },
  {
    key: 'figmaMcp',
    icon: 'ai',
    slug: 'figma-mcp',
    image: '/images/work/design-system.webp',
  },
  {
    key: 'designSystems',
    icon: 'grid',
    slug: 'seasonal-planting',
    image: '/images/work/swissonal.webp',
  },
])
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

      <!-- Desktop: 2-column grid -->
      <div class="hidden md:grid md:grid-cols-2 gap-x-8 gap-y-12 w-full max-w-[736px]">
        <BaseSkillItem
          v-for="skill in skills"
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
            <!-- user-star -->
            <svg v-if="skill.icon === 'user-star'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.67 14v-1.33A2.67 2.67 0 0 0 8 10H4.67A2.67 2.67 0 0 0 2 12.67V14" />
              <circle cx="6.33" cy="5.33" r="2.67" />
              <path d="M12 5.33l.67 1.34L14 7.33l-1.33.67-.67 1.33-.67-1.33L10 7.33l1.33-.66z" />
            </svg>
            <!-- search -->
            <svg v-else-if="skill.icon === 'search'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M14 14l-3.2-3.2" />
            </svg>
            <!-- computer -->
            <svg v-else-if="skill.icon === 'computer'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1.5" y="2.5" width="13" height="8.5" rx="1" />
              <path d="M5.5 14h5M8 11v3" />
            </svg>
            <!-- rocket -->
            <svg v-else-if="skill.icon === 'rocket'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 12.67s-2-1.34-3.33-4C3.33 6 4 2.67 8 1.33c4 1.34 4.67 4.67 3.33 7.34-1.33 2.66-3.33 4-3.33 4z" />
              <circle cx="8" cy="6" r="1.33" />
              <path d="M5.33 10.67L3.33 14l2.67-.67M10.67 10.67L12.67 14l-2.67-.67" />
            </svg>
            <!-- ai -->
            <svg v-else-if="skill.icon === 'ai'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="8" cy="8" r="2" />
              <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.76 3.76l1.41 1.41M10.83 10.83l1.41 1.41M3.76 12.24l1.41-1.41M10.83 5.17l1.41-1.41" />
            </svg>
            <!-- grid/more -->
            <svg v-else-if="skill.icon === 'grid'" class="size-3 text-muted" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="4" cy="4" r="1.2" />
              <circle cx="8" cy="4" r="1.2" />
              <circle cx="12" cy="4" r="1.2" />
              <circle cx="4" cy="8" r="1.2" />
              <circle cx="8" cy="8" r="1.2" />
              <circle cx="12" cy="8" r="1.2" />
              <circle cx="4" cy="12" r="1.2" />
              <circle cx="8" cy="12" r="1.2" />
              <circle cx="12" cy="12" r="1.2" />
            </svg>
          </template>
        </BaseSkillItem>
      </div>

      <!-- Mobile: Accordion -->
      <div class="md:hidden w-full flex flex-col items-center border-x-0 border-t-0">
        <div class="w-full flex flex-col border-x-0 border-t-0">
          <BaseSkillItem
            v-for="skill in skills"
            :key="`mobile-${skill.key}`"
            :title="t(`skills.items.${skill.key}.title`)"
            :description="t(`skills.items.${skill.key}.description`)"
            :dialog-description="t(`skills.items.${skill.key}.dialogDescription`)"
            :image="skill.image"
            :image-alt="t(`skills.items.${skill.key}.title`)"
            :to="localePath(`/work/${skill.slug}`)"
            :link-label="t('skills.readCaseStudy')"
          >
            <template #icon>
              <svg v-if="skill.icon === 'user-star'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.67 14v-1.33A2.67 2.67 0 0 0 8 10H4.67A2.67 2.67 0 0 0 2 12.67V14" />
                <circle cx="6.33" cy="5.33" r="2.67" />
                <path d="M12 5.33l.67 1.34L14 7.33l-1.33.67-.67 1.33-.67-1.33L10 7.33l1.33-.66z" />
              </svg>
              <svg v-else-if="skill.icon === 'search'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M14 14l-3.2-3.2" />
              </svg>
              <svg v-else-if="skill.icon === 'computer'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1.5" y="2.5" width="13" height="8.5" rx="1" />
                <path d="M5.5 14h5M8 11v3" />
              </svg>
              <svg v-else-if="skill.icon === 'rocket'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 12.67s-2-1.34-3.33-4C3.33 6 4 2.67 8 1.33c4 1.34 4.67 4.67 3.33 7.34-1.33 2.66-3.33 4-3.33 4z" />
                <circle cx="8" cy="6" r="1.33" />
                <path d="M5.33 10.67L3.33 14l2.67-.67M10.67 10.67L12.67 14l-2.67-.67" />
              </svg>
              <svg v-else-if="skill.icon === 'ai'" class="size-3 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="8" r="2" />
                <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.76 3.76l1.41 1.41M10.83 10.83l1.41 1.41M3.76 12.24l1.41-1.41M10.83 5.17l1.41-1.41" />
              </svg>
              <svg v-else-if="skill.icon === 'grid'" class="size-3 text-muted" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="4" cy="4" r="1.2" />
                <circle cx="8" cy="4" r="1.2" />
                <circle cx="12" cy="4" r="1.2" />
                <circle cx="4" cy="8" r="1.2" />
                <circle cx="8" cy="8" r="1.2" />
                <circle cx="12" cy="8" r="1.2" />
                <circle cx="4" cy="12" r="1.2" />
                <circle cx="8" cy="12" r="1.2" />
                <circle cx="12" cy="12" r="1.2" />
              </svg>
            </template>
          </BaseSkillItem>
        </div>
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
