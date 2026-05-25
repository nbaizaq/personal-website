export interface SwimActivity {
  type: string;
  date: string;
  distance: number;
  avgHr: number;
  maxHr: number;
  avgPaceSec: number;
  avgPaceLabel: string;
  bestPaceSec: number;
  bestPaceLabel: string;
  movingTimeSec?: number;
  elapsedTimeSec?: number;
}

export interface SwimRoute {
  start: [number, number];
  end: [number, number];
  distanceKm: number;
}

export interface SwimPlan {
  goalWeek: number;
  goalDistanceM: number;
  racePace: string;
  racePaceSec: number;
}

export interface SwimStats {
  activityCount: number;
  totalMeters: number;
  totalKm: number;
  totalMovingTimeMin: number;
  avgRestTimeSec: number | null;
  lastSessionMeters: number;
  lastSessionKm: number;
  poolSessions: number;
  owSessions: number;
  improvementSec: number;
  improvementFrom: string;
  improvementTo: string;
  bestPaceLabel: string;
  bestPaceDate: string;
  recent5AvgPaceLabel: string;
  avgHr: number;
  routeKm: number;
  mapDistanceKm: number;
  planKm: number;
  currentLongKm: number;
  routePct: number;
  planPct: number;
  longestDate: string;
  longestWeek: number;
  goalWeek: number;
  routeNowPace: string;
  routeAugustPace: string;
  routeNowDurationMin: number;
  routeAugustDurationMin: number;
  trendSecPerYear: number;
  paceStart: string;
  paceTrend: string;
  paceCurrent: string;
  paceBest: string;
  paceTowardBestPct: number;
  lastSwimDate: string;
  linearFitStart: string;
  linearFitEnd: string;
  personalBestDate: string;
  trendSecPerDay: number;
  trendSecPerMonth: number;
  rangeStart: string;
  rangeEnd: string;
  heroStatBarPct: number;
  goalRingOffset: number;
  paceArcOffset: number;
  goalBarCurrentPct: number;
  goalBarRouteMarkPct: number;
}

export interface SwimChartData {
  labels: string[];
  pace: number[];
  paceLabels: string[];
  distance: number[];
  cumDistance: number[];
  avgHr: number[];
  maxHr: number[];
  types: string[];
}

export interface SwimmingData {
  stats: SwimStats;
  chart: SwimChartData;
  route: SwimRoute;
  plan: SwimPlan;
}
