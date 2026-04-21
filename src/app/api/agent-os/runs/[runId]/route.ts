import { NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';
import { admin, listEvents } from '../../../../../lib/agent-os/persistence';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ runId: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { runId } = await ctx.params;
  const sb = admin();
  const { data: run } = await sb
    .from('agent_runs')
    .select('*')
    .eq('id', runId)
    .eq('user_id', user.id)
    .single();
  if (!run) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const events = await listEvents(runId);
  return NextResponse.json({ run, events });
}
