import hierarchy from '../../../agents/agent-hierarchy.json';
import type { AgentDefinition } from './types';

import { cio } from './agents/cio';
import { vpCustomerSuccess } from './agents/vp-customer-success';
import { customerServiceLead } from './agents/customer-service-lead';
import { specialistCreatorSealCopywriter } from './agents/specialist-creatorseal-copywriter';

const DEFINITIONS: AgentDefinition[] = [
  cio,
  vpCustomerSuccess,
  customerServiceLead,
  specialistCreatorSealCopywriter,
];

const byId = new Map<string, AgentDefinition>(DEFINITIONS.map((d) => [d.id, d]));

type HierarchyEntry = { manages?: string[] };
type HierarchyLevel = Record<string, HierarchyEntry | undefined>;

function flattenHierarchy(): Map<string, HierarchyEntry> {
  const out = new Map<string, HierarchyEntry>();
  const root = (hierarchy as unknown as { hierarchy: Record<string, HierarchyLevel> }).hierarchy;
  const levels: HierarchyLevel[] = [
    root.level_0_executive ?? {},
    root.level_1_leadership ?? {},
    root.level_2_management ?? {},
  ];
  for (const level of levels) {
    for (const [id, entry] of Object.entries(level)) {
      if (entry) out.set(id, entry);
    }
  }
  return out;
}

const HIERARCHY = flattenHierarchy();

function validate(): void {
  for (const def of DEFINITIONS) {
    if (def.tier === 'specialist') continue;
    const entry = HIERARCHY.get(def.id);
    if (!entry) {
      throw new Error(
        `[agent-os] definition "${def.id}" (tier=${def.tier}) not found in agents/agent-hierarchy.json`,
      );
    }
    const managed = new Set(entry.manages ?? []);
    for (const sub of def.allowedSubAgents ?? []) {
      const isManaged = managed.has(sub);
      const isKnownSpecialist = byId.get(sub)?.tier === 'specialist';
      if (!isManaged && !isKnownSpecialist) {
        throw new Error(
          `[agent-os] "${def.id}".allowedSubAgents["${sub}"] is neither in hierarchy.manages nor a registered specialist`,
        );
      }
    }
  }
}

validate();

export function getAgent(id: string): AgentDefinition {
  const def = byId.get(id);
  if (!def) throw new Error(`[agent-os] unknown agent id: ${id}`);
  return def;
}

export function listAgents(): AgentDefinition[] {
  return [...DEFINITIONS];
}
