# 담당자님 문의드립니다 — 오늘도 무사퇴근 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 공공기관 사무직 생존 카드 게임을 React+TS로 구현한다 — 10턴, 4지표, 조기 게임오버, 등급/특수엔딩, 다시하기까지 동작하는 MVP.

**Architecture:** 순수 게임 로직(`src/game/`)을 React에서 완전히 분리하고, 카드 데이터(`src/data/cards.ts`)도 분리한다. 상태는 단일 `useReducer` 상태머신으로 관리하고 Context로 제공한다. UI 컴포넌트는 `phase`에 따라 라우팅한다.

**Tech Stack:** React 18, TypeScript, Vite, Vitest + @testing-library/react, 일반 CSS(단일 `index.css`, Tailwind 미사용).

**기반 스펙:** `docs/superpowers/specs/2026-06-23-musa-toegeun-game-design.md`

## Global Constraints

이 제약은 **모든 태스크에 암묵적으로 포함**된다. 스펙에서 verbatim 복사.

- 지표 4개·키: `mental`(초기 70) / `progress`(초기 40) / `complaintControl`(초기 70) / `riskControl`(초기 70). **전부 "높을수록 좋음", 게임오버 `<= 0`.**
- 지표는 0~100으로 clamp. **clamp는 `resolveTurn`(내부 `clampStats`) 한 곳에서만.** StatBar·점수·reducer 어디서도 재clamp 금지.
- 효과 적용 순서: **raw 가산 → raw 기준 `checkGameOver` → 생존 시에만 clamp.**
- 게임오버 동시발동 우선순위: `mental > progress > complaintControl > riskControl` (단일 enum).
- 게임오버 판정은 10턴째 포함 모든 턴 즉시. 마지막 턴 실패도 등급이 아니라 게임오버.
- 점수식: `mental + progress + riskControl + complaintControl` (단순 합산, 0~400).
- 등급컷(잠정, D5): S≥320 / A≥270 / B≥220 / C≥170 / D<170. **S/A는 게이팅 필수** — 미충족 시 점수가 통과하는 가장 높은 밴드로 내려간다(B 이하는 게이팅 없음). S 게이팅: 4지표 모두 ≥50. A 게이팅: 4지표 모두 ≥35.
- 특수엔딩은 일반등급보다 우선, **게임오버 판이면 특수엔딩 평가 안 함**, 선언 순서 first-match: 폭탄돌리기(progress≥90 ∧ riskControl≤30) > 원칙주의(riskControl≥85 ∧ complaintControl≤30) > 친절과로(complaintControl>70 ∧ mental≤20) > 민원관리(complaintControl>70 ∧ progress≤50).
- 변동값 숨김: `ChoiceButton`은 타입상 `effects`를 prop으로 받지 못한다.
- 변동값 표시: `+N`(녹색)/`-N`(빨강)/`변화 없음`(회색), 4지표 항상 표시. clamp로 깎인 **실적용 delta**를 표시(명목값 아님).
- 다시하기: `INITIAL_STATE` 단일 상수로 한 번에 리셋.
- 접근성 최소선: 선택지/다음/다시하기는 `<button>`, 결과 영역 `aria-live="polite"`, 게임오버 `role="alert"`, `:focus-visible` 유지.
- 새로고침 시 진행 유지 안 함(지속성 미구현).
- 비목표(만들지 않음): i18n 키 카탈로그, 조건 DSL/후속이벤트 엔진, zod, 시드 PRNG/이미지 공유, 사운드/분석 SDK, 상태관리 라이브러리.
- 카드 수 `TOTAL_TURNS = 10`. 카드 effect 단일 지표 변동 절댓값 ≤ 30(무결성 테스트 상한). 카드 3장은 PRD 확정본, 7장은 임시 콘텐츠(D8 검수 대상)이되 규칙을 지킨 동작 가능한 실데이터.

---

## File Structure

| 파일 | 책임 |
|---|---|
| `src/game/types.ts` | 도메인 타입·상수(`StatKey`,`Stats`,`Effects`,`Card`,`Choice`,`GameOverReason`,`Grade`,`INITIAL_STATS`,`STAT_META`,`TOTAL_TURNS`) |
| `src/game/logic.ts` | `clamp`,`applyEffects`,`clampStats`,`checkGameOver`,`resolveTurn` |
| `src/game/scoring.ts` | `calculateFinalScore`,`getGrade`(게이팅),`pointsToNextGrade` |
| `src/game/endings.ts` | `SPECIAL_ENDINGS`,`resolveEnding`,`EndingResult` |
| `src/game/reducer.ts` | `GameState`,`INITIAL_STATE`,`gameReducer`,`Action`,`Phase` |
| `src/game/GameContext.tsx` | `GameProvider`,`useGame()` |
| `src/data/cards.ts` | 카드 10장 데이터(`satisfies Card[]`) |
| `src/ui/format.ts` | `formatDelta` |
| `src/components/StatBar.tsx` | 4지표 게이지+delta+위험경고 |
| `src/components/ChoiceButton.tsx` | 선택지 버튼(effects 미수신) |
| `src/components/CardView.tsx` | 카드 제목·설명·선택지 목록 |
| `src/components/ResultPanel.tsx` | 결과 문구+다음 버튼 |
| `src/components/StartScreen.tsx` | 시작 화면+지표 범례 |
| `src/components/GameOverScreen.tsx` | 게임오버 화면 |
| `src/components/EndingScreen.tsx` | 엔딩 화면+점수+복사 |
| `src/App.tsx` | phase 라우팅+레이아웃+aria-live |
| `src/index.css` | 전역 스타일(mobile-first) |
| `src/test/setup.ts` | 테스트 셋업 |

---

## Task 1: 프로젝트 스캐폴드 + 테스트 환경

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`(scaffold), `src/test/setup.ts`, `src/game/__tests__/smoke.test.ts`
- 작업 폴더: 현재 디렉터리(빈 그린필드, git 미초기화)

**Interfaces:**
- Produces: 동작하는 Vite+React+TS 앱, `npm test`로 Vitest 실행.

- [ ] **Step 1: git 초기화 + Vite 스캐폴드**

```bash
git init
npm create vite@latest . -- --template react-ts
npm install
```
(현재 폴더에 생성. `docs/` 등 기존 파일과 충돌하면 덮어쓰지 말고 유지할 것.)

- [ ] **Step 2: 테스트 의존성 설치**

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: `vite.config.ts`에 vitest 설정 추가**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

- [ ] **Step 4: 테스트 셋업 파일 작성**

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 5: `package.json` 스크립트에 test 추가**

`scripts`에 추가:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: 스모크 테스트 작성**

`src/game/__tests__/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs the test runner', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 7: 테스트 실행해 통과 확인**

Run: `npm test`
Expected: PASS (1 passed)

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "chore: scaffold vite react-ts with vitest"
```

---

## Task 2: 도메인 타입 & 상수

**Files:**
- Create: `src/game/types.ts`, `src/game/__tests__/types.test.ts`

**Interfaces:**
- Produces: `StatKey`, `Stats`, `Effects`, `Archetype`, `Choice`, `CardCategory`, `Card`, `GameOverReason`, `Grade`, `INITIAL_STATS`, `STAT_META`, `TOTAL_TURNS`.

- [ ] **Step 1: 실패 테스트 작성**

`src/game/__tests__/types.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { INITIAL_STATS, STAT_META, TOTAL_TURNS } from '../types';

