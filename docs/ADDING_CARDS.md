# 카드 추가 방법

게임은 `frontend/src/data/cards.ts`가 합친 전체 카드 풀에서 매 플레이마다 10장을 중복 없이 무작위로 뽑습니다. 전체 카드가 15장, 20장으로 늘어나도 플레이 턴은 `TOTAL_TURNS` 값인 10턴으로 유지됩니다.

## 1. 앱 카드 추가

카테고리에 맞는 파일에 `Card` 객체를 추가합니다.

- 윤리: `frontend/src/data/ethicsCards.ts`
- 근태: `frontend/src/data/attendanceCards.ts`

필수 형식:

```ts
{
  id: 'ethics_v3_unique_topic',
  category: 'ethics',
  title: '카드 제목',
  description: '상황 설명',
  choices: [
    {
      id: 'ethics_v3_unique_topic_a',
      text: '선택지',
      archetype: 'principled',
      effects: { mental: -10, riskControl: 20 },
      resultText: '선택 결과 문구',
    },
  ],
}
```

규칙:

- 카드 ID와 선택지 ID는 전체 풀에서 고유해야 합니다.
- 공개 후 선택지 의미가 달라지면 기존 ID를 재사용하지 말고 `v2`, `v3`처럼 새 ID를 사용합니다.
- 효과값은 `mental`, `progress`, `complaintControl`, `riskControl`만 사용합니다.
- 현재 무결성 기준은 카드당 선택지 3~4개, 효과값 -30~30입니다.
- 카드 풀은 최소 10장이어야 합니다.

## 2. 통계 서버 기준 데이터 추가

Supabase를 사용하는 경우 새 migration 파일도 추가해야 Edge Function이 새 ID를 정상 선택으로 인정합니다.

```sql
insert into public.game_cards (id, sort_order)
values ('ethics_v3_unique_topic', 201);

insert into public.game_choices (card_id, id, sort_order) values
  ('ethics_v3_unique_topic', 'ethics_v3_unique_topic_a', 1),
  ('ethics_v3_unique_topic', 'ethics_v3_unique_topic_b', 2),
  ('ethics_v3_unique_topic', 'ethics_v3_unique_topic_c', 3);
```

그 다음 배포합니다.

```powershell
npm run supabase:db:push
```

## 3. 검증

```powershell
cmd /c npm test
cmd /c npm run build
```

`cards.test.ts`가 ID 중복, 카드 수, 선택지 개수와 효과 범위를 검사합니다. `deck` 테스트는 10장이 중복 없이 선택되는지 검사합니다.
