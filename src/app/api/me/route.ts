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
