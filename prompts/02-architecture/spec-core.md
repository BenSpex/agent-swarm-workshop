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
- Each TICK calls subsystem updaters in order: pricing sells clips, autoclippers produce, wire depletes
- Handle all Phase 1 actions: MAKE_CLIP, BUY_WIRE, SET_PRICE, BUY_AUTOCLIPPER, etc.
- Auto-save every 250 ticks (25 seconds)

---

## Test Strategy

Run tests with: `npx vitest run tests/core/`

Required test files:
- `tests/core/formulas.test.ts` -- unit tests for every formula
- `tests/core/engine.test.ts` -- dispatch, subscribe, tick cycle
- `tests/core/save.test.ts` -- BigInt round-trip, Set round-trip, full state serialization

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
