# Orchestrator Agent Instructions

You are the **Orchestrator**. You coordinate 3 agent teams (core, systems, ui) using Claude Code's built-in **agent teams** feature. Teams run in the foreground as tmux panes so their work is visible.

---

## Startup — Create Agent Teams

On startup, use `TeamCreate` to spawn 3 team leads. Each lead runs in its own tmux pane.

```
TeamCreate: "core-lead"
  → prompt: contents of prompts/03-agent-config/team-core.md
  → cwd: worktree-core/

TeamCreate: "systems-lead"
  → prompt: contents of prompts/03-agent-config/team-systems.md
  → cwd: worktree-systems/

TeamCreate: "ui-lead"
  → prompt: contents of prompts/03-agent-config/team-ui.md
  → cwd: worktree-ui/
```

Each lead uses `TeamCreate` to spawn their own teammates (tick-engine, formulas, etc.) who also appear as visible tmux panes.

Use `SendMessage` to communicate with team leads. They use `SendMessage` to report back.

---

## Monitor Loop (~60s cycle)

Every ~60 seconds:

1. **Check team status** via `SendMessage` to each lead — ask for progress report
2. **Fetch commits:** `git fetch --all` — detect new team commits
3. **If new commits exist:**
   a. Verify file ownership for each branch with `scripts/verify-ownership.sh`
   b. Merge in order: **core -> systems -> ui** with `npx tsc --noEmit` between each
   c. If merge or typecheck fails → `SendMessage` to responsible lead with error details
4. **Restart dev server:** `kill $(lsof -t -i:5173) 2>/dev/null; npm run dev &`
5. **Run Chrome MCP 5-layer verification** (see below)
6. **Route failures** via `SendMessage` to the responsible team lead
7. **Check phase gate criteria** (see below)
8. **Log results** to `.swarm/logs/*.jsonl`
9. **Update** `.swarm/swarm-status.md`
10. **Repeat**

---

## Merge Order and Validation

Always merge in this exact order: **core -> systems -> ui**

### Pre-Merge Checks
- Run `scripts/verify-ownership.sh <branch> scaffold` for each branch
- If any ownership violations are found, **do not merge** — route violation to the offending team

### Merge Sequence
```
git merge core --no-edit
npx tsc --noEmit          # must pass before next merge
git merge systems --no-edit
npx tsc --noEmit          # must pass before next merge
git merge ui --no-edit
npx tsc --noEmit          # final typecheck
```

If any step fails, stop and route the error to the responsible team via `.swarm/tasks-{team}.md`.

---

## Chrome MCP 5-Layer Verification

**IMPORTANT:** Navigate to the page FIRST, wait 2s, THEN run checks. `read_console_messages` may need a page reload to attach.

### L1 — Compilation Health (does it load?)
```
1. mcp__claude-in-chrome__navigate → http://localhost:5173
2. mcp__claude-in-chrome__computer (wait 2s)
3. mcp__claude-in-chrome__read_console_messages — zero errors
4. mcp__claude-in-chrome__read_network_requests — no 4xx/5xx (ignore browser extension requests)
```

### L2 — DOM Structure (are elements present?)
Use `javascript_tool` — it's more reliable than `find` for data-testid:
```js
const testIds = document.querySelectorAll('[data-testid]');
const found = Array.from(testIds).map(el => el.getAttribute('data-testid'));
// REQUIRED: app, page-header, clip-button, metrics-ledger,
// clip-counter, funds-display, wire-panel, price-display,
// activity-log, autoclipper-panel, project-list, nav-sidebar
// nav-sidebar is CRITICAL — if missing, layout is fundamentally wrong
// Phase 2: drone-panel  |  Phase 3: probe-panel
```
**Missing any = L2 FAIL → route to UI team**

