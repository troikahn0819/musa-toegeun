import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EndingScreen, GameOverScreen } from '../Screens';
import type { EndingResult } from '../../game/endings';
import { INITIAL_STATS } from '../../game/types';

const analytics = { analyticsConfigured: false, analyticsPending: false, analyticsFailed: false };

describe('ending screens render their illustration', () => {
  it('shows the clear illustration on an A-grade ending screen', () => {
    const ending: EndingResult = { kind: 'grade', id: 'A', grade: 'A', title: '안정적 퇴근', text: 'x' };
    render(<EndingScreen ending={ending} stats={INITIAL_STATS} onRestart={() => {}} {...analytics} />);
    expect(screen.getByRole('img', { name: /퇴근/ })).toBeInTheDocument();
  });

  it('shows the bomb illustration on the risk-control game-over screen', () => {
    const ending: EndingResult = { kind: 'gameover', id: 'RISK_CONTROL_OUT', title: '폭탄관리 실패', text: 'x' };
    render(<GameOverScreen ending={ending} stats={INITIAL_STATS} turn={6} onRestart={() => {}} {...analytics} />);
    expect(screen.getByRole('img', { name: /폭탄/ })).toBeInTheDocument();
  });

  it('renders no illustration for endings without matching art', () => {
    const ending: EndingResult = { kind: 'gameover', id: 'MENTAL_OUT', title: '멘탈 방전', text: 'x' };
    render(<GameOverScreen ending={ending} stats={INITIAL_STATS} turn={4} onRestart={() => {}} {...analytics} />);
    expect(screen.queryByRole('img')).toBeNull();
  });
});
