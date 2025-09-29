<template>
  <div
    :id="props.experience.id"
    class="border-1 p-4 rounded-xl border-gray-200"
    :class="isPresent ? 'border-primary-200 bg-primary-50' : 'border-gray-200'"
  >
    <div class="flex gap-2 justify-between items-center">
      <div class="flex gap-2 items-center">
        <div
          class="text-sm italic"
          :class="isPresent ? 'text-primary-500' : 'text-gray-500'"
        >
          {{ workingPeriod }}
        </div>
        <SharedEmploymentTypeTag
          :type="props.experience.employmentType"
          :severity="
            props.experience.type === 'employment' ? 'primary' : 'secondary'
          "
        />
        <SharedEmploymentTypeTag
          v-if="props.experience.type === 'project'"
          type="project"
          severity="accent"
        />
      </div>
      <div
        v-if="props.experience.location"
        class="text-sm text-gray-500 flex items-center gap-1"
      >
        <i class="pi pi-map-marker !text-xs" />
        {{ props.experience.location }}
      </div>
    </div>

    <div class="text-xl py-2 font-medium">
      {{ props.experience.title }}
    </div>
    <div class="text-sm text-gray-700">
      @ {{ props.experience.company }}
      <div
        v-if="props.experience.website"
        class="inline-flex gap-2 items-center"
      >
        ·
        <a
          :href="props.experience.website"
          target="_blank"
          class="text-gray-500 hover:text-primary-500"
          ><i class="pi pi-external-link !text-xs" />
          {{ props.experience.website }}</a
        >
      </div>
    </div>
    <div class="mt-4">
      <div class="text-sm text-gray-500">Responsibilities</div>
      <ul class="mt-2 list-disc pl-4" v-if="props.experience.responsibilities">
        <li
          v-for="responsibility in props.experience.responsibilities"
          class="text-sm py-1 font-light"
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
