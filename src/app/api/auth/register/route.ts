import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password, plan = 'gratis', ref } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Passwort min. 8 Zeichen' }, { status: 400 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data.user) return NextResponse.json({ error: 'Registrierung fehlgeschlagen' }, { status: 500 });

    // Handle referral if ref code provided
    if (ref) {
      const { data: referrer } = await supabase
        .rpc('get_creator_by_ref', { ref_code: ref })
        .single();
      if (referrer) {
        const oneMonth = new Date();
        oneMonth.setMonth(oneMonth.getMonth() + 1);
        await supabase.from('profiles').update({
          referred_by: referrer.id, plan_id: 'bronze',
          plan_expires_at: oneMonth.toISOString(), plan_source: 'referral',
        }).eq('id', data.user.id);
        await supabase.from('referrals').insert({
          referrer_id: referrer.id, referred_id: data.user.id, status: 'pending',
        });
        // Welcome coins for referrer
        await supabase.from('coin_transactions').insert({
          user_id: referrer.id, type: 'referral', amount: 190,
          description: `Neuer Creator: ${email.split('@')[0]}`, ref_user_id: data.user.id,
        });
      }
    }

    return NextResponse.json({ success: true, user: data.user, needsConfirmation: !data.session });
  } catch {
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen' }, { status: 500 });
  }
}
