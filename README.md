# 오늘도 무사퇴근

공공기관 사무직 담당자가 되어 10번의 선택으로 네 가지 업무 지표를 지키는 모바일 선택형 게임입니다. 전체 카드 풀에서 매번 10장이 무작위로 등장합니다.

## 플레이

<https://troikahn0819.github.io/musa-toegeun/>

## 로컬 실행

```powershell
cmd /c npm install
cmd /c npm run dev
```

## 구조

- `frontend/`: React 화면, 게임 로직, 카드, 디자인 테마
- `backend/`: Supabase Edge Function
- `database/`: PostgreSQL migration
- `docs/`: 카드 추가, 테마 추가, Supabase 연결 안내

```powershell
cmd /c npm test
cmd /c npm run build
```

