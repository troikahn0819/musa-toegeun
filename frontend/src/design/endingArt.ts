import type { EndingResult } from '../game/endings';
import clearLeaving from '../assets/endings/clear-leaving.png';
import bombPassing from '../assets/endings/bomb-passing.png';
import bombGameover from '../assets/endings/bomb-gameover.png';

export interface EndingArt {
  src: string;
  alt: string;
}

/**
 * 엔딩 결과에 어울리는 일러스트를 돌려줍니다. 매칭되는 아트가 없는 엔딩은
 * undefined를 반환하므로 화면은 기존처럼 텍스트만 렌더링합니다.
 */
export function getEndingArt(ending: EndingResult): EndingArt | undefined {
  if (ending.kind === 'grade' && (ending.grade === 'S' || ending.grade === 'A')) {
    return { src: clearLeaving, alt: '화분을 들고 가벼운 발걸음으로 정시 퇴근하는 담당자' };
  }
  if (ending.kind === 'special' && ending.id === 'bomb') {
    return { src: bombPassing, alt: '서류 더미 위에 올라앉아 식은땀을 흘리는 폭탄 — 폭탄돌리기형 엔딩' };
  }
  if (ending.kind === 'gameover' && ending.id === 'RISK_CONTROL_OUT') {
    return { src: bombGameover, alt: '책상 위에서 도화선이 타들어가는 폭탄 — 폭탄관리 실패' };
  }
  return undefined;
}