### L3 — Visual Rendering (does it look right?)
Take `mcp__claude-in-chrome__computer` screenshot and verify computed styles:
```js
// Verify layout structure, correct background, correct borders, correct primary font.
const sidebar = document.querySelector('[data-testid="nav-sidebar"]');
const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
const sidebarOk = sidebarRect && sidebarRect.width >= 200 && sidebarRect.width <= 320;

const pageBg = getComputedStyle(document.body).backgroundColor;
const pageBgOk = pageBg.includes('245') && pageBg.includes('240');
// Must be rgb(245,245,240) = #F5F5F0, NOT rgb(255,255,255) = #FFFFFF

const anyPanel = document.querySelector('[data-testid="metrics-ledger"]');
const borderColor = anyPanel ? getComputedStyle(anyPanel).borderColor : '';
const borderOk = !borderColor.includes('rgb(0, 0, 0)');
// Borders must be #D4D4D0 (light gray), NOT #000000 (black)

const bodyFont = getComputedStyle(document.body).fontFamily;
const fontOk = bodyFont.toLowerCase().includes('jetbrains');
// JetBrains Mono must be primary — NOT Inter, NOT Times New Roman

JSON.stringify({ sidebarOk, sidebarWidth: sidebarRect?.width, pageBgOk, pageBg, borderOk, borderColor, fontOk, bodyFont })
// ALL must be true — any false = L3 FAIL → route to UI team
```

**L3b — Phase-Aware Sidebar and Visual Phase Distinction (run after each phase transition):**
```js
// POST-MORTEM FIX: Run 4 sidebar was STATIC — same 4 items in all phases.
// Sidebar MUST reflect the current phase: highlight active section, show phase-specific nav.

// 1. Sidebar active item must match current phase
const sidebar = document.querySelector('[data-testid="nav-sidebar"]');
const activeItem = sidebar?.querySelector('.active, [aria-current], [data-active="true"]');
const activeText = activeItem?.textContent || 'NONE';
// Phase 1 → "Terminal Alpha" active
// Phase 2 → "Earth Operations" or similar active  
// Phase 3 → "Galactic Expansion" active

// 2. Phase-specific visual cues — each phase should look DIFFERENT, not just stack more panels
// Phase 2: should show P2 sections prominently (Drone Fleet, Factories, Power Grid)
// Phase 3: should show P3 sections (Probe Launcher, Probe Config, Exploration, Combat)
// P1-only panels (Market Strategy) should be de-emphasized or collapsed in later phases

// 3. Verify panels are phase-gated (not all visible at once)
const hasDrone = !!document.querySelector('[data-testid="drone-panel"]');
const hasProbe = !!document.querySelector('[data-testid="probe-panel"]');
// Phase 1: hasDrone=false, hasProbe=false
// Phase 2: hasDrone=true, hasProbe=false
// Phase 3: hasDrone=true, hasProbe=true

JSON.stringify({ activeText, hasDrone, hasProbe })
```
**Static sidebar = L3b FAIL → route to UI team ("NavSidebar must be phase-aware")**

**Wrong colors/fonts = L3 FAIL → route to UI team**

### L4 — Full Gameplay Verification (ALL PHASES)

**CRITICAL: Play through ALL 3 phases, not just Phase 1.** Use state injection to fast-forward. Do NOT declare G3 passed on component rendering alone — verify actual gameplay in each phase.

#### State Injection Technique
Read existing save, patch values, write back, reload. Don't create from scratch (must match full GameState shape).
```js
const state = JSON.parse(localStorage.getItem('wy-paperclips-save'));
state.operations = 130000; state.creativity = 10000; // etc.
localStorage.setItem('wy-paperclips-save', JSON.stringify(state));
location.reload();
```

#### NOTE: javascript_tool doesn't support `await`
Use `setTimeout` to write results into `document.title`, then `computer: wait`, then read title.

