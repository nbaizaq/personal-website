<template>
  <div class="flex flex-col md:flex-row gap-3">
    <div
      class="relative isolate w-full md:flex-[2] min-w-0 h-[360px] md:h-[420px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
    >
      <div ref="detailEl" class="absolute inset-0 z-0" />
      <div
        class="absolute top-3 right-3 z-10 bg-primary-900/90 border border-primary-300/30 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-semibold text-white pointer-events-none"
        v-html="routeBadge"
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
      <div ref="overviewEl" class="absolute inset-0 z-0" />
      <span
        class="absolute bottom-3 left-3 z-10 text-[0.65rem] font-semibold uppercase tracking-wide text-white/90 bg-black/40 rounded px-2 py-0.5 pointer-events-none"
      >
        Regional scale
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import {
  MAP_DETAIL_PADDING_DEG,
  MAP_OVERVIEW_PADDING_DEG,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
  boundsToLeafletLatLngs,
  routeBounds,
} from "~/utils/swimming/map-shared";
import type { SwimRoute } from "~/utils/swimming/types";

const props = defineProps<{
  route: SwimRoute;
  routeBadge: string;
  startLabel: string;
  finishLabel: string;
}>();

const detailEl = ref<HTMLElement | null>(null);
const overviewEl = ref<HTMLElement | null>(null);

type LeafletMap = import("leaflet").Map;

let detailMap: LeafletMap | undefined;
let overviewMap: LeafletMap | undefined;

function lockMapView(map: LeafletMap) {
  map.scrollWheelZoom.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  map.dragging.disable();
  if (map.zoomControl) {
    map.removeControl(map.zoomControl);
  }
  const zoom = map.getZoom();
  map.setMinZoom(zoom);
  map.setMaxZoom(zoom);
}

async function initMap(
  el: HTMLElement,
  paddingDeg: number,
  maxZoom: number,
  markerSize: number,
): Promise<LeafletMap> {
  const L = (await import("leaflet")).default;

  const map = L.map(el, {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false,
    dragging: false,
  });

  L.tileLayer(MAP_TILE_URL, {
    attribution: MAP_TILE_ATTRIBUTION,
    maxZoom: 19,
  }).addTo(map);

  const routeCoords: [number, number][] = [props.route.start, props.route.end];

  L.polyline(routeCoords, {
    color: "rgba(20, 33, 53, 0.85)",
    weight: 8,
    opacity: 0.9,
    lineCap: "round",
  }).addTo(map);

  L.polyline(routeCoords, {
    color: "#5182d2",
    weight: 4,
    opacity: 0.95,
    dashArray: "12, 8",
    lineCap: "round",
  }).addTo(map);

  const markerClass =
    markerSize < 14
      ? "swim-map-marker swim-map-marker-xs"
      : markerSize < 30
        ? "swim-map-marker swim-map-marker-sm"
        : "swim-map-marker";
  const half = markerSize / 2;

  const startIcon = L.divIcon({
    className: `${markerClass} swim-map-marker-start`,
    html: "<span>S</span>",
    iconSize: [markerSize, markerSize],
    iconAnchor: [half, half],
  });

  const endIcon = L.divIcon({
    className: `${markerClass} swim-map-marker-end`,
    html: "<span>F</span>",
    iconSize: [markerSize, markerSize],
    iconAnchor: [half, half],
  });

  L.marker(props.route.start, { icon: startIcon })
    .bindPopup(
      `<strong>${props.startLabel}</strong><br>${props.route.start.join(", ")}`,
    )
    .addTo(map);

  L.marker(props.route.end, { icon: endIcon })
    .bindPopup(
      `<strong>${props.finishLabel}</strong><br>${props.route.end.join(", ")}`,
    )
    .addTo(map);

  const bounds = boundsToLeafletLatLngs(routeBounds(props.route, paddingDeg));
  map.fitBounds(bounds, { padding: [32, 32], maxZoom });
  lockMapView(map);

  return map;
}

onMounted(async () => {
  await nextTick();
  if (!detailEl.value || !overviewEl.value) return;

  detailMap = await initMap(
    detailEl.value as HTMLElement,
    MAP_DETAIL_PADDING_DEG,
    16,
    30,
  );
  overviewMap = await initMap(
    overviewEl.value as HTMLElement,
    MAP_OVERVIEW_PADDING_DEG,
    11,
    12,
  );

  requestAnimationFrame(() => {
    detailMap?.invalidateSize();
    overviewMap?.invalidateSize();
  });
});

onBeforeUnmount(() => {
  detailMap?.remove();
  overviewMap?.remove();
  detailMap = undefined;
  overviewMap = undefined;
});
</script>

<style scoped>
:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  font-family: "Lato", sans-serif;
}

:deep(.swim-map-marker) {
  background: none !important;
  border: none !important;
}

:deep(.swim-map-marker span) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  border: 2px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}

:deep(.swim-map-marker-sm span) {
  width: 18px;
  height: 18px;
  font-size: 0.55rem;
  border-width: 1.5px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

:deep(.swim-map-marker-xs span) {
  width: 12px;
  height: 12px;
  font-size: 0.45rem;
  border-width: 1px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
}

:deep(.swim-map-marker-start span) {
  background: #5182d2;
}

:deep(.swim-map-marker-end span) {
  background: #93b2e3;
  color: #142135;
}

:deep(.leaflet-popup-content-wrapper) {
  background: #fff;
  color: #374151;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

:deep(.leaflet-popup-tip) {
  background: #fff;
}

:deep(.leaflet-control-attribution) {
  font-size: 0.62rem !important;
}
</style>
