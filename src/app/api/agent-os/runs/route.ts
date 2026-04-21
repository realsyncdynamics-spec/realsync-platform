import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { inngest } from '../../../../lib/agent-os/inngest/client';
import { createRun } from '../../../../lib/agent-os/persistence';
import { getAgent } from '../../../../lib/agent-os/registry';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { agentId?: string; input?: unknown }
    | null;
  if (!body?.agentId) {
    return NextResponse.json({ error: 'agentId required' }, { status: 400 });
  }

  try {
    getAgent(body.agentId);
  } catch {
    return NextResponse.json({ error: `unknown agentId: ${body.agentId}` }, { status: 400 });
  }

  const runId = await createRun({
    userId: user.id,
    agentId: body.agentId,
    input: body.input ?? {},
  });

  await inngest.send({ name: 'agent/run.requested', data: { runId } });

  return NextResponse.json({ runId });
}
