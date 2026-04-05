# Constitution (9 Articles)

These articles are the law governing all agents during the build. Violations are grounds for immediate revert. Every team lead and every teammate must follow these without exception.

---

### Article 1: Single State Tree
All game state lives in ONE `GameState` object. No `useState` for game values. Components read from `useGameState()` hook. Dispatch actions to mutate. Violation = immediate revert.

### Article 2: Pure Formulas
Every game formula is a pure function: `(state, inputs) => output`. No side effects, no DOM access, no `setTimeout`. Formulas live in `src/core/formulas.ts`. Every formula has a unit test.

### Article 3: BigInt for Large Numbers
Any value exceeding `Number.MAX_SAFE_INTEGER` uses `bigint`: clips, probes, factories, exploredSectors, drifterCount, universalPaperclips. Never mix bigint and number arithmetic without explicit conversion. Use `formatBigInt()` for display.

### Article 4: 100ms Tick, Pure Reducer
Game loop ticks at 100ms via `setInterval`. Each tick dispatches `{ type: 'TICK' }`. Tick reducer is pure: `(state) => state`. Calls subsystem updaters in deterministic order: pricing → autoclippers → wire → investment → creativity → phase-specific. No async in tick path.

### Article 5: Contracts Are Frozen
Types in `src/shared/` are frozen after Phase 0. Adding a new optional field requires a contract amendment. Removing or renaming a field is NEVER allowed during build.

### Article 6: File Ownership -- No Cross-Edits
- Core: `src/core/*`, `src/shared/*` (read-only for others after Phase 0)
- Systems: `src/systems/*`
- UI: `src/components/*`, `src/hooks/*`, `src/styles/*`, `tailwind.config.ts`, `index.html`, `public/*`

**Cross-team imports:** Core may IMPORT (read) exported functions from `src/systems/` in the tick reducer. This is a read operation, not a modification, and is explicitly allowed. Systems exports pure `(state) => state` functions; Core orchestrates them in the tick order.

### Article 7: Max 300 Lines Per File
Decompose into directory with `index.ts` barrel export if approaching limit. Projects split by category, components split by phase.

### Article 8: data-testid on All Components
Every React component that renders game state MUST have a `data-testid` attribute. The orchestrator's Chrome MCP oracle uses these to verify the DOM. Missing `data-testid` = Chrome MCP can't verify = unknown state.

### Article 9: Context Checkpoints
Before a context reset, every agent writes a structured checkpoint to `.swarm/checkpoints/{agent-name}.md`. After reset: read checkpoint first, then spec, then continue. Never reset mid-implementation -- finish or commit current work first. See checkpoint format below.

---

## Checkpoint Format

```markdown
# Checkpoint: {agent-name}
## Timestamp: {ISO-8601}
## Status: {in-progress | blocked | done}

### Completed
- [x] file.ts -- description of what was built

### In Progress
- [ ] file.ts -- what remains, what's broken

### Blocked On
- {description of blocker, which team/agent owns it}

### Next Steps
1. First thing to do after reset
2. Second thing
```