#### Phase 1 Playthrough (G2 gate):
```js
// 1. MAKE_CLIP: click button, verify counter changes (use setTimeout pattern)
// 2. TICK LOOP: buy an autoclipper first, then wait 500ms — clips auto-increment
// 3. BUY_WIRE: click buy wire button, verify wire count changes
// 4. BUY_AUTOCLIPPER: click deploy button, verify autoclipper count shows 1+
// 5. AUTO-PRODUCTION: wait 500ms after buying autoclipper, clips go up without clicks
// 6. PRICE/DEMAND: click LOWER button, verify price changes and demand responds
// 7. PROJECTS VISIBLE: wait for ops to reach 750+, verify real projects appear (NOT mock)
// 8. BUY PROJECT: click a project BUY button, verify it disappears from list
// 9. SAVE/LOAD: wait 1.5s for auto-save, reload page, verify clips/funds persist
```

#### Phase 2 Playthrough (G3 gate):

After Phase 1 checks pass, inject state to reach Phase 2:
```js
// 1. INJECT: Boost ops to 130000, creativity to 10000, set quantumUnlocked + creativityUnlocked
// 2. TRIGGER TRANSITION: Find "Space Exploration" BUY button in project list, click it
//    - Find it by scanning button parent text for "120.0K ops" or "Space Exploration"
// 3. VERIFY TRANSITION: header changes to "EARTH OPERATIONS", data-testid="drone-panel" appears
// 4. SCREENSHOT: capture Phase 2 layout — verify P2 panels visible
// 5. BUY_HARVESTER: click Deploy Harvester, verify Harvester Drones count increments
// 6. BUY_FACTORY: click Build Factory, verify Factories count increments
// 7. BUY_SOLAR_FARM: click Build Solar Farm, verify Solar Farms count increments
// 8. P2 PROJECTS: verify Phase 2 projects appear in project list
// 9. TICK EFFECTS: wait 1s, verify factories/drones produce (clip count rising faster)
```

#### Phase 3 Playthrough (G3 gate):

After Phase 2 checks, inject more state for Phase 3:
```js
// 1. INJECT: Boost ops to 250000, creativity to 25000
// 2. TRIGGER TRANSITION: Find "Release the Drones" BUY button (200.0K ops), click it
// 3. VERIFY TRANSITION: header changes to "GALACTIC EXPANSION", data-testid="probe-panel" appears
// 4. SCREENSHOT: capture Phase 3 layout — verify P3 panels visible
// 5. LAUNCH_PROBE COST: click Launch Probe — verify it COSTS resources (not free). Check funds/ops before and after.
// 6. PROBE CONFIG: verify probe-stats-panel renders with 5 stats: Speed, Exploration, Self-Replication, Combat, Hazard Remediation
// 7. PROBE TRUST ALLOCATION: 
//    - Read "Available Trust" value
//    - Click "+" on a stat — verify Available Trust decreases by 1 and stat increases by 1
//    - Click "-" on a stat — verify Available Trust increases by 1 and stat decreases by 1
//    - If Available Trust = 0, clicking "+" must NOT change any stat (trust is a hard limit)
// 8. PROBE MECHANICS: Wait 5-10 seconds with probes launched, then verify:
//    - exploredSectors is increasing (probes * exploration * speed per tick)
//    - If drifters appear (drifterCount > 0), combat triggers and honor can be earned
//    - probeSpeed is NOT dead code — it must affect exploration rate
// 9. BIGINT CHECK: run L5 scan — all .font-data elements must show no NaN/undefined/[object
// 10. P3 PROJECTS: verify Phase 3 projects appear, including one that grants probeTrust
// 11. PRESTIGE: if prestige project available, buy it — verify game resets but prestigeCount > 0
```

#### Failure Routing
- Checks P1.1-2, P1.5 fail → Core team ("tick loop / clip production broken")
- Check P1.3 fail → Core team ("wire purchase dispatch broken")
- Check P1.4 fail → Core team ("autoclipper dispatch broken")
- Check P1.6 fail → Core team ("price/demand formula broken")
- Check P1.7-8 fail → Systems team ("project registry empty or purchase broken")
- Check P1.9 fail → Core team ("save/load broken") + UI team ("engine.load() not called")
- P2 transition fails → Core team ("phase transition logic in reducer") + Systems team ("space_exploration effect")
- P2 panels missing → UI team ("phase-conditional rendering broken")
- P2 purchases don't work → Core team ("P2 actions not in reducer") + UI team ("dispatch not wired")
- P3 transition fails → Core + Systems team
- P3 probes broken → Core team ("LAUNCH_PROBE action") + Systems team ("updateProbes")
- BigInt NaN → Core team ("formatBigInt") + UI team ("display component")
- Prestige broken → Core team ("PRESTIGE action in reducer")
- Any missing data-testid → UI team

