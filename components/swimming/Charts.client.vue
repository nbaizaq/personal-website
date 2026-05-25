<template>
  <div class="space-y-4">
    <section class="swim-card">
      <div class="swim-card-header">
        <div>
          <h3 class="swim-card-title">Pace Over Time</h3>
          <p class="swim-card-desc">Average pace per 100m — lower is faster</p>
        </div>
      </div>
      <div class="h-[340px] relative">
        <canvas ref="paceCanvas" class="block w-full h-full" />
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section class="swim-card">
        <div class="swim-card-header">
          <div>
            <h3 class="swim-card-title">Distance</h3>
            <p class="swim-card-desc">Per session & cumulative total</p>
          </div>
        </div>
        <div class="h-[300px] relative">
          <canvas ref="distanceCanvas" class="block w-full h-full" />
        </div>
      </section>

      <section class="swim-card">
        <div class="swim-card-header">
          <div>
            <h3 class="swim-card-title">Heart Rate</h3>
            <p class="swim-card-desc">Average & max bpm per session</p>
          </div>
        </div>
        <div class="h-[300px] relative">
          <canvas ref="hrCanvas" class="block w-full h-full" />
        </div>
      </section>
    </div>

    <section class="swim-card">
      <div class="swim-card-header">
        <div>
          <h3 class="swim-card-title">Monthly Distance</h3>
          <p class="swim-card-desc">Total swam each month & running cumulative</p>
        </div>
      </div>
      <div class="h-[300px] relative">
        <canvas ref="monthlyCanvas" class="block w-full h-full" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
  Tooltip,
} from "chart.js";
import {
  fmtBpm,
  fmtKm,
  fmtMeters,
  fmtNum,
  fmtPacePer100m,
  fmtShortDate,
} from "~/utils/swimming/format";
import { linearTrend } from "~/utils/swimming/parse";
import type { SwimChartData } from "~/utils/swimming/types";
import { toRaw } from "vue";

Chart.register(
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
  Tooltip,
);

const props = defineProps<{
  chart: SwimChartData;
}>();

const paceCanvas = ref<HTMLCanvasElement | null>(null);
const distanceCanvas = ref<HTMLCanvasElement | null>(null);
const hrCanvas = ref<HTMLCanvasElement | null>(null);
const monthlyCanvas = ref<HTMLCanvasElement | null>(null);

const charts: Record<string, Chart> = {};

function snapshotChart(): SwimChartData {
  const raw = toRaw(props.chart);
  return {
    labels: [...raw.labels],
    pace: [...raw.pace],
    paceLabels: [...raw.paceLabels],
    distance: [...raw.distance],
    cumDistance: [...raw.cumDistance],
    avgHr: [...raw.avgHr],
    maxHr: [...raw.maxHr],
    types: [...raw.types],
  };
}

const COLORS = {
  grid: "rgba(81, 130, 210, 0.12)",
  text: "#6b7280",
  textBright: "#4b5563",
  primaryLight: "#729adb",
  primaryPale: "#93b2e3",
  trend: "#b4c9ec",
  ow: "#456fb3",
  owHover: "#395b93",
  owFill: "rgba(69, 111, 179, 0.15)",
  owBar: "rgba(81, 130, 210, 0.65)",
  tooltipBg: "#fff",
  tooltipBorder: "#e5e7eb",
};

