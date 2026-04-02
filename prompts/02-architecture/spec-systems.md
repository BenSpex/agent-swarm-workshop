# Spec: Systems Team

## Team Info

| Field | Value |
|-------|-------|
| Team | Systems |
| Branch | `systems` |
| Directory | `src/systems/` |
| Teammates | projects-p1, projects-p2p3, subsystems |
| Test command | `npx vitest run tests/systems/` |
| Typecheck | `npx tsc --noEmit` |

## File Ownership

You may ONLY touch files in `src/systems/*`. You may READ `src/shared/*` but never modify it. Any edit outside `src/systems/` is a Constitution violation and will be reverted.

Files you will create/edit:
- `src/systems/projects/index.ts` -- Project registry (barrel export + lookup)
- `src/systems/projects/phase1.ts` -- Phase 1 projects (~20 projects)
- `src/systems/projects/phase2.ts` -- Phase 2 projects
- `src/systems/projects/phase3.ts` -- Phase 3 projects
- `src/systems/investment.ts` -- Stock/bond simulation tick updater
- `src/systems/quantum.ts` -- Creativity generation logic
- `src/systems/trust.ts` -- Trust allocation (processors/memory)
- `src/systems/probes.ts` -- Probe launch/explore/replicate/combat

---

## Constitution Articles (Your Law)

**Article 1 -- Single State Tree:** All game state lives in ONE `GameState` object. Your functions receive state and return new state.

**Article 2 -- Pure Formulas:** Every system function is pure: `(state) => state` or `(state, inputs) => output`. No side effects, no DOM, no timers.

**Article 3 -- BigInt for Large Numbers:** clips, clipFactories, probes, exploredSectors, drifterCount, universalPaperclips are all bigint. Never mix with number arithmetic.

**Article 4 -- 100ms Tick:** Core calls your tick updaters in deterministic order. You provide the pure functions, Core orchestrates.

**Article 5 -- Contracts Are Frozen:** Import types from `src/shared/` but never modify them.

**Article 6 -- File Ownership:** Systems owns `src/systems/*` only.

**Article 7 -- Max 300 Lines Per File:** Split projects by phase. Split subsystems by concern.

**Article 9 -- Context Checkpoints:** Write checkpoints before context resets.

---

## Key Interface

### ProjectDefinition (from `src/shared/projects.ts`)

```typescript
interface ProjectDefinition {
  id: string;                              // Unique ID, e.g. "autoclipper_1"
  name: string;                            // Display name
  description: string;                     // Flavor text
  phase: GamePhase;                        // 1, 2, or 3
  cost: ProjectCost;                       // { operations?, creativity?, funds?, trust? }
  isAvailable: (state: GameState) => boolean;   // Should this appear in the list?
  effect: (state: GameState) => GameState;      // Apply the upgrade
  category: ProjectCategory;               // For UI filtering
}

enum ProjectCategory {
  CLIPPING, COMPUTING, BUSINESS, CREATIVITY,
  INFRASTRUCTURE, EXPLORATION, COMBAT, ENDGAME
}
```

---

## Build Order

### Minute 0-5: projects-p1

Build project registry + Phase 1 projects:

**`src/systems/projects/index.ts`** -- Registry:
- `getAllProjects(): ProjectDefinition[]`
- `getProjectById(id: string): ProjectDefinition | undefined`
- `getAvailableProjects(state: GameState): ProjectDefinition[]`
- `getPurchasedProjects(state: GameState): ProjectDefinition[]`

