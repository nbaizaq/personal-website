<template>
  <div class="container mx-auto">
    <div>
      <div class="font-medium text-center text-2xl">Frontend Engineer</div>
      <div class="text-primary-600 font-medium uppercase text-lg text-center">
        Ready to relocate!
      </div>
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
      <CvBlock title="Summary" class="leading-6 text-sm text-gray-800">
        {{ professionalSummary }}
      </CvBlock>
      <CvBlock title="Experience">
        <div class="flex flex-col">
          <CvExperienceItem
            v-for="experience in experiences"
            :key="experience.title"
            :experience="experience"
          />
        </div>
      </CvBlock>
      <CvBlock title="Education">
        <CvEducation :education="education" />
      </CvBlock>
      <CvBlock title="Skills">
        <div class="space-y-2">
          <div class="inline text-sm">
            <span class="mr-2 font-bold">Languages:</span>
            <span>{{ languages.join(", ") }}</span>
          </div>
          <div class="inline-block mt-2 text-sm">
            <span class="mr-2 font-bold">Technical:</span>
            <span>{{ skills.join(", ") }}</span>
          </div>
        </div>
      </CvBlock>
      <CvBlock title="Awards" class="print:hidden">
        <div class="flex flex-col gap-4">
          <div v-for="award in awards.slice(0, 3)" :key="award.award">
            <div>{{ award.award }}</div>
            <div class="flex items-center gap-2">
              <div class="text-gray-500 text-sm inline-block">
                {{ award.dates.map(formatDate).join(" - ") }}
              </div>
              <span class="text-gray-500 text-xs">•</span>
              <div class="text-gray-500 text-sm inline-block">
                {{ award.location }}
              </div>
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
