<template>
  <div v-if="swimming" class="max-w-6xl mx-auto space-y-4 pb-8">
    <header
      class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2"
    >
      <div>
        <h1 class="text-3xl font-bold text-primary-950">Swimming Dashboard</h1>
        <p class="text-gray-500 mt-1">Your performance at a glance</p>
      </div>
      <div class="flex flex-wrap gap-2 justify-end">
        <span class="swim-badge">
          <span class="swim-badge-dot" />
          {{ copy.activities }}
        </span>
        <span class="swim-badge">{{ copy.dateRange }}</span>
        <a
          class="swim-badge swim-badge-link"
          href="https://connect.garmin.com/modern/profile/a3bdbec9-8ab7-468f-af97-3bafe3d4c88d"
          target="_blank"
          rel="noopener noreferrer"
        >
          Garmin Connect
          <i class="pi pi-external-link swim-badge-ext" aria-hidden="true" />
        </a>
      </div>
    </header>

    <section class="swim-card swim-overview-card">
      <div class="px-5 pt-5 pb-4 border-b border-gray-100">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm text-gray-500">Total distance swam</p>
            <p class="mt-1 text-3xl font-semibold text-primary-950 tabular-nums tracking-tight">
              {{ fmtKmValue(stats.totalKm, 1) }} km
            </p>
            <p class="mt-1 text-sm text-gray-400">
              {{ copy.metersAcross }} · {{ copy.poolOw }}
            </p>
          </div>
          <p
            v-if="copy.heroSummary"
            class="text-sm text-gray-500 tabular-nums sm:text-right sm:max-w-xs"
          >
            {{ copy.heroSummary }}
          </p>
        </div>
        <div class="mt-4">
          <div class="mb-1.5 flex justify-between text-xs text-gray-400">
            <span>{{ copy.volumeMilestoneLabel }}</span>
            <span class="tabular-nums">{{ copy.volumeMilestonePct }}</span>
          </div>
          <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 rounded-full"
              :style="{ width: `${stats.heroStatBarPct}%` }"
            />
          </div>
        </div>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4">
          <div class="min-w-0">
            <p class="text-xs text-gray-400">Last session</p>
            <p class="mt-1 text-xl font-semibold text-primary-950 tabular-nums">
              {{ fmtKmValue(stats.lastSessionKm, 1) }} km
            </p>
            <p class="mt-0.5 text-xs text-gray-400">{{ copy.lastSessionSub }}</p>
          </div>

          <div class="min-w-0">
            <p class="text-xs text-gray-400">Recent avg</p>
            <p class="mt-1 text-xl font-semibold text-primary-950 tabular-nums">
              {{ stats.recent5AvgPaceLabel }}
            </p>
            <p class="mt-0.5 text-xs text-gray-400">{{ copy.recent5AvgDetail }}</p>
          </div>

          <div class="min-w-0">
            <p class="text-xs text-gray-400">Best</p>
            <p class="mt-1 text-xl font-semibold text-primary-950 tabular-nums">
              {{ stats.bestPaceLabel }}
            </p>
            <p class="mt-0.5 text-xs text-gray-400">{{ copy.per100m }}</p>
          </div>

          <div class="min-w-0">
            <p class="flex items-center gap-1 text-xs text-gray-400">
              Improvement
              <span class="swim-info-tip">
                <button
                  type="button"
                  class="swim-info-btn"
                  :aria-label="copy.improvementDefinition"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" stroke-linecap="round" />
                  </svg>
                </button>
                <span class="swim-info-tip-text" role="tooltip">
                  {{ copy.improvementDefinition }}
                </span>
              </span>
            </p>
            <p class="mt-1 text-xl font-semibold text-primary-950 tabular-nums">
              {{ fmtSeconds(stats.improvementSec) }}
            </p>
            <p class="mt-0.5 text-xs text-gray-400">{{ copy.improvementSub }}</p>
          </div>

          <div class="min-w-0">
            <p class="text-xs text-gray-400">Avg rate</p>
            <p class="mt-1 text-xl font-semibold text-primary-950 tabular-nums">
              {{ stats.avgHr }}
            </p>
            <p class="mt-0.5 text-xs text-gray-400">{{ copy.bpmAllSessions }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="swim-card swim-goal-section">
      <div class="p-5">
        <div class="swim-card-header !px-0 !pt-0">
          <div>
            <h2 class="swim-card-title">{{ copy.goalTitle }}</h2>
            <p class="swim-card-desc">{{ copy.goalDesc }}</p>
          </div>
          <span class="swim-tag">{{ copy.weekTag }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          <div class="relative w-[130px] h-[130px] mx-auto md:mx-0">
            <svg width="130" height="130" viewBox="0 0 130 130" class="rotate-[-90deg]">
              <circle cx="65" cy="65" r="54" fill="none" stroke="#e5e7eb" stroke-width="10" />
              <circle
                cx="65"
                cy="65"
                r="54"
                fill="none"
                stroke="url(#goalGrad)"
                stroke-width="10"
                stroke-dasharray="339"
                :stroke-dashoffset="stats.goalRingOffset"
                stroke-linecap="round"
              />
              <defs>
                <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#5182d2" />
                  <stop offset="100%" stop-color="#93b2e3" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-primary-950">{{ stats.routePct }}%</span>
              <span class="text-xs text-gray-500 uppercase tracking-wide">of route</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="swim-stat-cell">
              <div class="swim-stat-label">Longest Session</div>
              <div class="swim-stat-value">{{ fmtKm(stats.currentLongKm, 1) }}</div>
              <p class="swim-stat-sub">{{ copy.longestSub }}</p>
            </div>
            <div class="swim-stat-cell swim-stat-highlight">
              <div class="swim-stat-label">August Projected</div>
              <div class="swim-stat-value">{{ stats.planPct }}%</div>
              <p class="swim-stat-sub">{{ copy.projectedSub }}</p>
            </div>
            <div class="swim-stat-cell">
              <div class="swim-stat-label">Route · Now</div>
              <div class="swim-stat-value">
                {{ fmtDurationFromMinutes(stats.routeNowDurationMin) }}
              </div>
              <p class="swim-stat-sub">{{ copy.routeNowSub }}</p>
            </div>
            <div class="swim-stat-cell swim-stat-highlight">
              <div class="swim-stat-label">Route · August</div>
              <div class="swim-stat-value">
                {{ fmtDurationFromMinutes(stats.routeAugustDurationMin) }}
              </div>
              <p class="swim-stat-sub">{{ copy.routeAugustSub }}</p>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>{{ fmtKm(0, 0) }}</span>
            <span v-html="copy.goalBarMid" />
            <span>{{ fmtKm(stats.planKm, 0) }}</span>
          </div>
          <div class="relative h-2 bg-gray-100 rounded-full">
            <div class="absolute inset-0 rounded-full bg-primary-100" style="width: 100%" />
            <div
              class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-300 z-[2]"
              :style="{ width: `${stats.goalBarCurrentPct}%` }"
            />
            <div
              class="absolute top-[-3px] bottom-[-3px] w-0.5 bg-primary-700 opacity-60 z-[3]"
              :style="{ left: `${stats.goalBarRouteMarkPct}%` }"
            />
          </div>
          <div class="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
            <span class="flex items-center gap-1.5">
              <i class="inline-block w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-primary-500 to-primary-300" />
              {{ copy.legendCurrent }}
            </span>
            <span class="flex items-center gap-1.5">
              <i class="inline-block w-2.5 h-2.5 rounded-sm bg-primary-100" />
              {{ copy.legendPlan }}
            </span>
            <span class="flex items-center gap-1.5">
              <i class="inline-block w-2.5 h-2.5 rounded-sm bg-primary-700 opacity-60" />
              {{ copy.legendFinish }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="swim-card">
      <div class="p-5">
        <div class="swim-card-header !px-0 !pt-0">
          <div>
            <h2 class="swim-card-title">August Swim Route</h2>
            <p class="swim-card-desc">{{ copy.mapDesc }}</p>
          </div>
          <span class="swim-tag">{{ fmtKm(stats.routeKm, 1) }}</span>
        </div>

        <SwimmingMapStatic
          v-if="swimming && preferStaticMaps"
          :route-badge="copy.routeBadge"
        />
        <ClientOnly v-else-if="swimming">
          <SwimmingMap
            :route="swimming.route"
            :route-badge="copy.routeBadge"
            start-label="Start"
            finish-label="Finish"
          />
        </ClientOnly>

        <div class="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-100">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-400">Start</div>
            <div class="text-sm font-semibold text-primary-950 mt-0.5 tabular-nums">
              {{ swimming.route.start.join(", ") }}
            </div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-400">Finish</div>
            <div class="text-sm font-semibold text-primary-950 mt-0.5 tabular-nums">
              {{ swimming.route.end.join(", ") }}
            </div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-400">Distance</div>
            <div class="text-sm font-semibold text-primary-950 mt-0.5 tabular-nums">
              {{ fmtKm(stats.mapDistanceKm, 2) }}
            </div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {{ copy.estTimeLabel }}
            </div>
            <div class="text-sm font-semibold text-primary-950 mt-0.5 tabular-nums">
              {{ fmtDurationFromMinutes(stats.routeAugustDurationMin) }}
            </div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Plan long swim
            </div>
            <div class="text-sm font-semibold text-primary-950 mt-0.5 tabular-nums">
              {{ fmtKm(stats.planKm, 1) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="swim-card swim-trend-section overflow-visible">
      <div class="p-5">
        <div class="swim-card-header !px-0 !pt-0">
          <div>
            <h2 class="swim-card-title">Pace Improvement Trend</h2>
            <p class="swim-card-desc">{{ copy.paceTrendDesc }}</p>
          </div>
          <span class="swim-tag">{{ copy.trendTag }}</span>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-6 mb-5">
          <div class="relative w-[100px] h-[100px] shrink-0">
            <svg width="100" height="100" viewBox="0 0 100 100" class="rotate-[-90deg]">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" stroke-width="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#arcGrad)"
                stroke-width="8"
                stroke-dasharray="264"
                :stroke-dashoffset="stats.paceArcOffset"
                stroke-linecap="round"
              />
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#5182d2" />
                  <stop offset="100%" stop-color="#93b2e3" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-lg font-bold text-primary-950">{{ stats.paceTowardBestPct }}%</span>
              <span class="text-[0.62rem] text-gray-500 uppercase">toward best</span>
            </div>
          </div>

          <div class="flex-1 space-y-2 w-full">
            <div
              v-for="row in paceLegend"
              :key="row.label"
              class="flex items-center gap-2 text-sm"
            >
              <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: row.color }" />
              <span class="text-gray-500 min-w-[52px]">{{ row.label }}</span>
              <span class="font-semibold text-primary-950 tabular-nums">{{ row.value }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div class="swim-trend-cell swim-trend-featured">
            <div class="swim-trend-label">Current</div>
            <div class="swim-trend-value">{{ stats.paceCurrent }}</div>
            <p class="swim-trend-detail">{{ copy.lastSwim }}</p>
          </div>
          <div class="swim-trend-cell">
            <div class="swim-trend-label">Start</div>
            <div class="swim-trend-value">{{ stats.paceStart }}</div>
            <p class="swim-trend-detail">{{ copy.linearFitStart }}</p>
          </div>
          <div class="swim-trend-cell">
            <div class="swim-trend-label">Trend</div>
            <div class="swim-trend-value">{{ stats.paceTrend }}</div>
            <p class="swim-trend-detail">{{ copy.linearFitEnd }}</p>
          </div>
          <div class="swim-trend-cell">
            <div class="swim-trend-label">Best</div>
            <div class="swim-trend-value">{{ stats.bestPaceLabel }}</div>
            <p class="swim-trend-detail">{{ copy.personalBest }}</p>
          </div>
          <div class="swim-trend-cell">
            <div class="swim-trend-label flex items-center gap-1">
              Improvement
              <span class="swim-info-tip">
                <button
                  type="button"
                  class="swim-info-btn"
                  :aria-label="copy.improvementDefinition"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" stroke-linecap="round" />
                  </svg>
                </button>
                <span class="swim-info-tip-text" role="tooltip">
                  {{ copy.improvementDefinition }}
                </span>
              </span>
            </div>
            <div class="swim-trend-value">
              {{ fmtSignedSeconds(-stats.improvementSec) }}
            </div>
          </div>
          <div class="swim-trend-cell">
            <div class="swim-trend-label">Trend Rate</div>
            <div class="swim-trend-value">{{ copy.secRate }}</div>
            <p class="swim-trend-detail">{{ copy.trendRateDetail }}</p>
          </div>
        </div>
      </div>
    </section>

    <SwimmingCharts v-if="swimming?.chart" :chart="swimming.chart" />
  </div>
</template>

<script setup lang="ts">
import {
  buildSwimmingCopy,
  fmtDurationFromMinutes,
  fmtKm,
  fmtKmValue,
  fmtPaceSlash,
  fmtSeconds,
  fmtSignedSeconds,
} from "~/utils/swimming/format";
import type { SwimmingData } from "~/utils/swimming/types";

const preferStaticMaps = import.meta.env.PROD;

const { data: swimming } = await useFetch<SwimmingData>("/swimming-data.json");

const stats = computed(() => swimming.value!.stats);
const copy = computed(() => buildSwimmingCopy(stats.value));

const paceLegend = computed(() => [
  { label: "Start", value: fmtPaceSlash(stats.value.paceStart), color: "#93b2e3" },
  { label: "Trend", value: fmtPaceSlash(stats.value.paceTrend), color: "#729adb" },
  { label: "Current", value: fmtPaceSlash(stats.value.paceCurrent), color: "#5182d2" },
  { label: "Best", value: fmtPaceSlash(stats.value.paceBest), color: "#142135" },
]);

useHead({ title: "Swimming Dashboard" });
</script>

<style scoped>
@reference "~/assets/css/main.css";

.swim-card {
  @apply bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden;
}

.swim-card-header {
  @apply flex items-start justify-between gap-4 mb-4;
}

.swim-card-title {
  @apply text-base font-semibold text-primary-950;
}

.swim-card-desc {
  @apply text-sm text-gray-500 mt-0.5;
}

.swim-badge {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-xs font-medium text-primary-800;
}

.swim-badge-link {
  @apply transition-colors hover:bg-primary-100 hover:border-primary-200;
}

.swim-badge-icon {
  @apply w-3.5 h-3.5 shrink-0;
}

.swim-badge-ext {
  @apply text-[0.65rem] opacity-60;
}

.swim-badge-dot {
  @apply w-1.5 h-1.5 rounded-full bg-primary-400;
}

.swim-icon {
  @apply w-9 h-9 rounded-lg flex items-center justify-center;
}

.swim-tag {
  @apply text-xs font-semibold uppercase tracking-wide text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-md whitespace-nowrap;
}

.swim-goal-section {
  @apply bg-gradient-to-br from-primary-50 to-white border-primary-100;
}

.swim-stat-cell {
  @apply bg-gray-50 border border-gray-100 rounded-xl p-3.5;
}

.swim-stat-highlight {
  @apply bg-primary-50 border-primary-100;
}

.swim-stat-label {
  @apply text-xs font-semibold uppercase tracking-wide text-gray-500;
}

.swim-stat-value {
  @apply text-xl font-bold text-primary-950 mt-0.5;
}

.swim-stat-sub {
  @apply text-xs text-gray-500 mt-0.5;
}

.swim-stat-highlight .swim-stat-sub {
  @apply text-primary-600;
}

.swim-trend-cell {
  @apply bg-gray-50 border border-gray-100 rounded-xl p-3.5 transition-colors hover:bg-primary-50 hover:border-primary-100;
}

.swim-trend-featured {
  @apply bg-primary-50 border-primary-200;
}

.swim-trend-label {
  @apply text-xs font-semibold uppercase tracking-wide text-gray-500;
}

.swim-trend-value {
  @apply text-2xl font-bold text-primary-950 mt-1;
}

.swim-trend-featured .swim-trend-value {
  @apply text-primary-700;
}

.swim-trend-detail {
  @apply text-xs text-gray-500 mt-1 leading-snug;
}

.swim-info-tip {
  @apply relative inline-flex;
}

.swim-info-btn {
  @apply inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-gray-400
    hover:text-primary-600 hover:bg-primary-50 focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-1;
}

.swim-info-btn svg {
  @apply w-3 h-3;
}

.swim-info-tip-text {
  @apply pointer-events-none absolute left-1/2 bottom-full z-20 mb-1.5 w-44 -translate-x-1/2
    rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[0.65rem] normal-case
    leading-snug tracking-normal text-gray-600 shadow-md opacity-0 invisible
    transition-opacity duration-150;
}

.swim-info-tip:hover .swim-info-tip-text,
.swim-info-tip:focus-within .swim-info-tip-text {
  @apply opacity-100 visible;
}
</style>
