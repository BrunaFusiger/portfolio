import gsapImport from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type GsapModule = typeof gsapImport & { default?: typeof gsapImport }
const mod = gsapImport as GsapModule
const gsap = mod.default ?? mod

let registered = false

export const useGsap = () => {
  if (import.meta.client && !registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }

  return { gsap, ScrollTrigger }
}
