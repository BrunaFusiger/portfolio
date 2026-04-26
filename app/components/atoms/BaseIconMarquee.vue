<script setup lang="ts">
const toolsLeft = [
  { name: 'Notion', src: '/media/tools/notion.png' },
  { name: 'Figma', src: '/media/tools/figma.png' },
  { name: 'Jitter', src: '/media/tools/jitter.png' },
  { name: 'Adobe', src: '/media/tools/adobe.png' },
  { name: 'Linear', src: '/media/tools/linear.png' },
  { name: 'Directus', src: '/media/tools/directus.png' },
]

const toolsRight = [
  { name: 'VS Code', src: '/media/tools/vscode.png' },
  { name: 'Claude', src: '/media/tools/claude.png' },
  { name: 'GitHub', src: '/media/tools/github.png' },
  { name: 'Cursor', src: '/media/tools/cursor.png' },
  { name: 'Nuxt', src: '/media/tools/nuxt.png' },
]
</script>

<template>
  <div
    class="relative overflow-hidden rounded-4xl bg-surface-card border border-transparent dark:border-surface-subtle h-[136px] w-full max-w-[358px] md:max-w-[544px]"
  >
    <NuxtImg
      src="/media/tools/red-icon-tools.webp"
      alt=""
      aria-hidden="true"
      v-bind="nuxtImgRasterDefaults"
      width="136"
      height="136"
      sizes="136px"
      densities="x1 x2"
      loading="lazy"
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
            v-bind="nuxtImgRasterDefaults"
            width="130"
            height="130"
            sizes="88px md:130px"
            densities="x1 x2"
            loading="lazy"
            class="size-full object-contain"
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
            v-bind="nuxtImgRasterDefaults"
            width="130"
            height="130"
            sizes="88px md:130px"
            densities="x1 x2"
            loading="lazy"
            class="size-full object-contain"
          />
        </div>
      </div>
    </div>
  </div>
</template>
