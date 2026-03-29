/**
 * Swiper FreeMode emits `_freeModeStaticRelease`; `swiper/vue` omits it from `emits`.
 * Re-apply after every `bun install` / `npm install`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const target = path.join(root, 'node_modules', 'swiper', 'swiper-vue.mjs')

if (!fs.existsSync(target)) {
  console.warn('[patch-swiper-vue-emits] swiper not installed, skip')
  process.exit(0)
}

let s = fs.readFileSync(target, 'utf8')
const patched =
  "'_freeModeNoMomentumRelease', '_freeModeStaticRelease', '_virtualUpdated'"
const needle = "'_freeModeNoMomentumRelease', '_virtualUpdated'"

if (s.includes(patched)) {
  process.exit(0)
}

if (!s.includes(needle)) {
  console.error(
    '[patch-swiper-vue-emits] swiper-vue.mjs format changed; update the patch script.',
  )
  process.exit(1)
}

fs.writeFileSync(target, s.replace(needle, patched))