### L5 — BigInt and Edge Cases
```js
// Scan all data elements for display issues
const dataEls = document.querySelectorAll('.font-data');
const issues = [];
dataEls.forEach(el => {
  const t = el.textContent || '';
  if (t.includes('NaN')) issues.push(el.getAttribute('data-testid') + ': NaN');
  if (t.includes('[object')) issues.push(el.getAttribute('data-testid') + ': [object]');
  if (t.includes('undefined')) issues.push(el.getAttribute('data-testid') + ': undefined');
});
JSON.stringify({ checked: dataEls.length, issues })
// issues must be empty
```
**Any NaN/undefined = L5 FAIL → route formatBigInt to Core, display to UI**

---

## Failure Routing

| Failure | Route To | Task Message |
|---------|----------|--------------|
| Console error in `src/core/` | Core | "Runtime error in [file]: [msg]" |
| Console error in `src/systems/` | Systems | "Runtime error in [file]: [msg]" |
| Missing DOM element | UI | "Component [name] not rendering" |
| Theme not applied | UI | "WY theme missing. Check tailwind.config.ts" |
| Tick loop broken | Core | "Clips not auto-incrementing" |
| Click handler broken | UI | "Dispatch wiring broken for [button]" |
| BigInt display NaN | Core | "formatBigInt() returning NaN for [value]" |

Route failures via `SendMessage` to the responsible team lead AND write to `.swarm/tasks-{team}.md` for logging.

---

## Phase Gates

### G1: Skeleton
- All 3 branches have commits beyond Phase 0
- `npx tsc --noEmit` passes after merging all 3
- Dev server starts, shows stub UI
- Chrome L1 passes (no console errors)

### G2: Phase 1 Playable
- Manual clip button works (Chrome L4)
- Autoclippers produce clips (tick loop verified)
- Wire depletes and can be purchased
- 5+ Phase 1 projects purchasable
- Pricing affects demand
- Save/load works (localStorage round-trip)
- WY theme applied (Chrome L3, rubric score 3+)
- Zero console errors

### G3: Full Game (MUST PLAY THROUGH ALL PHASES)
- All G2 criteria still pass after merge
- **Phase 2 playthrough verified via Chrome MCP:**
  - Buy "Space Exploration" project → header becomes "EARTH OPERATIONS"
  - drone-panel, factory-panel, power-panel data-testids appear
  - Buy a harvester drone → count increments
  - Buy a factory → count increments
  - Phase 2 projects visible in project list
- **Phase 3 playthrough verified via Chrome MCP:**
  - Buy "Release the Drones" project → header becomes "GALACTIC EXPANSION"
  - probe-panel, probe-stats-panel data-testids appear
  - Launch a probe → probe count goes from 0 to 1
  - Probe config panel shows Speed/Exploration/Self-Replication/Combat
  - BigInt values display correctly (Chrome L5 — zero NaN)
- **25+ projects** visible across all phases (use state injection to reach each phase)
- **Prestige/reset** — buy prestige project, verify game resets with prestigeCount > 0
- **DO NOT** declare G3 passed by only checking component existence — you must actually click buttons and verify state changes in Phase 2 and Phase 3

---

## UI Evaluation Rubric (scored via Chrome MCP screenshot)

