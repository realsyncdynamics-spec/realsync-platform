import { serve } from 'inngest/next';
import { inngest } from '../../../lib/agent-os/inngest/client';
import { functions } from '../../../lib/agent-os/inngest/functions';

export const { GET, POST, PUT } = serve({ client: inngest, functions });

export const runtime = 'nodejs';
export const maxDuration = 300;
