<script setup lang="ts">
defineProps<{
  image: string
  imageAlt: string
  to: string
  linkLabel: string
}>()

const emit = defineEmits<{
  dialogEnter: []
  dialogLeave: []
}>()

const tipPos = ref({ x: 0, y: 0 })
const tipVisible = ref(false)
const tooltipId = useId()

function onFooterMove(e: MouseEvent) {
  tipPos.value = { x: e.clientX, y: e.clientY }
}

function onFooterEnter(e: MouseEvent) {
  tipVisible.value = true
  tipPos.value = { x: e.clientX, y: e.clientY }
}

function onFooterLeave() {
  tipVisible.value = false
}
</script>

<template>
  <div
    class="skill-dialog relative flex h-[377px] w-[444px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-4xl bg-surface-card pb-8 pl-6 pr-6 pt-6 shadow-[4px_4px_8px_0px_rgba(0,0,0,0.16)] dark:shadow-[4px_4px_8px_0px_rgba(0,0,0,0.35)]"
    @mouseenter="emit('dialogEnter')"
    @mouseleave="emit('dialogLeave')"
  >
    <BaseCursorTooltip
      :id="tooltipId"
      :visible="tipVisible"
      :x="tipPos.x"
      :y="tipPos.y"
      :label="linkLabel"
    />

    <!-- Very subtle paper grain / wash (Figma 612-10294) -->
    <div
      class="skill-dialog__paper pointer-events-none absolute inset-0 rounded-4xl"
      aria-hidden="true"
    />

    <!-- Torn paper accent, top-left (Figma 392-3413) -->
    <div
      class="pointer-events-none absolute -left-12 -top-10 z-20 h-[104px] w-[92px] overflow-visible dark:hidden"
    >
      <TornPaperDecor
        side="left"
        class="h-full w-full"
        src="/textures/scratched-white.png"
      />
    </div>
    <div
      class="pointer-events-none absolute left-0 top-0 z-20 hidden h-[104px] w-[92px] overflow-visible dark:block"
    >
      <TornPaperDecor
        side="left"
        class="h-full w-full"
        src="/textures/scratched-white.png"
      />
    </div>

    <div class="relative z-10 flex min-h-0 flex-1 flex-col gap-6">
      <div
        class="relative min-h-0 w-full flex-1 overflow-hidden rounded-3xl bg-surface-subtle/40"
      >
        <NuxtImg
          :src="image"
          :alt="imageAlt"
          v-bind="nuxtImgRasterDefaults"
          class="absolute inset-0 size-full object-contain"
          sizes="100vw md:444px"
          loading="eager"
        />
      </div>

      <!-- Icon-only control; label in cursor tooltip + aria-label -->
      <NuxtLink
        :to="to"
        :aria-label="linkLabel"
        :aria-describedby="tipVisible ? tooltipId : undefined"
        class="group mx-auto flex w-max max-w-full cursor-pointer no-underline outline-none focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2"
        @mouseenter="onFooterEnter"
        @mousemove="onFooterMove"
        @mouseleave="onFooterLeave"
      >
        <span
          class="flex size-10 items-center justify-center rounded-full border border-surface-subtle bg-surface-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        >
          <BaseArrowOutIcon class="size-4 text-muted transition-colors group-hover:text-default" />
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.skill-dialog__paper {
  opacity: 0.055;
  background-image:
    radial-gradient(ellipse 95% 55% at 18% 12%, rgba(230, 48, 34, 0.22), transparent 58%),
    radial-gradient(ellipse 80% 50% at 82% 88%, rgba(26, 26, 26, 0.12), transparent 55%),
    repeating-linear-gradient(
      -12deg,
      transparent 0,
      transparent 3px,
      rgba(26, 26, 26, 0.04) 3px,
      rgba(26, 26, 26, 0.04) 3.5px
    );
  mix-blend-mode: multiply;
}

.dark .skill-dialog__paper {
  opacity: 0.07;
  background-image:
    radial-gradient(ellipse 90% 50% at 20% 15%, rgba(255, 255, 255, 0.14), transparent 60%),
    radial-gradient(ellipse 70% 45% at 78% 85%, rgba(255, 255, 255, 0.08), transparent 50%),
    repeating-linear-gradient(
      8deg,
      transparent 0,
      transparent 4px,
      rgba(255, 255, 255, 0.035) 4px,
      rgba(255, 255, 255, 0.035) 4.5px
    );
  mix-blend-mode: soft-light;
}
</style>
