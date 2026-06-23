import { cards, cardsById } from './data/cards';
import { TOTAL_TURNS } from './game/types';
import { createRandomDeck } from './game/deck';
import { useGame } from './game/GameContext';
import { calculateFinalScore } from './game/scoring';
import { getOrCreatePlayerId } from './analytics/api';
import { useGameAnalytics } from './analytics/useGameAnalytics';
import { StatBar } from './components/StatBar';
import { EndingScreen, GameOverScreen, StartScreen } from './components/Screens';
import { ChoicePoll } from './components/ChoicePoll';
import { CardArt } from './components/CardArt';
import { ThemeSwitcher } from './design/ThemeSwitcher';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

function MobileShell({ children }: { children: ReactNode }) {
  return (
    <main className="app" id="main-content">
      {children}
      <ThemeSwitcher />
      <a
        className="deerflow-mark"
        href="https://deerflow.tech"
        target="_blank"
        rel="noreferrer"
        aria-label="Created By Deerflow (새 창)"
      >
        DF
      </a>
    </main>
  );
}

export default function App() {
  const { state, dispatch } = useGame();
  const analytics = useGameAnalytics();
  const playerIdRef = useRef<string | null>(null);
  const sessionPromiseRef = useRef<Promise<string | null> | null>(null);
  const choiceSubmissionRef = useRef<Promise<unknown> | null>(null);
  const completionSentRef = useRef(false);

  const startGame = () => {
    analytics.resetRun();
    completionSentRef.current = false;
    choiceSubmissionRef.current = null;
    dispatch({ type: 'START', cardIds: createRandomDeck(cards) });
    if (!analytics.configured) return;
    const playerId = getOrCreatePlayerId();
    playerIdRef.current = playerId;
    sessionPromiseRef.current = analytics.start.mutateAsync(playerId).catch(() => null);
  };

  const choose = (cardId: string, choiceId: string, turn: number) => {
    analytics.choice.reset();
    dispatch({ type: 'CHOOSE', choiceId });
    if (!analytics.configured || !playerIdRef.current || !sessionPromiseRef.current) return;
    choiceSubmissionRef.current = (async () => {
      const sessionId = await sessionPromiseRef.current;
      if (!sessionId || !playerIdRef.current) return;
      await analytics.choice.mutateAsync({
        playerId: playerIdRef.current,
        sessionId,
        cardId,
        choiceId,
        turn,
      });
    })().catch(() => undefined);
  };

  const restart = () => {
    analytics.resetRun();
    sessionPromiseRef.current = null;
    choiceSubmissionRef.current = null;
    completionSentRef.current = false;
    dispatch({ type: 'RESTART' });
  };

  useEffect(() => {
    const finished = state.phase === 'ending' || state.phase === 'gameover';
    if (!finished || !state.ending || !analytics.configured || completionSentRef.current) return;
    completionSentRef.current = true;
    void (async () => {
      await choiceSubmissionRef.current;
      const sessionId = await sessionPromiseRef.current;
      if (!sessionId || !playerIdRef.current || !state.ending) return;
      await analytics.complete.mutateAsync({
        playerId: playerIdRef.current,
        sessionId,
        ending: state.ending,
        finalScore: calculateFinalScore(state.stats),
        finalStats: state.stats,
      });
    })().catch(() => undefined);
  }, [analytics.complete, analytics.configured, state.ending, state.phase, state.stats]);

  const endingAnalyticsProps = {
    endingStatistic: analytics.complete.data,
    analyticsConfigured: analytics.configured,
    analyticsPending: analytics.complete.isPending,
    analyticsFailed: analytics.complete.isError,
  };

  if (state.phase === 'start') return <MobileShell><StartScreen onStart={startGame} /></MobileShell>;
  if (state.phase === 'gameover' && state.ending) return <MobileShell><GameOverScreen ending={state.ending} stats={state.stats} turn={state.turn} onRestart={restart} {...endingAnalyticsProps} /></MobileShell>;
  if (state.phase === 'ending' && state.ending) return <MobileShell><EndingScreen ending={state.ending} stats={state.stats} onRestart={restart} {...endingAnalyticsProps} /></MobileShell>;
  const card = cardsById.get(state.cardIds[state.cardIndex]);
  if (!card) return <MobileShell><p className="analytics-notice analytics-notice--error">카드를 불러오지 못했습니다. 게임을 다시 시작해주세요.</p></MobileShell>;
  return (
    <MobileShell>
      <header className="mobile-hud">
        <div className="top">
          <div>
            <span className="logo">오늘도 무사퇴근</span>
            <span className={`category category--${card.category}`}>{card.category === 'ethics' ? '윤리' : '근태'}</span>
          </div>
          <b aria-label={`${TOTAL_TURNS}턴 중 ${state.turn}턴`}><em>{state.turn}</em> / {TOTAL_TURNS}</b>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="오늘의 진행률"
          aria-valuemin={1}
          aria-valuemax={TOTAL_TURNS}
          aria-valuenow={state.turn}
        >
          <span style={{ width: `${state.turn * 10}%` }} />
        </div>
        <StatBar stats={state.stats} delta={state.phase === 'result' ? state.lastChoice?.delta : null} />
      </header>

      <section className={`panel card card--${state.phase}`} aria-live="polite">
        {state.phase === 'card' ? (
          <>
            <p className="card-no"><span>CASE</span> {String(state.turn).padStart(2, '0')}</p>
            <h1>{card.title}</h1>
            <p className="description">{card.description}</p>
            <CardArt cardId={card.id} />
            <div className="choices" aria-label="선택지">
              {card.choices.map((choice, i) => (
                <button key={choice.id} onClick={() => choose(card.id, choice.id, state.turn)}>
                  <span aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                  <strong>{choice.text}</strong>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="result-content">
            <div className="result-check" aria-hidden="true">✓</div>
            <p className="card-no">처리 결과</p>
            <h2>{state.lastChoice?.resultText}</h2>
            {state.lastChoice && (
              <ChoicePoll
                choices={card.choices}
                selectedChoiceId={state.lastChoice.choiceId}
                statistics={analytics.choice.data}
                configured={analytics.configured}
                pending={analytics.choice.isPending}
                failed={analytics.choice.isError}
              />
            )}
            <button className="primary next" onClick={() => dispatch({ type: 'NEXT' })}>
              {state.turn === TOTAL_TURNS ? '퇴근 결과 보기' : '다음 문의'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </section>
    </MobileShell>
  );
}
