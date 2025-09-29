<template>
  <div>
    <div class="flex gap-2 flex-wrap text-xs">
      <a
        class="flex gap-1 items-center shrink-0 hover:text-primary-500"
        href="http://github.com/nbaizaq"
      >
        <i class="pi pi-github !text-sm" />
      </a>
      <a
        class="flex gap-1 items-center shrink-0 hover:text-primary-500"
        href="http://www.linkedin.com/in/nbaizaq"
      >
        <i class="pi pi-linkedin !text-sm" />
      </a>
      <a
        class="flex gap-1 items-center shrink-0 hover:text-primary-500"
        :href="useRuntimeConfig().public.baseUrl"
      >
        <i class="pi pi-globe !text-sm" /> nbaizaq.github.io
      </a>
      <a
        class="flex gap-1 items-center shrink-0 hover:text-primary-500"
        href="https://t.me/nbaizaq"
      >
        <i class="pi pi-telegram !text-sm" /> nbaizaq
      </a>
      <a
        class="flex gap-1 items-center shrink-0 hover:text-primary-500"
        href="tel:+996558826282"
      >
        <i class="pi pi-phone !text-sm" /> +996 558 826-282
      </a>
      <a
        class="flex gap-1 items-center shrink-0 hover:text-primary-500"
        href="mailto:n.baizakof@gmail.com"
      >
        <i class="pi pi-at !text-sm" /> n.baizakof@gmail.com
      </a>
    </div>
    <div class="flex gap-2 items-center text-sm mt-2">
      <div class="flex gap-1 items-center shrink-0 text-gray-700">
        <i class="pi pi-map-marker !text-sm" /> Bishkek, Kyrgyzstan
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
