import type { Card } from '../game/types';
import { attendanceCards } from './attendanceCards';
import { ethicsCards } from './ethicsCards';

/**
 * 전체 카드 풀입니다. 새 카드는 카테고리 파일에 추가하기만 하면
 * 다음 게임부터 무작위 추첨 후보에 자동 포함됩니다.
 */
export const cards: Card[] = [...ethicsCards, ...attendanceCards];

export const cardsById = new Map(cards.map((card) => [card.id, card]));

