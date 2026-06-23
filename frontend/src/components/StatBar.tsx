import { STAT_KEYS, STAT_META } from '../game/types';
import type { Stats } from '../game/types';
export function StatBar({ stats, delta }: { stats: Stats; delta?: Stats | null }) {
  return <ul className="stats" aria-label="현재 지표">{STAT_KEYS.map((key) => {
    const value = stats[key]; const change = delta?.[key];
    return <li className={value <= 20 ? 'stat danger' : 'stat'} key={key}>
      <div className="stat-head"><span>{STAT_META[key].label}</span><span className="stat-number">{value}{change !== undefined && <b className={change >= 0 ? 'up' : 'down'}>{change > 0 ? ` +${change}` : ` ${change}`}</b>}</span></div>
      <div className="gauge"><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
    </li>;
  })}</ul>;
}

