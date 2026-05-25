import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ROUTE_DISPLAY_KM, SWIM_ROUTE } from "./constants";
import {
  estimateTrainingWeek,
  formatPace,
  linearTrend,
  parseActivitiesCsv,
  parsePlanMd,
} from "./parse";
import type { SwimmingData } from "./types";

function swimmingDataDir(): string {
  return join(process.cwd(), "assets", "swimming");
}

function routeDurationMin(distanceM: number, paceSecPer100m: number): number {
  return Math.round((distanceM / 100) * paceSecPer100m) / 60;
}

export function buildSwimmingData(): SwimmingData {
  const dir = swimmingDataDir();
  const csvPath = join(dir, "Activities.csv");
  const planPath = join(dir, "plan.md");

  if (!existsSync(csvPath)) {
    throw new Error(
      `Missing ${csvPath}. Add Garmin Activities.csv to assets/swimming/ before building.`,
    );
  }

  const csv = readFileSync(csvPath, "utf-8");
  const planText = existsSync(planPath)
    ? readFileSync(planPath, "utf-8")
    : "Week 24\n16000m (Goal Swim), Pace per 100m: 3:13";

  const activities = parseActivitiesCsv(csv);
  const plan = parsePlanMd(planText);

  const poolSessions = activities.filter((a) => a.type === "Pool Swim").length;
  const owSessions = activities.length - poolSessions;
  const totalMeters = activities.reduce((sum, a) => sum + a.distance, 0);

  const activitiesWithRest = activities.filter(
    (a) => a.movingTimeSec != null && a.elapsedTimeSec != null,
  );
  const totalMovingTimeSec = activitiesWithRest.reduce(
    (sum, a) => sum + a.movingTimeSec!,
    0,
  );
  const totalMovingTimeMin = Math.round(totalMovingTimeSec / 60);
  const avgRestTimeSec =
    activitiesWithRest.length > 0
      ? Math.round(
          activitiesWithRest.reduce(
            (sum, a) => sum + (a.elapsedTimeSec! - a.movingTimeSec!),
            0,
          ) / activitiesWithRest.length,
        )
      : null;

  const longest = activities.reduce((best, a) =>
    a.distance > best.distance ? a : best,
  );
  const currentLongKm = Math.round((longest.distance / 1000) * 10) / 10;

  const bestPaceActivity = activities.reduce((best, a) =>
    a.avgPaceSec < best.avgPaceSec ? a : best,
  );

  const lastActivity = activities[activities.length - 1];
  const firstActivity = activities[0];
  const avgHr = Math.round(
    activities.reduce((sum, a) => sum + a.avgHr, 0) / activities.length,
  );

  const paceValues = activities.map((a) => a.avgPaceSec);
  const trendLine = linearTrend(paceValues);
  const trendStartSec = trendLine[0];
  const trendEndSec = trendLine[trendLine.length - 1];

  const rangeStart = firstActivity.date;
  const rangeEnd = lastActivity.date;
  const rangeDays =
    (new Date(rangeEnd).getTime() - new Date(rangeStart).getTime()) /
    (1000 * 60 * 60 * 24);
  const rangeYears = rangeDays / 365.25;
  const trendSecPerYear = Math.round(
    Math.abs((trendStartSec - trendEndSec) / Math.max(rangeYears, 0.1)),
  );
  const trendSecPerDay =
    Math.round(((trendStartSec - trendEndSec) / Math.max(rangeDays, 1)) * 100) /
    100;
  const trendSecPerMonth = Math.round(trendSecPerDay * 30.44 * 10) / 10;

  const earlyCount = Math.max(1, Math.floor(activities.length / 3));
  const recentCount = Math.max(1, Math.floor(activities.length / 3));
  const earlyAvg =
    activities
      .slice(0, earlyCount)
      .reduce((sum, a) => sum + a.avgPaceSec, 0) / earlyCount;
  const recentAvg =
    activities
      .slice(-recentCount)
      .reduce((sum, a) => sum + a.avgPaceSec, 0) / recentCount;
  const improvementSec = Math.round(earlyAvg - recentAvg);

  const recent5 = activities.slice(-5);
  const recent5AvgSec =
    recent5.reduce((sum, a) => sum + a.avgPaceSec, 0) / recent5.length;
  const recent5AvgPaceLabel = formatPace(Math.round(recent5AvgSec));

  const routeM = ROUTE_DISPLAY_KM * 1000;
  const routePct = Math.round((currentLongKm / ROUTE_DISPLAY_KM) * 100);
  const planKm = plan.goalDistanceM / 1000;
  const planPct = Math.round((planKm / ROUTE_DISPLAY_KM) * 100);

  const routeNowPace = lastActivity.avgPaceLabel;
  const routeAugustPace = plan.racePace;
  const routeNowDurationMin = routeDurationMin(
    routeM,
    lastActivity.avgPaceSec,
  );
  const routeAugustDurationMin = routeDurationMin(routeM, plan.racePaceSec);

  const bestSec = bestPaceActivity.avgPaceSec;
  const currentSec = lastActivity.avgPaceSec;
  const startSec = trendStartSec;
  const paceTowardBestPct = Math.round(
    Math.max(
      0,
      Math.min(100, ((startSec - currentSec) / (startSec - bestSec)) * 100),
    ),
  );

  const goalRingCircumference = 339;
  const goalRingOffset =
    goalRingCircumference - (goalRingCircumference * routePct) / 100;

  const paceArcCircumference = 264;
  const paceArcOffset =
    paceArcCircumference -
    (paceArcCircumference * paceTowardBestPct) / 100;

  const goalBarCurrentPct = (currentLongKm / planKm) * 100;
  const goalBarRouteMarkPct = (ROUTE_DISPLAY_KM / planKm) * 100;

  const labels = activities.map((a) => a.date);
  let cum = 0;
  const cumDistance = activities.map((a) => {
    cum += a.distance;
    return cum;
  });

  const longestWeek = estimateTrainingWeek(longest.date, rangeStart);

  return {
    stats: {
      activityCount: activities.length,
      totalMeters,
      totalKm: Math.round((totalMeters / 1000) * 10) / 10,
      totalMovingTimeMin,
      avgRestTimeSec,
      lastSessionMeters: lastActivity.distance,
      lastSessionKm: Math.round((lastActivity.distance / 1000) * 10) / 10,
      poolSessions,
      owSessions,
      improvementSec,
      improvementFrom: formatPace(Math.round(earlyAvg)),
      improvementTo: formatPace(Math.round(recentAvg)),
      bestPaceLabel: bestPaceActivity.avgPaceLabel,
      bestPaceDate: bestPaceActivity.date,
      recent5AvgPaceLabel,
      avgHr,
      routeKm: ROUTE_DISPLAY_KM,
      mapDistanceKm: SWIM_ROUTE.distanceKm,
      planKm,
      currentLongKm,
      routePct,
      planPct,
      longestDate: longest.date,
      longestWeek,
      goalWeek: plan.goalWeek,
      routeNowPace,
      routeAugustPace,
      routeNowDurationMin,
      routeAugustDurationMin,
      trendSecPerYear,
      paceStart: formatPace(Math.round(trendStartSec)),
      paceTrend: formatPace(Math.round(trendEndSec)),
      paceCurrent: lastActivity.avgPaceLabel,
      paceBest: bestPaceActivity.avgPaceLabel,
      paceTowardBestPct,
      lastSwimDate: lastActivity.date,
      linearFitStart: rangeStart,
      linearFitEnd: rangeEnd,
      personalBestDate: bestPaceActivity.date,
      trendSecPerDay,
      trendSecPerMonth,
      rangeStart,
      rangeEnd,
      heroStatBarPct: Math.min(100, Math.round((totalMeters / 100000) * 100)),
      goalRingOffset,
      paceArcOffset,
      goalBarCurrentPct,
      goalBarRouteMarkPct,
    },
    chart: {
      labels,
      pace: paceValues,
      paceLabels: activities.map((a) => a.avgPaceLabel),
      distance: activities.map((a) => a.distance),
      cumDistance,
      avgHr: activities.map((a) => a.avgHr),
      maxHr: activities.map((a) => a.maxHr),
      types: activities.map((a) => a.type),
    },
    route: SWIM_ROUTE,
    plan,
  };
}
