import { inngest } from './client';
import { getAgent } from '../registry';
import { createEmitter, getRun, getRunStatus, setRunStatus } from '../persistence';
import { runAgent } from '../runtime';
import type { AgentRunContext } from '../types';

export const runAgentFn = inngest.createFunction(
  { id: 'agent-os/run', retries: 3 },
  { event: 'agent/run.requested' },
  async ({ event, step }) => {
    const runId = (event.data as { runId: string }).runId;

    await step.run('mark-running', async () => {
      await setRunStatus(runId, 'running');
    });

    const run = await step.run('load-run', async () => getRun(runId));
    if (!run) throw new Error(`[agent-os] run ${runId} not found`);

    const controller = new AbortController();
    const emit = createEmitter(runId);

    // Cross-process cancellation: poll agent_runs.status; signal controller.
    const poll = setInterval(async () => {
      const status = await getRunStatus(runId).catch(() => null);
      if (status === 'cancelled' && !controller.signal.aborted) controller.abort();
    }, 2000);

    try {
      const ctx: AgentRunContext = {
        runId,
        userId: run.user_id as string,
        abortSignal: controller.signal,
        emit,
      };
      const definition = getAgent(run.agent_id as string);
      const rawInput = run.input as unknown;
      const input =
        typeof rawInput === 'string'
          ? rawInput
          : (rawInput as { prompt?: string } | null)?.prompt ??
            JSON.stringify(rawInput ?? {});

      const { finalOutput } = await runAgent({ definition, input, ctx });

      const terminal = controller.signal.aborted ? 'cancelled' : 'completed';
      await setRunStatus(runId, terminal, { final_output: finalOutput });
      return { runId, status: terminal };
    } catch (err) {
      const error =
        err instanceof Error
          ? { message: err.message, stack: err.stack }
          : { message: String(err) };
      if (controller.signal.aborted) {
        await setRunStatus(runId, 'cancelled', { error });
        return { runId, status: 'cancelled' as const };
      }
      await setRunStatus(runId, 'failed', { error });
      throw err;
    } finally {
      clearInterval(poll);
    }
  },
);

export const functions = [runAgentFn];
