import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Supabase supports these OAuth providers natively:
// google, facebook (also covers instagram), twitter (X), github
// TikTok & YouTube need custom OAuth (see notes below)

const PROVIDER_MAP: Record<string, string> = {
  google:    'google',
  youtube:   'google',     // YouTube = Google OAuth with youtube scope
  facebook:  'facebook',
  instagram: 'facebook',   // Instagram = Facebook Login
  x:         'twitter',
  twitter:   'twitter',
  github:    'github',
};

const EXTRA_SCOPES: Record<string, string> = {
  google:   'https://www.googleapis.com/auth/youtube.readonly',
  youtube:  'https://www.googleapis.com/auth/youtube.readonly',
  facebook: 'public_profile,email,pages_show_list',
  instagram:'public_profile,email,instagram_basic',
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const provider = searchParams.get('provider') || 'google';
  const ref      = searchParams.get('ref') || '';
  const next     = searchParams.get('next') || '/hub';

  const supabaseProvider = PROVIDER_MAP[provider] || 'google';
  const scopes = EXTRA_SCOPES[provider];

  const supabase = await createClient();

  const callbackUrl = new URL('/api/auth/callback', origin);
  if (ref)  callbackUrl.searchParams.set('ref', ref);
  if (next) callbackUrl.searchParams.set('next', next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: supabaseProvider as any,
    options: {
      redirectTo: callbackUrl.toString(),
      scopes: scopes,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error || !data.url) {
    console.error('[OAuth Init] Error:', error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error?.message || 'oauth_failed')}`);
  }

  return NextResponse.redirect(data.url);
}
