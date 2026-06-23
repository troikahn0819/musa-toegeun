import { describe, expect, it } from 'vitest';
import { getEndingArt } from '../endingArt';
import type { EndingResult } from '../../game/endings';

const ending = (over: Partial<EndingResult>): EndingResult => ({
  kind: 'grade',
  id: 'A',
  title: 't',
  text: 'x',
  ...over,
});

describe('ending art mapping', () => {
  it('shows the clear illustration for S and A grade endings', () => {
    expect(getEndingArt(ending({ kind: 'grade', grade: 'S', id: 'S' }))?.src).toBeTruthy();
    expect(getEndingArt(ending({ kind: 'grade', grade: 'A', id: 'A' }))?.src).toBeTruthy();
  });

  it('shows the bomb-passing illustration for the bomb special ending', () => {
    expect(getEndingArt(ending({ kind: 'special', id: 'bomb' }))?.src).toBeTruthy();
  });

  it('shows the bomb game-over illustration for risk-control failure', () => {
    expect(getEndingArt(ending({ kind: 'gameover', id: 'RISK_CONTROL_OUT' }))?.src).toBeTruthy();
  });

  it('returns nothing for endings without matching art', () => {
    expect(getEndingArt(ending({ kind: 'grade', grade: 'B', id: 'B' }))).toBeUndefined();
    expect(getEndingArt(ending({ kind: 'gameover', id: 'MENTAL_OUT' }))).toBeUndefined();
    expect(getEndingArt(ending({ kind: 'special', id: 'principle' }))).toBeUndefined();
  });

  it('provides descriptive alt text for accessibility', () => {
    const art = getEndingArt(ending({ kind: 'special', id: 'bomb' }));
    expect(art?.alt.length ?? 0).toBeGreaterThan(0);
  });
});
