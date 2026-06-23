export type StatKey = 'mental' | 'progress' | 'complaintControl' | 'riskControl';
export type Stats = Record<StatKey, number>;
export type Effects = Partial<Record<StatKey, number>>;
export type Archetype = 'principled' | 'convenient' | 'kind' | 'defer';
export type CardCategory = 'attendance' | 'ethics' | 'admin';
export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';
export type GameOverReason =
  | 'MENTAL_OUT'
  | 'PROGRESS_OUT'
  | 'COMPLAINT_OUT'
  | 'RISK_CONTROL_OUT'
  | null;

export interface Choice {
  id: string;
  text: string;
  archetype: Archetype;
  effects: Effects;
  resultText: string;
}

export interface Card {
  id: string;
  category: CardCategory;
  title: string;
  description: string;
  choices: Choice[];
}

export const TOTAL_TURNS = 10;
export const INITIAL_STATS: Stats = {
  mental: 70,
  progress: 40,
  complaintControl: 70,
  riskControl: 70,
};
export const STAT_KEYS: StatKey[] = ['mental', 'progress', 'complaintControl', 'riskControl'];
export const STAT_META: Record<StatKey, { label: string; shortLabel: string }> = {
  mental: { label: '멘탈', shortLabel: '멘탈' },
  progress: { label: '오늘의 진척', shortLabel: '진척' },
  complaintControl: { label: '민원관리지수', shortLabel: '민원' },
  riskControl: { label: '폭탄관리지수', shortLabel: '폭탄' },
};

