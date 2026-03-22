import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, creator_code, coin_balance')
    .eq('id', user.id)
    .single();

  const { data: referrals } = await supabase
    .from('referrals')
    .select('*, referred:referred_id(username, plan_id, created_at)')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false });

  const earned = (referrals ?? []).reduce((s: number, r: any) => s + (r.coin_reward || 0), 0);

  return NextResponse.json({
    referralCode: profile?.referral_code,
    creatorCode:  profile?.creator_code,
    coinBalance:  profile?.coin_balance ?? 0,
    totalEarned:  earned,
    referrals:    referrals ?? [],
  });
}
