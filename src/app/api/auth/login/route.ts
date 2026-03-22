import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort erforderlich' }, { status: 400 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name, plan_id, creator_code, coin_balance, trust_score')
      .eq('id', data.user.id)
      .single();
    return NextResponse.json({ success: true, user: { ...data.user, ...profile } });
  } catch {
    return NextResponse.json({ error: 'Login fehlgeschlagen' }, { status: 500 });
  }
}
