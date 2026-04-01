---
tags: [keel, marketing, active]
---
# Orchestration System — 4-Layer Backpressure

← AI Tinkerers Talk

The full orchestration design for the agent swarm workshop. 4 tmux panes, 3 agent teams in worktrees, 1 orchestrator. 4-layer verification stack. Extensive logging for prompt iteration.

## Contents

| File | Description |
|------|-------------|
| Backpressure Layers | 4-layer stack: Keel → TypeScript → Vitest → Chrome MCP |
| Infrastructure | tmux panes, Ralph Loop, lead roles, phase gates, prerequisites |
| Harness Design | Context resets, evaluation rubric, logging, practice metrics |

## Overview

```
Layer 1: KEEL (pre-write)     → file ownership, contract freeze, signatures
Layer 2: TYPESCRIPT (compile)  → state shape, missing exports, wrong types
Layer 3: VITEST (test)         → wrong formulas, broken BigInt, engine bugs
Layer 4: CHROME MCP (runtime)  → doesn't render, clicks broken, theme wrong
```

| Keel's Own Oracle | Workshop Oracle | Layer |
|---|---|---|
| LSP ground truth | Keel (pre-write) | Structure |
| JSON schema validation | TypeScript strict | Types |
| Mutation testing | Vitest | Logic |
| Performance benchmarks | Chrome MCP | Runtime |

**The meta move:** The tool being demoed in the talk enforces the code being built by the demo's agent swarm.

## Architecture

```
┌─────────────────────┬─────────────────────┐
│ ORCHESTRATOR         │ CORE TEAM           │
│ Root worktree        │ worktree-core/      │
│ /ralph-loop          │ Lead + 3 teammates  │
│ Chrome MCP           │ Keel hook active    │
├─────────────────────┼─────────────────────┤
│ SYSTEMS TEAM         │ UI TEAM             │
│ worktree-systems/    │ worktree-ui/        │
│ Lead + 3 teammates   │ Lead + 4 teammates  │
│ Keel hook active     │ Keel hook active    │
└─────────────────────┴─────────────────────┘

Total: 1 orchestrator + 3 leads + 10 teammates = 14 agents
```
