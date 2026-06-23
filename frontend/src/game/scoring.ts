import { STAT_KEYS } from './types';
import type { Grade, Stats } from './types';

export const calculateFinalScore = (stats: Stats) =>
  STAT_KEYS.reduce((sum, key) => sum + stats[key], 0);

const allAtLeast = (stats: Stats, threshold: number) =>
  STAT_KEYS.every((key) => stats[key] >= threshold);

export function getGrade(stats: Stats): Grade {
  const score = calculateFinalScore(stats);
  if (score >= 320 && allAtLeast(stats, 50)) return 'S';
  if (score >= 270 && allAtLeast(stats, 35)) return 'A';
  if (score >= 220) return 'B';
  if (score >= 170) return 'C';
  return 'D';
}

const NEXT_GRADE: Record<Grade, { grade: Grade; cut: number } | null> = {
  S: null,
  A: { grade: 'S', cut: 320 },
  B: { grade: 'A', cut: 270 },
  C: { grade: 'B', cut: 220 },
  D: { grade: 'C', cut: 170 },
};

export function pointsToNextGrade(stats: Stats) {
  const score = calculateFinalScore(stats);
  const target = NEXT_GRADE[getGrade(stats)];
  if (!target) return { score, next: null, remaining: null };
  return { score, next: target.grade, remaining: Math.max(0, target.cut - score) };
}

