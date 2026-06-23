# 프로젝트 구조

## 프론트엔드

위치: `frontend/`

- `index.html`: 웹 진입 문서와 모바일 메타데이터
- `src/App.tsx`: 화면 전환과 게임·통계 연결
- `src/components/`: 게임 화면과 재사용 UI
- `src/design/`: 테마 목록, 저장, 전환 UI
- `src/styles/`: 디자인 토큰, 공통 기반, 게임 레이아웃
- `src/game/`: 점수, 엔딩, 무작위 덱, reducer
- `src/data/`: 윤리·근태 카드 원본
- `src/analytics/`: 백엔드 호출과 React Query 상태

게임 판정은 즉각적인 반응을 위해 브라우저에서 실행됩니다. 전체 사용자 기록만 백엔드로 전송합니다.

## 백엔드

위치: `backend/`

- `functions/game-analytics/index.ts`: 세션 시작, 선택 기록, 완료 처리
- 브라우저 입력을 검증한 뒤 서비스 역할로 데이터베이스에 접근
- 카드·선택지 ID, 중복 선택, 세션 소유자를 검증

## 데이터베이스

위치: `database/`

- `migrations/`: PostgreSQL 테이블, 제약 조건, 기준 ID, 집계 함수
- `game_sessions`: 한 번의 플레이와 엔딩
- `choice_events`: 카드별 선택 원본 이벤트
- `choice_statistics`: 선택률 계산 함수
- `ending_statistic`: 엔딩 달성률 계산 함수

백분율은 저장하지 않고 원본 이벤트에서 계산해 값이 어긋나지 않게 합니다.

## 배포 어댑터

위치: `supabase/`, `scripts/prepare-supabase.mjs`

소스의 주인은 `backend/`와 `database/`입니다. Supabase CLI 실행 전 다음 명령으로 배포 규격 폴더를 생성합니다.

```powershell
npm run supabase:prepare
```

생성되는 `supabase/functions/`, `supabase/migrations/`는 `.gitignore` 대상이며 직접 수정하지 않습니다.

