import { TOTAL_TURNS } from './types';
import type { Card } from './types';

/** Fisher-Yates shuffle. `random` is injectable so selection can be tested deterministically. */
export function createRandomDeck(
  pool: readonly Card[],
  count = TOTAL_TURNS,
  random: () => number = Math.random,
): string[] {
  if (count < 1) throw new Error('Deck size must be positive.');
  if (pool.length < count) throw new Error(`At least ${count} cards are required.`);
  const ids = pool.map((card) => card.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [ids[index], ids[target]] = [ids[target], ids[index]];
  }
  return ids.slice(0, count);
}

