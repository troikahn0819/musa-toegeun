# 디자인 테마 변경 방법

화면 구조와 기능 코드를 건드리지 않고 CSS 변수만 교체하도록 구성되어 있습니다.

## 관련 파일

- `frontend/src/styles/themes.css`: 테마별 색상·재질 토큰
- `frontend/src/styles/base.css`: 브라우저 공통 기반
- `frontend/src/styles/game.css`: 모든 테마가 공유하는 레이아웃
- `frontend/src/design/themes.ts`: 테마 ID와 사용자 표시 이름
- `frontend/src/design/ThemeSwitcher.tsx`: 테마 전환 UI

## 새 테마 추가

`themes.ts`에 항목을 추가합니다.

```ts
{ id: 'new-theme', label: '새 디자인', color: '#ff6600' }
```

그다음 `themes.css`에 동일한 ID의 변수 묶음을 추가합니다.

```css
:root[data-theme='new-theme'] {
  color-scheme: light;
  --font-body: 'Noto Sans KR', sans-serif;
  --font-display: 'Gowun Dodum', serif;
  --ink: #222;
  --paper: #fff;
  /* 기존 테마의 나머지 변수를 복사해 원하는 값으로 변경 */
}
```

레이아웃까지 다른 디자인을 시험하려면 `game.css` 끝에 테마 한정 선택자를 추가할 수 있습니다.

```css
:root[data-theme='new-theme'] .panel {
  border-radius: 24px;
}
```

선택한 테마는 `localStorage`에 저장되어 새로고침 후에도 유지됩니다.

