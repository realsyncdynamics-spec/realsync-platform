import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'E-Mail erforderlich' }, { status: 400 });
    }

    const supabase = await createClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://realsync-platform.vercel.app';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/api/auth/callback?next=/dashboard/settings`,
    });

    if (error) {
      console.error('[Reset Password]', error);
      // Return success even on error to avoid user enumeration
    }

    // Always return success to prevent user enumeration
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Reset Password]', err);
    return NextResponse.json({ error: 'Fehler beim Senden' }, { status: 500 });
  }
}
