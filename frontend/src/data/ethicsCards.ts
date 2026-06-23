import type { Card } from '../game/types';

export const ethicsCards = [
  {
    id: 'ethics_v2_view_127', category: 'ethics', title: '조회수 127',
    description: '사내 게시판에 직원 가족 회사의 홍보글이 올라왔다. 조회수는 빠르게 올라가고 있고, 누군가는 이미 캡처했을지도 모른다.',
    choices: [
      { id: 'ethics_v2_view_127_a', text: '작성자에게 조용히 연락해 가족 회사 관련성을 확인한다.', archetype: 'kind', effects: { mental: -10, progress: -5, complaintControl: -5, riskControl: 15 }, resultText: '조용히 시작했지만 작성자의 말끝이 차가워졌다. 그래도 사실관계를 확인할 첫 단추는 끼웠다.' },
      { id: 'ethics_v2_view_127_b', text: '게시글을 보존하고 관련 기준을 확인한 뒤 처리한다.', archetype: 'principled', effects: { mental: -15, progress: -10, complaintControl: -10, riskControl: 25 }, resultText: '캡처와 기준을 확보했다. 게시판의 시간은 빨랐지만 담당자의 기록은 더 오래 남는다.' },
      { id: 'ethics_v2_view_127_c', text: '단순 정보 공유일 수 있으니 일단 넘어간다.', archetype: 'convenient', effects: { mental: 5, progress: 15, complaintControl: 5, riskControl: -25 }, resultText: '업무창은 닫혔다. 조회수는 닫히지 않았고, 캡처 파일은 어딘가에 남았다.' },
      { id: 'ethics_v2_view_127_d', text: '댓글에 “이해관계 여부 확인 필요”라고 남긴다.', archetype: 'defer', effects: { mental: -15, progress: -10, complaintControl: -25, riskControl: 10 }, resultText: '투명성은 확보됐다. 동시에 게시판 전체가 조사에 참여하기 시작했다.' },
    ],
  },
  {
    id: 'ethics_v2_short_email', category: 'ethics', title: '신고 대상 아님',
    description: '외부강의 신고 대상이 아니라는 확인 요청 메일이 왔다. 필요한 정보는 없고, 빠른 답변을 요구하는 문장만 세 번 반복되어 있다.',
    choices: [
      { id: 'ethics_v2_short_email_a', text: '요청기관, 주제, 사례금 여부를 확인한 뒤 판단하겠다고 답한다.', archetype: 'principled', effects: { mental: -10, progress: -5, complaintControl: -5, riskControl: 20 }, resultText: '답은 늦어졌지만 판단에 필요한 정보가 생겼다. 빈칸은 줄고 할 일은 늘었다.' },
      { id: 'ethics_v2_short_email_b', text: '권익위에 유선으로 문의한다.', archetype: 'kind', effects: { mental: -15, progress: -10, complaintControl: 0, riskControl: 25 }, resultText: '통화 연결음 끝에 기준을 확인했다. 메일 한 통이 업무 두 건으로 증식했다.' },
      { id: 'ethics_v2_short_email_c', text: '모든 결과는 본인이 책임지고 마음대로 하라고 안내한다.', archetype: 'convenient', effects: { mental: 5, progress: 15, complaintControl: -15, riskControl: -30 }, resultText: '답장은 빨랐다. 책임의 방향은 흐려졌고, 메일은 훌륭한 증거가 되었다.' },
      { id: 'ethics_v2_short_email_d', text: '“검토 필요” 네 글자만 보낸 뒤 메일창을 닫는다.', archetype: 'defer', effects: { mental: 5, progress: -10, complaintControl: -10, riskControl: -5 }, resultText: '메일창은 닫혔지만 문의는 닫히지 않았다. 잠시 뒤 물음표 세 개가 도착했다.' },
    ],
  },
  {
    id: 'ethics_v2_heavy_bag', category: 'ethics', title: '쇼핑백의 무게',
    description: '협력사 교육이 끝난 뒤 한 참석자가 묵직한 쇼핑백을 건넨다. “별건 아닙니다. 마음만 받아주세요.”',
    choices: [
      { id: 'ethics_v2_heavy_bag_a', text: '직무관련자로부터 제공받는 물품일 수 있으므로 정중히 거절한다.', archetype: 'principled', effects: { mental: -10, progress: 5, complaintControl: -10, riskControl: 25 }, resultText: '두 손은 가벼워졌다. 분위기는 조금 무거워졌지만 폭탄은 남의 손에 머물렀다.' },
      { id: 'ethics_v2_heavy_bag_b', text: '내용물과 제공 경위를 확인한 뒤 처리 기준을 검토하겠다고 말한다.', archetype: 'kind', effects: { mental: -15, progress: -5, complaintControl: -5, riskControl: 20 }, resultText: '당황스러운 순간을 절차로 넘겼다. 담당자의 심장은 절차보다 빠르게 뛰었다.' },
      { id: 'ethics_v2_heavy_bag_c', text: '일단 받아온 뒤 사무실에서 확인하기로 한다.', archetype: 'convenient', effects: { mental: -5, progress: 10, complaintControl: 5, riskControl: -30 }, resultText: '쇼핑백은 사무실까지 따라왔다. 내용물을 확인하기 전부터 해명할 문장이 늘어났다.' },
      { id: 'ethics_v2_heavy_bag_d', text: '쇼핑백을 든 채 “이건 제가 들고 있어도 되는 건가요?”라고 묻는다.', archetype: 'defer', effects: { mental: -10, progress: -5, complaintControl: 0, riskControl: 10 }, resultText: '질문은 솔직했지만 답을 대신해주지는 않았다. 쇼핑백과 침묵만 무거워졌다.' },
    ],
  },
  {
    id: 'ethics_v2_anonymous_tip', category: 'ethics', title: '낯선 번호',
    description: '익명의 외부인이 큰 목소리로 이해충돌 의심 상황을 제보한다. 왠지 통화를 녹음하고 있는 것 같다.',
    choices: [
      { id: 'ethics_v2_anonymous_tip_a', text: '공식 신고 절차와 신고자 보호 제도를 안내한다.', archetype: 'principled', effects: { mental: -15, progress: -10, complaintControl: 0, riskControl: 25 }, resultText: '절차는 정확했다. 오늘의 업무 목록에는 새로운 사건번호가 생겼다.' },
      { id: 'ethics_v2_anonymous_tip_b', text: '기본적인 사실관계만 듣고 공식 접수 경로로 연결한다.', archetype: 'kind', effects: { mental: -15, progress: -5, complaintControl: 5, riskControl: 20 }, resultText: '필요한 말만 듣고 안전한 경로로 연결했다. 상대의 목소리는 조금 낮아졌다.' },
      { id: 'ethics_v2_anonymous_tip_c', text: '사실관계가 불분명하니 관련 부서에 먼저 확인해본다.', archetype: 'convenient', effects: { mental: -5, progress: 5, complaintControl: -5, riskControl: -20 }, resultText: '빠르게 확인하려 했지만 신고자 보호보다 소문이 먼저 움직이기 시작했다.' },
      { id: 'ethics_v2_anonymous_tip_d', text: '통화기록을 바라보다가 매뉴얼을 세 번 다시 연다.', archetype: 'defer', effects: { mental: -10, progress: -15, complaintControl: 0, riskControl: 10 }, resultText: '매뉴얼은 같은 페이지를 세 번 보여줬다. 전화는 끝났지만 처리는 시작되지 않았다.' },
    ],
  },
  {
    id: 'ethics_v2_captured_email', category: 'ethics', title: '바뀌었다고요',
    description: '과거 안내와 현재 기준이 달라 항의가 들어왔다. 민원인이 보낸 캡처 화면 속 이전 답변 날짜가 유난히 선명하다.',
    choices: [
      { id: 'ethics_v2_captured_email_a', text: '과거 안내 내용과 현재 기준을 모두 확인한 뒤 정정 안내한다.', archetype: 'kind', effects: { mental: -15, progress: -10, complaintControl: -10, riskControl: 20 }, resultText: '가장 정석적인 길을 골랐다. 물론 정석적인 길이 가장 짧다는 뜻은 아니다.' },
      { id: 'ethics_v2_captured_email_b', text: '과거 안내가 있었으니 이번 건은 예외적으로 처리한다.', archetype: 'convenient', effects: { mental: 5, progress: 15, complaintControl: 15, riskControl: -30 }, resultText: '항의는 멈췄다. 대신 같은 캡처를 든 다음 사람이 줄을 설 미래가 보인다.' },
      { id: 'ethics_v2_captured_email_c', text: '현재 기준상 어렵다고 단호하게 안내한다.', archetype: 'principled', effects: { mental: -10, progress: 5, complaintControl: -20, riskControl: 10 }, resultText: '현재 기준은 지켰다. 캡처 속 과거의 답변은 여전히 화면에 남아 있었다.' },
      { id: 'ethics_v2_captured_email_d', text: '이전 답변 메일을 열어둔 채 마음속으로 담당자 회의를 소집한다.', archetype: 'defer', effects: { mental: -5, progress: -15, complaintControl: 5, riskControl: 0 }, resultText: '마음속 회의는 길어졌고 결론은 없었다. 메일의 읽음 시간만 갱신됐다.' },
    ],
  },
  {
    id: 'ethics_v2_confidential_attachment', category: 'ethics', title: '잘못 온 첨부파일',
    description: '외부기관이 참고자료라며 “[대외비]_검토자료.pdf”를 보냈다. 본문에는 “내부에서만 봐주세요”라고 적혀 있다.',
    choices: [
      { id: 'ethics_v2_confidential_attachment_a', text: '자료 성격과 제공 가능 여부를 확인한 뒤 열람 여부를 판단한다.', archetype: 'kind', effects: { mental: -15, progress: -10, complaintControl: -5, riskControl: 25 }, resultText: '파일은 열지 않았지만 확인할 연락처가 늘었다. 대외비보다 근거가 먼저 확보됐다.' },
      { id: 'ethics_v2_confidential_attachment_b', text: '파일을 열지 않고 공식 경로로 다시 송부해달라고 요청한다.', archetype: 'principled', effects: { mental: -10, progress: -10, complaintControl: -10, riskControl: 30 }, resultText: '가장 안전한 길을 골랐다. 상대는 번거로워했지만 열람 기록은 깨끗하게 남았다.' },
      { id: 'ethics_v2_confidential_attachment_c', text: '참고자료니까 일단 열어보고 필요한 부분만 확인한다.', archetype: 'convenient', effects: { mental: 5, progress: 15, complaintControl: 5, riskControl: -30 }, resultText: '자료는 유용했다. 동시에 “누가 열어봤나요?”라는 질문에 당신의 이름이 생겼다.' },
      { id: 'ethics_v2_confidential_attachment_d', text: '마우스 커서를 열기 버튼 위에 둔 채 멈춘다.', archetype: 'defer', effects: { mental: -10, progress: -15, complaintControl: 0, riskControl: 5 }, resultText: '파일은 열리지 않았다. 업무도 진행되지 않았고 커서만 미세하게 떨렸다.' },
    ],
  },
  {
    id: 'ethics_v2_meeting_envelope', category: 'ethics', title: '회의실의 봉투',
    description: '외부 회의가 끝난 회의실에서 “수고 많으셨습니다”라고 적힌 봉투를 발견했다. 참석자들은 이미 떠났다.',
    choices: [
      { id: 'ethics_v2_meeting_envelope_a', text: '발견 사실을 기록하고 반환 또는 신고 절차를 확인한다.', archetype: 'principled', effects: { mental: -15, progress: -10, complaintControl: -5, riskControl: 30 }, resultText: '봉투는 증거와 함께 안전한 절차로 들어갔다. 담당자의 퇴근은 조금 멀어졌다.' },
      { id: 'ethics_v2_meeting_envelope_b', text: '회의 참석자에게 봉투의 출처를 확인한다.', archetype: 'kind', effects: { mental: -10, progress: -5, complaintControl: -5, riskControl: 20 }, resultText: '전화를 돌린 끝에 출처를 좁혔다. 모두가 봉투를 처음 본다는 듯 말한 것만 빼면 순조로웠다.' },
      { id: 'ethics_v2_meeting_envelope_c', text: '일단 서랍에 넣어두고 나중에 처리한다.', archetype: 'convenient', effects: { mental: 5, progress: 10, complaintControl: 5, riskControl: -30 }, resultText: '책상 위에서는 사라졌다. 잠긴 서랍 속에서 더 큰 존재감을 갖게 됐다.' },
      { id: 'ethics_v2_meeting_envelope_d', text: '봉투를 열지 않은 채 빛에 비춰본다.', archetype: 'defer', effects: { mental: -5, progress: -10, complaintControl: 0, riskControl: -10 }, resultText: '내용은 흐릿했고 판단도 흐릿해졌다. 봉투에는 지문만 하나 더 늘었다.' },
    ],
  },
  {
    id: 'ethics_v2_deleted_message', category: 'ethics', title: '단톡방의 한 줄',
    description: '부서 단톡방에 “이번 업체, 예전부터 정해져 있었다던데요?”라는 메시지가 올라왔다가 곧 삭제됐다. 하지만 당신은 이미 봤다.',
    choices: [
      { id: 'ethics_v2_deleted_message_a', text: '소문만으로 판단하지 않고 공식 확인 필요성을 검토한다.', archetype: 'principled', effects: { mental: -15, progress: -10, complaintControl: 0, riskControl: 25 }, resultText: '소문을 사실로 만들지 않으면서 확인할 경로를 찾았다. 조용한 일이 하나 더 생겼다.' },
      { id: 'ethics_v2_deleted_message_b', text: '메시지 작성자에게 사실관계를 조심스럽게 묻는다.', archetype: 'kind', effects: { mental: -10, progress: -5, complaintControl: -5, riskControl: 15 }, resultText: '작성자는 “그냥 들은 얘기”라고 답했다. 그냥 들은 얘기는 이제 두 사람이 들은 얘기가 됐다.' },
      { id: 'ethics_v2_deleted_message_c', text: '삭제된 메시지이므로 못 본 것으로 한다.', archetype: 'convenient', effects: { mental: 5, progress: 15, complaintControl: 5, riskControl: -25 }, resultText: '화면에서는 사라졌다. 기억과 서버의 어딘가에서는 사라지지 않았을 가능성이 높다.' },
      { id: 'ethics_v2_deleted_message_d', text: '단톡방을 나가고 싶지만 나갈 수 없다는 사실을 깨닫는다.', archetype: 'defer', effects: { mental: -10, progress: -10, complaintControl: 0, riskControl: -5 }, resultText: '아무 행동도 하지 않았지만 멘탈은 행동한 것처럼 닳았다.' },
    ],
  },
  {
    id: 'ethics_v2_business_card', category: 'ethics', title: '명함 뒤의 글씨',
    description: '협력사 담당자가 건넨 명함 뒤에 “편하실 때 연락 주세요. 따로 설명드릴 게 있습니다”라고 적혀 있다. 회의록에는 발언자로도 남지 않았다.',
    choices: [
      { id: 'ethics_v2_business_card_a', text: '공식 연락 경로를 이용해달라고 안내한다.', archetype: 'principled', effects: { mental: -10, progress: -5, complaintControl: -10, riskControl: 25 }, resultText: '개인적인 통로를 공식적인 통로로 돌려놓았다. 상대의 미소는 조금 얇아졌다.' },
      { id: 'ethics_v2_business_card_b', text: '설명할 내용이 있으면 메일로 보내달라고 한다.', archetype: 'kind', effects: { mental: -5, progress: 0, complaintControl: -5, riskControl: 20 }, resultText: '설명은 기록이 되었고, 명함 뒤의 문장은 더 이상 유일한 단서가 아니었다.' },
      { id: 'ethics_v2_business_card_c', text: '명함을 보관하고 회의 참석 기록을 확인한다.', archetype: 'defer', effects: { mental: -10, progress: -10, complaintControl: 0, riskControl: 15 }, resultText: '당장 연락하지 않고 주변 기록부터 맞췄다. 퍼즐은 늘었지만 폭탄의 위치는 조금 선명해졌다.' },
      { id: 'ethics_v2_business_card_d', text: '개인 연락처로 전화를 걸어본다.', archetype: 'convenient', effects: { mental: 5, progress: 10, complaintControl: 10, riskControl: -30 }, resultText: '설명은 빨리 들었다. 공식 기록에는 통화했다는 사실조차 남지 않았다.' },
    ],
  },
  {
    id: 'ethics_v2_printed_list', category: 'ethics', title: '궁금증',
    description: '복합기 위에 아직 공개되지 않은 “평가위원 후보 명단”이 놓여 있다. 문서 하단에는 당신 부서명이 찍혀 있다.',
    choices: [
      { id: 'ethics_v2_printed_list_a', text: '문서 관리자를 확인하고 회수·보안 조치를 한다.', archetype: 'principled', effects: { mental: -15, progress: -10, complaintControl: 0, riskControl: 30 }, resultText: '문서는 회수됐고 노출 범위도 확인했다. 발견자가 담당자가 되는 기묘한 법칙만 남았다.' },
      { id: 'ethics_v2_printed_list_b', text: '출력 이력을 확인해 담당자를 찾는다.', archetype: 'kind', effects: { mental: -10, progress: -10, complaintControl: -5, riskControl: 25 }, resultText: '출력 기록은 정직했다. 담당자를 찾는 동안 복합기 앞의 시선이 조금 늘었다.' },
      { id: 'ethics_v2_printed_list_c', text: '누가 가져가겠지 싶어 그대로 둔다.', archetype: 'convenient', effects: { mental: 5, progress: 15, complaintControl: 5, riskControl: -30 }, resultText: '당신은 자리를 떠났다. 다음 사람이 발견자가 되었고, CCTV는 그렇지 않았다.' },
      { id: 'ethics_v2_printed_list_d', text: '종이를 뒤집어 놓고도 내용이 머릿속에서 사라지지 않는다.', archetype: 'defer', effects: { mental: -10, progress: -10, complaintControl: 0, riskControl: -10 }, resultText: '글자는 가려졌지만 문서는 여전히 그 자리에 있었다. 궁금증만 처리 완료됐다.' },
    ],
  },
] satisfies Card[];

