import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/coins — get balance + transactions
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const [profileRes, txRes] = await Promise.all([
    supabase.from('profiles').select('coin_balance, coins_earned, coins_spent').eq('id', user.id).single(),
    supabase.from('coin_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
  ]);

  return NextResponse.json({
    balance:  profileRes.data?.coin_balance  ?? 0,
    earned:   profileRes.data?.coins_earned  ?? 0,
    spent:    profileRes.data?.coins_spent   ?? 0,
    transactions: txRes.data ?? [],
  });
}

// POST /api/coins — redeem coins for plan
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const { planId, coins } = await request.json();
  if (!planId || !coins) return NextResponse.json({ error: 'planId und coins erforderlich' }, { status: 400 });

  const PLAN_COSTS: Record<string, number> = { bronze: 1900, silber: 4900, gold: 9900 };
  const required = PLAN_COSTS[planId];
  if (!required) return NextResponse.json({ error: 'Ungültiger Plan' }, { status: 400 });

  // Check balance
  const { data: profile } = await supabase.from('profiles').select('coin_balance').eq('id', user.id).single();
  if (!profile || profile.coin_balance < required) {
    return NextResponse.json({ error: `Nicht genug Coins (${profile?.coin_balance ?? 0} < ${required})` }, { status: 400 });
  }

  // Deduct coins + activate plan
  const oneMonth = new Date(); oneMonth.setMonth(oneMonth.getMonth() + 1);
  await Promise.all([
    supabase.from('coin_transactions').insert({
      user_id: user.id, type: 'spend', amount: -required,
      description: `${planId} Plan mit Coins eingelöst`, ref_plan_id: planId,
    }),
    supabase.from('profiles').update({
      plan_id: planId, plan_expires_at: oneMonth.toISOString(), plan_source: 'coins',
    }).eq('id', user.id),
  ]);

  return NextResponse.json({ success: true, plan: planId, coinsUsed: required });
}
