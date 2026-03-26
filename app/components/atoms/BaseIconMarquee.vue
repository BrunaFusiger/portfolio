<script setup lang="ts">
/**
 * Each icon's source image has different dimensions and internal whitespace.
 * The `scale` value compensates so they all appear the same visual size,
 * derived from the original Figma overflow-sizing percentages.
 */
const toolsLeft = [
  { name: 'Notion', src: '/images/tools/notion.webp', scale: 'scale-115' },
  { name: 'Figma', src: '/images/tools/figma.webp', scale: 'scale-170' },
  { name: 'Adobe', src: '/images/tools/adobe.webp', scale: 'scale-170' },
  { name: 'Linear', src: '/images/tools/linear.webp', scale: 'scale-170' },
  { name: 'Directus', src: '/images/tools/directus.webp', scale: 'scale-150' },
]

const toolsRight = [
  { name: 'VS Code', src: '/images/tools/vscode.webp', scale: 'scale-115' },
  { name: 'Claude', src: '/images/tools/claude.webp', scale: 'scale-115' },
  { name: 'GitHub', src: '/images/tools/github.webp', scale: 'scale-120' },
  { name: 'Cursor', src: '/images/tools/cursor.webp', scale: 'scale-120' },
  { name: 'Nuxt', src: '/images/tools/nuxt.webp', scale: 'scale-140' },
]
</script>

<template>
  <div
    class="relative overflow-hidden rounded-4xl bg-surface-card border border-transparent dark:border-surface-subtle h-[136px] w-full max-w-[358px] md:max-w-[544px]"
  >
    <NuxtImg
      src="/images/tools/red-icon-tools.webp"
      alt=""
      aria-hidden="true"
      width="136"
      height="136"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[136px] object-cover z-1"
    />

    <div class="absolute left-[22px] md:left-[52px] top-0 flex flex-col marquee-scroll-up">
      <div
        v-for="cycle in 2"
        :key="`left-${cycle}`"
        class="flex flex-col gap-4 shrink-0"
      >
        <div
          v-for="tool in toolsLeft"
          :key="`${cycle}-${tool.name}`"
          class="size-[88px] md:size-[130px] shrink-0 overflow-hidden flex items-center justify-center"
        >
          <NuxtImg
            :src="tool.src"
            :alt="tool.name"
            width="130"
            height="130"
            loading="lazy"
            :class="['size-full object-contain', tool.scale]"
          />
        </div>
      </div>
    </div>

    <div class="absolute right-[22px] md:right-[52px] top-0 flex flex-col marquee-scroll-down" aria-hidden="true">
      <div
        v-for="cycle in 2"
        :key="`right-${cycle}`"
        class="flex flex-col gap-4 shrink-0"
      >
        <div
          v-for="tool in toolsRight"
          :key="`${cycle}-${tool.name}`"
          class="size-[88px] md:size-[130px] shrink-0 overflow-hidden flex items-center justify-center"
        >
          <NuxtImg
            :src="tool.src"
            :alt="tool.name"
            width="130"
            height="130"
            loading="lazy"
            :class="['size-full object-contain', tool.scale]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
