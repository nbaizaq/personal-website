<template>
  <div class="flex flex-col md:flex-row gap-3">
    <div
      class="relative isolate w-full md:flex-[2] min-w-0 h-[360px] md:h-[420px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
    >
      <img
        :src="MAP_STATIC_DETAIL"
        alt="Swim route — detail"
        width="1200"
        height="630"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <span
        class="absolute bottom-3 left-3 z-10 text-[0.65rem] font-semibold uppercase tracking-wide text-white/90 bg-black/40 rounded px-2 py-0.5 pointer-events-none"
      >
        Route detail
      </span>
    </div>

    <div
      class="relative isolate w-full md:flex-1 min-w-0 h-[280px] md:h-[420px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
    >
      <img
        :src="MAP_STATIC_OVERVIEW"
        alt="Swim route — regional context"
        width="640"
        height="630"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <span
        class="absolute bottom-3 left-3 z-10 text-[0.65rem] font-semibold uppercase tracking-wide text-white/90 bg-black/40 rounded px-2 py-0.5 pointer-events-none"
      >
        Regional scale
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MAP_STATIC_DETAIL,
  MAP_STATIC_OVERVIEW,
} from "~/utils/swimming/map-shared";
</script>
