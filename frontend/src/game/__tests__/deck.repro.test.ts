import { describe, expect, it } from 'vitest';
import { createRandomDeck } from '../deck';
import { gameReducer, INITIAL_STATE } from '../reducer';
import { cards, cardsById } from '../../data/cards';
import type { GameState } from '../reducer';

/** Play a full run, always picking the most stat-positive choice to avoid early game over. */
function playFullRun(): string[] {
  let state: GameState = gameReducer(INITIAL_STATE, { type: 'START', cardIds: createRandomDeck(cards) });
  const shown: string[] = [];
  for (let i = 0; i < 12 && (state.phase === 'card'); i += 1) {
    const cardId = state.cardIds[state.cardIndex];
    shown.push(cardId);
    const card = cardsById.get(cardId)!;
    // pick the choice with the highest summed effect so stats survive 10 turns
    const best = [...card.choices].sort((a, b) => sum(b.effects) - sum(a.effects))[0];
    state = gameReducer(state, { type: 'CHOOSE', choiceId: best.id });
    if (state.phase === 'result') state = gameReducer(state, { type: 'NEXT' });
  }
  return shown;
}

function sum(effects: Record<string, number | undefined>): number {
  return Object.values(effects).reduce<number>((acc, v) => acc + (v ?? 0), 0);
}

describe('no duplicate cards within a single playthrough (reproduction)', () => {
  it('createRandomDeck yields 10 unique ids across 20000 real-random draws', () => {
    for (let i = 0; i < 20000; i += 1) {
      const deck = createRandomDeck(cards, 10);
      expect(new Set(deck).size, `dup in deck: ${deck}`).toBe(10);
    }
  });

  it('a full simulated playthrough never shows the same card twice (5000 runs)', () => {
    for (let i = 0; i < 5000; i += 1) {
      const shown = playFullRun();
      expect(new Set(shown).size, `dup shown: ${shown}`).toBe(shown.length);
    }
  });
});