describe('constants', () => {
  it('initial stats match spec', () => {
    expect(INITIAL_STATS).toEqual({ mental: 70, progress: 40, complaintControl: 70, riskControl: 70 });
  });
  it('all stats are higherIsBetter', () => {
    expect(Object.values(STAT_META).every((m) => m.higherIsBetter)).toBe(true);
  });
  it('STAT_META covers exactly the 4 stat keys', () => {
    expect(Object.keys(STAT_META).sort()).toEqual(['complaintControl', 'mental', 'progress', 'riskControl']);
  });
  it('has 10 turns', () => {
    expect(TOTAL_TURNS).toBe(10);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- types`
Expected: FAIL (Cannot find module '../types')

- [ ] **Step 3: 타입/상수 구현**

`src/game/types.ts`:
```ts
export type StatKey = 'mental' | 'progress' | 'complaintControl' | 'riskControl';
export type Stats = Record<StatKey, number>;
export type Effects = Partial<Record<StatKey, number>>;

export type Archetype = 'principled' | 'convenient' | 'kind' | 'defer';

export interface Choice {
  id: string;
  text: string;
  archetype: Archetype;
  effects: Effects;
  resultText: string;
}

export type CardCategory = 'attendance' | 'ethics' | 'admin';

export interface Card {
  id: string;
  category: CardCategory;
  title: string;
  description: string;
  choices: Choice[];
}

export type GameOverReason =
  | 'MENTAL_OUT'
  | 'PROGRESS_OUT'
  | 'COMPLAINT_OUT'
  | 'RISK_CONTROL_OUT'
  | null;

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

export const TOTAL_TURNS = 10;

export const INITIAL_STATS: Stats = {
  mental: 70,
  progress: 40,
  complaintControl: 70,
  riskControl: 70,
};

export const STAT_KEYS: StatKey[] = ['mental', 'progress', 'complaintControl', 'riskControl'];

export const STAT_META: Record<StatKey, { label: string; higherIsBetter: true }> = {
  mental: { label: '멘탈', higherIsBetter: true },
  progress: { label: '오늘의 진척', higherIsBetter: true },
  complaintControl: { label: '민원관리지수', higherIsBetter: true },
  riskControl: { label: '폭탄관리지수', higherIsBetter: true },
};
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- types`
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/game/types.ts src/game/__tests__/types.test.ts
git commit -m "feat: add domain types and constants"
```

---

## Task 3: 핵심 로직 — applyEffects / clamp / checkGameOver / resolveTurn

**Files:**
- Create: `src/game/logic.ts`, `src/game/__tests__/logic.test.ts`

**Interfaces:**
- Consumes: `Stats`, `Effects`, `GameOverReason`, `STAT_KEYS` (Task 2).
- Produces:
  - `clamp(value: number): number`
  - `applyEffects(stats: Stats, effects: Effects): Stats` (raw 가산, clamp 없음)
  - `clampStats(stats: Stats): Stats`
  - `checkGameOver(stats: Stats): GameOverReason`
  - `resolveTurn(prev: Stats, effects: Effects): { stats: Stats; gameOver: GameOverReason; delta: Stats }`

- [ ] **Step 1: 실패 테스트 작성**

`src/game/__tests__/logic.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { clamp, applyEffects, clampStats, checkGameOver, resolveTurn } from '../logic';
import { Stats } from '../types';

const base: Stats = { mental: 70, progress: 40, complaintControl: 70, riskControl: 70 };

describe('clamp', () => {
  it('clamps to [0,100]', () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(150)).toBe(100);
    expect(clamp(50)).toBe(50);
  });
});

describe('applyEffects', () => {
  it('adds raw without clamping', () => {
    expect(applyEffects(base, { mental: -100 })).toEqual({ mental: -30, progress: 40, complaintControl: 70, riskControl: 70 });
  });
  it('treats missing keys as 0', () => {
    expect(applyEffects(base, { progress: 5 }).mental).toBe(70);
  });
});

describe('checkGameOver', () => {
  it('returns null when all > 0', () => {
    expect(checkGameOver(base)).toBeNull();
  });
  it('fires at exactly 0 (<=0)', () => {
    expect(checkGameOver({ ...base, mental: 0 })).toBe('MENTAL_OUT');
  });
  it('survives at 1', () => {
    expect(checkGameOver({ ...base, mental: 1 })).toBeNull();
  });
  it('uses priority mental > progress > complaintControl > riskControl', () => {
    expect(checkGameOver({ mental: 0, progress: 0, complaintControl: 0, riskControl: 0 })).toBe('MENTAL_OUT');
    expect(checkGameOver({ mental: 5, progress: 0, complaintControl: 0, riskControl: 0 })).toBe('PROGRESS_OUT');
    expect(checkGameOver({ mental: 5, progress: 5, complaintControl: 0, riskControl: 0 })).toBe('COMPLAINT_OUT');
    expect(checkGameOver({ mental: 5, progress: 5, complaintControl: 5, riskControl: 0 })).toBe('RISK_CONTROL_OUT');
  });
});

describe('resolveTurn', () => {
  it('clamps survivors and reports actual applied delta', () => {
    const r = resolveTurn(base, { complaintControl: 50 }); // 70+50=120 -> clamp 100
    expect(r.gameOver).toBeNull();
    expect(r.stats.complaintControl).toBe(100);
    expect(r.delta.complaintControl).toBe(30); // actual applied (100-70), not nominal 50
  });
  it('detects game over on raw value before clamping', () => {
    const r = resolveTurn(base, { mental: -100 });
    expect(r.gameOver).toBe('MENTAL_OUT');
    expect(r.stats.mental).toBe(-30); // raw kept when game over
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- logic`
Expected: FAIL (Cannot find module '../logic')

- [ ] **Step 3: 구현**

`src/game/logic.ts`:
```ts
import { Stats, Effects, GameOverReason, StatKey, STAT_KEYS } from './types';

export function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function applyEffects(stats: Stats, effects: Effects): Stats {
  const next = { ...stats };
  for (const key of STAT_KEYS) {
    next[key] = stats[key] + (effects[key] ?? 0);
  }
  return next;
}

export function clampStats(stats: Stats): Stats {
  const next = {} as Stats;
  for (const key of STAT_KEYS) {
    next[key] = clamp(stats[key]);
  }
  return next;
}

// priority: mental > progress > complaintControl > riskControl
export function checkGameOver(stats: Stats): GameOverReason {
  if (stats.mental <= 0) return 'MENTAL_OUT';
  if (stats.progress <= 0) return 'PROGRESS_OUT';
  if (stats.complaintControl <= 0) return 'COMPLAINT_OUT';
  if (stats.riskControl <= 0) return 'RISK_CONTROL_OUT';
  return null;
}

export function resolveTurn(prev: Stats, effects: Effects): { stats: Stats; gameOver: GameOverReason; delta: Stats } {
  const raw = applyEffects(prev, effects);
  const gameOver = checkGameOver(raw);
  const stats = gameOver ? raw : clampStats(raw);
  const delta = {} as Stats;
  for (const key of STAT_KEYS) {
    delta[key] = stats[key] - prev[key];
  }
  return { stats, gameOver, delta };
}
```
(미사용 import 경고 방지: `StatKey`가 불필요하면 import에서 제외해도 됨.)

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- logic`
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/game/logic.ts src/game/__tests__/logic.test.ts
git commit -m "feat: add core stat logic (applyEffects, clamp, checkGameOver, resolveTurn)"
```

---

## Task 4: 점수·등급(게이팅)·다음등급거리

**Files:**
- Create: `src/game/scoring.ts`, `src/game/__tests__/scoring.test.ts`

**Interfaces:**
- Consumes: `Stats`, `Grade` (Task 2).
- Produces:
  - `calculateFinalScore(stats: Stats): number`
  - `getGrade(stats: Stats): Grade`
  - `pointsToNextGrade(stats: Stats): { score: number; next: Grade | null; remaining: number | null }`

- [ ] **Step 1: 실패 테스트 작성**

`src/game/__tests__/scoring.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { calculateFinalScore, getGrade, pointsToNextGrade } from '../scoring';
import { Stats } from '../types';

const balanced = (n: number): Stats => ({ mental: n, progress: n, complaintControl: n, riskControl: n });

describe('calculateFinalScore', () => {
  it('is simple sum of 4 stats', () => {
    // PRD 회귀: 멘탈60+진척85+폭탄75+민원관리60 = 280
    expect(calculateFinalScore({ mental: 60, progress: 85, riskControl: 75, complaintControl: 60 })).toBe(280);
  });
});

describe('getGrade with gating', () => {
  it('grants S only when score>=320 AND all stats>=50', () => {
    expect(getGrade(balanced(80))).toBe('S'); // 320, all>=50
  });
  it('demotes S-score to A when a stat is below 50 but >=35', () => {
    // score = 49+90+90+92 = 321 (>=320) but mental 49 < 50; A gate (>=35) passes -> A
    expect(getGrade({ mental: 49, progress: 90, complaintControl: 90, riskControl: 92 })).toBe('A');
  });
  it('demotes to B when score is high but a stat is below 35', () => {
    // score = 30+95+95+100 = 320 but mental 30 < 35 -> B
    expect(getGrade({ mental: 30, progress: 95, complaintControl: 95, riskControl: 100 })).toBe('B');
  });
  it('B/C/D are score-only (no gate)', () => {
    expect(getGrade(balanced(55))).toBe('B'); // 220
    expect(getGrade({ mental: 100, progress: 70, complaintControl: 0 + 0, riskControl: 0 })).toBeDefined();
  });
  it('grade band boundaries are inclusive (>=)', () => {
    expect(getGrade(balanced(67.5))).toBe('A'); // 270, all>=35
    expect(getGrade(balanced(55))).toBe('B'); // 220
    expect(getGrade({ mental: 42.5, progress: 42.5, complaintControl: 42.5, riskControl: 42.5 })).toBe('C'); // 170
    expect(getGrade(balanced(40))).toBe('D'); // 160
  });
});

describe('pointsToNextGrade', () => {
  it('reports remaining points to next score band', () => {
    const r = pointsToNextGrade(balanced(65)); // 260 -> next A(270)
    expect(r.next).toBe('A');
    expect(r.remaining).toBe(10);
  });
  it('returns null next at top (>=320)', () => {
    const r = pointsToNextGrade(balanced(85)); // 340
    expect(r.next).toBeNull();
    expect(r.remaining).toBeNull();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- scoring`
Expected: FAIL (Cannot find module '../scoring')

- [ ] **Step 3: 구현**

`src/game/scoring.ts`:
```ts
import { Stats, Grade, StatKey, STAT_KEYS } from './types';

export function calculateFinalScore(stats: Stats): number {
  return STAT_KEYS.reduce((sum, key) => sum + stats[key], 0);
}

const S_GATE = 50;
const A_GATE = 35;

function allAtLeast(stats: Stats, threshold: number): boolean {
  return STAT_KEYS.every((key: StatKey) => stats[key] >= threshold);
}

// Score qualifies the band; S/A additionally require the balance gate.
// If a gate fails, the player falls through to the highest band they qualify for.
export function getGrade(stats: Stats): Grade {
  const score = calculateFinalScore(stats);
  if (score >= 320 && allAtLeast(stats, S_GATE)) return 'S';
  if (score >= 270 && allAtLeast(stats, A_GATE)) return 'A';
  if (score >= 220) return 'B';
  if (score >= 170) return 'C';
  return 'D';
}

const SCORE_BANDS: { grade: Grade; cut: number }[] = [
  { grade: 'S', cut: 320 },
  { grade: 'A', cut: 270 },
  { grade: 'B', cut: 220 },
  { grade: 'C', cut: 170 },
];

export function pointsToNextGrade(stats: Stats): { score: number; next: Grade | null; remaining: number | null } {
  const score = calculateFinalScore(stats);
  const band = SCORE_BANDS.find((b) => score < b.cut);
  if (!band) return { score, next: null, remaining: null };
  return { score, next: band.grade, remaining: band.cut - score };
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- scoring`
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/game/scoring.ts src/game/__tests__/scoring.test.ts
git commit -m "feat: add scoring and grade gating"
```

---

## Task 5: 엔딩 해석 — 특수엔딩/게임오버/등급엔딩

**Files:**
- Create: `src/game/endings.ts`, `src/game/__tests__/endings.test.ts`

**Interfaces:**
- Consumes: `Stats`, `GameOverReason`, `Grade` (Task 2), `getGrade` (Task 4).
- Produces:
  - `EndingResult = { kind: 'gameover' | 'special' | 'grade'; id: string; title: string; text: string; grade?: Grade }`
  - `SPECIAL_ENDINGS` (declaration order = priority)
  - `resolveEnding(stats: Stats, gameOver: GameOverReason): EndingResult`

- [ ] **Step 1: 실패 테스트 작성**

`src/game/__tests__/endings.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { resolveEnding } from '../endings';
import { Stats } from '../types';

const ok: Stats = { mental: 60, progress: 60, complaintControl: 60, riskControl: 60 };

describe('resolveEnding', () => {
  it('game over takes precedence and skips special endings', () => {
    // even if special condition holds, game over wins
    const r = resolveEnding({ mental: 0, progress: 95, complaintControl: 60, riskControl: 20 }, 'MENTAL_OUT');
    expect(r.kind).toBe('gameover');
    expect(r.id).toBe('MENTAL_OUT');
  });
  it('special ending fires by first-match priority', () => {
    // satisfies both 폭탄돌리기(progress>=90 & risk<=30) and 민원관리(cc>70 & progress<=50)? progress 95 != <=50, so only bomb
    const r = resolveEnding({ mental: 50, progress: 95, complaintControl: 80, riskControl: 25 }, null);
    expect(r.kind).toBe('special');
    expect(r.id).toBe('bomb');
  });
  it('친절과로 wins over 민원관리 when both cc>70 conditions hold', () => {
    // cc 80(>70), mental 15(<=20) -> kind; also progress 40(<=50) -> would be complaint; kind declared first
    const r = resolveEnding({ mental: 15, progress: 40, complaintControl: 80, riskControl: 60 }, null);
    expect(r.id).toBe('kind');
  });
  it('falls back to grade ending when no special matches', () => {
    const r = resolveEnding(ok, null); // 240 -> B
    expect(r.kind).toBe('grade');
    expect(r.grade).toBe('B');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- endings`
Expected: FAIL (Cannot find module '../endings')

- [ ] **Step 3: 구현**

`src/game/endings.ts`:
```ts
import { Stats, GameOverReason, Grade } from './types';
import { getGrade } from './scoring';

export interface EndingResult {
  kind: 'gameover' | 'special' | 'grade';
  id: string;
  title: string;
  text: string;
  grade?: Grade;
}

interface SpecialEnding {
  id: string;
  title: string;
  text: string;
  condition: (s: Stats) => boolean;
}

// declaration order = priority, first-match
export const SPECIAL_ENDINGS: SpecialEnding[] = [
  {
    id: 'bomb',
    title: '폭탄돌리기형',
    text: '오늘의 일은 끝났다. 하지만 어딘가에서 시한폭탄 소리가 들린다.',
    condition: (s) => s.progress >= 90 && s.riskControl <= 30,
  },
  {
    id: 'principle',
    title: '원칙주의형',
    text: '기록과 근거는 완벽하다. 다만 직원 게시판이 뜨겁다.',
    condition: (s) => s.riskControl >= 85 && s.complaintControl <= 30,
  },
  {
    id: 'kind',
    title: '친절과로형',
    text: '모두에게 친절했다. 대신 나에게는 친절하지 못했다.',
    condition: (s) => s.complaintControl > 70 && s.mental <= 20,
  },
  {
    id: 'complaint',
    title: '민원관리형',
    text: '모두가 만족했다. 업무만 빼고.',
    condition: (s) => s.complaintControl > 70 && s.progress <= 50,
  },
];

const GAMEOVER_ENDINGS: Record<Exclude<GameOverReason, null>, { title: string; text: string }> = {
  MENTAL_OUT: { title: '멘탈 방전', text: '담당자는 모니터를 바라본 채 잠시 영혼을 로그아웃했다.' },
  PROGRESS_OUT: { title: '업무 마비', text: '업무가 쌓이고 쌓여 퇴근 버튼이 비활성화되었습니다.' },
  COMPLAINT_OUT: { title: '민원 폭주', text: "게시판 제목이 전부 '담당자님 문의드립니다'로 바뀌었습니다." },
  RISK_CONTROL_OUT: { title: '폭탄관리 실패', text: '과거의 선택이 돌아왔습니다. 관련 근거와 처리 과정을 제출해야 합니다.' },
};

const GRADE_ENDINGS: Record<Grade, { title: string; text: string }> = {
  S: { title: '무사퇴근의 전설', text: '일도 처리했고, 민원도 잠재웠고, 폭탄도 관리했다.' },
  A: { title: '안정적 퇴근', text: '약간의 상처는 있지만 오늘은 성공적이다.' },
  B: { title: '찜찜한 퇴근', text: '퇴근은 했지만 내일의 내가 조금 걱정된다.' },
  C: { title: '겨우 퇴근', text: '퇴근은 했으나 여러 지표가 위험하다.' },
  D: { title: '퇴근 보류', text: '몸은 퇴근했지만 마음은 아직 사무실에 있다.' },
};

export function resolveEnding(stats: Stats, gameOver: GameOverReason): EndingResult {
  if (gameOver) {
    const e = GAMEOVER_ENDINGS[gameOver];
    return { kind: 'gameover', id: gameOver, title: e.title, text: e.text };
  }
  const special = SPECIAL_ENDINGS.find((e) => e.condition(stats));
  if (special) {
    return { kind: 'special', id: special.id, title: special.title, text: special.text };
  }
  const grade = getGrade(stats);
  const g = GRADE_ENDINGS[grade];
  return { kind: 'grade', id: grade, title: g.title, text: g.text, grade };
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- endings`
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/game/endings.ts src/game/__tests__/endings.test.ts
git commit -m "feat: add ending resolution (special/gameover/grade)"
```

---

## Task 6: 카드 데이터 10장 + 무결성 테스트

**Files:**
- Create: `src/data/cards.ts`, `src/data/__tests__/cards.test.ts`

**Interfaces:**
- Consumes: `Card`, `Archetype` (Task 2).
- Produces: `export const cards` (length 10, `satisfies Card[]`).

**주의:** complaint→complaintControl 부호 반전이 데이터에 반영됨(PRD `민원온도 +15` = `complaintControl -15`). 카드 1~3은 PRD 확정본, 4~10은 임시 콘텐츠(D8 검수 대상)이되 규칙 준수.

- [ ] **Step 1: 무결성 테스트 작성**

`src/data/__tests__/cards.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { cards } from '../cards';

const STAT_KEYS = ['mental', 'progress', 'complaintControl', 'riskControl'];
const ARCHETYPES = ['principled', 'convenient', 'kind', 'defer'];

describe('card data integrity', () => {
  it('has exactly 10 cards', () => {
    expect(cards).toHaveLength(10);
  });
  it('card ids are unique', () => {
    const ids = cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('choice ids are globally unique', () => {
    const ids = cards.flatMap((c) => c.choices.map((ch) => ch.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('each card has 2-3 choices', () => {
    for (const c of cards) {
      expect(c.choices.length).toBeGreaterThanOrEqual(2);
      expect(c.choices.length).toBeLessThanOrEqual(3);
    }
  });
  it('every effect value is a finite number within +-30', () => {
    for (const c of cards) {
      for (const ch of c.choices) {
        for (const [k, v] of Object.entries(ch.effects)) {
          expect(STAT_KEYS).toContain(k);
          expect(Number.isFinite(v)).toBe(true);
          expect(Math.abs(v as number)).toBeLessThanOrEqual(30);
        }
      }
    }
  });
  it('every choice archetype is valid', () => {
    for (const c of cards) {
      for (const ch of c.choices) {
        expect(ARCHETYPES).toContain(ch.archetype);
      }
    }
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- cards`
Expected: FAIL (Cannot find module '../cards')

- [ ] **Step 3: 카드 데이터 구현**

`src/data/cards.ts`:
```ts
import { Card } from '../game/types';

export const cards = [
  // ── 카드 1~3: PRD 확정본 (민원온도 → 민원관리지수 부호 반전 적용) ──
  {
    id: 'card_001',
    category: 'admin',
    title: '17시 55분의 업무연락',
    description: "퇴근 5분 전, 팀장님에게 메신저가 도착했다. '이거 오늘 중으로 간단히 정리 가능하죠?'",
    choices: [
      {
        id: 'card_001_a',
        text: '네, 바로 정리해서 보내드리겠습니다.',
        archetype: 'convenient',
        effects: { mental: -20, progress: 20, riskControl: -5 },
        resultText: '빠른 처리는 성공했지만, 검토할 시간이 부족했습니다.',
      },
      {
        id: 'card_001_b',
        text: '내일 오전까지 검토해서 제출드리겠습니다.',
        archetype: 'defer',
        effects: { mental: -5, progress: -10, riskControl: 10 },
        resultText: '오늘의 진척은 늦어졌지만, 무리한 처리는 피했습니다.',
      },
      {
        id: 'card_001_c',
        text: '우선 방향을 확인한 뒤 처리하겠습니다.',
        archetype: 'principled',
        effects: { mental: -10, progress: 5, riskControl: 5 },
        resultText: '명확한 방향을 확인해 불필요한 재작업 가능성을 줄였습니다.',
      },
    ],
  },
  {
    id: 'card_002',
    category: 'attendance',
    title: '병가 증빙 문의',
    description: "직원이 병가를 신청했지만 증빙서류 제출 여부가 애매하다며 문의했다. '진단서는 다음 주에 내도 되나요? 오늘은 일단 병가 처리 부탁드립니다.'",
    choices: [
      {
        id: 'card_002_a',
        text: '규정상 필요한 증빙을 먼저 제출해주셔야 합니다.',
        archetype: 'principled',
        effects: { mental: -5, progress: -5, complaintControl: -15, riskControl: 20 },
        resultText: '원칙은 지켰지만, 문의자의 표정이 차가워졌습니다.',
      },
      {
        id: 'card_002_b',
        text: '이번에는 일단 처리하고, 증빙은 나중에 받겠습니다.',
        archetype: 'convenient',
        effects: { mental: 5, progress: 15, complaintControl: 10, riskControl: -25 },
        resultText: '지금은 조용해졌지만, 미래의 내가 조금 위험해졌습니다.',
      },
      {
        id: 'card_002_c',
        text: '관련 기준을 안내드리고, 가능한 처리 방법을 함께 확인하겠습니다.',
        archetype: 'kind',
        effects: { mental: -15, progress: -10, complaintControl: 5, riskControl: 15 },
        resultText: '친절한 설명은 담당자의 멘탈을 소모하지만, 뒤탈을 줄입니다.',
      },
    ],
  },
  {
    id: 'card_003',
    category: 'ethics',
    title: '외부강의 신고 문의',
    description: "직원이 외부강의 요청을 받았다고 문의했다. '직무관련성은 없어 보이는데, 신고 안 해도 되죠?'",
    choices: [
      {
        id: 'card_003_a',
        text: '직무관련성을 넓게 검토해야 하므로 신고 필요 여부를 확인해보겠습니다.',
        archetype: 'principled',
        effects: { mental: -10, progress: -10, complaintControl: -10, riskControl: 20 },
        resultText: '담당자의 일은 늘어났지만, 판단근거를 남길 수 있게 되었습니다.',
      },
      {
        id: 'card_003_b',
        text: '직무관련성이 없으면 신고하지 않아도 됩니다.',
        archetype: 'convenient',
        effects: { mental: 5, progress: 10, complaintControl: 5, riskControl: -20 },
        resultText: '당장은 빠르게 끝났지만, 판단근거가 부족합니다.',
      },
      {
        id: 'card_003_c',
        text: '요청기관, 강의주제, 사례금 여부를 먼저 확인하겠습니다.',
        archetype: 'defer',
        effects: { mental: -10, progress: -5, riskControl: 15 },
        resultText: '필요한 정보를 확인해 섣부른 판단을 피했습니다.',
      },
    ],
  },

  // ── 카드 4~10: 임시 콘텐츠 (D8 검수 대상). 규칙: 단일 변동 |x|<=25, 선택지 net 점수차 작게, 4원형 분산 ──
  {
    id: 'card_004',
    category: 'attendance',
    title: '연차 취소 요청',
    description: "직원이 이미 승인된 연차를 당일 아침에 취소하고 출근하겠다고 문의했다. '시스템에서 취소가 안 되는데 그냥 출근 처리해주시면 안 돼요?'",
    choices: [
      {
        id: 'card_004_a',
        text: '정식 절차로 취소 신청을 올려주시면 처리하겠습니다.',
        archetype: 'principled',
        effects: { mental: -5, progress: -5, complaintControl: -10, riskControl: 15 },
        resultText: '기록은 남겼지만, 문의자는 번거로워했습니다.',
      },
      {
        id: 'card_004_b',
        text: '우선 출근으로 보고, 연차는 제가 알아서 정리할게요.',
        archetype: 'convenient',
        effects: { mental: 0, progress: 10, complaintControl: 10, riskControl: -20 },
        resultText: '빠르게 끝났지만, 근태 기록에 작은 구멍이 생겼습니다.',
      },
    ],
  },
  {
    id: 'card_005',
    category: 'ethics',
    title: '겸직 허가 문의',
    description: "직원이 주말에 소규모 강의를 하나 맡고 싶다며 물었다. '이 정도는 겸직 허가 안 받아도 되겠죠?'",
    choices: [
      {
        id: 'card_005_a',
        text: '겸직 허가 대상인지 기준부터 함께 확인하시죠.',
        archetype: 'principled',
        effects: { mental: -10, progress: -5, complaintControl: -5, riskControl: 20 },
        resultText: '판단 근거를 남겼지만, 담당자의 오후가 사라졌습니다.',
      },
      {
        id: 'card_005_b',
        text: '그 정도면 괜찮을 거예요, 진행하셔도 됩니다.',
        archetype: 'convenient',
        effects: { mental: 5, progress: 10, complaintControl: 5, riskControl: -20 },
        resultText: '문의자는 기뻐했지만, 근거 없는 안내가 마음에 걸립니다.',
      },
      {
        id: 'card_005_c',
        text: '서면으로 안내드리고, 신청서를 함께 작성해드릴게요.',
        archetype: 'kind',
        effects: { mental: -15, progress: -5, complaintControl: 10, riskControl: 15 },
        resultText: '친절히 챙겼더니, 게시판은 잠잠하고 멘탈만 줄었습니다.',
      },
    ],
  },
  {
    id: 'card_006',
    category: 'admin',
    title: '점심시간의 햇볕',
    description: '오전 내내 문의에 시달렸다. 동료가 잠깐 나가서 바람 쐬자고 한다.',
    choices: [
      {
        id: 'card_006_a',
        text: '딱 15분만 걷고 오자.',
        archetype: 'defer',
        effects: { mental: 15, progress: -5 },
        resultText: '햇볕 한 줌에 오후를 버틸 힘이 조금 돌아왔습니다.',
      },
      {
        id: 'card_006_b',
        text: '아니, 쌓인 것부터 처리하자.',
        archetype: 'convenient',
        effects: { mental: -10, progress: 15 },
        resultText: '일은 줄었지만, 점심은 키보드 옆에서 식어갔습니다.',
      },
    ],
  },
  {
    id: 'card_007',
    category: 'ethics',
    title: '가족 채용 관련 문의',
    description: "타 부서에서 조용히 물어왔다. '이번 단기 채용에 제 조카가 지원했는데, 제가 면접에 들어가도 문제없죠?'",
    choices: [
      {
        id: 'card_007_a',
        text: '이해충돌에 해당하니 회피 절차를 안내드리겠습니다.',
        archetype: 'principled',
        effects: { mental: -10, progress: -10, complaintControl: -10, riskControl: 25 },
        resultText: '관계는 어색해졌지만, 가장 위험한 폭탄 하나를 미리 막았습니다.',
      },
      {
        id: 'card_007_b',
        text: '실무상 큰 문제는 없을 거예요.',
        archetype: 'convenient',
        effects: { mental: 5, progress: 5, complaintControl: 5, riskControl: -25 },
        resultText: '상대는 안도했지만, 이건 나중에 분명히 돌아옵니다.',
      },
      {
        id: 'card_007_c',
        text: '규정을 같이 보며 안전한 방법을 찾아보시죠.',
        archetype: 'kind',
        effects: { mental: -15, progress: -5, complaintControl: 10, riskControl: 20 },
        resultText: '오래 설명했더니 상대도 수긍했지만, 멘탈은 바닥을 봤습니다.',
      },
    ],
  },
  {
    id: 'card_008',
    category: 'attendance',
    title: '재택근무 근태 문의',
    description: "재택근무 중인 직원이 오후에 잠깐 자리를 비웠다고 한다. '근태에 따로 안 남겨도 되죠? 금방 다녀온 거라서요.'",
    choices: [
      {
        id: 'card_008_a',
        text: '짧더라도 외출은 기록 원칙입니다, 남겨주세요.',
        archetype: 'principled',
        effects: { mental: -5, progress: 0, complaintControl: -10, riskControl: 15 },
        resultText: '깐깐하다는 눈초리를 받았지만, 기록은 깔끔합니다.',
      },
      {
        id: 'card_008_b',
        text: '이번 건은 넘어갈게요.',
        archetype: 'convenient',
        effects: { mental: 5, progress: 10, complaintControl: 10, riskControl: -20 },
        resultText: '분위기는 좋아졌지만, 기준은 한 뼘 느슨해졌습니다.',
      },
    ],
  },
  {
    id: 'card_009',
    category: 'admin',
    title: '교육자료 긴급 수정 요청',
    description: "다른 부서가 오늘 배포할 청렴교육 자료에 오류를 발견했다며 급히 수정을 요청했다. '담당자님이 잘 아시니까 바로 좀 고쳐주세요!'",
    choices: [
      {
        id: 'card_009_a',
        text: '제 업무 범위와 근거를 확인한 뒤 도와드릴게요.',
        archetype: 'principled',
        effects: { mental: -10, progress: -5, complaintControl: -5, riskControl: 15 },
        resultText: '책임 범위를 분명히 했지만, 급한 쪽은 발을 굴렀습니다.',
      },
      {
        id: 'card_009_b',
        text: '제가 지금 바로 고쳐서 넘길게요.',
        archetype: 'convenient',
        effects: { mental: -15, progress: 20, complaintControl: 10, riskControl: -10 },
        resultText: '배포는 막았지만, 정작 내 일은 그대로 쌓여 있습니다.',
      },
      {
        id: 'card_009_c',
        text: '수정 포인트를 정리해 담당자에게 안내하겠습니다.',
        archetype: 'kind',
        effects: { mental: -10, progress: -5, complaintControl: 10, riskControl: 10 },
        resultText: '친절히 짚어줬더니 상대도 차분해졌습니다.',
      },
    ],
  },
  {
    id: 'card_010',
    category: 'admin',
    title: '퇴근 직전, 마지막 결재',
    description: '하루를 마무리하려는데 결재함에 한 건이 남아 있다. 검토가 덜 끝난 사안이다.',
    choices: [
      {
        id: 'card_010_a',
        text: '내일 아침 맑은 정신으로 검토하고 올리자.',
        archetype: 'defer',
        effects: { mental: 5, progress: -10, riskControl: 10 },
        resultText: '오늘의 진척은 멈췄지만, 실수 하나를 예약 취소했습니다.',
      },
      {
        id: 'card_010_b',
        text: '여기까지 왔으니 지금 끝내고 퇴근하자.',
        archetype: 'convenient',
        effects: { mental: -10, progress: 20, riskControl: -10 },
        resultText: '드디어 결재함이 비었습니다. 다만 검토는 조금 거칠었습니다.',
      },
    ],
  },
] satisfies Card[];
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- cards`
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/data/cards.ts src/data/__tests__/cards.test.ts
git commit -m "feat: add 10 card dataset with integrity tests"
```

---

## Task 7: 게임 상태머신 reducer + Context

**Files:**
- Create: `src/game/reducer.ts`, `src/game/GameContext.tsx`, `src/game/__tests__/reducer.test.ts`

**Interfaces:**
- Consumes: `Stats`,`INITIAL_STATS`,`TOTAL_TURNS` (Task 2), `resolveTurn` (Task 3), `resolveEnding`,`EndingResult` (Task 5), `cards` (Task 6).
- Produces:
  - `Phase = 'start' | 'card' | 'result' | 'gameover' | 'ending'`
  - `LastChoice = { choiceId: string; resultText: string; delta: Stats }`
  - `GameState = { phase; turn; cardIndex; stats; lastChoice; gameOverReason; ending }`
  - `INITIAL_STATE`, `Action`, `gameReducer(state, action)`
  - `GameProvider`, `useGame(): { state: GameState; dispatch: Dispatch<Action> }`

- [ ] **Step 1: 실패 테스트 작성**

`src/game/__tests__/reducer.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { gameReducer, INITIAL_STATE, GameState } from '../reducer';
import { cards } from '../../data/cards';

function start(): GameState {
  return gameReducer(INITIAL_STATE, { type: 'START' });
}

describe('gameReducer', () => {
  it('START moves to card phase at turn 1', () => {
    const s = start();
    expect(s.phase).toBe('card');
    expect(s.turn).toBe(1);
    expect(s.cardIndex).toBe(0);
  });

  it('CHOOSE applies effects, stores actual delta, moves to result', () => {
    const s = gameReducer(start(), { type: 'CHOOSE', choiceId: 'card_001_a' });
    expect(s.phase).toBe('result');
    expect(s.lastChoice?.choiceId).toBe('card_001_a');
    expect(s.stats.progress).toBe(60); // 40 + 20
    expect(s.lastChoice?.delta.mental).toBe(-20);
  });

  it('CHOOSE that triggers game over goes to gameover with ending', () => {
    // force low mental first by replaying choices is complex; assert via direct state
    const low: GameState = { ...start(), stats: { mental: 5, progress: 40, complaintControl: 70, riskControl: 70 } };
    const s = gameReducer(low, { type: 'CHOOSE', choiceId: 'card_001_a' }); // mental -20 -> -15
    expect(s.phase).toBe('gameover');
    expect(s.gameOverReason).toBe('MENTAL_OUT');
    expect(s.ending?.kind).toBe('gameover');
  });

  it('NEXT advances turn and card', () => {
    const chosen = gameReducer(start(), { type: 'CHOOSE', choiceId: 'card_001_b' });
    const s = gameReducer(chosen, { type: 'NEXT' });
    expect(s.phase).toBe('card');
    expect(s.turn).toBe(2);
    expect(s.cardIndex).toBe(1);
    expect(s.lastChoice).toBeNull();
  });

  it('NEXT on the last turn goes to ending', () => {
    const atLast: GameState = { ...start(), turn: 10, cardIndex: 9, phase: 'result', lastChoice: { choiceId: 'x', resultText: '', delta: { mental: 0, progress: 0, complaintControl: 0, riskControl: 0 } } };
    const s = gameReducer(atLast, { type: 'NEXT' });
    expect(s.phase).toBe('ending');
    expect(s.ending).not.toBeNull();
  });

  it('RESTART resets to INITIAL_STATE', () => {
    const dirty = gameReducer(start(), { type: 'CHOOSE', choiceId: 'card_001_a' });
    const s = gameReducer(dirty, { type: 'RESTART' });
    expect(s).toEqual(INITIAL_STATE);
  });

  it('cards array length matches TOTAL_TURNS so every turn has a card', () => {
    expect(cards.length).toBe(10);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- reducer`
Expected: FAIL (Cannot find module '../reducer')

- [ ] **Step 3: reducer 구현**

`src/game/reducer.ts`:
```ts
import { Stats, GameOverReason, INITIAL_STATS, TOTAL_TURNS } from './types';
import { resolveTurn } from './logic';
import { resolveEnding, EndingResult } from './endings';
import { cards } from '../data/cards';

export type Phase = 'start' | 'card' | 'result' | 'gameover' | 'ending';

export interface LastChoice {
  choiceId: string;
  resultText: string;
  delta: Stats;
}

export interface GameState {
  phase: Phase;
  turn: number;
  cardIndex: number;
  stats: Stats;
  lastChoice: LastChoice | null;
  gameOverReason: GameOverReason;
  ending: EndingResult | null;
}

export const INITIAL_STATE: GameState = {
  phase: 'start',
  turn: 1,
  cardIndex: 0,
  stats: INITIAL_STATS,
  lastChoice: null,
  gameOverReason: null,
  ending: null,
};

export type Action =
  | { type: 'START' }
  | { type: 'CHOOSE'; choiceId: string }
  | { type: 'NEXT' }
  | { type: 'RESTART' };

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return { ...INITIAL_STATE, phase: 'card' };

    case 'CHOOSE': {
      if (state.phase !== 'card') return state;
      const card = cards[state.cardIndex];
      const choice = card.choices.find((c) => c.id === action.choiceId);
      if (!choice) return state;
      const { stats, gameOver, delta } = resolveTurn(state.stats, choice.effects);
      const lastChoice: LastChoice = { choiceId: choice.id, resultText: choice.resultText, delta };
      if (gameOver) {
        return { ...state, stats, lastChoice, gameOverReason: gameOver, ending: resolveEnding(stats, gameOver), phase: 'gameover' };
      }
      return { ...state, stats, lastChoice, phase: 'result' };
    }

    case 'NEXT': {
      if (state.phase !== 'result') return state;
      if (state.turn >= TOTAL_TURNS) {
        return { ...state, lastChoice: null, ending: resolveEnding(state.stats, null), phase: 'ending' };
      }
      return { ...state, turn: state.turn + 1, cardIndex: state.cardIndex + 1, lastChoice: null, phase: 'card' };
    }

    case 'RESTART':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
```

- [ ] **Step 4: reducer 테스트 통과 확인**

Run: `npm test -- reducer`
Expected: PASS

- [ ] **Step 5: Context 구현**

`src/game/GameContext.tsx`:
```tsx
import { createContext, useContext, useReducer, Dispatch, ReactNode } from 'react';
import { gameReducer, INITIAL_STATE, GameState, Action } from './reducer';

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
```

- [ ] **Step 6: 전체 테스트 통과 확인**

Run: `npm test`
Expected: PASS (all suites)

- [ ] **Step 7: 커밋**

```bash
git add src/game/reducer.ts src/game/GameContext.tsx src/game/__tests__/reducer.test.ts
git commit -m "feat: add game state machine reducer and context"
```

---

## Task 8: format 유틸 + StatBar 컴포넌트

**Files:**
- Create: `src/ui/format.ts`, `src/ui/__tests__/format.test.ts`, `src/components/StatBar.tsx`, `src/components/__tests__/StatBar.test.tsx`

**Interfaces:**
- Consumes: `Stats`,`StatKey`,`STAT_META`,`STAT_KEYS` (Task 2).
- Produces:
  - `formatDelta(n: number): { text: string; tone: 'up' | 'down' | 'none' }`
  - `StatBar({ stats, delta }: { stats: Stats; delta?: Stats | null })`

- [ ] **Step 1: format 실패 테스트**

`src/ui/__tests__/format.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { formatDelta } from '../format';

describe('formatDelta', () => {
  it('formats positive as +N up', () => {
    expect(formatDelta(20)).toEqual({ text: '+20', tone: 'up' });
  });
  it('formats negative as -N down', () => {
    expect(formatDelta(-5)).toEqual({ text: '-5', tone: 'down' });
  });
  it('formats zero as 변화 없음 none', () => {
    expect(formatDelta(0)).toEqual({ text: '변화 없음', tone: 'none' });
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- format`
Expected: FAIL

- [ ] **Step 3: format 구현**

`src/ui/format.ts`:
```ts
export function formatDelta(n: number): { text: string; tone: 'up' | 'down' | 'none' } {
  if (n > 0) return { text: `+${n}`, tone: 'up' };
  if (n < 0) return { text: `${n}`, tone: 'down' };
  return { text: '변화 없음', tone: 'none' };
}
```

- [ ] **Step 4: format 통과 확인**

Run: `npm test -- format`
Expected: PASS

- [ ] **Step 5: StatBar 실패 테스트**

`src/components/__tests__/StatBar.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatBar } from '../StatBar';
import { INITIAL_STATS } from '../../game/types';

describe('StatBar', () => {
  it('renders all four stat labels', () => {
    render(<StatBar stats={INITIAL_STATS} />);
    expect(screen.getByText('멘탈')).toBeInTheDocument();
    expect(screen.getByText('오늘의 진척')).toBeInTheDocument();
    expect(screen.getByText('민원관리지수')).toBeInTheDocument();
    expect(screen.getByText('폭탄관리지수')).toBeInTheDocument();
  });
  it('shows delta text when delta provided', () => {
    render(<StatBar stats={{ ...INITIAL_STATS, progress: 60 }} delta={{ mental: 0, progress: 20, complaintControl: 0, riskControl: 0 }} />);
    expect(screen.getByText('+20')).toBeInTheDocument();
  });
  it('marks a stat as danger when <= 20', () => {
    const { container } = render(<StatBar stats={{ ...INITIAL_STATS, mental: 15 }} />);
    expect(container.querySelector('.stat--danger')).toBeTruthy();
  });
});
```

- [ ] **Step 6: 실패 확인**

Run: `npm test -- StatBar`
Expected: FAIL

- [ ] **Step 7: StatBar 구현**

`src/components/StatBar.tsx`:
```tsx
import { Stats, STAT_KEYS, STAT_META } from '../game/types';
import { formatDelta } from '../ui/format';

export function StatBar({ stats, delta }: { stats: Stats; delta?: Stats | null }) {
  return (
    <ul className="statbar" aria-label="현재 지표">
      {STAT_KEYS.map((key) => {
        const value = stats[key];
        const danger = value <= 20;
        const d = delta ? formatDelta(delta[key]) : null;
        return (
          <li key={key} className={`stat${danger ? ' stat--danger' : ''}`}>
            <span className="stat__label">
              {STAT_META[key].label} <span className="stat__dir" aria-hidden="true">↑좋음</span>
            </span>
            <span className="stat__gauge" aria-hidden="true">
              <span className="stat__fill" style={{ width: `${value}%` }} />
            </span>
            <span className="stat__value">{value}</span>
            {d && <span className={`stat__delta stat__delta--${d.tone}`}>{d.text}</span>}
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 8: StatBar 통과 확인**

Run: `npm test -- StatBar`
Expected: PASS

- [ ] **Step 9: 커밋**

```bash
git add src/ui/format.ts src/ui/__tests__/format.test.ts src/components/StatBar.tsx src/components/__tests__/StatBar.test.tsx
git commit -m "feat: add formatDelta and StatBar component"
```

---

## Task 9: 카드/선택지/결과 컴포넌트

**Files:**
- Create: `src/components/ChoiceButton.tsx`, `src/components/CardView.tsx`, `src/components/ResultPanel.tsx`, `src/components/__tests__/CardView.test.tsx`, `src/components/__tests__/ResultPanel.test.tsx`

**Interfaces:**
- Consumes: `Card` (Task 2).
- Produces:
  - `ChoiceButton({ id, text, onChoose }: { id: string; text: string; onChoose: (id: string) => void })` — **effects를 받지 않음**
  - `CardView({ card, onChoose }: { card: Card; onChoose: (choiceId: string) => void })`
  - `ResultPanel({ resultText, onNext }: { resultText: string; onNext: () => void })`

- [ ] **Step 1: CardView 실패 테스트**

`src/components/__tests__/CardView.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardView } from '../CardView';
import { cards } from '../../data/cards';

describe('CardView', () => {
  it('renders title, description and choice buttons', () => {
    render(<CardView card={cards[0]} onChoose={() => {}} />);
    expect(screen.getByText('17시 55분의 업무연락')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(cards[0].choices.length);
  });
  it('calls onChoose with choice id on click', async () => {
    const onChoose = vi.fn();
    render(<CardView card={cards[0]} onChoose={onChoose} />);
    await userEvent.click(screen.getByRole('button', { name: cards[0].choices[0].text }));
    expect(onChoose).toHaveBeenCalledWith('card_001_a');
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- CardView`
Expected: FAIL

- [ ] **Step 3: ChoiceButton + CardView 구현**

`src/components/ChoiceButton.tsx`:
```tsx
// NOTE: effects는 의도적으로 prop에 없음 — "선택 전 변동값 숨김"을 타입으로 강제한다.
export function ChoiceButton({ id, text, onChoose }: { id: string; text: string; onChoose: (id: string) => void }) {
  return (
    <button type="button" className="choice" onClick={() => onChoose(id)}>
      {text}
    </button>
  );
}
```

`src/components/CardView.tsx`:
```tsx
import { Card } from '../game/types';
import { ChoiceButton } from './ChoiceButton';

export function CardView({ card, onChoose }: { card: Card; onChoose: (choiceId: string) => void }) {
  return (
    <section className="card" aria-label="문제상황">
      <h2 className="card__title">{card.title}</h2>
      <p className="card__desc">{card.description}</p>
      <div className="card__choices">
        {card.choices.map((c) => (
          <ChoiceButton key={c.id} id={c.id} text={c.text} onChoose={onChoose} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: CardView 통과 확인**

Run: `npm test -- CardView`
Expected: PASS

- [ ] **Step 5: ResultPanel 실패 테스트**

`src/components/__tests__/ResultPanel.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultPanel } from '../ResultPanel';

describe('ResultPanel', () => {
  it('shows result text and a next button', () => {
    render(<ResultPanel resultText="빠른 처리는 성공했습니다." onNext={() => {}} />);
    expect(screen.getByText('빠른 처리는 성공했습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
  });
  it('calls onNext when next clicked', async () => {
    const onNext = vi.fn();
    render(<ResultPanel resultText="x" onNext={onNext} />);
    await userEvent.click(screen.getByRole('button', { name: '다음' }));
    expect(onNext).toHaveBeenCalled();
  });
});
```

- [ ] **Step 6: 실패 확인**

Run: `npm test -- ResultPanel`
Expected: FAIL

- [ ] **Step 7: ResultPanel 구현**

`src/components/ResultPanel.tsx`:
```tsx
export function ResultPanel({ resultText, onNext }: { resultText: string; onNext: () => void }) {
  return (
    <section className="result">
      <p className="result__text">{resultText}</p>
      <button type="button" className="btn-primary" onClick={onNext}>
        다음
      </button>
    </section>
  );
}
```

- [ ] **Step 8: ResultPanel 통과 확인**

Run: `npm test -- ResultPanel`
Expected: PASS

- [ ] **Step 9: 커밋**

```bash
git add src/components/ChoiceButton.tsx src/components/CardView.tsx src/components/ResultPanel.tsx src/components/__tests__/CardView.test.tsx src/components/__tests__/ResultPanel.test.tsx
git commit -m "feat: add card, choice and result components"
```

---

## Task 10: 시작/게임오버/엔딩 화면

**Files:**
- Create: `src/components/StartScreen.tsx`, `src/components/GameOverScreen.tsx`, `src/components/EndingScreen.tsx`, `src/components/__tests__/EndingScreen.test.tsx`, `src/components/__tests__/GameOverScreen.test.tsx`

**Interfaces:**
- Consumes: `Stats`,`STAT_KEYS`,`STAT_META` (Task 2), `EndingResult` (Task 5), `calculateFinalScore`,`pointsToNextGrade` (Task 4), `StatBar` (Task 8).
- Produces:
  - `StartScreen({ onStart }: { onStart: () => void })`
  - `GameOverScreen({ ending, stats, turn, onRestart }: { ending: EndingResult; stats: Stats; turn: number; onRestart: () => void })`
  - `EndingScreen({ ending, stats, onRestart }: { ending: EndingResult; stats: Stats; onRestart: () => void })`

- [ ] **Step 1: EndingScreen 실패 테스트**

`src/components/__tests__/EndingScreen.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EndingScreen } from '../EndingScreen';
import { EndingResult } from '../../game/endings';
import { Stats } from '../../game/types';

const stats: Stats = { mental: 60, progress: 85, complaintControl: 60, riskControl: 75 }; // 280
const ending: EndingResult = { kind: 'grade', id: 'A', title: '안정적 퇴근', text: '오늘은 성공적이다.', grade: 'A' };

describe('EndingScreen', () => {
  it('shows ending title, score out of 400 and restart button', () => {
    render(<EndingScreen ending={ending} stats={stats} onRestart={() => {}} />);
    expect(screen.getByText('안정적 퇴근')).toBeInTheDocument();
    expect(screen.getByText(/280\s*\/\s*400/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시하기' })).toBeInTheDocument();
  });
  it('calls onRestart when clicked', async () => {
    const onRestart = vi.fn();
    render(<EndingScreen ending={ending} stats={stats} onRestart={onRestart} />);
    await userEvent.click(screen.getByRole('button', { name: '다시하기' }));
    expect(onRestart).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- EndingScreen`
Expected: FAIL

- [ ] **Step 3: StartScreen 구현**

`src/components/StartScreen.tsx`:
```tsx
import { STAT_KEYS, STAT_META } from '../game/types';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="start">
      <h1 className="start__title">담당자님 문의드립니다 — 오늘도 무사퇴근</h1>
      <p className="start__concept">
        공공기관 사무직 담당자가 되어 10번의 선택으로 하루를 버틴다. 네 지표의 균형을 지키며 무사히 퇴근하세요.
      </p>
      <ul className="start__legend">
        {STAT_KEYS.map((key) => (
          <li key={key}>
            {STAT_META[key].label} <span aria-hidden="true">↑좋음</span> — 0 이하가 되면 게임오버
          </li>
        ))}
      </ul>
      <button type="button" className="btn-primary" onClick={onStart}>
        출근하기
      </button>
    </section>
  );
}
```

- [ ] **Step 4: GameOverScreen 실패 테스트**

`src/components/__tests__/GameOverScreen.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameOverScreen } from '../GameOverScreen';
import { EndingResult } from '../../game/endings';
import { INITIAL_STATS } from '../../game/types';

const ending: EndingResult = { kind: 'gameover', id: 'MENTAL_OUT', title: '멘탈 방전', text: '영혼을 로그아웃했다.' };

describe('GameOverScreen', () => {
  it('renders as an alert with title and reached turn', () => {
    render(<GameOverScreen ending={ending} stats={INITIAL_STATS} turn={4} onRestart={() => {}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('멘탈 방전')).toBeInTheDocument();
    expect(screen.getByText(/4\s*턴/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: 실패 확인**

Run: `npm test -- GameOverScreen`
Expected: FAIL

- [ ] **Step 6: GameOverScreen + EndingScreen 구현**

`src/components/GameOverScreen.tsx`:
```tsx
import { Stats } from '../game/types';
import { EndingResult } from '../game/endings';
import { StatBar } from './StatBar';

export function GameOverScreen({ ending, stats, turn, onRestart }: { ending: EndingResult; stats: Stats; turn: number; onRestart: () => void }) {
  return (
    <section className="screen screen--gameover" role="alert">
      <h2 className="screen__title">{ending.title}</h2>
      <p className="screen__text">{ending.text}</p>
      <p className="screen__meta">{turn}턴에서 하루가 끝났습니다.</p>
      <StatBar stats={stats} />
      <button type="button" className="btn-primary" onClick={onRestart}>
        다시하기
      </button>
    </section>
  );
}
```

`src/components/EndingScreen.tsx`:
```tsx
import { Stats } from '../game/types';
import { EndingResult } from '../game/endings';
import { calculateFinalScore, pointsToNextGrade } from '../game/scoring';
import { StatBar } from './StatBar';

export function EndingScreen({ ending, stats, onRestart }: { ending: EndingResult; stats: Stats; onRestart: () => void }) {
  const score = calculateFinalScore(stats);
  const next = pointsToNextGrade(stats);

  const copyResult = () => {
    const line = `[오늘도 무사퇴근] ${ending.title} · ${score}/400점`;
    void navigator.clipboard?.writeText(line);
  };

  return (
    <section className="screen screen--ending">
      <h2 className="screen__title">
        {ending.kind === 'grade' && ending.grade ? `${ending.grade}등급 — ` : ''}
        {ending.title}
        {ending.kind === 'special' && <span className="badge"> 특수엔딩</span>}
      </h2>
      <p className="screen__text">{ending.text}</p>
      <p className="screen__score">{score} / 400</p>
      {next.next && next.remaining !== null && (
        <p className="screen__next">{next.next}까지 -{next.remaining}점</p>
      )}
      <StatBar stats={stats} />
      <div className="screen__actions">
        <button type="button" className="btn-secondary" onClick={copyResult}>
          결과 복사
        </button>
        <button type="button" className="btn-primary" onClick={onRestart}>
          다시하기
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: 화면 테스트 통과 확인**

Run: `npm test -- EndingScreen GameOverScreen`
Expected: PASS

- [ ] **Step 8: 커밋**

```bash
git add src/components/StartScreen.tsx src/components/GameOverScreen.tsx src/components/EndingScreen.tsx src/components/__tests__/EndingScreen.test.tsx src/components/__tests__/GameOverScreen.test.tsx
git commit -m "feat: add start, gameover and ending screens"
```

---

## Task 11: App 라우팅 + 레이아웃 + 통합 테스트

**Files:**
- Modify: `src/App.tsx` (스캐폴드 내용 대체), `src/main.tsx` (GameProvider 래핑)
- Create: `src/index.css` (대체), `src/components/__tests__/App.integration.test.tsx`
- Delete: 스캐폴드 잔재 `src/App.css`(있다면 import 제거)

**Interfaces:**
- Consumes: `useGame` (Task 7), `cards` (Task 6), 모든 화면 컴포넌트 + `StatBar`.
- Produces: phase에 따라 화면을 렌더하는 `App`. 상단 진행("N/10"), 좌/상단 StatBar, 중앙 카드/결과, aria-live 결과 영역.

- [ ] **Step 1: 통합 실패 테스트 작성**

`src/components/__tests__/App.integration.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { GameProvider } from '../../game/GameContext';
import { cards } from '../../data/cards';

function renderApp() {
  return render(
    <GameProvider>
      <App />
    </GameProvider>
  );
}

describe('App flow', () => {
  it('start -> choose -> see result -> next advances turn', async () => {
    renderApp();
    await userEvent.click(screen.getByRole('button', { name: '출근하기' }));
    // turn 1 card visible
    expect(screen.getByText('17시 55분의 업무연락')).toBeInTheDocument();
    expect(screen.getByText(/1\s*\/\s*10/)).toBeInTheDocument();
    // choose first option
    await userEvent.click(screen.getByRole('button', { name: cards[0].choices[0].text }));
    // result text shown
    expect(screen.getByText(cards[0].choices[0].resultText)).toBeInTheDocument();
    // next -> turn 2
    await userEvent.click(screen.getByRole('button', { name: '다음' }));
    expect(screen.getByText(/2\s*\/\s*10/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- App.integration`
Expected: FAIL

- [ ] **Step 3: App 구현**

`src/App.tsx`:
```tsx
import { useGame } from './game/GameContext';
import { cards } from './data/cards';
import { TOTAL_TURNS } from './game/types';
import { StatBar } from './components/StatBar';
import { CardView } from './components/CardView';
import { ResultPanel } from './components/ResultPanel';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { EndingScreen } from './components/EndingScreen';

export default function App() {
  const { state, dispatch } = useGame();

  if (state.phase === 'start') {
    return (
      <main className="app">
        <StartScreen onStart={() => dispatch({ type: 'START' })} />
      </main>
    );
  }

  if (state.phase === 'gameover' && state.ending) {
    return (
      <main className="app">
        <GameOverScreen ending={state.ending} stats={state.stats} turn={state.turn} onRestart={() => dispatch({ type: 'RESTART' })} />
      </main>
    );
  }

  if (state.phase === 'ending' && state.ending) {
    return (
      <main className="app">
        <EndingScreen ending={state.ending} stats={state.stats} onRestart={() => dispatch({ type: 'RESTART' })} />
      </main>
    );
  }

  const card = cards[state.cardIndex];

  return (
    <main className="app">
      <header className="app__top">
        <span className="app__title">오늘도 무사퇴근</span>
        <span className="app__turn">{state.turn} / {TOTAL_TURNS}</span>
      </header>

      <StatBar stats={state.stats} delta={state.phase === 'result' ? state.lastChoice?.delta : null} />

      <div className="app__main" aria-live="polite">
        {state.phase === 'card' && <CardView card={card} onChoose={(id) => dispatch({ type: 'CHOOSE', choiceId: id })} />}
        {state.phase === 'result' && state.lastChoice && (
          <ResultPanel resultText={state.lastChoice.resultText} onNext={() => dispatch({ type: 'NEXT' })} />
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: main.tsx에 Provider 래핑**

`src/main.tsx` (스캐폴드 기본형을 아래로 맞춤. `./App.css` import 있으면 삭제):
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { GameProvider } from './game/GameContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>
);
```

- [ ] **Step 5: 전역 스타일 작성 (mobile-first 단일 컬럼)**

`src/index.css` (스캐폴드 내용 전부 대체):
```css
:root {
  --green: #2e9e5b;
  --red: #d64545;
  --gray: #888;
  --bg: #f6f7f9;
  --card: #fff;
  --ink: #1f2430;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: var(--ink); }
.app { max-width: 560px; margin: 0 auto; padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.app__top { display: flex; justify-content: space-between; align-items: baseline; }
.app__title { font-weight: 700; }
.app__turn { font-variant-numeric: tabular-nums; color: var(--gray); }

.statbar { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.stat { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 8px; }
.stat__label { font-size: 14px; }
.stat__dir { color: var(--gray); font-size: 12px; }
.stat__gauge { grid-column: 1 / -1; height: 8px; background: #e3e6ea; border-radius: 4px; overflow: hidden; }
.stat__fill { display: block; height: 100%; background: var(--green); }
.stat--danger .stat__fill { background: var(--red); }
.stat--danger { outline: 2px solid var(--red); outline-offset: 2px; border-radius: 6px; animation: pulse 1.2s ease-in-out infinite; }
@keyframes pulse { 50% { outline-color: transparent; } }
.stat__value { font-variant-numeric: tabular-nums; min-width: 2.5ch; text-align: right; }
.stat__delta { font-variant-numeric: tabular-nums; min-width: 4ch; text-align: right; }
.stat__delta--up { color: var(--green); }
.stat__delta--down { color: var(--red); }
.stat__delta--none { color: var(--gray); }

.card, .result, .screen { background: var(--card); border-radius: 12px; padding: 16px; }
.card__title { margin: 0 0 8px; font-size: 18px; }
.card__desc { margin: 0 0 16px; line-height: 1.6; }
.card__choices { display: flex; flex-direction: column; gap: 10px; }
.choice, .btn-primary, .btn-secondary {
  font: inherit; cursor: pointer; border-radius: 10px; padding: 12px 14px; min-height: 44px;
  border: 1px solid #d7dbe0; background: #fff; text-align: left; line-height: 1.4;
}
.btn-primary { background: var(--ink); color: #fff; border-color: var(--ink); text-align: center; }
.btn-secondary { text-align: center; }
.choice:hover, .btn-primary:hover { filter: brightness(0.97); }
:focus-visible { outline: 3px solid #5b8def; outline-offset: 2px; }

.result__text { margin: 0 0 16px; line-height: 1.6; }
.screen { text-align: center; display: flex; flex-direction: column; gap: 12px; align-items: center; }
.screen__title { margin: 0; }
.screen__score { font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; }
.screen__next { color: var(--gray); }
.screen__actions { display: flex; gap: 10px; }
.badge { font-size: 12px; background: #ffe9a8; padding: 2px 6px; border-radius: 6px; }
.start__legend { text-align: left; line-height: 1.8; }

@media (min-width: 768px) {
  .app { max-width: 720px; }
}
```

- [ ] **Step 6: 통합 테스트 통과 확인**

Run: `npm test -- App.integration`
Expected: PASS

- [ ] **Step 7: 전체 테스트 + 타입체크 + 빌드**

Run: `npm test`
Expected: PASS (all suites)

Run: `npm run build`
Expected: 빌드 성공(타입 에러 0). 미사용 변수 에러가 나면 해당 import 제거.

- [ ] **Step 8: 수동 실행 확인**

Run: `npm run dev`
브라우저에서: 출근하기 → 선택 → 변동값 표시 → 다음 → 10턴 진행 → 엔딩/게임오버 → 다시하기. 정상 동작 확인.

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "feat: wire app phase routing, layout and integration test"
```

---

## Self-Review (작성자 점검 결과)

**1. Spec coverage**
- §2 지표/clamp/게임오버 → Task 2,3 ✅
- §3.1 점수, §3.2 등급 게이팅, §3.4 다음등급거리 → Task 4 ✅
- §3.3 특수엔딩 우선순위/게임오버 우선 → Task 5 ✅
- §4 선택지(archetype 필드, |Δ|≤30) → Task 2(타입), Task 6(데이터+무결성) ✅
- §5 카드 10장/3막/톤 → Task 6 (3장 확정 + 7장 임시, D8은 명시적 범위 밖) ✅
- §6 데이터 스키마/STAT_META → Task 2,6 ✅
- §7 game/ 분리·useReducer·변동값 숨김 계약·delta 단일계산·다시하기 리셋 → Task 3,7,9,11 ✅
- §8 지표 UI(전부 정방향)·위험경고·시작/게임오버/엔딩 화면·a11y·mobile-first → Task 8,10,11 ✅
- §9 테스트(순수함수 경계·카드 무결성·통합) → Task 2~7,11 ✅
- §10 배포/팀: 비목표로 처리(분석 SDK·Husky 미도입). 배포는 빌드 성공으로 준비 완료.

**2. Placeholder scan:** 모든 스텝에 실제 코드/명령/기대값 포함. "임시 콘텐츠" 카드는 동작하는 실데이터이며 D8로 명시된 의도적 범위 — 빈 칸 아님.

**3. Type consistency:** `resolveTurn` 반환 `{stats,gameOver,delta}`가 reducer에서 동일 사용. `EndingResult` 필드(`kind/id/title/text/grade`)가 endings/screens에서 일치. `formatDelta` tone enum이 StatBar CSS 클래스와 일치. `STAT_KEYS` 단일 출처(types.ts). 불일치 없음.

---

## Execution Handoff

계획이 `docs/superpowers/plans/2026-06-23-musa-toegeun-game.md`에 저장되었습니다. 두 가지 실행 방식이 있습니다.
