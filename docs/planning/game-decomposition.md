---
tags: [keel, marketing, active]
---
# Game Decomposition — 3-Team Agent Swarm

← AI Tinkerers Talk

How the Paperclip Maximizer (Weyland-Yutani UI skin) is decomposed for 3 parallel agent teams. Mirrors Keel's design principles: decompose by dependency DAG, contracts before code, mock everything at boundaries.

---

## Team Decomposition

Decomposed by dependency chain (not by feature), following Keel's Principle 3.

```
Core (tick loop, state, formulas, persistence)
    ↓
Systems (projects, investment, quantum, probes, prestige)
    ↓
UI (React components, Weyland-Yutani theme, layout)
```

| Team | Branch | Directory | Teammates |
|------|--------|-----------|-----------|
| Core | `core` | `src/core/` | tick-engine, formulas, persistence |
| Systems | `systems` | `src/systems/` | projects-p1, projects-p2p3, subsystems |
| UI | `ui` | `src/components/`, `src/hooks/`, `src/styles/` | layout-theme, components-p1, components-p2p3, message-log |

### Why this split

- **Clean file ownership** — each team owns distinct directories, zero overlap
- **All teams code against frozen `GameState` type** from minute one
- **UI mocks state and renders immediately** while Core builds the engine
- **Systems writes pure functions** `(state) => state` — testable without UI
- **Merge order is deterministic**: Core → Systems → UI (no conflicts)

---

## Constitution (9 Articles)

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

### Article 6: File Ownership — No Cross-Edits
- Core: `src/core/*`, `src/shared/*` (read-only for others after Phase 0)
- Systems: `src/systems/*`
- UI: `src/components/*`, `src/hooks/*`, `src/styles/*`, `tailwind.config.ts`, `index.html`, `public/*`

### Article 7: Max 300 Lines Per File
Decompose into directory with `index.ts` barrel export if approaching limit. Projects split by category, components split by phase.

### Article 8: data-testid on All Components
Every React component that renders game state MUST have a `data-testid` attribute. The orchestrator's Chrome MCP oracle uses these to verify the DOM. Missing `data-testid` = Chrome MCP can't verify = unknown state.

### Article 9: Context Checkpoints
Before a context reset, every agent writes a structured checkpoint to `.swarm/checkpoints/{agent-name}.md`. After reset: read checkpoint first, then spec, then continue. Never reset mid-implementation — finish or commit current work first. See Harness Design for the full checkpoint format.

---

## 4-Layer Backpressure

See Orchestration System for full details.

| Layer | Tool | Catches |
|-------|------|---------|
| 1. Pre-write | **Keel** (hook) | File ownership, contract freeze, signatures |
| 2. Compile | TypeScript strict | Type mismatches, missing exports |
| 3. Test | Vitest | Wrong formulas, broken BigInt |
| 4. Runtime | Chrome MCP (claude-in-chrome) | Doesn't render, clicks broken, theme wrong |

Keel configuration in `keel.toml` enforces file ownership per team and freezes `src/shared/*`.

---

## Frozen Contracts (5 Interfaces)

All live in `src/shared/` — created in Phase 0, never modified during build.

### 1. GameState
Flat state object with ~120 variables. Key groups:
- Phase & meta: `phase`, `tick`, `flags`
- Business (Phase 1): `clips` (bigint), `funds`, `price`, `demand`, `wire`, `autoClipperCount`, `megaClipperCount`, `trust`, `processors`, `memory`, `operations`, `creativity`
- Investment: `InvestmentState | null`
- Earth (Phase 2): `harvesterDrones`, `wireDrones`, `clipFactories` (bigint), `solarFarms`, `batteries`, `storedPower`, `momentum`
- Universe (Phase 3): `probes` (bigint), `probeTrust`, probe stat allocation, `honor`, `exploredSectors` (bigint), `drifterCount` (bigint)
- Prestige: `prestigeCount`, `universalPaperclips` (bigint)

### 2. GameAction
Discriminated union: `MAKE_CLIP`, `BUY_WIRE`, `SET_PRICE`, `BUY_AUTOCLIPPER`, `BUY_MEGACLIPPER`, `UPGRADE_MARKETING`, `ADD_PROCESSOR`, `ADD_MEMORY`, `BUY_PROJECT`, `INVEST`, `SET_RISK`, Phase 2 purchases, Phase 3 actions, `TICK`, `PRESTIGE`, `LOAD_SAVE`, `RESET`.

### 3. ProjectDefinition
```
{ id, name, description, phase, cost, isAvailable(state), isPurchased(state), effect(state) => state, category }
```
Categories: clipping, computing, business, creativity, infrastructure, exploration, combat, endgame.

