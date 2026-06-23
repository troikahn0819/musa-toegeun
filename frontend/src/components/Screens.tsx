import { calculateFinalScore, pointsToNextGrade } from '../game/scoring';
import { STAT_KEYS, STAT_META } from '../game/types';
import type { EndingResult } from '../game/endings';
import type { Stats } from '../game/types';
import type { EndingStatistic } from '../analytics/api';
import { StatBar } from './StatBar';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return <section className="panel hero"><p className="eyebrow">오늘 하루도 평화롭게, 아마도</p><h1>담당자님<br />문의드립니다</h1><p className="subtitle">10번의 선택으로 네 가지 지표를 지키고 무사히 퇴근하세요.</p><ul className="legend">{STAT_KEYS.map(k => <li key={k}><b>{STAT_META[k].label}</b><span>높을수록 좋음 · 0이면 게임오버</span></li>)}</ul><button className="primary" onClick={onStart}>출근하기</button></section>;
}
function EndingRate({ configured, pending, failed, statistic }: { configured: boolean; pending: boolean; failed: boolean; statistic?: EndingStatistic | null }) {
  if (!configured) return <p className="ending-rate ending-rate--muted">통계 서버를 연결하면 이 엔딩의 달성률이 표시됩니다.</p>;
  if (pending) return <p className="ending-rate ending-rate--muted" role="status">엔딩 달성률 계산 중…</p>;
  if (failed || !statistic) return <p className="ending-rate ending-rate--muted">달성률을 불러오지 못했어요.</p>;
  return <p className="ending-rate"><strong>{statistic.percentage.toFixed(1)}%</strong><span>전체 완료자 중 이 엔딩을 달성했어요</span><small>{statistic.endingCount.toLocaleString()}명 / {statistic.completedCount.toLocaleString()}명</small></p>;
}

interface AnalyticsEndingProps {
  endingStatistic?: EndingStatistic | null;
  analyticsConfigured: boolean;
  analyticsPending: boolean;
  analyticsFailed: boolean;
}

export function GameOverScreen({ ending, stats, turn, onRestart, endingStatistic, analyticsConfigured, analyticsPending, analyticsFailed }: { ending: EndingResult; stats: Stats; turn: number; onRestart: () => void } & AnalyticsEndingProps) {
  return <section className="panel ending" role="alert"><p className="stamp">업무 중단</p><h1>{ending.title}</h1><p>{ending.text}</p><p className="meta">{turn}턴에서 하루가 끝났습니다.</p><EndingRate configured={analyticsConfigured} pending={analyticsPending} failed={analyticsFailed} statistic={endingStatistic} /><StatBar stats={stats} /><button className="primary" onClick={onRestart}>다시 출근하기</button></section>;
}
export function EndingScreen({ ending, stats, onRestart, endingStatistic, analyticsConfigured, analyticsPending, analyticsFailed }: { ending: EndingResult; stats: Stats; onRestart: () => void } & AnalyticsEndingProps) {
  const score = calculateFinalScore(stats); const next = pointsToNextGrade(stats);
  const copy = () => void navigator.clipboard?.writeText(`[오늘도 무사퇴근] ${ending.title} · ${score}/400점`);
  return <section className="panel ending"><p className="stamp">{ending.kind === 'special' ? '특수 엔딩' : '퇴근 완료'}</p><h1>{ending.grade && `${ending.grade}등급 · `}{ending.title}</h1><p>{ending.text}</p><strong className="score">{score} <small>/ 400</small></strong>{next.next && <p className="meta">{next.remaining === 0 ? `${next.next}등급은 지표 균형이 더 필요해요` : `${next.next}까지 ${next.remaining}점`}</p>}<EndingRate configured={analyticsConfigured} pending={analyticsPending} failed={analyticsFailed} statistic={endingStatistic} /><StatBar stats={stats} /><div className="actions"><button onClick={copy}>결과 복사</button><button className="primary" onClick={onRestart}>다시하기</button></div></section>;
}
