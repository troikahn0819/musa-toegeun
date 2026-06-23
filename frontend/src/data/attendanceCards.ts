import type { Card } from '../game/types';

export const attendanceCards = [
  {
    id: 'attendance_evidence_later', category: 'attendance', title: '증빙은 나중에 낼게요',
    description: '사전에 증빙이 필요한 휴가인데 직원이 급하게 문의한다. “우선 휴가 쓰고 증빙은 나중에 첨부하면 안 될까요?”',
    choices: [
      { id: 'attendance_evidence_later_a', text: '우선 처리해드릴게요. 증빙은 나중에 꼭 올려주세요.', archetype: 'convenient', effects: { mental: 5, progress: 15, complaintControl: 10, riskControl: -25 }, resultText: '우선 처리는 했지만 증빙은 올라오지 않았다. 담당자는 뒤늦게 제출을 독촉했고, 직원은 “이미 처리된 건데 왜 이제 와서 그러냐”고 반응했다. 빨리 끝낸 줄 알았던 일은 끝난 일이 아니었다.' },
      { id: 'attendance_evidence_later_b', text: '증빙 없이는 처리할 수 없습니다. 준비해서 다시 신청해주세요.', archetype: 'principled', effects: { mental: -5, progress: -5, complaintControl: -15, riskControl: 20 }, resultText: '원칙은 지켰지만 문의자는 부장님에게 직접 전화했다. 담당자는 결국 부장님에게도 규정과 처리 기준을 다시 설명해야 했다.' },
      { id: 'attendance_evidence_later_c', text: '긴급 사유와 보완 기한, 승인권자 확인 여부를 남기고 처리 가능성을 검토하겠습니다.', archetype: 'kind', effects: { mental: -10, progress: 5, complaintControl: 5, riskControl: 15 }, resultText: '처리는 조금 번거로웠지만 긴급 사유와 보완 기한을 기록으로 남겼다. 나중에 설명할 근거는 생겼지만, 직원은 절차가 많다는 표정이었다.' },
    ],
  },
  {
    id: 'attendance_night_call', category: 'attendance', title: '새벽 3시의 회사 번호',
    description: '새벽 3시, 개인 휴대폰으로 회사 번호가 찍힌 전화가 온다. 업무용 착신인 것 같지만 받아야 할지 고민된다.',
    choices: [
      { id: 'attendance_night_call_a', text: '혹시 급한 일일 수 있으니 바로 받는다.', archetype: 'kind', effects: { mental: -25, progress: 5, complaintControl: 15, riskControl: -10 }, resultText: '실제로 급한 용무였고 상황은 정리됐다. 하지만 “이 시간에도 받으시네요?”라는 말 뒤로 근무시간 외 연락이 자연스러워지기 시작했다.' },
      { id: 'attendance_night_call_b', text: '근무시간 외 전화는 받지 않고, 아침에 확인한다.', archetype: 'principled', effects: { mental: 10, progress: -5, complaintControl: -15, riskControl: 10 }, resultText: '개인 시간은 지켰지만 아침부터 “급해서 전화했는데 아무도 안 받았다”는 불만에 해명해야 했다.' },
      { id: 'attendance_night_call_c', text: '전화기를 부숴버린다.', archetype: 'defer', effects: { mental: -5, progress: 0, complaintControl: 5, riskControl: 15 }, resultText: '전화는 끊겼지만 새 휴대폰을 사야 했다. 액정 파편을 보며 생각했다. “내가 해결한 건 전화였을까, 내 멘탈이었을까.”' },
    ],
  },
  {
    id: 'attendance_same_receipt', category: 'attendance', title: '똑같은 통행료 영수증',
    description: '여러 명이 제출한 전근여비 통행료 증빙이 동일하다. 동승일 수도, 다른 사람의 증빙을 쓴 것일 수도 있다.',
    choices: [
      { id: 'attendance_same_receipt_a', text: '일단 다 지급 처리한다. 같은 차를 탔을 수도 있으니까.', archetype: 'convenient', effects: { mental: 5, progress: 20, complaintControl: 10, riskControl: -30 }, resultText: '처리는 빨랐지만 감사에서 동일 영수증으로 왜 여러 명에게 지급했는지 질문받았다. 빠르게 끝냈던 일이 가장 오래 남았다.' },
      { id: 'attendance_same_receipt_b', text: '동일 증빙은 부정 가능성이 있으니 전부 반려한다.', archetype: 'principled', effects: { mental: -10, progress: -15, complaintControl: -20, riskControl: 25 }, resultText: '원본 증빙을 제대로 낸 직원까지 반려되어 강한 불만이 들어왔다. 리스크를 피하려다 정당한 신청자도 함께 막았다.' },
      { id: 'attendance_same_receipt_c', text: '원본 제출자, 동승 여부, 운행 경로를 확인하고 필요한 건 보완 요청한다.', archetype: 'kind', effects: { mental: -15, progress: -5, complaintControl: -5, riskControl: 30 }, resultText: '처리는 늦어졌지만 정상 지급과 보완 요청을 구분했고 근거도 남았다. 맞게 처리했지만 같은 설명을 하루 종일 반복해야 했다.' },
    ],
  },
  {
    id: 'attendance_previous_answer', category: 'attendance', title: '그때 담당자가 된다고 했는데요?',
    description: '직원이 불가 안내를 무시하고 휴가를 사용한 뒤 “근태담당자가 확인해준 내용”이라고 주장한다.',
    choices: [
      { id: 'attendance_previous_answer_a', text: '당시 안내한 내용, 근거, 시점을 정리해 상급자와 관련 부서에 공유한다.', archetype: 'principled', effects: { mental: -10, progress: -5, complaintControl: -5, riskControl: 30 }, resultText: '안내 내용과 근거를 정리해 주장이 사실과 다름을 설명했다. 문제는 방어했지만 직원과의 관계에는 작은 금이 남았다.' },
      { id: 'attendance_previous_answer_b', text: '그런 말 한 적 없다고 강하게 항의하고 끝낸다.', archetype: 'defer', effects: { mental: -5, progress: 5, complaintControl: -20, riskControl: -10 }, resultText: '기록이 정리되지 않아 “했다, 안 했다”의 공방이 됐다. 문제는 휴가 적정성에서 담당자의 응대 태도로 옮겨갔다.' },
      { id: 'attendance_previous_answer_c', text: '문제가 커지지 않게 이번만 사후에 맞춰 처리해준다.', archetype: 'convenient', effects: { mental: 5, progress: 15, complaintControl: 10, riskControl: -30 }, resultText: '당장은 조용했지만 “지난번에는 해줬다”는 말이 돌아왔다. 오늘 덮은 일이 내일의 기준이 되었다.' },
    ],
  },
  {
    id: 'attendance_vehicle_rumor', category: 'attendance', title: '업무용 차량의 이상한 소문',
    description: '“저 사람, 업무용 차량을 개인 용도로 쓰는 것 같던데요?” 아직 명확한 증빙은 없고 소문에 가깝다.',
    choices: [
      { id: 'attendance_vehicle_rumor_a', text: '제보를 구체화하고 차량 운행기록과 관리부서 확인 절차를 밟는다.', archetype: 'principled', effects: { mental: -15, progress: -10, complaintControl: -5, riskControl: 30 }, resultText: '소문을 사실로 단정하지 않고 확인 가능한 범위를 정리했다. 판단 근거는 생겼지만 제보자와 당사자 모두 낌새를 챈 듯했다.' },
      { id: 'attendance_vehicle_rumor_b', text: '괜히 엮이면 피곤하니 못 들은 걸로 한다.', archetype: 'convenient', effects: { mental: 5, progress: 10, complaintControl: 5, riskControl: -25 }, resultText: '며칠 뒤 같은 내용이 다시 올라왔고 “이미 알고 있었는데 왜 조치하지 않았느냐”는 질문까지 붙었다.' },
      { id: 'attendance_vehicle_rumor_c', text: '당사자를 바로 불러서 개인 사용 아니냐고 추궁한다.', archetype: 'defer', effects: { mental: -10, progress: -5, complaintControl: -25, riskControl: -15 }, resultText: '근거 없이 추궁하자 상대방이 강하게 반발했다. 사실관계는 확인되지 않았는데 불신은 이미 생겼다.' },
    ],
  },
] satisfies Card[];

