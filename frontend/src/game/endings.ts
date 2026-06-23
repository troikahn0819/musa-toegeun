import { getGrade } from './scoring';
import type { GameOverReason, Grade, Stats } from './types';

export interface EndingResult {
  kind: 'gameover' | 'special' | 'grade';
  id: string;
  title: string;
  text: string;
  grade?: Grade;
}

const SPECIAL_ENDINGS = [
  { id: 'bomb', title: '폭탄돌리기형', text: '오늘의 일은 끝났다. 하지만 어딘가에서 시한폭탄 소리가 들린다.', condition: (s: Stats) => s.progress >= 90 && s.riskControl <= 30 },
  { id: 'principle', title: '원칙주의형', text: '기록과 근거는 완벽하다. 다만 직원 게시판이 뜨겁다.', condition: (s: Stats) => s.riskControl >= 85 && s.complaintControl <= 30 },
  { id: 'kind', title: '친절과로형', text: '모두에게 친절했다. 대신 나에게는 친절하지 못했다.', condition: (s: Stats) => s.complaintControl > 70 && s.mental <= 20 },
  { id: 'complaint', title: '민원관리형', text: '모두가 만족했다. 업무만 빼고.', condition: (s: Stats) => s.complaintControl > 70 && s.progress <= 50 },
];

const GAMEOVER: Record<Exclude<GameOverReason, null>, { title: string; text: string }> = {
  MENTAL_OUT: { title: '멘탈 방전', text: '담당자는 모니터를 바라본 채 잠시 영혼을 로그아웃했다.' },
  PROGRESS_OUT: { title: '업무 마비', text: '업무가 쌓이고 쌓여 퇴근 버튼이 비활성화되었습니다.' },
  COMPLAINT_OUT: { title: '민원 폭주', text: "게시판 제목이 전부 ‘담당자님 문의드립니다’로 바뀌었습니다." },
  RISK_CONTROL_OUT: { title: '폭탄관리 실패', text: '과거의 선택이 돌아왔습니다. 관련 근거와 처리 과정을 제출해야 합니다.' },
};

const GRADES: Record<Grade, { title: string; text: string }> = {
  S: { title: '무사퇴근의 전설', text: '일도 처리했고, 민원도 잠재웠고, 폭탄도 관리했다.' },
  A: { title: '안정적 퇴근', text: '약간의 상처는 있지만 오늘은 성공적이다.' },
  B: { title: '찜찜한 퇴근', text: '퇴근은 했지만 내일의 내가 조금 걱정된다.' },
  C: { title: '겨우 퇴근', text: '퇴근은 했으나 여러 지표가 위험하다.' },
  D: { title: '퇴근 보류', text: '몸은 퇴근했지만 마음은 아직 사무실에 있다.' },
};

export function resolveEnding(stats: Stats, gameOver: GameOverReason): EndingResult {
  if (gameOver) return { kind: 'gameover', id: gameOver, ...GAMEOVER[gameOver] };
  const special = SPECIAL_ENDINGS.find((ending) => ending.condition(stats));
  if (special) return { kind: 'special', id: special.id, title: special.title, text: special.text };
  const grade = getGrade(stats);
  return { kind: 'grade', id: grade, grade, ...GRADES[grade] };
}

