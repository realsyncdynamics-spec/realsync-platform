import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get('code');
  const error = searchParams.get('error');
  const next  = searchParams.get('next') ?? '/hub';
  const ref   = searchParams.get('ref');   // referral code from /join/[ref]

  // OAuth error
  if (error) {
    console.error('[OAuth Callback] Error:', error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError && data.user) {
      // Handle referral: link new user to referrer
      if (ref) {
        try {
          // Get referrer by code
          const { data: referrerData } = await supabase
            .rpc('get_creator_by_ref', { ref_code: ref })
            .single();

          if (referrerData && referrerData.id !== data.user.id) {
            // Update new user's referred_by
            await supabase
              .from('profiles')
              .update({ referred_by: referrerData.id })
              .eq('id', data.user.id);

            // Create referral record
            await supabase
              .from('referrals')
              .insert({
                referrer_id: referrerData.id,
                referred_id: data.user.id,
                status: 'pending',
              })
              .onConflict('referred_id')
              .ignore();

            // Give new user 1 month bronze free
            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

            await supabase
              .from('profiles')
              .update({
                plan_id: 'bronze',
                plan_expires_at: oneMonthFromNow.toISOString(),
                plan_source: 'referral',
              })
              .eq('id', data.user.id);

            // Give referrer welcome coins
            await supabase
              .from('coin_transactions')
              .insert({
                user_id: referrerData.id,
                type: 'referral',
                amount: 190,  // €1.90 preview bonus for getting someone to sign up
                description: `Neuer Creator über deinen Link: ${data.user.email?.split('@')[0]}`,
                ref_user_id: data.user.id,
              });
          }
        } catch (refError) {
          console.error('[OAuth Callback] Referral error:', refError);
          // Non-fatal — continue anyway
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
