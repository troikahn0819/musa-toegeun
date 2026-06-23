import { describe, expect, it } from 'vitest';
import { cards } from '../../data/cards';
import { cardArt, getCardArt } from '../cardArt';

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const RGB = /rgba?\(/i;
const HSL = /hsla?\(/i;
// 색·텍스트가 들어갈 수 있어 테마/언어 중립성을 깨는 요소들
const FORBIDDEN = /<\s*(script|text|textPath|image|foreignObject|style)\b/i;

describe('card illustrations', () => {
  it('provides art for every card in the pool', () => {
    for (const card of cards) {
      expect(getCardArt(card.id), `missing art for ${card.id}`).toBeDefined();
    }
  });

  it('has exactly one art entry per card and no orphans', () => {
    expect(Object.keys(cardArt).sort()).toEqual(cards.map((c) => c.id).sort());
  });

  for (const card of cards) {
    describe(card.id, () => {
      const art = getCardArt(card.id)!;

      it('uses the shared 16:9 viewBox and a non-empty alt + body', () => {
        expect(art.viewBox).toBe('0 0 480 270');
        expect(art.title.trim().length).toBeGreaterThan(0);
        expect(art.body.length).toBeGreaterThan(60);
      });

      it('opens with the shared paper-deep frame rect', () => {
        expect(art.body.trimStart().startsWith('<rect')).toBe(true);
        expect(art.body).toContain('fill="var(--paper-deep)"');
      });

      it('is themeable — no hardcoded colors', () => {
        expect(HEX.test(art.body), 'raw hex color found').toBe(false);
        expect(RGB.test(art.body), 'rgb() color found').toBe(false);
        expect(HSL.test(art.body), 'hsl() color found').toBe(false);
      });

      it('is language-neutral and safe — no text/script/external elements', () => {
        expect(FORBIDDEN.test(art.body)).toBe(false);
      });

      it('is safe to inline inside a JS template literal', () => {
        expect(art.body.includes('`')).toBe(false);
        expect(art.body.includes('${')).toBe(false);
      });
    });
  }
});
