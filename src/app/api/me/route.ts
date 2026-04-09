import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json(
        { error: true, message: 'Nicht eingeloggt', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, social_accounts(platform, username, followers), subscriptions(plan_id, status, current_period_end)')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: true, message: 'Profil konnte nicht geladen werden', code: 'PROFILE_FETCH_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: { ...user, ...profile } });
  } catch (err: any) {
    console.error('[Me GET]', err);
    return NextResponse.json(
      { error: true, message: err.message || 'Serverfehler', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json(
        { error: true, message: 'Nicht eingeloggt', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    const body = await request.json();
    const allowed = ['full_name', 'niche', 'bio', 'website', 'username'];
    const update: Record<string, string> = {};
    allowed.forEach(k => { if (body[k] !== undefined) update[k] = body[k]; });
    update.updated_at = new Date().toISOString();
    const { error: updateError } = await supabase.from('profiles').update(update).eq('id', user.id);
    if (updateError) {
      return NextResponse.json(
        { error: true, message: updateError.message, code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Me PATCH]', err);
    return NextResponse.json(
      { error: true, message: err.message || 'Serverfehler', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
