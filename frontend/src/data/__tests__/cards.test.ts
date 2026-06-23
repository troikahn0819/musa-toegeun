import { describe, expect, it } from 'vitest';
import { cards } from '../cards';

describe('card data', () => {
  it('contains ten ethics and five attendance cards', () => {
    expect(cards).toHaveLength(15);
    expect(cards.filter(c => c.category === 'ethics')).toHaveLength(10);
    expect(cards.filter(c => c.category === 'attendance')).toHaveLength(5);
  });
  it('has unique ids, 3-4 choices, and bounded finite effects', () => {
    const ids = cards.flatMap(c => [c.id, ...c.choices.map(ch => ch.id)]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const card of cards) {
      expect(card.choices.length).toBeGreaterThanOrEqual(3);
      expect(card.choices.length).toBeLessThanOrEqual(4);
      for (const choice of card.choices) for (const value of Object.values(choice.effects)) {
        expect(Number.isFinite(value)).toBe(true);
        expect(Math.abs(value!)).toBeLessThanOrEqual(30);
      }
    }
  });
});
