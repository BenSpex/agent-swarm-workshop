# Spec: Core Team

## Team Info

| Field | Value |
|-------|-------|
| Team | Core |
| Branch | `core` |
| Directory | `src/core/` |
| Teammates | tick-engine, formulas, persistence |
| Test command | `npx vitest run tests/core/` |
| Typecheck | `npx tsc --noEmit` |

## File Ownership

You may ONLY touch files in `src/core/*`. You may READ `src/shared/*` but never modify it. Any edit outside `src/core/` is a Constitution violation and will be reverted.

Files you will create/edit:
- `src/core/engine.ts` -- GameEngine implementation
- `src/core/formulas.ts` -- All game formulas (pure functions)
- `src/core/save.ts` -- localStorage persistence + BigInt JSON handling

---

## Constitution Articles (Your Law)

**Article 1 -- Single State Tree:** All game state lives in ONE `GameState` object. No `useState` for game values. Components read from `useGameState()` hook. Dispatch actions to mutate.

**Article 2 -- Pure Formulas:** Every game formula is a pure function: `(state, inputs) => output`. No side effects, no DOM access, no `setTimeout`. Formulas live in `src/core/formulas.ts`. Every formula has a unit test.

**Article 3 -- BigInt for Large Numbers:** Any value exceeding `Number.MAX_SAFE_INTEGER` uses `bigint`: clips, probes, factories, exploredSectors, drifterCount, universalPaperclips. Never mix bigint and number arithmetic without explicit conversion. Use `formatBigInt()` for display.

**Article 4 -- 100ms Tick, Pure Reducer:** Game loop ticks at 100ms via `setInterval`. Each tick dispatches `{ type: 'TICK' }`. Tick reducer is pure: `(state) => state`. Calls subsystem updaters in deterministic order: pricing -> autoclippers -> wire -> investment -> creativity -> phase-specific. No async in tick path.

**Article 5 -- Contracts Are Frozen:** Types in `src/shared/` are frozen. Adding a new optional field requires a contract amendment. Removing or renaming a field is NEVER allowed.

**Article 6 -- File Ownership:** Core owns `src/core/*`. Do not touch any other directory.

**Article 7 -- Max 300 Lines Per File:** Decompose into directory with `index.ts` barrel export if approaching limit.

**Article 9 -- Context Checkpoints:** Before a context reset, write a checkpoint to `.swarm/checkpoints/{agent-name}.md`.

---

## Key Interfaces

### GameEngine (you implement this)

```typescript
interface GameEngine {
  getState(): GameState;
  dispatch(action: GameAction): void;
  subscribe(listener: (state: GameState) => void): () => void;
  start(): void;   // starts 100ms setInterval
  stop(): void;     // clears interval
  save(): void;     // persist to localStorage
  load(): boolean;  // load from localStorage, return true if found
  reset(): void;    // reset to initial state, clear localStorage
  getMessages(): string[];
}
```

### GameState (you read from `src/shared/types.ts`)

~120 fields. Key groups:
- **Meta:** phase, tick, flags, messages
- **Phase 1:** clips (bigint), unsoldClips (bigint), funds, price, demand, wire, wirePrice, autoClipperCount, megaClipperCount, autoClipperCost, megaClipperCost, marketingLevel, marketingCost, trust, processors, memory, operations, maxOperations, creativity, opsGenerationRate
- **Investment:** InvestmentState | null
- **Phase 2:** harvesterDrones, wireDrones, clipFactories (bigint), solarFarms, batteries, storedPower, momentum
- **Phase 3:** probes (bigint), probeTrust, probeSpeed, probeExploration, probeSelfReplication, probeCombat, honor, exploredSectors (bigint), drifterCount (bigint)
- **Prestige:** prestigeCount, universalPaperclips (bigint)
- **Projects:** purchasedProjectIds (Set<string>)

---

## Build Order

### Minute 0-3: tick-engine

Build `src/core/engine.ts`:
- Observable pattern: subscribers array, notify on dispatch
- `dispatch()` runs the reducer and notifies all subscribers
- `start()` calls `setInterval(100ms)` dispatching `{ type: 'TICK' }`
- `stop()` clears the interval
- TICK reducer is pure: `(state) => state`
- Import `createInitialState()` from `src/shared/initialState.ts`

### Minute 3-7: formulas

