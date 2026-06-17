import { VOLUME_MILESTONE_KM } from "./constants";
import type { SwimStats } from "./types";

const LOCALE = "en-US";

export function fmtNum(n: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(LOCALE, opts).format(n);
}

export function fmtMeters(m: number) {
  return `${fmtNum(m)} m`;
}

export function fmtKm(km: number, decimals = 1) {
  return `${fmtNum(km, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} km`;
}

export function fmtKmValue(km: number, decimals = 1) {
  return fmtNum(km, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtPacePer100m(paceStr: string) {
  return `${paceStr}/100m`;
}

export function fmtPaceSlash(paceStr: string) {
  return `${paceStr} / 100m`;
}

export function fmtDurationFromMinutes(totalMin: number) {
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function fmtDurationFromSeconds(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

export function fmtSeconds(s: number) {
  return `${fmtNum(s)}s`;
}

export function fmtSignedSeconds(s: number) {
  const sign = s < 0 ? "−" : "";
  return `${sign}${fmtNum(Math.abs(s))}s`;
}

export function fmtSecRate(n: number) {
  return fmtNum(n, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

export function fmtBpm(n: number) {
  return `${fmtNum(n)} bpm`;
}

export function fmtDate(
  dateStr: string,
  style: "medium" | "monthDay" | "monthYear" = "medium",
) {
  const d = new Date(dateStr);
  if (style === "monthDay") {
    return d.toLocaleDateString(LOCALE, { month: "short", day: "numeric" });
  }
  if (style === "monthYear") {
    return d.toLocaleDateString(LOCALE, { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString(LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateRange(start: string, end: string) {
  return `${fmtDate(start, "monthYear")} – ${fmtDate(end, "monthYear")}`;
}

export function fmtShortDate(d: string) {
  return new Date(d).toLocaleDateString(LOCALE, {
    month: "short",
    day: "numeric",
  });
}

function buildHeroSummary(stats: SwimStats): string | null {
  const parts = [`${fmtNum(stats.activityCount)} sessions`];

  if (stats.totalMovingTimeMin > 0) {
    parts.push(fmtDurationFromMinutes(stats.totalMovingTimeMin));
  }
  if (stats.avgRestTimeSec != null) {
    parts.push(`${fmtDurationFromSeconds(stats.avgRestTimeSec)} avg rest`);
  }

  return parts.join(" · ");
}

export function buildSwimmingCopy(stats: SwimStats) {
  const routeDistance = fmtKm(stats.routeKm, 1);
  const planDistance = fmtKm(stats.planKm, 1);
  const nowDistance = fmtKm(stats.currentLongKm, 1);
  const sessionThird = Math.max(1, Math.floor(stats.activityCount / 3));

  return {
    activities: `${fmtNum(stats.activityCount)} activities`,
    dateRange: fmtDateRange(stats.rangeStart, stats.rangeEnd),
    metersAcross: `${fmtMeters(stats.totalMeters)} across all sessions`,
    heroSwimTime:
      stats.totalMovingTimeMin > 0
        ? fmtDurationFromMinutes(stats.totalMovingTimeMin)
        : null,
    heroRestTime:
      stats.avgRestTimeSec != null
        ? fmtDurationFromSeconds(stats.avgRestTimeSec)
        : null,
    heroSummary: buildHeroSummary(stats),
    volumeMilestoneLabel: `${fmtKm(VOLUME_MILESTONE_KM, 0)} milestone`,
    volumeMilestonePct: `${fmtNum(stats.heroStatBarPct)}% · ${fmtKm(stats.totalKm, 1)} of ${fmtKm(VOLUME_MILESTONE_KM, 0)}`,
    totalSwimTime:
      stats.totalMovingTimeMin > 0
        ? `${fmtDurationFromMinutes(stats.totalMovingTimeMin)} total swim time`
        : null,
    avgRestPerSession:
      stats.avgRestTimeSec != null
        ? `${fmtDurationFromSeconds(stats.avgRestTimeSec)} avg rest per session`
        : null,
    poolOw: `${fmtNum(stats.poolSessions)} pool · ${fmtNum(stats.owSessions)} OW`,
    lastSessionSub: `${fmtMeters(stats.lastSessionMeters)} · ${fmtDate(stats.lastSwimDate, "monthDay")}`,
    per100m: `per 100m · ${fmtDate(stats.bestPaceDate, "monthDay")}`,
    improvementSub: `${stats.improvementFrom} → ${stats.improvementTo}`,
    recent5AvgDetail: "Last 5 sessions avg",
    bpmAllSessions: "bpm · all sessions",
    goalTitle: `August Goal · ${routeDistance} Swim`,
    goalDesc: `Projections from training plan · Week ${stats.goalWeek} taper & race (${planDistance} @ ${fmtPacePer100m(stats.routeAugustPace)})`,
    weekTag: `Week ${stats.goalWeek}`,
    longestSub: `${fmtNum(stats.routePct)}% of route · ${fmtDate(stats.longestDate, "monthDay")} (Week ${stats.longestWeek})`,
    projectedSub: `${planDistance} ÷ ${routeDistance} route`,
    routeNowSub: `@ ${fmtPacePer100m(stats.routeNowPace)} · ${routeDistance} course`,
    routeAugustSub: `@ ${fmtPacePer100m(stats.routeAugustPace)} · plan race pace`,
    goalBarMid: `<strong>${nowDistance}</strong> now (${fmtNum(stats.routePct)}%) · <strong>${planDistance}</strong> plan (${fmtNum(stats.planPct)}%)`,
    legendCurrent: `Current (${fmtNum(stats.routePct)}% of route)`,
    legendPlan: `Week ${stats.goalWeek} plan (${fmtNum(stats.planPct)}% of route)`,
    legendFinish: `Route finish (${routeDistance})`,
    mapDesc: `Satellite track · open water · ${routeDistance} straight-line course`,
    estTimeLabel: `Est. time @ ${stats.routeAugustPace}`,
    paceTrendDesc: `Linear trend across all ${fmtNum(stats.activityCount)} activities · ${fmtDateRange(stats.rangeStart, stats.rangeEnd)}`,
    trendTag: `−${fmtNum(stats.trendSecPerYear)} sec / year`,
    lastSwim: `Last swim · ${fmtDate(stats.lastSwimDate)}`,
    linearFitStart: `Linear fit · ${fmtDate(stats.linearFitStart, "monthYear")}`,
    linearFitEnd: `Linear fit · ${fmtDate(stats.linearFitEnd, "monthYear")}`,
    personalBest: `Personal best · ${fmtDate(stats.personalBestDate, "monthDay")}`,
    improvementDefinition: `Avg of first ${fmtNum(sessionThird)} vs last ${fmtNum(sessionThird)} sessions · positive = faster`,
    trendRateDetail: `${fmtSecRate(stats.trendSecPerDay)}/day · ${fmtSecRate(stats.trendSecPerMonth)}/mo`,
    secRate: fmtSecRate(stats.trendSecPerDay),
  };
}
