import { cardsById } from '../data/cards';
import { resolveEnding } from './endings';
import { resolveTurn } from './logic';
import { INITIAL_STATS, TOTAL_TURNS } from './types';
import type { EndingResult } from './endings';
import type { GameOverReason, Stats } from './types';

export type Phase = 'start' | 'card' | 'result' | 'gameover' | 'ending';
export interface LastChoice { choiceId: string; resultText: string; delta: Stats }
export interface GameState { phase: Phase; turn: number; cardIndex: number; cardIds: string[]; stats: Stats; lastChoice: LastChoice | null; gameOverReason: GameOverReason; ending: EndingResult | null }
export type Action = { type: 'START'; cardIds: string[] } | { type: 'CHOOSE'; choiceId: string } | { type: 'NEXT' } | { type: 'RESTART' };

export const INITIAL_STATE: GameState = { phase: 'start', turn: 1, cardIndex: 0, cardIds: [], stats: INITIAL_STATS, lastChoice: null, gameOverReason: null, ending: null };

export function gameReducer(state: GameState, action: Action): GameState {
  if (action.type === 'START') {
    if (state.phase !== 'start' || action.cardIds.length !== TOTAL_TURNS) return state;
    const uniqueIds = new Set(action.cardIds);
    if (uniqueIds.size !== TOTAL_TURNS || action.cardIds.some((id) => !cardsById.has(id))) return state;
    return { ...INITIAL_STATE, cardIds: [...action.cardIds], phase: 'card' };
  }
  if (action.type === 'RESTART') return { ...INITIAL_STATE };
  if (action.type === 'CHOOSE') {
    if (state.phase !== 'card') return state;
    const card = cardsById.get(state.cardIds[state.cardIndex]);
    const choice = card?.choices.find((item) => item.id === action.choiceId);
    if (!choice) return state;
    const { stats, gameOver, delta } = resolveTurn(state.stats, choice.effects);
    const lastChoice = { choiceId: choice.id, resultText: choice.resultText, delta };
    if (gameOver) return { ...state, stats, lastChoice, gameOverReason: gameOver, ending: resolveEnding(stats, gameOver), phase: 'gameover' };
    return { ...state, stats, lastChoice, phase: 'result' };
  }
  if (action.type === 'NEXT') {
    if (state.phase !== 'result') return state;
    if (state.turn >= TOTAL_TURNS) return { ...state, lastChoice: null, ending: resolveEnding(state.stats, null), phase: 'ending' };
    return { ...state, turn: state.turn + 1, cardIndex: state.cardIndex + 1, lastChoice: null, phase: 'card' };
  }
  return state;
}
