-- Analytics schema for 오늘도 무사퇴근.
-- Raw events are retained; percentages are calculated from source data so they cannot drift.

create table if not exists public.game_cards (
  id text primary key,
  sort_order smallint not null unique check (sort_order between 1 and 10)
);

create table if not exists public.game_choices (
  card_id text not null references public.game_cards(id) on delete cascade,
  id text not null,
  sort_order smallint not null check (sort_order between 1 and 4),
  primary key (card_id, id),
  unique (card_id, sort_order)
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  ending_id text,
  ending_kind text check (ending_kind in ('gameover', 'special', 'grade')),
  final_score smallint,
  final_stats jsonb,
  constraint completed_session_has_ending check (
    (completed_at is null and ending_id is null) or
    (completed_at is not null and ending_id is not null)
  )
);

create table if not exists public.choice_events (
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  card_id text not null,
  choice_id text not null,
  turn smallint not null check (turn between 1 and 10),
  created_at timestamptz not null default now(),
  primary key (session_id, card_id),
  unique (session_id, turn),
  foreign key (card_id, choice_id) references public.game_choices(card_id, id)
);

create index if not exists choice_events_card_choice_idx
  on public.choice_events(card_id, choice_id);
create index if not exists game_sessions_completed_ending_idx
  on public.game_sessions(ending_id)
  where completed_at is not null;

alter table public.game_cards enable row level security;
alter table public.game_choices enable row level security;
alter table public.game_sessions enable row level security;
alter table public.choice_events enable row level security;

-- No direct browser policies are defined. The Edge Function uses its service-role client,
-- validates identifiers, and is the only public write/read path for analytics.

insert into public.game_cards (id, sort_order) values
  ('ethics_family_company', 1),
  ('attendance_evidence_later', 2),
  ('ethics_outside_lecture', 3),
  ('attendance_night_call', 4),
  ('ethics_shopping_bag', 5),
  ('attendance_same_receipt', 6),
  ('ethics_tip_call', 7),
  ('attendance_previous_answer', 8),
  ('ethics_old_guidance', 9),
  ('attendance_vehicle_rumor', 10)
on conflict (id) do update set sort_order = excluded.sort_order;

insert into public.game_choices (card_id, id, sort_order) values
  ('ethics_family_company', 'ethics_family_company_a', 1),
  ('ethics_family_company', 'ethics_family_company_b', 2),
  ('ethics_family_company', 'ethics_family_company_c', 3),
  ('ethics_family_company', 'ethics_family_company_d', 4),
  ('attendance_evidence_later', 'attendance_evidence_later_a', 1),
  ('attendance_evidence_later', 'attendance_evidence_later_b', 2),
  ('attendance_evidence_later', 'attendance_evidence_later_c', 3),
  ('ethics_outside_lecture', 'ethics_outside_lecture_a', 1),
  ('ethics_outside_lecture', 'ethics_outside_lecture_b', 2),
  ('ethics_outside_lecture', 'ethics_outside_lecture_c', 3),
  ('ethics_outside_lecture', 'ethics_outside_lecture_d', 4),
  ('attendance_night_call', 'attendance_night_call_a', 1),
  ('attendance_night_call', 'attendance_night_call_b', 2),
  ('attendance_night_call', 'attendance_night_call_c', 3),
  ('ethics_shopping_bag', 'ethics_shopping_bag_a', 1),
  ('ethics_shopping_bag', 'ethics_shopping_bag_b', 2),
  ('ethics_shopping_bag', 'ethics_shopping_bag_c', 3),
  ('ethics_shopping_bag', 'ethics_shopping_bag_d', 4),
  ('attendance_same_receipt', 'attendance_same_receipt_a', 1),
  ('attendance_same_receipt', 'attendance_same_receipt_b', 2),
  ('attendance_same_receipt', 'attendance_same_receipt_c', 3),
  ('ethics_tip_call', 'ethics_tip_call_a', 1),
  ('ethics_tip_call', 'ethics_tip_call_b', 2),
  ('ethics_tip_call', 'ethics_tip_call_c', 3),
  ('ethics_tip_call', 'ethics_tip_call_d', 4),
  ('attendance_previous_answer', 'attendance_previous_answer_a', 1),
  ('attendance_previous_answer', 'attendance_previous_answer_b', 2),
  ('attendance_previous_answer', 'attendance_previous_answer_c', 3),
  ('ethics_old_guidance', 'ethics_old_guidance_a', 1),
  ('ethics_old_guidance', 'ethics_old_guidance_b', 2),
  ('ethics_old_guidance', 'ethics_old_guidance_c', 3),
  ('ethics_old_guidance', 'ethics_old_guidance_d', 4),
  ('attendance_vehicle_rumor', 'attendance_vehicle_rumor_a', 1),
  ('attendance_vehicle_rumor', 'attendance_vehicle_rumor_b', 2),
  ('attendance_vehicle_rumor', 'attendance_vehicle_rumor_c', 3)
on conflict (card_id, id) do update set sort_order = excluded.sort_order;

create or replace function public.choice_statistics(p_card_id text)
returns table (choice_id text, choice_count bigint, percentage numeric)
language sql
stable
security definer
set search_path = public
as $$
  with counts as (
    select
      c.id as choice_id,
      c.sort_order,
      count(e.choice_id) as choice_count
    from game_choices c
    left join choice_events e
      on e.card_id = c.card_id and e.choice_id = c.id
    where c.card_id = p_card_id
    group by c.id, c.sort_order
  ), totals as (
    select coalesce(sum(choice_count), 0) as total from counts
  )
  select
    counts.choice_id,
    counts.choice_count,
    case when totals.total = 0 then 0
      else round((counts.choice_count::numeric * 100) / totals.total, 1)
    end as percentage
  from counts cross join totals
  order by counts.sort_order;
$$;

create or replace function public.ending_statistic(p_ending_id text)
returns table (ending_id text, ending_count bigint, completed_count bigint, percentage numeric)
language sql
stable
security definer
set search_path = public
as $$
  with totals as (
    select count(*) as completed_count
    from game_sessions
    where completed_at is not null
  ), selected as (
    select count(*) as ending_count
    from game_sessions
    where completed_at is not null and ending_id = p_ending_id
  )
  select
    p_ending_id,
    selected.ending_count,
    totals.completed_count,
    case when totals.completed_count = 0 then 0
      else round((selected.ending_count::numeric * 100) / totals.completed_count, 1)
    end as percentage
  from totals cross join selected;
$$;

revoke all on function public.choice_statistics(text) from public, anon, authenticated;
revoke all on function public.ending_statistic(text) from public, anon, authenticated;
grant execute on function public.choice_statistics(text) to service_role;
grant execute on function public.ending_statistic(text) to service_role;
grant select on public.game_cards, public.game_choices to service_role;
grant select, insert, update on public.game_sessions to service_role;
grant select, insert on public.choice_events to service_role;
