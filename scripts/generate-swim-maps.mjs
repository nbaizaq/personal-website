import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import StaticMaps from "staticmaps";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "assets", "img");

const SWIM_ROUTE = {
  start: [42.467358, 76.428702],
  end: [42.350204, 76.394555],
};

const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

const DETAIL_PADDING = 0.012;
const OVERVIEW_PADDING = 0.22;

function routeBounds(paddingDeg) {
  const [lat1, lng1] = SWIM_ROUTE.start;
  const [lat2, lng2] = SWIM_ROUTE.end;
  return {
    minLat: Math.min(lat1, lat2) - paddingDeg,
    maxLat: Math.max(lat1, lat2) + paddingDeg,
    minLng: Math.min(lng1, lng2) - paddingDeg,
    maxLng: Math.max(lng1, lng2) + paddingDeg,
  };
}

/** staticmaps bbox: [lng, lat, lng, lat, ...] */
function boundsBbox(b) {
  return [b.minLng, b.minLat, b.maxLng, b.maxLat];
}

function routeLine() {
  return [SWIM_ROUTE.start, SWIM_ROUTE.end].map(([lat, lng]) => [lng, lat]);
}

async function renderMap({ name, width, height, paddingDeg, markerRadius = 120 }) {
  const map = new StaticMaps({
    width,
    height,
    tileUrl: TILE_URL,
    tileSize: 256,
  });

  const coords = routeLine();

  map.addLine({
    coords,
    color: "rgba(20, 33, 53, 0.85)",
    width: 10,
  });

  map.addLine({
    coords,
    color: "#5182d2",
    width: 5,
  });

  const [startLng, startLat] = coords[0];
  const [endLng, endLat] = coords[1];

  map.addCircle({
    coord: [startLng, startLat],
    radius: markerRadius,
    color: "#ffffff",
    width: markerRadius < 120 ? 1.5 : 2,
    fill: "#5182d2",
  });

  map.addCircle({
    coord: [endLng, endLat],
    radius: markerRadius,
    color: "#ffffff",
    width: markerRadius < 120 ? 1.5 : 2,
    fill: "#93b2e3",
  });

  await map.render(boundsBbox(routeBounds(paddingDeg)));

  const buffer = await map.image.buffer("png");
  const path = join(outDir, name);
  writeFileSync(path, buffer);
  console.log(`Wrote ${path}`);
}

mkdirSync(outDir, { recursive: true });

await renderMap({
  name: "swimming-map-detail.png",
  width: 1200,
  height: 630,
  paddingDeg: DETAIL_PADDING,
});

await renderMap({
  name: "swimming-map-overview.png",
  width: 640,
  height: 630,
  paddingDeg: OVERVIEW_PADDING,
  markerRadius: 45,
});
