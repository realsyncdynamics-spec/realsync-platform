import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    // MVP: Simple login - create session
    // In production, validate against DB
    const sessionToken = Buffer.from(
      JSON.stringify({ email, tier: 'free', loginAt: new Date().toISOString() })
    ).toString('base64');

    const cookieStore = await cookies();
    cookieStore.set('realsync-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json({ success: true, user: { email, tier: 'free' } });
  } catch {
    return NextResponse.json(
      { error: 'Login fehlgeschlagen' },
      { status: 500 }
    );
  }
}
