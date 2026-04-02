import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// CreatorSeal Trust Score API
//
// TODO: Real trust score requires:
//   1. OAuth connection to the creator's social accounts (YouTube, TikTok, Instagram, etc.)
//   2. Platform API data: follower count, engagement rate, post history, audience quality
//   3. C2PA manifest scan on recent content (real C2PA API, not stub)
//   4. AI-based deepfake detection on recent uploads
//   5. Brand safety analysis via content moderation API
//
// Current status: Returns a stub score. The user must connect a social account first.
// Scores are NOT derived from real platform data until accounts are connected.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 });
  }

  // Check if this user has connected a real social account
  let hasConnectedAccount = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: accounts } = await supabase
        .from('social_accounts')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      hasConnectedAccount = (accounts?.length ?? 0) > 0;
    }
  } catch {
    // Supabase not configured — continue as stub
  }

  if (!hasConnectedAccount) {
    // Return honest stub — no real data
    return NextResponse.json({
      handle,
      stub: true,
      status: 'NO_ACCOUNT_CONNECTED',
      message: 'Verbinde einen Social-Account, um deinen echten Trust-Score zu berechnen.',
      score: null,
      trustFactors: [
        { icon: '🛡', label: 'C2PA 2.3',        score: null, color: '#10B981', desc: 'Nicht gescannt' },
        { icon: '⛓', label: 'Blockchain',       score: null, color: '#8B5CF6', desc: 'Nicht verankert' },
        { icon: '🤖', label: 'Deepfake-Scan',   score: null, color: '#00D4FF', desc: 'Nicht gescannt' },
        { icon: '📸', label: 'Style-Check',     score: null, color: '#C9A84C', desc: 'Nicht analysiert' },
        { icon: '📊', label: 'Engagement',      score: null, color: '#F59E0B', desc: 'Kein Account verbunden' },
        { icon: '🎯', label: 'Brand-Fitness',   score: null, color: '#EC4899', desc: 'Kein Account verbunden' },
      ],
      nextStep: '/dashboard/social-accounts',
    });
  }

  // TODO: Compute real scores from connected account data
  // For now, return stub even when account is connected
  return NextResponse.json({
    handle,
    stub: true,
    status: 'INTEGRATION_PENDING',
    message: 'Score-Berechnung aus echten Plattform-Daten ist in Entwicklung.',
    score: null,
    trustFactors: [],
    nextStep: '/dashboard/social-accounts',
  });
}
