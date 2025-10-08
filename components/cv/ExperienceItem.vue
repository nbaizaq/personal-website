<template>
  <div
    :id="props.experience.id"
    :class="props.experience.pageBreak ? 'print:break-after-page' : ''"
    class="mb-4"
  >
    <div class="text-lg font-semibold">
      {{ props.experience.title }}
    </div>
    <div>
      {{ props.experience.company }}
    </div>
    <div class="text-sm" :class="isPresent ? 'text-primary-500' : 'text-gray-800'">
      {{ workingPeriod }}
    </div>
    <div
      v-if="props.experience.location"
      class="text-sm flex items-center gap-1 text-gray-500 font-medium"
    >
      {{ props.experience.location }}
    </div>
    <div class="mt-2">
      <ul class="mt-2 list-disc pl-4" v-if="props.experience.responsibilities">
        <li
          v-for="responsibility in props.experience.responsibilities"
          class="text-sm py-1"
        >
          {{ responsibility }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from "@/utils/helpers";
const props = defineProps<{
  experience: CvExperience;
}>();
const workingPeriod = computed(() => {
  return `${formatDate(props.experience.start)} - ${formatDate(
    props.experience.end
  )}`;
});
const isPresent = computed(() => {
  return workingPeriod.value.includes("Present");
});
</script>
