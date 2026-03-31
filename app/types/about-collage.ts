import type { StoryPhoto, TapePosition } from '~/constants/about-stories'

export type AboutCollageStoryPin = {
  kind: 'pin'
  textKey: string
  photos: readonly StoryPhoto[]
  pinStyle: { left: string; top: string }
  pinShiftClass: string
}

export type AboutCollageStoryTapes = {
  kind: 'tapes'
  textKey: string
  photos: readonly StoryPhoto[]
  tapes: readonly TapePosition[]
}

export type AboutCollageStory = AboutCollageStoryPin | AboutCollageStoryTapes
