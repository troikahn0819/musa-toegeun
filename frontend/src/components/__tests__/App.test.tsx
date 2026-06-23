import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../../App';
import { GameProvider } from '../../game/GameContext';

function renderApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <GameProvider><App /></GameProvider>
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('starts, chooses, reveals the result, and advances', async () => {
    renderApp();
    await userEvent.click(screen.getByRole('button', { name: '출근하기' }));
    expect(screen.getByLabelText('선택지')).toBeInTheDocument();
    const firstChoice = screen.getByLabelText('선택지').querySelector('button');
    expect(firstChoice).not.toBeNull();
    await userEvent.click(firstChoice!);
    expect(screen.getByText('처리 결과')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '다음 문의' }));
    expect(screen.getByLabelText(/10턴 중 2턴/)).toBeInTheDocument();
  });
});
