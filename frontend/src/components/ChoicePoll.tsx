import type { ChoiceStatistic } from '../analytics/api';
import type { Choice } from '../game/types';

export function ChoicePoll({
  choices,
  selectedChoiceId,
  statistics,
  configured,
  pending,
  failed,
}: {
  choices: Choice[];
  selectedChoiceId: string;
  statistics?: ChoiceStatistic[];
  configured: boolean;
  pending: boolean;
  failed: boolean;
}) {
  if (!configured) {
    return <p className="analytics-notice">통계 서버를 연결하면 전체 사용자의 선택 비율이 여기에 표시됩니다.</p>;
  }
  if (pending) return <p className="analytics-notice" role="status">선택 통계를 불러오는 중…</p>;
  if (failed || !statistics) return <p className="analytics-notice analytics-notice--error">통계를 불러오지 못했어요. 게임은 계속할 수 있습니다.</p>;

  return (
    <section className="choice-poll" aria-labelledby="choice-poll-title">
      <div className="poll-heading">
        <h3 id="choice-poll-title">다른 담당자들의 선택</h3>
        <span>총 {statistics.reduce((sum, item) => sum + item.choiceCount, 0).toLocaleString()}회</span>
      </div>
      <ol>
        {choices.map((choice, index) => {
          const statistic = statistics.find((item) => item.choiceId === choice.id);
          const percentage = statistic?.percentage ?? 0;
          const selected = choice.id === selectedChoiceId;
          return (
            <li key={choice.id} className={selected ? 'poll-row poll-row--selected' : 'poll-row'}>
              <div className="poll-label">
                <span>{String.fromCharCode(65 + index)}{selected && <b>내 선택</b>}</span>
                <strong>{percentage.toFixed(1)}%</strong>
              </div>
              <div className="poll-track" aria-hidden="true"><span style={{ width: `${percentage}%` }} /></div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

