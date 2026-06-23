import { describe, expect, it } from 'vitest';
import { checkGameOver, resolveTurn } from '../logic';
import { getGrade, pointsToNextGrade } from '../scoring';
import { resolveEnding } from '../endings';
import { createRandomDeck } from '../deck';
import { cards } from '../../data/cards';

describe('game rules', () => {
  it('checks game over before clamping and preserves priority', () => {
    const result = resolveTurn({ mental: 5, progress: 5, complaintControl: 70, riskControl: 70 }, { mental: -10, progress: -10 });
    expect(result.gameOver).toBe('MENTAL_OUT');
    expect(result.stats.mental).toBe(-5);
    expect(checkGameOver({ mental: 1, progress: 0, complaintControl: 0, riskControl: 0 })).toBe('PROGRESS_OUT');
  });
  it('applies grade gates and reports a gate-blocked next grade', () => {
    const unbalanced = { mental: 30, progress: 95, complaintControl: 95, riskControl: 100 };
    expect(getGrade(unbalanced)).toBe('B');
    expect(pointsToNextGrade(unbalanced)).toEqual({ score: 320, next: 'A', remaining: 0 });
  });
  it('gives game over precedence over special endings', () => {
    expect(resolveEnding({ mental: 0, progress: 95, complaintControl: 80, riskControl: 20 }, 'MENTAL_OUT').kind).toBe('gameover');
  });
  it('draws ten unique cards from an extensible card pool', () => {
    const deck = createRandomDeck(cards, 10, () => 0.42);
    expect(deck).toHaveLength(10);
    expect(new Set(deck).size).toBe(10);
    expect(deck.every((id) => cards.some((card) => card.id === id))).toBe(true);
  });
  it('produces different decks when the random source changes', () => {
    expect(createRandomDeck(cards, 10, () => 0)).not.toEqual(createRandomDeck(cards, 10, () => 0.99));
  });
});
