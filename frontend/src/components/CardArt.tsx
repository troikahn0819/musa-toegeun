import { getCardArt } from '../design/cardArt';

/**
 * 카드 선택 화면 상단에 표시되는 장면 일러스트. 인라인 SVG로 렌더링하므로
 * 본문이 사용하는 테마 CSS 변수(var(--ink) 등)가 그대로 적용되어
 * 라이트/다크 테마에 자동으로 맞춰집니다. 매칭되는 아트가 없으면 렌더링하지
 * 않습니다.
 */
export function CardArt({ cardId }: { cardId: string }) {
  const art = getCardArt(cardId);
  if (!art) return null;
  return (
    <figure className="card-art" role="img" aria-label={art.title}>
      <svg
        viewBox={art.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: art.body }}
      />
    </figure>
  );
}
