# ADR 0003 — Paperclip-Hierarchie als Konfiguration

Status: Accepted
Date: 2026-04-21

## Kontext

`agents/agent-hierarchy.json` beschreibt die Organisation (CIO → VPs → Leads → Spezialisten) — Reporting-Wege, Verantwortlichkeiten, Manages/Reports-to-Beziehungen. Sie wird aktuell von nichts konsumiert. AgentOS braucht eine Quelle für Delegations-Erlaubnisse und Agent-Metadaten.

## Entscheidung

Die Hierarchie-JSON wird **read-only** vom AgentOS-Registry (`src/lib/agent-os/registry.ts`) beim Boot geladen und gegen die TypeScript-Definitionen (`src/lib/agent-os/agents/*.ts`) validiert. Bei Diskrepanzen wirft die Registry — so gehen Hierarchie und Runtime nie auseinander.

## Validierungsregeln

1. Jede TS-`AgentDefinition` mit `tier ∈ {cio, vp, lead}` muss einen `id`-Eintrag in der entsprechenden Hierarchie-Ebene haben.
2. `allowedSubAgents` einer Definition muss Teilmenge des `manages`-Arrays in der JSON sein.
3. Spezialisten dürfen `allowedSubAgents: []` haben (Blatt).
4. Abweichungen → Fehler beim Boot, nicht zur Laufzeit.

## Konsequenzen

- `agents/agent-hierarchy.json` wird nicht bearbeitet. Änderungen an der Hierarchie werden dort gepflegt, TS-Definitionen folgen.
- Die Registry ist die einzige Stelle, an der Hierarchie und Runtime-Definitionen zusammenkommen.
- Neue Agenten: JSON zuerst, dann passende TS-`AgentDefinition` hinzufügen.
