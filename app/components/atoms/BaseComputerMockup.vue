<script setup lang="ts">
type ScreenInset = {
  top: number
  left: number
  right: number
  bottom: number
}

const props = withDefaults(
  defineProps<{
    /** Frame asset (transparent PNG). */
    mockupSrc?: string
    /** Tall screenshot or asset shown inside the screen; uses @nuxt/image (`NuxtImg`). */
    screenImageSrc?: string
    /** Optional video URL inside the screen (mutually exclusive with image in typical use). */
    screenVideoSrc?: string
    alt?: string
    caption?: string
    /** Inset from the mockup edges, in percent of the frame’s box (0–100). */
    screenInset?: Partial<ScreenInset>
  }>(),
  {
    mockupSrc: '/media/utils/laptop-mockup.png',
  },
)

/** Measured cutout for `computer-mockup.png` (1536×1024). */
const DEFAULT_INSET_COMPUTER: ScreenInset = {
  top: 12.79,
  left: 5.79,
  right: 22.98,
  bottom: 14.84,
}

/**
 * Tight inner panel for `laptop-mockup.png` (1536×1024): darkest glass only
 * (darkest pixels only, lum under 8), so the mask sits inside the bezel.
 */
const DEFAULT_INSET_LAPTOP: ScreenInset = {
  top: 20,
  left: 18.6,
  right: 18.6,
  bottom: 26,
}

const baseInset = computed((): ScreenInset => {
  const src = props.mockupSrc ?? ''
  if (src.includes('computer-mockup')) return DEFAULT_INSET_COMPUTER
  return DEFAULT_INSET_LAPTOP
})

/** Match the laptop glass corner radius at different scales (~10–14px on the 1536px-wide asset). */
const screenRadiusClass = 'rounded-[clamp(7px,0.85vw,12px)]'

const effectiveInset = computed(() => ({
  ...baseInset.value,
  ...props.screenInset,
}))

const screenBoxStyle = computed(() => ({
  top: `${effectiveInset.value.top}%`,
  left: `${effectiveInset.value.left}%`,
  right: `${effectiveInset.value.right}%`,
  bottom: `${effectiveInset.value.bottom}%`,
}))

const showImage = computed(() => Boolean(props.screenImageSrc?.trim()))
const showVideo = computed(() => Boolean(props.screenVideoSrc?.trim()))
const showCaption = computed(() => Boolean(props.caption?.trim()))

const scrollRegionLabel = computed(() => props.alt?.trim() || 'Screen content')
</script>

<template>
  <figure class="w-full">
    <div class="relative w-full max-w-full select-none leading-none">
      <NuxtImg
        :src="mockupSrc"
        alt=""
        class="pointer-events-none relative z-0 block h-auto w-full max-w-full align-top"
        loading="lazy"
        decoding="async"
      />
      <div
        class="absolute z-10 min-h-0 min-w-0 overflow-hidden bg-black"
        :class="screenRadiusClass"
        :style="screenBoxStyle"
      >
        <div
          class="box-border h-full max-h-full min-h-0 min-w-0 w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:thin]"
          tabindex="0"
          role="region"
          :aria-label="scrollRegionLabel"
        >
          <slot>
            <NuxtImg
              v-if="showImage"
              :src="screenImageSrc!"
              :alt="alt ?? ''"
              class="block h-auto w-full max-w-full min-w-0 align-top"
              sizes="(max-width: 768px) 85vw, 900px"
              loading="lazy"
              decoding="async"
            />
            <video
              v-else-if="showVideo"
              :src="screenVideoSrc"
              class="block h-auto w-full max-w-full align-top"
              muted
              loop
              playsinline
              controls
            />
            <div
              v-else
              class="flex min-h-[120px] w-full items-center justify-center bg-neutral-900"
            >
              <span class="font-heading text-[10px] font-medium uppercase tracking-widest text-white/40 px-4 text-center md:text-xs">
                Screen content
              </span>
            </div>
          </slot>
        </div>
      </div>
    </div>
    <figcaption
      v-if="showCaption"
      class="font-body mt-4 max-w-prose text-sm leading-6 text-subtle md:text-base"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