**`src/systems/projects/phase1.ts`** -- First 10+ Phase 1 projects:
- AutoClippers (cost: 750 ops) -- unlocks autoClippersUnlocked flag
- Improved AutoClippers (cost: 2500 ops) -- doubles clipper output
- Even Better AutoClippers (cost: 5000 ops) -- doubles again
- MegaClippers (cost: 12000 ops) -- unlocks megaClippersUnlocked flag
- New Slogan (cost: 500 ops) -- increases marketing effectiveness
- Catchier Slogan (cost: 1000 ops) -- further marketing boost
- Improved Wire Extrusion (cost: 1750 ops) -- clips cost less wire
- Optimized Wire Buying (cost: 3000 ops) -- unlocks wireBuyerUnlocked flag
- Quantum Computing (cost: 10000 ops) -- unlocks quantumUnlocked, creativityUnlocked
- Photonic Chip (cost: 2000 creativity) -- boosts processor speed
- Strategic Modeling (cost: 12000 ops) -- unlocks advanced projects
- Limerick Generation (cost: 1000 creativity) -- activates limericksActive
- Lexical Processing (cost: 2000 creativity) -- activates lexicalProcessingActive
- Combinatory Harmonics (cost: 5000 creativity) -- activates combinatoryHarmonicsActive
- Hadwiger Problem (cost: 3500 creativity) -- solves hadwigerProblemSolved
- Toth Sausage Conjecture (cost: 5000 creativity) -- solves tothSausageConjectureSolved
- Hostile Takeover (cost: 10000 ops) -- activates hostileTakeoverActive
- Full Monopoly (cost: 15000 ops) -- activates fullAutoClippersActive
- Xavier Re-initialization (cost: 100000 ops) -- activates xavierInitialized
- Space Exploration (cost: 120000 ops + 5000 creativity) -- unlocks spaceTravelUnlocked, triggers Phase 2

### Minute 5-10: subsystems

**`src/systems/investment.ts`:**
- `updateInvestment(state: GameState): GameState` -- tick updater
- Stock/bond value fluctuation based on riskLevel
- Return calculation: higher risk = higher variance
- Portfolio value tracking

**`src/systems/quantum.ts`:**
- `updateCreativity(state: GameState): GameState` -- tick updater
- Generates creativity when quantumUnlocked is true
- Rate depends on processors and active creativity flags
- Limerick, lexical processing, combinatory harmonics boost rates

**`src/systems/trust.ts`:**
- `checkTrustMilestone(state: GameState): GameState` -- awards trust at clip thresholds
- Milestones: 1000, 2000, 5000, 10000, 25000, 50000, 100000, etc.
- Trust allocation handled by ADD_PROCESSOR / ADD_MEMORY actions (Core dispatches, but the formula logic can live here)

### Minute 10-15: projects-p2p3

**`src/systems/projects/phase2.ts`:**
- Solar Farm Efficiency, Harvester Throughput, Factory Optimization
- Momentum Computing, Swarm Coordination
- Phase 3 trigger project

**`src/systems/projects/phase3.ts`:**
- Probe Launch Improvements, Combat Strategy
- Exploration Efficiency, Honor rewards
- Prestige/endgame trigger projects

**`src/systems/probes.ts`:**
- `updateProbes(state: GameState): GameState` -- tick updater for Phase 3
- Probe exploration: probes * probeExploration rate -> exploredSectors
- Probe replication: probes * probeSelfReplication rate -> new probes
- Drifter encounters: random based on exploredSectors
- Combat resolution: probeCombat vs drifter strength -> honor

---

## Test Strategy

Run tests with: `npx vitest run tests/systems/`

Required test files:
- `tests/systems/projects.test.ts` -- isAvailable, cost checks, effect application
- `tests/systems/investment.test.ts` -- portfolio update, risk levels
- `tests/systems/quantum.test.ts` -- creativity generation rates
- `tests/systems/probes.test.ts` -- exploration, replication, combat

Every `isAvailable` and `effect` function must be tested with a mock state. Import `createMockState()` from `src/shared/mockState.ts`.

---

---

## Chrome MCP Backpressure (What the Browser Tests)

After every merge, the browser verifies these Systems-owned mechanics:

| Check | What It Tests | Failure Message |
|-------|--------------|-----------------|
| L4.7 | Project list shows 1+ project | "project registry empty" |
| L4.8 | Buy project → disappears from list | "project purchase broken" |
| L4.10-12 | Phase 2 transition + panels | "phase transition broken" |
| L4.13-15 | Phase 3 probes + BigInt display | "probe system broken" |

Your `allProjects` must return available projects filtered by state.
Your project `effect()` functions must be pure: `(state) => state`.
Phase transitions must trigger when conditions are met in the tick reducer.

---

## Context Checkpoint Format

Before any context reset, write to `.swarm/checkpoints/{your-name}.md`:

```markdown
# Checkpoint: {agent-name}
## Timestamp: {ISO-8601}
## Status: {in-progress | blocked | done}

### Completed
- [x] file.ts -- description

### In Progress
- [ ] file.ts -- what remains

### Blocked On
- {blocker description}

### Next Steps
1. First thing after reset
2. Second thing
```
