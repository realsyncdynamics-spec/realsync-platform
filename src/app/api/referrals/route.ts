import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json(
        { error: true, message: 'Nicht eingeloggt', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, creator_code, coin_balance')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: true, message: 'Profil konnte nicht geladen werden', code: 'PROFILE_FETCH_FAILED' },
        { status: 500 }
      );
    }

    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*, referred:referred_id(username, plan_id, created_at)')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (referralsError) {
      return NextResponse.json(
        { error: true, message: 'Referrals konnten nicht geladen werden', code: 'REFERRALS_FETCH_FAILED' },
        { status: 500 }
      );
    }

    const earned = (referrals ?? []).reduce((s: number, r: any) => s + (r.coin_reward || 0), 0);

    return NextResponse.json({
      referralCode: profile?.referral_code,
      creatorCode:  profile?.creator_code,
      coinBalance:  profile?.coin_balance ?? 0,
      totalEarned:  earned,
      referrals:    referrals ?? [],
    });
  } catch (err: any) {
    console.error('[Referrals]', err);
    return NextResponse.json(
      { error: true, message: err.message || 'Serverfehler', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