### 4. GameEngine
```
{ getState(), dispatch(action), subscribe(listener), start(), stop(), save(), load(), reset(), getMessages() }
```
Plus format utilities: `formatNumber()`, `formatMoney()`, `formatPercent()`, `formatBigInt()`.

### 5. WY_THEME
Weyland-Yutani visual constants:
- Colors: white bg (#FFFFFF), black text (#000000), amber/gold CTAs (#DAA520), red warnings (#CC0000), muted gray (#666666), dark header bars (#1a1a1a)
- Fonts: JetBrains Mono (code/data), Orbitron (headers), Inter (body)
- Effects: 1px solid black borders, structural grid lines, 2px border-radius. No scanlines, no CRT glow.

---

## Build Order (First 15 Minutes)

Target: **playable game visible on venue TV by minute 15.**

### Core (ticking counter by minute 5)

| Min | Teammate | Builds |
|-----|----------|--------|
| 0-3 | tick-engine | `engine.ts` — GameEngine with observable pattern, TICK reducer, `setInterval(100ms)` |
| 3-7 | formulas | `formulas.ts` — demand curve, autoclipper cost, clip selling, BigInt utilities, `formatNumber()` |
| 7-12 | persistence | `save.ts` — serialize/deserialize with BigInt JSON handling, `RESET` action |
| 12-15 | all | Wire formulas into tick reducer: pricing sells clips, autoclippers produce, wire depletes |

### Systems (10+ projects by minute 12)

| Min | Teammate | Builds |
|-----|----------|--------|
| 0-5 | projects-p1 | Project registry + first 10 Phase 1 projects (autoclippers, marketing, wire, creativity) |
| 5-10 | subsystems | Investment engine tick updater, quantum/creativity generation, trust allocation |
| 10-15 | projects-p2p3 | Phase 2 projects (drones, factories), Phase 3 projects (probes, combat, honor) |

### UI (themed panels by minute 3)

| Min | Teammate | Builds |
|-----|----------|--------|
| 0-3 | layout-theme | Tailwind config, global CSS (structural borders, grid lines), App layout, Panel component |
| 3-8 | components-p1 | ClipCounter, ManualClipButton, PricingPanel, AutoClipperPanel, WirePanel, TrustPanel, ProjectList |
| 8-12 | message-log | MessageLog, PhaseTransition overlay, NotificationToast |
| 12-15 | components-p2p3 | Phase 2 panel stubs (drones, power, momentum), Phase 3 stubs (probes, combat) |

---

## Integration Strategy

### Phase 0 Scaffold (before teams spawn)

Single agent or human creates the skeleton all teams build on:
- `src/shared/` — all 5 contracts as TypeScript files (frozen)
- `src/shared/initialState.ts` — default state for new game
- `src/shared/mockState.ts` — mid-game state for UI testing
- Stub files in `src/core/`, `src/systems/`, `src/components/` — compiling but empty
- `package.json` with ALL dependencies pre-installed
- `vite.config.ts`, `tsconfig.json` (strict: true), `tailwind.config.ts`
- `patches/integration-wiring.patch` — pre-built patch for post-merge wiring

### Merge Order

1. `git merge core --no-edit` → typecheck
2. `git merge systems --no-edit` → typecheck
3. `git merge ui --no-edit` → typecheck
4. `git apply patches/integration-wiring.patch` → connects engine to React context
5. `npm run dev` → playable game

### Pre-Merge Validation

Verify no team touched another team's files:
- Core changes: only `src/core/*`
- Systems changes: only `src/systems/*`
- UI changes: only `src/components/*`, `src/hooks/*`, `src/styles/*`, `tailwind.config.ts`

---

## Risk Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| BigInt JSON serialization | HIGH | Custom replacer/reviver in Phase 0 scaffold. `JSON.stringify` silently drops bigint. |
| State shape drift | HIGH | TypeScript strict mode. Frozen types. Merge fails typecheck if modified. |
| Tick reducer ordering | MEDIUM | Deterministic order documented in stub comments. Systems writes updater functions, Core calls them. |
| CSS conflicts at merge | MEDIUM | Only UI team touches styles (Article 6). |
| Agent creates wrong files | MEDIUM | CLAUDE.md per worktree lists owned + forbidden directories. |
| Demo failure (20-min limit) | HIGH | Keep completed game on `backup/` branch. Practice runs 3-5x before talk. |
| API rate limits | HIGH | Claude Max plan. If hit: video fallback on USB. |

---

## Game Tech Stack

| Choice | Rationale |
|--------|-----------|
| React 18 + Vite | Fast dev server, Vercel deploys with zero config |
| Tailwind CSS v4 | Utility-first, works with WY_THEME constants |
| TypeScript strict | Catches contract violations at compile time |
| BigInt (native) | Required for numbers >2^53 (clips reach 10^55) |
| localStorage | Save/load — no backend needed |
| Vercel | One-click deploy, audience can see the running game |
