import type { SwimActivity, SwimPlan } from "./types";

export function parsePaceToSeconds(pace: string): number {
  const parts = pace.trim().split(":");
  if (parts.length !== 2) return 0;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

export function formatPace(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function parseDistance(value: string): number {
  return parseInt(value.replace(/,/g, ""), 10);
}

export function parseDurationToSeconds(value: string): number {
  if (!value || value === "--") return 0;

  const parts = value.trim().split(":");
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseFloat(s);
  }
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  }
  return 0;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  fields.push(current);
  return fields;
}

export function parseActivitiesCsv(csv: string): SwimActivity[] {
  const lines = csv.trim().split("\n");
  const activities: SwimActivity[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    if (row.length < 12) continue;

    const date = row[1].slice(0, 10);
    const avgPaceLabel = row[10];
    const bestPaceLabel = row[11];

    const hasTimeData = row.length >= 23;
    const movingTimeSec = hasTimeData
      ? parseDurationToSeconds(row[21])
      : undefined;
    const elapsedTimeSec = hasTimeData
      ? parseDurationToSeconds(row[22])
      : undefined;

    activities.push({
      type: row[0],
      date,
      distance: parseDistance(row[4]),
      avgHr: parseInt(row[7], 10),
      maxHr: parseInt(row[8], 10),
      avgPaceSec: parsePaceToSeconds(avgPaceLabel),
      avgPaceLabel,
      bestPaceSec: parsePaceToSeconds(bestPaceLabel),
      bestPaceLabel,
      movingTimeSec,
      elapsedTimeSec,
    });
  }

  return activities.sort((a, b) => a.date.localeCompare(b.date));
}

export function parsePlanMd(plan: string): SwimPlan {
  const weekMatch = plan.match(/Week\s+(\d+)/i);
  const goalMatch = plan.match(/(\d[\d,]*)\s*m\s*\(?Goal/i);
  const paceMatch = plan.match(/Pace per 100m:\s*(\d:\d+)/i);

  const goalDistanceM = goalMatch
    ? parseInt(goalMatch[1].replace(/,/g, ""), 10)
    : 16000;
  const racePace = paceMatch?.[1] ?? "3:13";

  return {
    goalWeek: weekMatch ? parseInt(weekMatch[1], 10) : 24,
    goalDistanceM,
    racePace,
    racePaceSec: parsePaceToSeconds(racePace),
  };
}

export function linearTrend(values: number[]): number[] {
  const n = values.length;
  if (n === 0) return [];

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return values.map((_, i) => slope * i + intercept);
}

export function estimateTrainingWeek(dateStr: string, rangeStart: string): number {
  const start = new Date(rangeStart);
  const date = new Date(dateStr);
  const diffDays = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(1, Math.floor(diffDays / 7) + 1);
}