Build `src/core/formulas.ts`:
- `calculateDemand(price, marketingLevel, flags)` -- demand curve
- `calculateAutoClipperCost(count)` -- exponential cost scaling
- `calculateMegaClipperCost(count)` -- exponential cost scaling
- `calculateMarketingCost(level)` -- marketing upgrade cost
- `sellClips(state)` -- sells unsoldClips based on demand, updates funds
- `produceAutoClips(state)` -- autoclippers produce clips (costs wire)
- `produceMegaClips(state)` -- megaclippers produce clips (costs wire)
- BigInt utilities: all clip/factory math uses bigint
- Every formula must have a corresponding unit test

### Minute 7-12: persistence

Build `src/core/save.ts`:
- `serializeState(state: GameState): string` -- JSON with BigInt replacer
- `deserializeState(json: string): GameState` -- JSON with BigInt reviver
- BigInt serialization: `bigint` -> `{ __bigint: "12345" }` and back
- Set serialization: `Set<string>` -> `{ __set: ["a", "b"] }` and back
- `saveToLocalStorage(state)` / `loadFromLocalStorage()` -- uses keys like `"wy-paperclips-save"`
- Wire into engine's `save()`, `load()`, `reset()` methods

### Minute 12-15: all teammates

Wire formulas into tick reducer:
- Each TICK calls subsystem updaters in the 13-step order below
- Handle all actions listed in the Action Catalog below
- Auto-save every 250 ticks (25 seconds)

---

## Action Catalog (COMPLETE — every action the reducer must handle)

### MAKE_CLIP
- Guard: `wire >= 1`
- Effect: `clips += 1n`, `unsoldClips += 1n`, `wire -= 1`
- CRITICAL: Each clip costs EXACTLY 1 wire. Return state unchanged if wire is 0.

### BUY_WIRE (CRITICAL — game-breaking if wrong)
- Guard: `funds >= wirePrice`
- Effect: `funds -= wirePrice`, `wire += 1000` (1 spool = 1000 inches of wire)
- wirePrice fluctuates each tick (+/- random, clamped [10, 35])
- This is how players get wire in Phase 1. If this action doesn't work, the game is unplayable.

### SET_PRICE
- Effect: `price = action.price`, clamped to [0.01, 9.99]
- LOWER button: price -= 0.01. RAISE button: price += 0.01.

### BUY_AUTOCLIPPER
- Guard: `funds >= autoClipperCost`
- Effect: `funds -= autoClipperCost`, `autoClipperCount += 1`, recalculate cost

### BUY_MEGACLIPPER
- Guard: `funds >= megaClipperCost && flags.megaClippersUnlocked`
- Effect: `funds -= megaClipperCost`, `megaClipperCount += 1`, recalculate cost

### BUY_MARKETING
- Guard: `funds >= marketingCost`
- Effect: `funds -= marketingCost`, `marketingLevel += 1`, recalculate cost

### ADD_PROCESSOR / ADD_MEMORY
- Guard: `trust > processors + memory` (available trust > 0)
- Effect: increment processors or memory by 1

### BUY_PROJECT
- Guard: project.isAvailable(state) && !purchasedProjectIds.has(id) && player can afford cost
- Effect: deduct cost, add to purchasedProjectIds, apply project.effect(state)

### TOGGLE_WIRE_BUYER
- Guard: `flags.wireBuyerUnlocked`
- Effect: flip `wireBuyerEnabled` boolean

### STRAT_PICK
- Guard: `flags.strategicModelingUnlocked`
- Effect: resolve round using payoff matrix, update yomi

### COMPUTE
- Guard: `flags.quantumUnlocked && operations >= 10`
- Effect: `operations -= 10`, `creativity += 1`

### DEPOSIT / WITHDRAW
- Guard: sufficient funds/portfolio balance
- Effect: move amount between funds and investment tier

### LAUNCH_PROBE
- Guard: `funds >= probeLaunchCost` (define a real cost, e.g. 10000 ops or 50000 funds)
- Effect: `probes += 1n`, deduct cost. Probes are NOT free.

### ADJUST_PROBE (CRITICAL — read this very carefully)
- `probeTrust` = TOTAL trust earned (from projects/honor). NEVER modified by ADJUST_PROBE.
- All 8 stats start at 1 (free baseline, does NOT count against probeTrust).
- Available trust = `probeTrust - (sum_of_all_8_stats - 8)` — a DERIVED value.
- INCREMENT (+1): Guard: available trust > 0. Increment the stat by 1. Do NOT modify probeTrust.
- DECREMENT (-1): Guard: stat > 1 (minimum is 1). Decrement the stat by 1. Do NOT modify probeTrust.
- The UI computes and displays "Available Trust" as: `probeTrust - (sum_of_all_8_stats - 8)`.

