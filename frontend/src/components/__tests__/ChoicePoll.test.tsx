import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChoicePoll } from '../ChoicePoll';
import type { Choice } from '../../game/types';

const choices: Choice[] = [
  { id: 'a', text: '첫 번째', archetype: 'principled', effects: {}, resultText: '결과 A' },
  { id: 'b', text: '두 번째', archetype: 'kind', effects: {}, resultText: '결과 B' },
];

describe('ChoicePoll', () => {
  it('shows every choice percentage and marks the player choice', () => {
    render(
      <ChoicePoll
        choices={choices}
        selectedChoiceId="b"
        statistics={[
          { choiceId: 'a', choiceCount: 3, percentage: 25 },
          { choiceId: 'b', choiceCount: 9, percentage: 75 },
        ]}
        configured
        pending={false}
        failed={false}
      />,
    );
    expect(screen.getByText('25.0%')).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
    expect(screen.getByText('내 선택')).toBeInTheDocument();
    expect(screen.getByText('총 12회')).toBeInTheDocument();
  });

  it('explains that server setup is required when unconfigured', () => {
    render(<ChoicePoll choices={choices} selectedChoiceId="a" configured={false} pending={false} failed={false} />);
    expect(screen.getByText(/통계 서버를 연결하면/)).toBeInTheDocument();
  });
});

