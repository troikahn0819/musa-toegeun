-- Adds the revised ten-card ethics pack without reusing the old analytics IDs.
-- Old reference rows remain so historical events stay valid.

alter table public.game_cards drop constraint if exists game_cards_sort_order_check;
alter table public.game_cards add constraint game_cards_sort_order_positive check (sort_order > 0);

insert into public.game_cards (id, sort_order) values
  ('ethics_v2_view_127', 101),
  ('ethics_v2_short_email', 102),
  ('ethics_v2_heavy_bag', 103),
  ('ethics_v2_anonymous_tip', 104),
  ('ethics_v2_captured_email', 105),
  ('ethics_v2_confidential_attachment', 106),
  ('ethics_v2_meeting_envelope', 107),
  ('ethics_v2_deleted_message', 108),
  ('ethics_v2_business_card', 109),
  ('ethics_v2_printed_list', 110)
on conflict (id) do update set sort_order = excluded.sort_order;

insert into public.game_choices (card_id, id, sort_order) values
  ('ethics_v2_view_127', 'ethics_v2_view_127_a', 1),
  ('ethics_v2_view_127', 'ethics_v2_view_127_b', 2),
  ('ethics_v2_view_127', 'ethics_v2_view_127_c', 3),
  ('ethics_v2_view_127', 'ethics_v2_view_127_d', 4),
  ('ethics_v2_short_email', 'ethics_v2_short_email_a', 1),
  ('ethics_v2_short_email', 'ethics_v2_short_email_b', 2),
  ('ethics_v2_short_email', 'ethics_v2_short_email_c', 3),
  ('ethics_v2_short_email', 'ethics_v2_short_email_d', 4),
  ('ethics_v2_heavy_bag', 'ethics_v2_heavy_bag_a', 1),
  ('ethics_v2_heavy_bag', 'ethics_v2_heavy_bag_b', 2),
  ('ethics_v2_heavy_bag', 'ethics_v2_heavy_bag_c', 3),
  ('ethics_v2_heavy_bag', 'ethics_v2_heavy_bag_d', 4),
  ('ethics_v2_anonymous_tip', 'ethics_v2_anonymous_tip_a', 1),
  ('ethics_v2_anonymous_tip', 'ethics_v2_anonymous_tip_b', 2),
  ('ethics_v2_anonymous_tip', 'ethics_v2_anonymous_tip_c', 3),
  ('ethics_v2_anonymous_tip', 'ethics_v2_anonymous_tip_d', 4),
  ('ethics_v2_captured_email', 'ethics_v2_captured_email_a', 1),
  ('ethics_v2_captured_email', 'ethics_v2_captured_email_b', 2),
  ('ethics_v2_captured_email', 'ethics_v2_captured_email_c', 3),
  ('ethics_v2_captured_email', 'ethics_v2_captured_email_d', 4),
  ('ethics_v2_confidential_attachment', 'ethics_v2_confidential_attachment_a', 1),
  ('ethics_v2_confidential_attachment', 'ethics_v2_confidential_attachment_b', 2),
  ('ethics_v2_confidential_attachment', 'ethics_v2_confidential_attachment_c', 3),
  ('ethics_v2_confidential_attachment', 'ethics_v2_confidential_attachment_d', 4),
  ('ethics_v2_meeting_envelope', 'ethics_v2_meeting_envelope_a', 1),
  ('ethics_v2_meeting_envelope', 'ethics_v2_meeting_envelope_b', 2),
  ('ethics_v2_meeting_envelope', 'ethics_v2_meeting_envelope_c', 3),
  ('ethics_v2_meeting_envelope', 'ethics_v2_meeting_envelope_d', 4),
  ('ethics_v2_deleted_message', 'ethics_v2_deleted_message_a', 1),
  ('ethics_v2_deleted_message', 'ethics_v2_deleted_message_b', 2),
  ('ethics_v2_deleted_message', 'ethics_v2_deleted_message_c', 3),
  ('ethics_v2_deleted_message', 'ethics_v2_deleted_message_d', 4),
  ('ethics_v2_business_card', 'ethics_v2_business_card_a', 1),
  ('ethics_v2_business_card', 'ethics_v2_business_card_b', 2),
  ('ethics_v2_business_card', 'ethics_v2_business_card_c', 3),
  ('ethics_v2_business_card', 'ethics_v2_business_card_d', 4),
  ('ethics_v2_printed_list', 'ethics_v2_printed_list_a', 1),
  ('ethics_v2_printed_list', 'ethics_v2_printed_list_b', 2),
  ('ethics_v2_printed_list', 'ethics_v2_printed_list_c', 3),
  ('ethics_v2_printed_list', 'ethics_v2_printed_list_d', 4)
on conflict (card_id, id) do update set sort_order = excluded.sort_order;