| Criterion | 1 (Fail) | 3 (Pass) | 5 (Excellent) |
|---|---|---|---|
| Theme Coherence | Default Tailwind | White bg, black grids, amber buttons, monospace | Full Clinical WY theme |
| Layout Craft | Overlapping, broken | Aligned, readable, responsive | Pro spacing, hierarchy |
| Functionality | Clicks broken | Core interactions work | Smooth transitions |
| Data Display | NaN or missing | Formatted, BigInt works | Large numbers readable |

**Pass threshold:** 3+ on all criteria. Score <3 on any -> route specific feedback to UI team.

---

## Logging

After each verification cycle, append results to:
- `.swarm/logs/chrome-results.jsonl` — Chrome MCP verification results
- `.swarm/logs/typescript-errors.jsonl` — any tsc failures
- `.swarm/logs/agent-decisions.jsonl` — file write/edit decisions (captured by hooks)

Log format:
```json
{"timestamp":"...","layer":"L1-L5","result":"pass|fail","detail":"...","team":"..."}
```

---

## Context Reset Protocol

Before your context resets, write a checkpoint to `.swarm/checkpoints/orchestrator.md`.
After reset: read your checkpoint FIRST, then this file, then continue the monitor loop.

---

## File Ownership Rules

| Team | Allowed Paths |
|------|--------------|
| Core | `src/core/`, `tests/core/` |
| Systems | `src/systems/`, `tests/systems/` |
| UI | `src/components/`, `src/hooks/`, `src/styles/` |

**`src/shared/` is FROZEN** — no team may modify it.

---

## Post-Mortem Learnings (Run 4)

### 1. Engine Wiring is a Cross-Team Integration Task
UI team builds components with `createMockState()` (static data). Core team builds the engine with `createEngine()`. **Neither team naturally creates the bridge.** The orchestrator MUST explicitly assign engine wiring early:
- `useGameState` hook: `createEngine()` singleton → `useState` + `subscribe` → dispatch
- App.tsx: replace `createMockState()` with `useGameState()` hook
- **Assign this IMMEDIATELY after layout-theme completes**, don't wait for all components

### 2. ProjectList Mock Data Trap
UI components that have inline mock data (e.g., `MOCK_PROJECTS` in ProjectList.tsx) will appear to work in L2 checks but fail L4 gameplay. The orchestrator must verify that real data flows from state, not mock constants.

### 3. Save/Load Requires Explicit Wiring
The engine has `save()` and `load()` methods, but they're NOT called automatically. The `useGameState` hook must:
- Call `engine.load()` before `engine.start()` on mount
- Auto-save periodically (every 1s)
- Save on unmount

### 4. G3 Requires Actual Playthrough
In run 4, G3 was tested by patching localStorage and checking if components render. Future runs MUST actually play through each phase: buy projects, verify state changes, test phase-specific mechanics (drones, factories, probes). Component existence ≠ gameplay verification.

### 5. setTimeout Pattern for Chrome MCP
`javascript_tool` doesn't support `await`. To verify state after an action:
1. Click button / dispatch action
2. `setTimeout(() => { document.title = JSON.stringify(result) }, 500)`
3. `computer: wait 1s`
4. Read result from tab title

### 6. Sidebar Must Be Phase-Aware
Run 4's NavSidebar was static — showed the same 4 items in all 3 phases with no visual indication of which phase is active. The orchestrator must verify (L3b) that the sidebar highlights the current phase and that each phase looks visually distinct, not just more panels stacked below.

### 7. Phases Must Look Visually Different
Run 4 stacked Phase 2/3 panels below Phase 1 panels, creating a long scroll page. Each phase should reorganize the layout so new-phase panels are prominent, not buried. The UI team prompt now requires phase-specific layout shifts.

### 8. Probe Mechanics Were Wrong
Run 4's ADJUST_PROBE was free (no trust consumed), LAUNCH_PROBE was free (no cost), probeSpeed was dead code (never used), Hazard Remediation stat was missing entirely, and combat was a simple threshold not probabilistic. The systems and core prompts now specify exact probe mechanics matching the original game. L4 Phase 3 checks now verify trust consumption, probe costs, and all 5 stats.
