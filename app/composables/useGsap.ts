import gsapModule from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const gsap =
  'default' in gsapModule ? ((gsapModule as any).default as typeof gsapModule) : gsapModule

let registered = false

export const useGsap = () => {
  if (import.meta.client && !registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }

  return { gsap, ScrollTrigger }
}
