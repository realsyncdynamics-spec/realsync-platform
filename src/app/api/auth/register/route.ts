import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple in-memory auth for MVP (replace with Supabase/DB later)
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 6 Zeichen haben' },
        { status: 400 }
      );
    }

    // MVP: Create simple session token
    const sessionToken = Buffer.from(
      JSON.stringify({ name, email, tier: 'free', createdAt: new Date().toISOString() })
    ).toString('base64');

    const cookieStore = await cookies();
    cookieStore.set('realsync-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true, user: { name, email, tier: 'free' } });
  } catch {
    return NextResponse.json(
      { error: 'Registrierung fehlgeschlagen' },
      { status: 500 }
    );
  }
}
