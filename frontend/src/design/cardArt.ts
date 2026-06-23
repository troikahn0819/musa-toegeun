import { art as ethicsView127 } from './cards/ethics_v2_view_127';
import { art as ethicsShortEmail } from './cards/ethics_v2_short_email';
import { art as ethicsHeavyBag } from './cards/ethics_v2_heavy_bag';
import { art as ethicsAnonymousTip } from './cards/ethics_v2_anonymous_tip';
import { art as ethicsCapturedEmail } from './cards/ethics_v2_captured_email';
import { art as ethicsConfidentialAttachment } from './cards/ethics_v2_confidential_attachment';
import { art as ethicsMeetingEnvelope } from './cards/ethics_v2_meeting_envelope';
import { art as ethicsDeletedMessage } from './cards/ethics_v2_deleted_message';
import { art as ethicsBusinessCard } from './cards/ethics_v2_business_card';
import { art as ethicsPrintedList } from './cards/ethics_v2_printed_list';
import { art as attendanceEvidenceLater } from './cards/attendance_evidence_later';
import { art as attendanceNightCall } from './cards/attendance_night_call';
import { art as attendanceSameReceipt } from './cards/attendance_same_receipt';
import { art as attendancePreviousAnswer } from './cards/attendance_previous_answer';
import { art as attendanceVehicleRumor } from './cards/attendance_vehicle_rumor';

export interface CardArt {
  /** SVG viewBox, e.g. "0 0 480 270". */
  viewBox: string;
  /** Short Korean alt text describing the illustration. */
  title: string;
  /** Inner SVG markup (children of <svg>), themed via CSS variables. */
  body: string;
}

/**
 * 카드 id → 선택 화면에 표시할 장면 일러스트. 모든 아트는 테마 CSS 변수만
 * 사용하므로 라이트/다크 테마에 자동으로 맞춰집니다. 카드 데이터와 분리해
 * 두어 새 카드가 생겨도 매칭되는 아트만 추가하면 됩니다.
 */
export const cardArt: Record<string, CardArt> = {
  ethics_v2_view_127: ethicsView127,
  ethics_v2_short_email: ethicsShortEmail,
  ethics_v2_heavy_bag: ethicsHeavyBag,
  ethics_v2_anonymous_tip: ethicsAnonymousTip,
  ethics_v2_captured_email: ethicsCapturedEmail,
  ethics_v2_confidential_attachment: ethicsConfidentialAttachment,
  ethics_v2_meeting_envelope: ethicsMeetingEnvelope,
  ethics_v2_deleted_message: ethicsDeletedMessage,
  ethics_v2_business_card: ethicsBusinessCard,
  ethics_v2_printed_list: ethicsPrintedList,
  attendance_evidence_later: attendanceEvidenceLater,
  attendance_night_call: attendanceNightCall,
  attendance_same_receipt: attendanceSameReceipt,
  attendance_previous_answer: attendancePreviousAnswer,
  attendance_vehicle_rumor: attendanceVehicleRumor,
};

export function getCardArt(cardId: string): CardArt | undefined {
  return cardArt[cardId];
}
