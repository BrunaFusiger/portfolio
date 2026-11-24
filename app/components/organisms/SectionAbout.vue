<script setup lang="ts">
import { TRAJECTORY_STOPS } from '~/constants/trajectory-stops'
</script>

<template>
  <section class="relative isolate section-space section-outer" aria-labelledby="about-title">
    <div class="section-grid relative z-10">
      <div class="col-main flex min-w-0 flex-col gap-16 md:gap-12">

        <BaseSectionTitle
          title="Behind the pixels..."
          title-id="about-title"
        />

        <BaseTrajectoryGlobe :stops="TRAJECTORY_STOPS" />

      </div>
    </div>
  </section>
</template>
