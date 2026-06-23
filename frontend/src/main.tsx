import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { GameProvider } from './game/GameContext';
import { initializeTheme } from './design/themes';
import './styles/themes.css';
import './styles/base.css';
import './styles/game.css';

initializeTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
    mutations: { retry: 0 },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GameProvider><App /></GameProvider>
    </QueryClientProvider>
  </StrictMode>,
);
