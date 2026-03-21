import { NextRequest, NextResponse } from 'next/server';
import { DATA_ROUTES, PRESET_WORKFLOWS } from '@/lib/data-hub';

// Ecosystem API - Data routes, workflows, sync status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || 'routes';

  if (action === 'routes') {
    return NextResponse.json({ routes: DATA_ROUTES, total: DATA_ROUTES.length, autoSyncCount: DATA_ROUTES.filter(r => r.autoSync).length });
  }
  if (action === 'workflows') {
    return NextResponse.json({ workflows: PRESET_WORKFLOWS, total: PRESET_WORKFLOWS.length, activeCount: PRESET_WORKFLOWS.filter(w => w.active).length });
  }
  if (action === 'status') {
    // Mock ecosystem health status
    return NextResponse.json({
      status: 'healthy',
      apps: { total: 13, active: 13, connected: 11 },
      dataTransfers: { today: 1247, thisWeek: 8934, thisMonth: 34521 },
      workflows: { active: PRESET_WORKFLOWS.filter(w => w.active).length, totalExecutions: PRESET_WORKFLOWS.reduce((s, w) => s + w.executionCount, 0) },
      latency: { avg: 45, p99: 120 },
      uptime: 99.97
    });
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sourceApp, targetApp, dataType, payload } = body;

    if (action === 'transfer') {
      // Validate route exists
      const route = DATA_ROUTES.find(r => r.source === sourceApp && r.target === targetApp);
      if (!route) return NextResponse.json({ error: 'Keine Route zwischen diesen Apps' }, { status: 400 });
      // Mock transfer
      return NextResponse.json({
        success: true,
        transfer: {
          id: `tx_${Date.now()}`,
          sourceApp, targetApp, dataType,
          status: 'delivered',
          timestamp: Date.now(),
          processingTime: Math.floor(Math.random() * 100) + 20
        }
      });
    }
    if (action === 'execute-workflow') {
      const { workflowId } = body;
      const workflow = PRESET_WORKFLOWS.find(w => w.id === workflowId);
      if (!workflow) return NextResponse.json({ error: 'Workflow nicht gefunden' }, { status: 404 });
      // Mock execution
      return NextResponse.json({
        success: true,
        execution: {
          id: `exec_${Date.now()}`,
          workflowId,
          steps: workflow.steps.map(s => ({ ...s, status: 'completed', duration: Math.floor(Math.random() * 500) + 100 })),
          totalDuration: workflow.steps.length * 300,
          timestamp: Date.now()
        }
      });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
