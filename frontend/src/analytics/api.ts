import { createClient } from '@supabase/supabase-js';
import type { EndingResult } from '../game/endings';
import type { Stats } from '../game/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isAnalyticsConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isAnalyticsConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export interface ChoiceStatistic {
  choiceId: string;
  choiceCount: number;
  percentage: number;
}

export interface EndingStatistic {
  endingId: string;
  endingCount: number;
  completedCount: number;
  percentage: number;
}

const invoke = async <T>(body: Record<string, unknown>): Promise<T> => {
  if (!supabase) throw new Error('통계 서버가 연결되지 않았습니다.');
  const { data, error } = await supabase.functions.invoke<T>('game-analytics', { body });
  if (error) throw new Error(error.message);
  if (data === null) throw new Error('통계 서버가 빈 응답을 반환했습니다.');
  return data;
};

export function getOrCreatePlayerId(): string {
  const key = 'musa-toegeun-player-id';
  const saved = localStorage.getItem(key);
  if (saved) return saved;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

export async function startAnalyticsSession(playerId: string): Promise<string> {
  const data = await invoke<{ sessionId: string }>({ action: 'start', playerId });
  return data.sessionId;
}

export async function recordChoice(input: {
  playerId: string;
  sessionId: string;
  cardId: string;
  choiceId: string;
  turn: number;
}): Promise<ChoiceStatistic[]> {
  const data = await invoke<{
    statistics: Array<{ choice_id: string; choice_count: number | string; percentage: number | string }>;
  }>({ action: 'choice', ...input });
  return data.statistics.map((item) => ({
    choiceId: item.choice_id,
    choiceCount: Number(item.choice_count),
    percentage: Number(item.percentage),
  }));
}

export async function completeAnalyticsSession(input: {
  playerId: string;
  sessionId: string;
  ending: EndingResult;
  finalScore: number;
  finalStats: Stats;
}): Promise<EndingStatistic | null> {
  const data = await invoke<{
    statistic: null | {
      ending_id: string;
      ending_count: number | string;
      completed_count: number | string;
      percentage: number | string;
    };
  }>({
    action: 'complete',
    playerId: input.playerId,
    sessionId: input.sessionId,
    endingId: input.ending.id,
    endingKind: input.ending.kind,
    finalScore: input.finalScore,
    finalStats: input.finalStats,
  });
  if (!data.statistic) return null;
  return {
    endingId: data.statistic.ending_id,
    endingCount: Number(data.statistic.ending_count),
    completedCount: Number(data.statistic.completed_count),
    percentage: Number(data.statistic.percentage),
  };
}
