import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: true, message: 'Nicht eingeloggt', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { content, accountIds, image_url } = await request.json();
    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return NextResponse.json(
        { error: true, message: 'accountIds ist erforderlich', code: 'MISSING_ACCOUNT_IDS' },
        { status: 400 }
      );
    }

    const { data: accounts, error: accountsError } = await supabase
      .from('social_accounts')
      .select('*')
      .in('id', accountIds);

    if (accountsError) {
      return NextResponse.json(
        { error: true, message: 'Konten konnten nicht geladen werden', code: 'ACCOUNTS_FETCH_FAILED' },
        { status: 500 }
      );
    }

    const results = [];
    for (const account of (accounts || [])) {
      if (account.platform === 'instagram' || account.platform === 'facebook') {
        try {
          if (account.platform === 'instagram') {
            // Instagram Graph API requires a two-step publish:
            // 1. Create media container (with image_url for IMAGE posts)
            // 2. Publish the container
            const mediaBody: Record<string, string> = {
              caption: content || '',
              access_token: account.access_token,
            };

            if (image_url) {
              mediaBody.image_url = image_url;
              mediaBody.media_type = 'IMAGE';
            } else {
              mediaBody.media_type = 'FEED';
            }

            const mediaRes = await fetch(`https://graph.instagram.com/me/media`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(mediaBody),
            });
            const mediaData = await mediaRes.json();

            if (!mediaRes.ok || mediaData.error) {
              results.push({
                account: account.username,
                platform: 'instagram',
                status: 'error',
                message: mediaData.error?.message || `HTTP ${mediaRes.status}`,
              });
              continue;
            }

            if (mediaData.id) {
              const publishRes = await fetch(`https://graph.instagram.com/me/media_publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ creation_id: mediaData.id, access_token: account.access_token }),
              });
              const publishData = await publishRes.json();

              if (!publishRes.ok || publishData.error) {
                results.push({
                  account: account.username,
                  platform: 'instagram',
                  status: 'error',
                  message: publishData.error?.message || `Publish failed: HTTP ${publishRes.status}`,
                });
                continue;
              }
            }

            results.push({ account: account.username, platform: 'instagram', status: 'success' });
          } else {
            // Facebook Graph API: single-step post
            const fbBody: Record<string, string> = {
              message: content || '',
              access_token: account.access_token,
            };
            if (image_url) {
              fbBody.link = image_url;
            }

            const fbRes = await fetch(`https://graph.facebook.com/me/feed`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(fbBody),
            });
            const fbData = await fbRes.json();

            if (!fbRes.ok || fbData.error) {
              results.push({
                account: account.username,
                platform: 'facebook',
                status: 'error',
                message: fbData.error?.message || `HTTP ${fbRes.status}`,
              });
              continue;
            }

            results.push({ account: account.username, platform: 'facebook', status: 'success' });
          }
        } catch (e: any) {
          results.push({
            account: account.username,
            platform: account.platform,
            status: 'error',
            message: e.message || 'Unbekannter Fehler',
          });
        }
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('[Posts Publish]', err);
    return NextResponse.json(
      { error: true, message: err.message || 'Veröffentlichung fehlgeschlagen', code: 'PUBLISH_FAILED' },
      { status: 500 }
    );
  }
}
