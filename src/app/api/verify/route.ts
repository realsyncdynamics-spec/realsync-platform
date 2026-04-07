import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createHash } from 'crypto';

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

    const { url, contentHash } = await request.json();
    if (!url) {
      return NextResponse.json(
        { error: true, message: 'URL ist erforderlich', code: 'MISSING_URL' },
        { status: 400 }
      );
    }

    // Step 1: Fetch the content at the URL and compute its SHA-256 hash
    let fetchedHash: string;
    try {
      const contentRes = await fetch(url, {
        headers: { 'User-Agent': 'RealSync-Verifier/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      if (!contentRes.ok) {
        return NextResponse.json(
          { error: true, message: `Inhalt konnte nicht abgerufen werden (HTTP ${contentRes.status})`, code: 'FETCH_FAILED' },
          { status: 422 }
        );
      }
      const contentBuffer = await contentRes.arrayBuffer();
      fetchedHash = createHash('sha256').update(Buffer.from(contentBuffer)).digest('hex');
    } catch (fetchErr: any) {
      return NextResponse.json(
        { error: true, message: `Inhalt nicht erreichbar: ${fetchErr.message}`, code: 'FETCH_ERROR' },
        { status: 422 }
      );
    }

    // Step 2: Compare against stored hash or provided hash
    let storedHash: string | null = null;

    // Check if there's a stored hash in the content_hashes table
    const { data: hashRecord } = await supabase
      .from('content_hashes')
      .select('hash, created_at')
      .eq('url', url)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (hashRecord) {
      storedHash = hashRecord.hash;
    } else if (contentHash) {
      // Use the client-provided hash for comparison
      storedHash = contentHash;
    }

    const verified = storedHash !== null && fetchedHash === storedHash;
    const now = new Date().toISOString();

    // Step 3: Store the verification result (best-effort, table may not exist yet)
    try {
      await supabase.from('content_verifications').insert({
        user_id: user.id,
        url,
        fetched_hash: fetchedHash,
        stored_hash: storedHash,
        verified,
        verified_at: now,
      });
    } catch { /* table may not exist yet */ }

    // Step 4: If no stored hash exists, register this hash for future verifications
    if (!hashRecord) {
      try {
        await supabase.from('content_hashes').insert({
          user_id: user.id,
          url,
          hash: fetchedHash,
          created_at: now,
        });
      } catch { /* table may not exist yet */ }
    }

    // Step 5: Only update user verification metadata if hash matches
    if (verified) {
      // Detect platform from URL
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

      await supabase.auth.updateUser({
        data: {
          verified: true,
          verified_platform: platform,
          verified_username: username,
          verified_at: now,
        }
      });
    }

    return NextResponse.json({
      verified,
      fetchedHash,
      storedHash,
      hashMatch: storedHash !== null ? fetchedHash === storedHash : null,
      isNewContent: !hashRecord,
      verifiedAt: now,
    });
  } catch (err: any) {
    console.error('[Verify]', err);
    return NextResponse.json(
      { error: true, message: err.message || 'Verifizierung fehlgeschlagen', code: 'VERIFY_FAILED' },
      { status: 500 }
    );
  }
}
