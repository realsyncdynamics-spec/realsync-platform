import { admin } from '../../../../../../lib/agent-os/persistence';
import { createClient } from '../../../../../../lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ runId: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response('unauthorized', { status: 401 });

  const { runId } = await ctx.params;
  const sb = admin();
  const { data: run } = await sb
    .from('agent_runs')
    .select('id,user_id,status')
    .eq('id', runId)
    .eq('user_id', user.id)
    .single();
  if (!run) return new Response('not found', { status: 404 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let lastSeq = 0;
      let done = false;

      const poll = async () => {
        while (!done) {
          const { data: events } = await sb
            .from('agent_events')
            .select('*')
            .eq('run_id', runId)
            .gt('seq', lastSeq)
            .order('seq', { ascending: true });
          for (const ev of events ?? []) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(ev)}\n\n`));
            lastSeq = ev.seq as number;
            if (ev.type === 'done' || ev.type === 'error') done = true;
          }
          const { data: latest } = await sb
            .from('agent_runs')
            .select('status')
            .eq('id', runId)
            .single();
          const status = latest?.status as string | undefined;
          if (status === 'completed' || status === 'failed' || status === 'cancelled') {
            done = true;
          }
          if (!done) await new Promise((r) => setTimeout(r, 1000));
        }
        controller.close();
      };

      poll().catch(() => controller.close());
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
