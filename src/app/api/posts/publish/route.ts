import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, accountIds } = await request.json();

  const { data: accounts } = await supabase
    .from('social_accounts')
    .select('*')
    .in('id', accountIds);

  const results = [];
  for (const account of (accounts || [])) {
    if (account.platform === 'instagram' || account.platform === 'facebook') {
      try {
        // Meta Graph API
        const graphUrl = account.platform === 'instagram'
          ? `https://graph.instagram.com/me/media`
          : `https://graph.facebook.com/me/feed`;
        const body = account.platform === 'instagram'
          ? { caption: content, media_type: 'FEED', access_token: account.access_token }
          : { message: content, access_token: account.access_token };
        const mediaRes = await fetch(graphUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const mediaData = await mediaRes.json();
        if (account.platform === 'instagram' && mediaData.id) {
          await fetch(`https://graph.instagram.com/me/media_publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ creation_id: mediaData.id, access_token: account.access_token }),
          });
        }
        results.push({ account: account.username, status: 'success' });
      } catch (e) {
        results.push({ account: account.username, status: 'error' });
      }
    }
  }

  return NextResponse.json({ results });
}
