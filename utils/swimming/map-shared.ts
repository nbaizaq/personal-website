import type { SwimRoute } from "./types";

export const MAP_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export const MAP_TILE_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics";

export const MAP_STATIC_DETAIL = "/swimming-map-detail.png";
export const MAP_STATIC_OVERVIEW = "/swimming-map-overview.png";

export interface RouteBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function routeBounds(route: SwimRoute, paddingDeg: number): RouteBounds {
  const [lat1, lng1] = route.start;
  const [lat2, lng2] = route.end;
  return {
    minLat: Math.min(lat1, lat2) - paddingDeg,
    maxLat: Math.max(lat1, lat2) + paddingDeg,
    minLng: Math.min(lng1, lng2) - paddingDeg,
    maxLng: Math.max(lng1, lng2) + paddingDeg,
  };
}

/** Detail: tight on the swim line. Overview: wide context for scale. */
export const MAP_DETAIL_PADDING_DEG = 0.012;
export const MAP_OVERVIEW_PADDING_DEG = 0.22;

export function boundsToLeafletLatLngs(b: RouteBounds): [number, number][] {
  return [
    [b.minLat, b.minLng],
    [b.maxLat, b.maxLng],
  ];
}
