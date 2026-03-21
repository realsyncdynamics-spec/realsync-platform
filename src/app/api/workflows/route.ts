import { NextRequest, NextResponse } from 'next/server';
import { PRESET_WORKFLOWS } from '@/lib/ecosystem';

// GET: Alle Workflows abrufen (Preset + Custom)
export async function GET() {
  // Mock: In Produktion aus DB laden
  const customWorkflows = [
    {
      id: 'wf-custom-1',
      name: 'Mein Upload-Schutz',
      trigger: { app: 'mediavault', event: 'file.uploaded' },
      actions: [
        { app: 'creatorseal', action: 'apply.watermark', params: { type: 'visible', position: 'bottom-right' } },
        { app: 'certificategen', action: 'generate.certificate', params: { type: 'authenticity' } },
      ],
      enabled: true,
    },
  ];

  return NextResponse.json({
    presets: PRESET_WORKFLOWS,
    custom: customWorkflows,
    total: PRESET_WORKFLOWS.length + customWorkflows.length,
  });
}

// POST: Workflow ausfuehren oder neuen erstellen
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'execute') {
      const { workflowId, triggerData } = body;
      // Workflow-Engine: Events durch Pipeline leiten
      const allWorkflows = [...PRESET_WORKFLOWS];
      const workflow = allWorkflows.find(w => w.id === workflowId);

      if (!workflow) {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
      }

      if (!workflow.enabled) {
        return NextResponse.json({ error: 'Workflow is disabled' }, { status: 400 });
      }

      // Simulate workflow execution
      const executionLog = workflow.actions.map((step, i) => ({
        step: i + 1,
        app: step.app,
        action: step.action,
        status: 'completed',
        timestamp: Date.now() + i * 1000,
        result: { success: true, message: `${step.action} executed on ${step.app}` },
      }));

      return NextResponse.json({
        workflowId,
        status: 'completed',
        trigger: triggerData,
        executionLog,
        duration: `${workflow.actions.length * 1.2}s`,
      });
    }

    if (action === 'create') {
      const { name, trigger, actions } = body;
      const newWorkflow = {
        id: `wf-custom-${Date.now()}`,
        name,
        trigger,
        actions,
        enabled: true,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({ workflow: newWorkflow, message: 'Workflow created' });
    }

    if (action === 'toggle') {
      const { workflowId, enabled } = body;
      return NextResponse.json({ workflowId, enabled, message: `Workflow ${enabled ? 'enabled' : 'disabled'}` });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Workflow operation failed' }, { status: 500 });
  }
}
