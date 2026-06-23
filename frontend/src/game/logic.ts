import { STAT_KEYS } from './types';
import type { Effects, GameOverReason, Stats } from './types';

export const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function applyEffects(stats: Stats, effects: Effects): Stats {
  return Object.fromEntries(
    STAT_KEYS.map((key) => [key, stats[key] + (effects[key] ?? 0)]),
  ) as unknown as Stats;
}

export function clampStats(stats: Stats): Stats {
  return Object.fromEntries(STAT_KEYS.map((key) => [key, clamp(stats[key])])) as unknown as Stats;
}

export function checkGameOver(stats: Stats): GameOverReason {
  if (stats.mental <= 0) return 'MENTAL_OUT';
  if (stats.progress <= 0) return 'PROGRESS_OUT';
  if (stats.complaintControl <= 0) return 'COMPLAINT_OUT';
  if (stats.riskControl <= 0) return 'RISK_CONTROL_OUT';
  return null;
}

export function resolveTurn(prev: Stats, effects: Effects) {
  const raw = applyEffects(prev, effects);
  const gameOver = checkGameOver(raw);
  const stats = gameOver ? raw : clampStats(raw);
  const delta = Object.fromEntries(
    STAT_KEYS.map((key) => [key, stats[key] - prev[key]]),
  ) as unknown as Stats;
  return { stats, gameOver, delta };
}

