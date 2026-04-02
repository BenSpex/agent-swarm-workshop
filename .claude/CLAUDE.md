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
// activity-log, autoclipper-panel, project-list
// Phase 2: drone-panel  |  Phase 3: probe-panel
```
**Missing any = L2 FAIL → route to UI team**

### L3 — Visual Rendering (does it look right?)
Screenshot + computed styles:
```js
JSON.stringify({
  bodyBg: getComputedStyle(document.body).backgroundColor,
  // MUST be rgb(255, 255, 255)
  headerBg: getComputedStyle(document.querySelector('[data-testid="page-header"]')).backgroundColor,
  // MUST be rgb(26, 26, 26)
  clipBtnBg: getComputedStyle(document.querySelector('[data-testid="clip-button"]')).backgroundColor,
  // MUST be rgb(218, 165, 32) — amber
  bodyFont: getComputedStyle(document.body).fontFamily,
  // MUST include 'Inter'
  dataFont: document.querySelector('.font-data') ?
    getComputedStyle(document.querySelector('.font-data')).fontFamily : 'MISSING'
  // MUST include 'JetBrains Mono'
})
```
Also take `mcp__claude-in-chrome__computer` screenshot and score against rubric with vision.
**Wrong colors/fonts = L3 FAIL → route to UI team**

### L4 — Full Gameplay Verification

Run these checks using `mcp__claude-in-chrome__javascript_tool` and `mcp__claude-in-chrome__computer`:

#### Phase 1 Core Mechanics (G2 gate):
```js
// 1. Click "Make Clip" → clip counter increments
const before = document.querySelector('[data-testid="clip-counter"]').textContent;
// → computer: click [data-testid="clip-button"]
const after = document.querySelector('[data-testid="clip-counter"]').textContent;
// after !== before → PASS

// 2. Tick loop: wait 300ms, read clip counter again
// Count should change without clicks → autoclippers OR tick running

// 3. Wire purchase
const wireBefore = document.querySelector('[data-testid="wire-panel"]').textContent;
// → computer: click buy wire button
const wireAfter = document.querySelector('[data-testid="wire-panel"]').textContent;
// wireAfter !== wireBefore → PASS

// 4. Autoclipper purchase
// → computer: click deploy autoclipper button
// → verify autoclipper count shows 1+

// 5. Autoclipper production: wait 500ms
// Clips should auto-increment without clicking → PASS

// 6. Price/demand: change price
// → verify demand value changes in response

// 7. Project visibility
document.querySelector('[data-testid="project-list"]').children.length > 0
// At least 1 project visible → PASS

// 8. Buy project
// → click a project → verify it disappears from list

// 9. Save/load round-trip
// → javascript_tool: call engine save(), reload page, verify state preserved
```

#### Phase 2 (after G2):
```js
// 10. Phase transition overlay appears
// 11. Drone/factory panels have data-testid and render
// 12. Phase 2 purchases increment counts
```

#### Phase 3 (after G3 gate):
```js
// 13. Probe panel renders with data-testid="probe-panel"
// 14. Launch probe → probe count increments
// 15. BigInt values display correctly in probe stats (not NaN)
```

**Failure routing:**
- Checks 1-2, 5 fail → Core team ("tick loop / clip production broken")
- Check 3 fail → Core team ("wire purchase dispatch broken")
- Check 4 fail → Core team ("autoclipper dispatch broken")  
- Check 6 fail → Core team ("price/demand formula broken")
- Check 7-8 fail → Systems team ("project registry empty or purchase broken")
- Check 9 fail → Core team ("save/load broken")
- Checks 10-12 fail → Systems + UI teams
- Checks 13-15 fail → Systems + UI teams
- Any missing data-testid → UI team
- Visual mismatch with design.pen → UI team

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

### G3: Full Game
- All G2 criteria still pass
- Phase 2 transition works, panels render
- Phase 3 transition works, panels render
- BigInt displays correctly (Chrome L5)
- 25+ projects across all phases
- Prestige/reset works

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
