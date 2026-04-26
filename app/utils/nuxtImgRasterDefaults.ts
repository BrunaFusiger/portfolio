/**
 * Shared defaults for raster `<NuxtImg>` (WebP, quality, async decode).
 * Merge with `v-bind="nuxtImgRasterDefaults"` and add per-image `sizes`, `loading`, `class`, etc.
 */
export const nuxtImgRasterDefaults = {
  format: 'webp' as const,
  quality: 90,
  decoding: 'async' as const,
}
