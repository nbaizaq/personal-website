<template>
  <div class="max-w-6xl mx-auto pb-8">
    <header class="pt-2 mb-6">
      <h1 class="text-3xl font-bold text-primary-950">Swimming</h1>
      <p class="text-gray-500 mt-1">Your performance at a glance</p>
    </header>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Swimming",
  description: "Open water and pool swimming stats from Garmin Connect.",
});
</script>