### Phase 2 Purchases (BUY_HARVESTER, BUY_WIRE_DRONE, BUY_FACTORY, BUY_SOLAR_FARM, BUY_BATTERY)
- Each has a cost (funds, matter, or power). Guard: can afford.
- Optional `count` field for bulk purchase (multiply cost, add count units).

### DISASSEMBLE
- Guard: have enough of target unit
- Effect: remove units, recover 50% of build cost as resources

### PRESTIGE
- Effect: reset game state to initial, increment prestigeCount, keep universalPaperclips total

---

## Subsystem Integration (CRITICAL)

The TICK reducer MUST import and call subsystem tick updaters from `src/systems/`.
Core team may IMPORT (read) from `src/systems/` — Constitution Article 6 explicitly allows this.
DO NOT inline subsystem logic in the reducer. Keep the reducer under 300 lines (Article 7).

Import and call these in the TICK handler:
- `updateWireBuyer(state)` from `src/systems/wireBuyer.ts`
- `updateInvestment(state)` from `src/systems/investment.ts`
- `updateCreativity(state)` from `src/systems/quantum.ts`
- `checkTrustMilestone(state)` from `src/systems/trust.ts`
- `updateMatter(state)` from `src/systems/matter.ts`
- `updateSwarm(state)` from `src/systems/swarm.ts`
- `updateProbes(state)` from `src/systems/probes.ts`
- `updateStratModeling(state)` from `src/systems/stratModeling.ts`

The reducer's job is ORCHESTRATION: call subsystems in deterministic order, handle simple Phase 1 inline logic (sell clips, auto-clip from wire, wire price fluctuation), and compute derived metrics. Complex subsystem logic belongs in `src/systems/`.

---

## Derived Display Metrics

Calculated every TICK and stored on GameState:

```typescript
// Keep a rolling window of the last 10 ticks (1 second at 100ms/tick)
clipsPerSecond = (clips_now - clips_10_ticks_ago) * 10  // scale to per-second
revenuePerSecond = (funds_now - funds_10_ticks_ago) * 10
clipsSoldPerSecond = (sold_now - sold_10_ticks_ago) * 10
```

Implementation: maintain a circular buffer (array of 10 snapshots). Each tick, record `{ clips, funds, clipsSold }`. Compute deltas from oldest entry.

---

## Wire Buyer Tick Logic

```typescript
function updateWireBuyer(state: GameState): GameState {
  if (!state.flags.wireBuyerUnlocked || !state.wireBuyerEnabled) return state;
  if (state.wire >= 10) return state; // enough wire, skip
  if (state.funds < state.wirePrice) return state; // can't afford
  return {
    ...state,
    funds: state.funds - state.wirePrice,
    wire: state.wire + 1000, // 1 spool = 1000 wire
  };
}
```

---

## Strategic Modeling Tournament Resolution

```typescript
// Payoff matrix: [playerChoice][opponentChoice] = yomi delta
const PAYOFF = { A: { A: 3, B: -1 }, B: { A: 0, B: 1 } };

function resolveStratRound(state: GameState, playerChoice: 'A' | 'B'): GameState {
  const oppChoice = Math.random() < 0.5 ? 'A' : 'B';
  const delta = PAYOFF[playerChoice][oppChoice];
  return {
    ...state,
    yomi: state.yomi + delta,
    stratModelRound: state.stratModelRound + 1,
  };
}
```

Auto-tournament: when `flags.autoTourneyEnabled`, every 50 ticks pick RANDOM and resolve.

---

## COMPUTE Action

```typescript
case 'COMPUTE':
  if (!state.flags.quantumUnlocked || state.operations < 10) return state;
  return { ...state, operations: state.operations - 10, creativity: state.creativity + 1 };
```

---

## Updated Tick Order (13 steps)

The TICK reducer calls subsystem updaters in this deterministic order:

