import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json({ error: 'Server is not configured' }, 500);

  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const action = body.action;
  const playerId = body.playerId;
  if (!isUuid(playerId)) return json({ error: 'Invalid playerId' }, 400);

  if (action === 'start') {
    const { data, error } = await db
      .from('game_sessions')
      .insert({ player_id: playerId })
      .select('id')
      .single();
    if (error) return json({ error: 'Could not start session' }, 500);
    return json({ sessionId: data.id }, 201);
  }

  const sessionId = body.sessionId;
  if (!isUuid(sessionId)) return json({ error: 'Invalid sessionId' }, 400);

  const { data: session, error: sessionError } = await db
    .from('game_sessions')
    .select('player_id, completed_at, ending_id')
    .eq('id', sessionId)
    .maybeSingle();

  if (sessionError) return json({ error: 'Could not read session' }, 500);
  if (!session || session.player_id !== playerId) return json({ error: 'Session not found' }, 404);

  if (action === 'choice') {
    if (session.completed_at) return json({ error: 'Session is already completed' }, 409);
    const cardId = body.cardId;
    const choiceId = body.choiceId;
    const turn = body.turn;
    if (typeof cardId !== 'string' || typeof choiceId !== 'string' || !Number.isInteger(turn) || Number(turn) < 1 || Number(turn) > 10) {
      return json({ error: 'Invalid choice event' }, 400);
    }

    const { data: existing, error: existingError } = await db
      .from('choice_events')
      .select('choice_id')
      .eq('session_id', sessionId)
      .eq('card_id', cardId)
      .maybeSingle();
    if (existingError) return json({ error: 'Could not check choice' }, 500);
    if (existing && existing.choice_id !== choiceId) return json({ error: 'Choice was already recorded' }, 409);

    if (!existing) {
      const { error } = await db.from('choice_events').insert({
        session_id: sessionId,
        card_id: cardId,
        choice_id: choiceId,
        turn,
      });
      if (error) return json({ error: 'Invalid or duplicate choice' }, 409);
    }

    const { data: statistics, error: statisticsError } = await db.rpc('choice_statistics', { p_card_id: cardId });
    if (statisticsError) return json({ error: 'Could not calculate choice statistics' }, 500);
    return json({ statistics });
  }

  if (action === 'complete') {
    const endingId = body.endingId;
    const endingKind = body.endingKind;
    const finalScore = body.finalScore;
    const finalStats = body.finalStats;
    if (
      typeof endingId !== 'string' ||
      !['gameover', 'special', 'grade'].includes(String(endingKind)) ||
      !Number.isInteger(finalScore) ||
      typeof finalStats !== 'object' ||
      finalStats === null
    ) {
      return json({ error: 'Invalid completion data' }, 400);
    }
    if (session.completed_at && session.ending_id !== endingId) return json({ error: 'Session was already completed' }, 409);

    if (!session.completed_at) {
      const { error } = await db
        .from('game_sessions')
        .update({
          completed_at: new Date().toISOString(),
          ending_id: endingId,
          ending_kind: endingKind,
          final_score: finalScore,
          final_stats: finalStats,
        })
        .eq('id', sessionId)
        .eq('player_id', playerId)
        .is('completed_at', null);
      if (error) return json({ error: 'Could not complete session' }, 500);
    }

    const { data: statistics, error: statisticsError } = await db.rpc('ending_statistic', { p_ending_id: endingId });
    if (statisticsError) return json({ error: 'Could not calculate ending statistics' }, 500);
    return json({ statistic: statistics?.[0] ?? null });
  }

  return json({ error: 'Unknown action' }, 400);
});

