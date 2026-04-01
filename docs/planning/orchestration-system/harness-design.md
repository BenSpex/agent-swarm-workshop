---
tags: [keel, marketing, active]
---
# Harness Design — Context, Evaluation, Logging

← Orchestration System

Insights from [Anthropic's harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps) applied to the workshop.

---

## Context Resets

"Context resets — clearing the window entirely with structured handoffs — solve this better than compaction alone." Agents exhibit "context anxiety" as windows fill.

### When to Reset

- After completing a major task (never mid-implementation)
- When context approaches ~70% capacity
- At phase gate transitions (natural handoff points)
- Lead triggers reset for a teammate stuck in retry loops

### Checkpoint Format (`.swarm/checkpoints/{agent-name}.md`)

```markdown
# Checkpoint: tick-engine
Timestamp: 2026-04-10T14:32:05Z
Team: core | Branch: core

## Completed
- src/core/engine.ts — GameEngine with observable, TICK reducer, setInterval(100ms)
- src/core/formulas.ts — demand curve, autoclipper cost (lines 1-80)

## In Progress
- formulas.ts lines 80-150: wire price fluctuation + megaclipper production
- Failing test: tests/core/formulas.test.ts "megaclipper cost escalation"

## Key Decisions
- Used Map<string, number> for formula cache — better BigInt compat
- Demand formula uses Math.pow not ** operator — BigInt coercion issue

## Resume Instructions
1. Read spec: prompts/02-architecture/spec-core.md
2. Read this checkpoint
3. git log --oneline -20 && git diff HEAD~5 --stat
4. Continue from "In Progress" above
```

### Per-Worktree CLAUDE.md Addition

```markdown
## Context Reset Protocol
Before your context resets, write a checkpoint to .swarm/checkpoints/{your-name}.md.
After reset: read your checkpoint FIRST, then your spec, then continue.
```

---

## Evaluation Rubric

"Separating generation from assessment." Agents "confidently praise mediocre work." The orchestrator scores output against explicit criteria — not pass/fail, but 1-5.

### UI Evaluation Rubric (scored by orchestrator via Chrome MCP screenshot)

| Criterion | 1 (Fail) | 3 (Pass) | 5 (Excellent) |
|---|---|---|---|
| Theme Coherence | Default Tailwind, no WY branding | White bg, black structural grids, amber buttons, monospace typography | Full Clinical: structural borders, Orbitron headers, amber CTAs, panel hierarchy, dark header bars |
| Layout Craft | Overlapping, broken grid | Aligned, readable, responsive | Pro spacing, hierarchy, breathing room |
| Functionality | Clicks broken, state stale | Core interactions work | Smooth transitions, loading states |
| Data Display | NaN or missing numbers | Formatted, BigInt works | Large numbers readable, units labeled |

**Pass threshold:** 3+ on all. Score <3 on any → specific feedback routed to UI team with the failing criterion.

### Core/Systems Rubric (measured by tests)

| Criterion | Measurement |
|---|---|
| Formula accuracy | Vitest tests pass |
| Save/load integrity | BigInt survives JSON roundtrip |
| Tick determinism | Same inputs → same outputs |
| Performance | Tick loop holds 100ms |

### Reference Screenshots (Phase 0 scaffold)

Include in `reference/` directory:
- `wy-theme-target.png` — Stitch design showing ideal WY look
- `phase1-layout.png` — expected Phase 1 panel arrangement
- `phase2-layout.png` — expected Phase 2
- `phase3-layout.png` — expected Phase 3

Orchestrator L3 comparison: screenshot → compare against reference → score rubric.

---

## Logging System

7 JSONL log streams capture every failure for prompt improvement.

```
.swarm/logs/
├── keel-violations.jsonl        # Every pre-write block
├── typescript-errors.jsonl      # Every tsc failure
├── vitest-failures.jsonl        # Every test failure
├── chrome-results.jsonl     # Every browser verification
├── plan-rejections.jsonl        # Every lead rejection (with reason)
├── escalations.jsonl            # Every 5/8/15 threshold
└── agent-decisions.jsonl        # Every file write/edit
```

### Log Format (JSONL)

```json
{"timestamp":"...","run":3,"team":"core","agent":"tick-engine","layer":"keel","event":"violation","detail":"E001: modified src/shared/types.ts","file":"src/shared/types.ts","action_taken":"self-corrected","prompt_fix_needed":"spec unclear on frozen contracts"}
```

### Capture Mechanisms

| Stream | Hook/Tool |
|---|---|
| Keel violations | `PreToolUse` hook → keel compile stderr → log |
| TypeScript errors | `tsc --noEmit 2>&1` parsed to JSONL |
| Vitest failures | `vitest run --reporter=json` output |
| Chrome MCP (`mcp__claude-in-chrome__*`) | Orchestrator writes after each verification |
| Plan rejections | Lead logs reason in `SendMessage` |
| Escalations | `TeammateIdle` hook → log |
| Agent decisions | `PostToolUse` hook on Write/Edit → log |

### Post-Run Analysis (`analyze-run.sh`)

Parses JSONL logs → failure frequency by layer/team/agent → prompt fix recommendations with severity → cross-run pattern detection. See Prep Checklist for the full practice run protocol.

---

## Practice Run Metrics

| Metric | Target |
|--------|--------|
| Time to Phase 1 playable | <15 min |
| Time to full game | <45 min |
| Keel violations (should decrease) | Trending → 0 |
| TypeScript errors post-merge | 0 |
| Vitest failures | 0 |
| Chrome MCP layers passing | 5/5 |
| UI rubric scores | 3+ on all criteria |
| Plan rejections by leads | Trending → 0 |
| Agent escalations (15-repeat) | 0 |
| Merge conflicts | 0 |
| Context resets with valid checkpoints | 100% |

**"Bulletproof" = 2 consecutive clean runs with:**
- Zero human intervention
- All 4 backpressure layers green
- UI rubric scores 3+ on all criteria
- Full game playable after merge
- <45 min total build time
- Keel violations trending to zero
- Zero lead plan rejections
- All context resets have valid checkpoints
