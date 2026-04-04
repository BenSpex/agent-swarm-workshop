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
- `src/systems/stratModeling.ts` -- Strategic modeling tournament engine
- `src/systems/wireBuyer.ts` -- Auto wire purchasing logic
- `src/systems/swarm.ts` -- Swarm computing with gifts
- `src/systems/matter.ts` -- Matter harvesting subsystem

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
- RevTracker (cost: 500 ops) -- unlocks revTrackerEnabled flag (reveals Avg Rev/sec, Clips Sold/sec, Unsold Inventory)
- AutoClippers (cost: 750 ops) -- unlocks autoClippersUnlocked flag (reveals Clips per Second display)
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
- Probe exploration: probes * probeExploration * probeSpeed -> exploredSectors
- Probe replication: probes * probeSelfReplication rate -> new probes (track in probeDescendants)
- Probe production: factoryProd/harvesterProd/wireDroneProd generate resources
- Drifter encounters: random based on exploredSectors
- Combat resolution: probeCombat vs drifter strength -> honor (track losses in probeLosses)
- 8 stats total: speed, exploration, selfReplication, combat, hazardRemediation, factoryProd, harvesterProd, wireDroneProd

**`src/systems/stratModeling.ts`:**
- `updateStratModeling(state: GameState): GameState` -- tick updater
- Tournament engine with 2x2 payoff matrix: (A,A)=+3, (A,B)=-1, (B,A)=+0, (B,B)=+1
- `resolveRound(state, choice: 'A'|'B'|'RANDOM')` -- resolve a single round, update yomi
- Auto-tournament: when `flags.autoTourneyEnabled`, auto-play every 50 ticks using random choice
- Track `stratModelRound` (increments each round)

**`src/systems/wireBuyer.ts`:**
- `updateWireBuyer(state: GameState): GameState` -- tick updater
- When `wireBuyerEnabled && wire < 10 && funds >= wirePrice`: buy 1 spool (1000 wire), deduct wirePrice
- Requires `flags.wireBuyerUnlocked` to be true

**`src/systems/swarm.ts`:**
- `updateSwarm(state: GameState): GameState` -- tick updater for Phase 2+
- When `flags.swarmSyncActive`: generate swarm gifts based on `momentum` and `swarmSyncLevel`
- Gifts: bonus operations or creativity, applied every N ticks (configurable)
- `swarmGiftTimer` counts down; when 0, deliver gift and reset timer

**`src/systems/matter.ts`:**
- `updateMatter(state: GameState): GameState` -- tick updater for Phase 2+
- When `flags.matterHarvestingActive`: harvesters generate `matter` each tick
- Wire drones convert `matter` into wire
- Factories convert `matter` + wire into clips
- `acquiredMatter` tracks lifetime total matter harvested

### Expanded Project List (aim for 45+)

**Phase 1 projects (~20):** (existing list plus)
- AutoTourney (cost: 15000 ops) -- enables `autoTourneyEnabled` flag
- WireBuyer (cost: 3000 ops) -- unlocks `wireBuyerUnlocked` flag (if not already in list)
- Strategic Modeling (cost: 12000 ops) -- unlocks `strategicModelingUnlocked` flag

**Phase 2 projects (~15):**
- Solar Farm Efficiency (cost: 5000 ops)
- Harvester Throughput (cost: 8000 ops)
- Factory Optimization (cost: 10000 ops)
- Momentum Computing (cost: 15000 ops)
- Swarm Coordination (cost: 20000 ops) -- activates `swarmSyncActive`
- Swarm Sync Upgrade (cost: 30000 ops) -- increases `swarmSyncLevel`
- Matter Harvesting (cost: 25000 ops) -- activates `matterHarvestingActive`
- Advanced Matter Processing (cost: 40000 ops)
- Drone Fleet Expansion (cost: 15000 ops)
- Battery Optimization (cost: 10000 ops)
- Power Grid Upgrade (cost: 20000 ops)
- Wire Drone Efficiency (cost: 12000 ops)
- Release the Drones (cost: 200000 ops) -- triggers Phase 3 transition

**Phase 3 projects (~15):**
- Coherent Extrapolated Volition (cost: 50000 ops) -- grants +10 probeTrust
- Probe Launch Improvements (cost: 30000 ops)
- Combat Strategy (cost: 25000 creativity)
- Exploration Efficiency (cost: 40000 ops)
- Honor rewards projects (cost: various honor amounts)
- Increase Max Trust (cost: 500 honor) -- grants +5 probeTrust
- Probe Factory Production (cost: 50000 ops) -- boosts probeFactoryProd
- Probe Harvester Production (cost: 50000 ops) -- boosts probeHarvesterProd
- Probe Wire Drone Production (cost: 50000 ops) -- boosts probeWireDroneProd
- Self-Replication Boost (cost: 75000 ops)
- Hazard Remediation Upgrade (cost: 30000 creativity)
- Drifter Diplomacy (cost: 1000 honor) -- reduces drifter aggression
- Universal Paperclips (cost: 100000 ops + 10000 creativity) -- prestige/endgame trigger
- Name the Probe (cost: 100 yomi) -- cosmetic + small speed boost
- The OODA Loop (cost: 2000 yomi) -- combat bonus from yomi

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
