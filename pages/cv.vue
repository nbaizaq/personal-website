<template>
  <div class="container">
    <div
      class="text-primary-600 font-medium uppercase underline text-center my-4"
    >
      Ready to relocate!
    </div>
    <ClientOnly>
      <div class="flex justify-end print:hidden" v-if="supportsPrint">
        <a href="/cv-data.json">
          <Button variant="link" size="small" class="hover:underline"
            >JSON</Button
          >
        </a>
        <Button variant="text" size="small" @click="onPrint">Print</Button>
      </div>
    </ClientOnly>
    <hr class="my-4 print:my-2 text-gray-400 border-dashed" />
    <div class="flex flex-col gap-8">
      <CvAddress />
      <CvBlock title="Professional summary" class="leading-8 text-sm">
        {{ professionalSummary }}
      </CvBlock>
      <CvBlock title="Work Experience">
        <div class="flex flex-col gap-4">
          <CvExperienceItem
            v-for="experience in experiences"
            :key="experience.title"
            :experience="experience"
            full-time
          />
        </div>
      </CvBlock>
      <CvBlock title="Education">
        <CvEducation :education="education" />
      </CvBlock>
      <CvBlock title="Languages">
        <ul class="list-disc list-inside">
          <li v-for="lang in languages" :key="lang" class="my-1">{{ lang }}</li>
        </ul>
      </CvBlock>
      <CvBlock title="Skills">
        <div class="flex gap-2 items-center flex-wrap">
          <SharedSkillTag v-for="skill in skills" :key="skill" :value="skill" />
        </div>
      </CvBlock>
      <CvBlock title="Awards">
        <div class="flex flex-col gap-4">
          <div v-for="award in awards.slice(0, 3)" :key="award.award">
            <div class="text-xs text-gray-500">
              {{ award.dates.map(formatDate).join(" - ") }}
            </div>
            <div>{{ award.award }}</div>
            <div class="text-sm text-gray-700">
              {{ award.location }}
            </div>
          </div>
          <div
            v-for="award in awards.slice(3)"
            :key="award.award"
            class="print:block"
            :class="showMoreAwards ? 'block' : 'hidden'"
          >
            <div class="text-xs text-gray-500">
              {{ award.dates.map(formatDate).join(" - ") }}
            </div>
            <div>{{ award.award }}</div>
            <div class="text-sm text-gray-700">
              {{ award.location }}
            </div>
          </div>
          <div class="flex justify-center print:hidden" v-if="!showMoreAwards">
            <Button variant="text" size="small" @click="onShowMoreAwards">
              More <i class="pi pi-chevron-down"></i>
            </Button>
          </div>
        </div>
      </CvBlock>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  professionalSummary,
  experiences,
  education,
  awards,
  languages,
  skills,
} from "~/assets/data/cv-data";

useHead({
  title: "CV",
});

const supportsPrint = computed(() => {
  if (useNuxtApp().ssrContext) return false;
  return window.print !== undefined;
});

function onPrint() {
  window.print();
}

// #region Awards
const showMoreAwards = ref(false);

function onShowMoreAwards() {
  showMoreAwards.value = !showMoreAwards.value;
}
// #endregion
</script>