function buildMonthlyStats(chart: SwimChartData) {
  const monthly = new Map<string, number>();
  chart.labels.forEach((label, i) => {
    const d = new Date(label);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthly.set(key, (monthly.get(key) || 0) + chart.distance[i]);
  });

  const sorted = [...monthly.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const monthLabels: string[] = [];
  const monthlyTotals: number[] = [];
  const cumulative: number[] = [];
  let cum = 0;

  for (const [key, total] of sorted) {
    const [y, m] = key.split("-");
    const dt = new Date(Number(y), Number(m) - 1, 1);
    monthLabels.push(
      dt.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    );
    monthlyTotals.push(total);
    cum += total;
    cumulative.push(cum);
  }

  return { monthLabels, monthlyTotals, cumulative };
}

function fmtAxisMeters(v: number) {
  if (v >= 1000) {
    return `${fmtNum(v / 1000, { maximumFractionDigits: 0 })}k`;
  }
  return fmtNum(v);
}

function fmtAxisKm(v: number) {
  return `${fmtNum(v / 1000, { maximumFractionDigits: 0 })} km`;
}

function isOW(chart: SwimChartData, i: number) {
  return chart.types[i] === "Open Water Swimming";
}

function poolOnly(chart: SwimChartData, arr: number[]) {
  return arr.map((v, i) => (isOW(chart, i) ? null : v));
}

function owOnly(chart: SwimChartData, arr: number[]) {
  return arr.map((v, i) => (isOW(chart, i) ? v : null));
}

const scaleDefaults = {
  grid: { color: COLORS.grid, drawBorder: false },
  ticks: { color: COLORS.text, maxRotation: 0, autoSkipPadding: 12 },
  border: { display: false },
};

const tooltipDefaults = {
  backgroundColor: COLORS.tooltipBg,
  borderColor: COLORS.tooltipBorder,
  borderWidth: 1,
  titleColor: "#142135",
  bodyColor: COLORS.textBright,
  padding: 12,
  cornerRadius: 8,
  titleFont: { weight: "600" as const, size: 12 },
  bodyFont: { size: 11 },
};

function destroyCharts() {
  Object.values(charts).forEach((c) => c.destroy());
  for (const key of Object.keys(charts)) delete charts[key];
}

function buildCharts() {
  destroyCharts();
  Chart.defaults.color = COLORS.text;
  Chart.defaults.borderColor = COLORS.grid;
  Chart.defaults.font.family = '"Lato", sans-serif';
  Chart.defaults.font.size = 11;

  const chart = snapshotChart();
  const shortLabels = chart.labels.map(fmtShortDate);
  const monthly = buildMonthlyStats(chart);

  if (paceCanvas.value) {
    charts.pace = new Chart(paceCanvas.value, {
      type: "line",
      data: {
        labels: shortLabels,
        datasets: [
          {
            label: "Pool swim",
            data: poolOnly(chart, chart.pace),
            borderColor: COLORS.primaryLight,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
              g.addColorStop(0, "rgba(114, 154, 219, 0.2)");
              g.addColorStop(1, "rgba(114, 154, 219, 0)");
              return g;
            },
            pointBackgroundColor: COLORS.primaryLight,
            pointBorderColor: "transparent",
            pointRadius: 3,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            spanGaps: false,
          },
          {
            label: "Open water",
            data: owOnly(chart, chart.pace),
            borderColor: COLORS.ow,
            backgroundColor: COLORS.owFill,
            pointBackgroundColor: COLORS.ow,
            pointBorderColor: "#fff",
            pointBorderWidth: 1.5,
            pointStyle: "triangle",
            pointRadius: 7,
            fill: false,
            tension: 0.35,
            borderWidth: 2.5,
            spanGaps: false,
          },
          {
            label: "Trend",
            data: linearTrend(chart.pace),
            borderColor: COLORS.trend,
            borderDash: [5, 4],
            pointRadius: 0,
            fill: false,
            tension: 0,
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            labels: {
              color: COLORS.textBright,
              usePointStyle: true,
              padding: 20,
              boxWidth: 8,
            },
          },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              label(ctx) {
                const i = ctx.dataIndex;
                if (ctx.datasetIndex === 2) {
                  const sec = Math.round(ctx.raw as number);
                  const pace = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
                  return `Trend: ${fmtPacePer100m(pace)}`;
                }
                if (ctx.raw == null) return undefined;
                return `${ctx.dataset.label}: ${fmtPacePer100m(chart.paceLabels[i])}`;
              },
            },
          },
        },
        scales: {
          x: {
            ...scaleDefaults,
            ticks: { ...scaleDefaults.ticks, maxTicksLimit: 10 },
          },
          y: {
            ...scaleDefaults,
            reverse: true,
            ticks: {
              ...scaleDefaults.ticks,
              callback: (v) => {
                const n = Number(v);
                return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
              },
            },
          },
        },
      },
    });
  }

  if (distanceCanvas.value) {
    charts.distance = new Chart(distanceCanvas.value, {
      type: "bar",
      data: {
        labels: shortLabels,
        datasets: [
          {
            label: "Pool swim",
            data: poolOnly(chart, chart.distance),
            backgroundColor: "rgba(81, 130, 210, 0.75)",
            hoverBackgroundColor: COLORS.primaryLight,
            borderRadius: 4,
            yAxisID: "y",
          },
          {
            label: "Open water",
            data: owOnly(chart, chart.distance),
            backgroundColor: COLORS.owBar,
            hoverBackgroundColor: COLORS.owHover,
            borderRadius: 4,
            yAxisID: "y",
          },
          {
            label: "Cumulative",
            data: chart.cumDistance,
            type: "line",
            borderColor: COLORS.primaryPale,
            pointRadius: 0,
            borderWidth: 2,
            tension: 0.35,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            labels: {
              color: COLORS.textBright,
              usePointStyle: true,
              padding: 16,
              boxWidth: 8,
            },
          },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              label(ctx) {
                if (ctx.datasetIndex === 2) {
                  return `Total: ${fmtKm((ctx.raw as number) / 1000, 1)}`;
                }
                if (ctx.raw == null) return undefined;
                return `${ctx.dataset.label}: ${fmtMeters(ctx.raw as number)}`;
              },
            },
          },
        },
        scales: {
          x: {
            ...scaleDefaults,
            ticks: { ...scaleDefaults.ticks, maxTicksLimit: 8 },
          },
          y: {
            ...scaleDefaults,
            position: "left",
            ticks: {
              ...scaleDefaults.ticks,
              callback: (v) => fmtAxisMeters(Number(v)),
            },
          },
          y1: {
            ...scaleDefaults,
            position: "right",
            grid: { drawOnChartArea: false },
            ticks: {
              ...scaleDefaults.ticks,
              callback: (v) => fmtAxisKm(Number(v)),
            },
          },
        },
      },
    });
  }

  if (hrCanvas.value) {
    charts.hr = new Chart(hrCanvas.value, {
      type: "line",
      data: {
        labels: shortLabels,
        datasets: [
          {
            label: "Avg HR · pool",
            data: poolOnly(chart, chart.avgHr),
            borderColor: COLORS.primaryLight,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
              g.addColorStop(0, "rgba(114, 154, 219, 0.15)");
              g.addColorStop(1, "rgba(114, 154, 219, 0)");
              return g;
            },
            pointRadius: 2,
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            spanGaps: false,
          },
          {
            label: "Avg HR · open water",
            data: owOnly(chart, chart.avgHr),
            borderColor: COLORS.ow,
            backgroundColor: COLORS.owFill,
            pointBackgroundColor: COLORS.ow,
            pointStyle: "triangle",
            pointRadius: 7,
            fill: false,
            tension: 0.35,
            borderWidth: 2.5,
            spanGaps: false,
          },
          {
            label: "Max HR · pool",
            data: poolOnly(chart, chart.maxHr),
            borderColor: COLORS.primaryPale,
            pointRadius: 0,
            fill: false,
            tension: 0.35,
            borderWidth: 1.5,
            spanGaps: false,
          },
          {
            label: "Max HR · open water",
            data: owOnly(chart, chart.maxHr),
            borderColor: COLORS.owHover,
            borderDash: [4, 3],
            pointBackgroundColor: COLORS.owHover,
            pointStyle: "triangle",
            pointRadius: 7,
            fill: false,
            tension: 0.35,
            borderWidth: 2,
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            labels: {
              color: COLORS.textBright,
              usePointStyle: true,
              padding: 16,
              boxWidth: 8,
            },
          },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              label(ctx) {
                if (ctx.raw == null) return undefined;
                return `${ctx.dataset.label}: ${fmtBpm(ctx.raw as number)}`;
              },
            },
          },
        },
        scales: {
          x: {
            ...scaleDefaults,
            ticks: { ...scaleDefaults.ticks, maxTicksLimit: 8 },
          },
          y: {
            ...scaleDefaults,
            min: 90,
            max: 230,
            ticks: {
              ...scaleDefaults.ticks,
              callback: (v) => fmtBpm(Number(v)),
            },
          },
        },
      },
    });
  }

  if (monthlyCanvas.value) {
    charts.monthly = new Chart(monthlyCanvas.value, {
      type: "bar",
      data: {
        labels: monthly.monthLabels,
        datasets: [
          {
            label: "Monthly total",
            data: monthly.monthlyTotals,
            backgroundColor: "rgba(81, 130, 210, 0.75)",
            hoverBackgroundColor: COLORS.primaryLight,
            borderRadius: 6,
            yAxisID: "y",
          },
          {
            label: "Cumulative",
            data: monthly.cumulative,
            type: "line",
            borderColor: COLORS.primaryPale,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
              g.addColorStop(0, "rgba(147, 178, 227, 0.2)");
              g.addColorStop(1, "rgba(147, 178, 227, 0)");
              return g;
            },
            pointBackgroundColor: COLORS.primaryPale,
            pointRadius: 4,
            fill: true,
            tension: 0.25,
            borderWidth: 2,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            labels: {
              color: COLORS.textBright,
              usePointStyle: true,
              padding: 16,
              boxWidth: 8,
            },
          },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              label(ctx) {
                const kmDistance = fmtKm((ctx.raw as number) / 1000, 1);
                const meterDistance = fmtMeters(ctx.raw as number);
                if (ctx.datasetIndex === 1) {
                  return `Cumulative: ${kmDistance} (${meterDistance})`;
                }
                return `Monthly: ${kmDistance} (${meterDistance})`;
              },
            },
          },
        },
        scales: {
          x: scaleDefaults,
          y: {
            ...scaleDefaults,
            position: "left",
            title: { display: true, text: "Monthly (m)", color: COLORS.text },
            ticks: {
              ...scaleDefaults.ticks,
              callback: (v) => fmtAxisMeters(Number(v)),
            },
          },
          y1: {
            ...scaleDefaults,
            position: "right",
            title: {
              display: true,
              text: "Cumulative (m)",
              color: COLORS.primaryPale,
            },
            grid: { drawOnChartArea: false },
            ticks: {
              ...scaleDefaults.ticks,
              callback: (v) => fmtAxisKm(Number(v)),
            },
          },
        },
      },
    });
  }
}

onMounted(async () => {
  await nextTick();
  buildCharts();
  requestAnimationFrame(() => {
    Object.values(charts).forEach((c) => c.resize());
  });
});

watch(() => props.chart, () => nextTick(buildCharts), { deep: true });

onBeforeUnmount(destroyCharts);
</script>

<style scoped>
@reference "~/assets/css/main.css";

.swim-card {
  @apply bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden;
}

.swim-card-header {
  @apply flex items-start justify-between gap-4 mb-4 px-5 pt-5;
}

.swim-card-title {
  @apply text-base font-semibold text-primary-950;
}

.swim-card-desc {
  @apply text-sm text-gray-500 mt-0.5;
}

</style>
