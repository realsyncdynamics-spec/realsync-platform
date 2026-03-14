import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  let platform = 'unknown';
  let username = '';

  if (url.includes('instagram.com')) platform = 'instagram';
  else if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
  else if (url.includes('tiktok.com')) platform = 'tiktok';
  else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'twitter';
  else if (url.includes('facebook.com')) platform = 'facebook';
  else if (url.includes('linkedin.com')) platform = 'linkedin';

  const match = url.match(/\/([\w.]+)\/?$/);
  if (match) username = match[1].replace('@', '');

  // Update user verification status in metadata
  await supabase.auth.updateUser({
    data: {
      verified: true,
      verified_platform: platform,
      verified_username: username,
      verified_at: new Date().toISOString(),
    }
  });

  return NextResponse.json({
    verified: true,
    platform,
    username,
    verifiedAt: new Date().toISOString(),
  });
}
