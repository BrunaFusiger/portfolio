<template>
  <div>
    <div class="relative isolate w-full">
      <div
        class="pointer-events-none absolute z-10 hidden h-80 w-80 -left-50 top-30 lg:block"
        aria-hidden="true"
      >
        <TornPaperDecor side="left" />
      </div>
      <SectionHero class="relative z-1" />
    </div>
    <SectionWork />
    <SectionSkills />
    <SectionAbout />
    <SectionContact />
    <SectionGarden />
  </div>
</template>