1. **Sell clips** — convert unsoldClips to funds based on demand
2. **Auto-clippers** — produce clips from wire
3. **Mega-clippers** — produce clips from wire
4. **Wire buyer** — auto-buy wire if enabled and wire < 10
5. **Wire price fluctuation** — random walk on wirePrice
6. **Investment** — fluctuate portfolio values
7. **Creativity/Quantum** — generate creativity if unlocked
8. **Strategic modeling** — auto-tournament if enabled (every 50 ticks)
9. **Trust milestones** — award trust at clip thresholds
10. **Operations generation** — processors generate ops up to maxOperations
11. **Phase transitions** (MANDATORY — Core's job, NOT optional):
    - If `phase === BUSINESS && flags.spaceTravelUnlocked` → set `phase = EARTH`, `flags.phase2Unlocked = true`, `harvesterDrones = 10`, log message
    - If `phase === EARTH && flags.phase3Unlocked` → set `phase = UNIVERSE`, log message
12. **Phase 2 subsystems** — drones, factories, power, matter, swarm (if phase >= 2)
13. **Phase 3 subsystems** — probes, exploration, combat (if phase >= 3)
14. **Derived metrics** — update clipsPerSecond, revenuePerSecond, clipsSoldPerSecond

---

## 8 Probe Stats in ADJUST_PROBE

The ADJUST_PROBE action handles all 8 stats:
- `probeSpeed`, `probeExploration`, `probeSelfReplication`, `probeCombat`
- `probeHazardRemediation`, `probeFactoryProd`, `probeHarvesterProd`, `probeWireDroneProd`

Map the ProbeStat string to the state field:
```typescript
const PROBE_STAT_MAP: Record<ProbeStat, keyof GameState> = {
  speed: 'probeSpeed',
  exploration: 'probeExploration',
  selfReplication: 'probeSelfReplication',
  combat: 'probeCombat',
  hazardRemediation: 'probeHazardRemediation',
  factoryProd: 'probeFactoryProd',
  harvesterProd: 'probeHarvesterProd',
  wireDroneProd: 'probeWireDroneProd',
};
```

---

## BigInt Revenue Safety (CRITICAL)

The `calculateRevenue` function MUST NOT overflow when clipsSold exceeds 2^53:

```typescript
// BANNED: Number(clipsSold) * price — overflows silently
// REQUIRED:
export function calculateRevenue(clipsSold: bigint, price: number): number {
  const safeSold = clipsSold > BigInt(Number.MAX_SAFE_INTEGER)
    ? Number.MAX_SAFE_INTEGER
    : Number(clipsSold);
  return safeSold * price;
}
```

Required test: `calculateRevenue(BigInt(10**18), 0.25)` must return a finite number, not NaN or Infinity.

---

## Test Strategy

Run tests with: `npx vitest run tests/core/`

Required test files:
- `tests/core/formulas.test.ts` -- unit tests for every formula + BigInt overflow in calculateRevenue
- `tests/core/engine.test.ts` -- dispatch, subscribe, tick cycle
- `tests/core/save.test.ts` -- BigInt round-trip, Set round-trip, full state serialization
- `tests/core/transitions.test.ts` -- phase transition BUSINESS→EARTH and EARTH→UNIVERSE

### Mandatory Test Cases (MUST exist before commit)

- Phase transition: dispatch BUY_PROJECT for space_exploration, tick, verify phase=2 and harvesterDrones=10
- Phase transition: set phase3Unlocked, tick, verify phase=3
- Wire buyer: set wireBuyerEnabled=true, wire=5, tick, verify wire increases
- Rolling window: run 20 ticks with autoclippers, verify clipsPerSecond > 0
- BigInt overflow: calculateRevenue(BigInt(10**18), 0.25) returns finite number
- Subsystem calls: grep src/core/tickHandler.ts for at least 5 imports from src/systems/

---

## Chrome MCP Backpressure (What the Browser Tests)

After every merge AND in your Ralph Loop, the browser verifies these Core-owned mechanics:

| Check | What It Tests | Failure Message |
|-------|--------------|-----------------|
| L4.1 | Click Make Clip → counter increments | "clip dispatch broken" |
| L4.2 | Wait 300ms → counter auto-changes | "tick loop not running" |
| L4.3 | Buy wire → wire count increases | "wire purchase dispatch broken" |
| L4.4 | Buy autoclipper → count shows 1+ | "autoclipper dispatch broken" |
| L4.5 | Wait 500ms → clips auto-increment | "autoclipper production broken" |
| L4.6 | Change price → demand changes | "price/demand formula broken" |
| L4.9 | Save → reload → state preserved | "save/load broken (check BigInt serializer)" |
| L5 | No NaN/undefined in any .font-data | "formatBigInt() returning bad values" |

Your `engine.dispatch()` must handle: MAKE_CLIP, BUY_WIRE, SET_PRICE, BUY_AUTOCLIPPER, TICK.
Your `engine.start()` must fire setInterval(100ms) dispatching TICK.
Your `bigIntReplacer`/`bigIntReviver` must survive JSON round-trips.

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
