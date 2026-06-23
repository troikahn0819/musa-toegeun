# Supabase 통계 서버 연결

앱 코드는 Supabase 설정이 없어도 실행됩니다. 설정 전에는 결과 화면에 통계 연결 안내가 표시되고, 설정 후에는 전체 사용자 선택률과 엔딩 달성률이 표시됩니다.

## 1. Supabase 프로젝트 생성

1. <https://supabase.com/dashboard>에서 프로젝트를 만듭니다.
2. 프로젝트의 `Project ref`, `Project URL`, `anon public key`를 확인합니다.

## 2. 데이터베이스와 Edge Function 배포

프로젝트 루트에서 다음 명령을 실행합니다.

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run supabase:deploy
```

배포되는 파일:

- `database/migrations/`: 테이블, 카드·선택지 기준 데이터, 집계 함수
- `backend/functions/game-analytics/index.ts`: 세션 시작, 선택 기록, 엔딩 완료 API

`npm run supabase:prepare`가 위 소스를 Supabase CLI 규격인 `supabase/functions`, `supabase/migrations`로 복사합니다. 이 두 폴더는 생성물이며 직접 수정하지 않습니다.

Edge Function의 `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`는 배포 환경에서 자동 제공됩니다. 서비스 역할 키를 브라우저 환경 변수에 넣으면 안 됩니다.

## 3. 프런트엔드 환경 변수

`.env.example`을 `.env.local`로 복사하고 값을 채웁니다.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

개발 서버를 재시작합니다.

```powershell
cmd /c npm run dev
```

## 집계 규칙

- 선택률 = 선택지 선택 횟수 / 해당 카드의 전체 선택 횟수
- 엔딩 달성률 = 해당 엔딩 완료 횟수 / 정상 완료 처리된 전체 세션 수
- 한 세션에서는 카드별 선택 한 건만 저장됩니다.
- 백분율은 별도 저장하지 않고 원본 이벤트로 계산합니다.
- 브라우저는 테이블에 직접 접근하지 않으며 모든 기록은 Edge Function에서 검증합니다.
