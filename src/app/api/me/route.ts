import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, social_accounts(platform, username, followers), subscriptions(plan_id, status, current_period_end)')
    .eq('id', user.id)
    .single();
  return NextResponse.json({ user: { ...user, ...profile } });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
  const body = await request.json();
  const allowed = ['full_name', 'niche', 'bio', 'website', 'username'];
  const update: Record<string, string> = {};
  allowed.forEach(k => { if (body[k] !== undefined) update[k] = body[k]; });
  update.updated_at = new Date().toISOString();
  const { error: updateError } = await supabase.from('profiles').update(update).eq('id', user.id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
