<template>
  <ActivitiesSwimmingDashboard />
</template>

<script setup lang="ts">
import { MAP_STATIC_DETAIL } from "~/utils/swimming/map-shared";

const { public: { baseUrl } } = useRuntimeConfig();
const ogImage = `${baseUrl}${MAP_STATIC_DETAIL}`;

useSeoMeta({
  title: "Swimming",
  description: "Open water and pool swimming stats from Garmin Connect.",
  ogTitle: "Swimming",
  ogDescription: "Open water and pool swimming stats from Garmin Connect.",
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "August swim route — 13.3 km open water course",
  ogUrl: `${baseUrl}/activities/swimming`,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterImage: ogImage,
});
</script>
