---
tags: [keel, marketing, active]
---
# Backpressure Layers

← Orchestration System

Each layer catches errors the previous one missed. Mirrors Keel's 4-oracle design.

---

## Layer 1: Keel Integration

Keel runs as a Claude Code `PreToolUse` hook in each worktree. Every Write/Edit triggers `keel compile` before the file is written. If Keel finds a violation, the write is blocked and the agent sees the error + fix hint.

### Hook Configuration (per-worktree `.claude/settings.json`)

```json
{
  "hooks": {
    "PreToolUse": [{
      "event": "Write|Edit",
      "command": "keel compile $FILE",
      "blocking": true
    }]
  }
}
```

### Keel Config (`keel.toml` in repo root)

```toml
[rules]
frozen_modules = ["src/shared/*"]

[[ownership]]
pattern = "src/core/**"
team = "core"

[[ownership]]
pattern = "src/systems/**"
team = "systems"

[[ownership]]
pattern = "src/components/**"
team = "ui"

[[ownership]]
pattern = "src/hooks/**"
team = "ui"

[[ownership]]
pattern = "src/styles/**"
team = "ui"
```

### What Keel Enforces

| Rule | Violation | Agent Sees |
|------|-----------|------------|
| File ownership | Core agent writes to `src/components/` | E001: file belongs to team "ui" |
| Contract freeze | Any agent modifies `src/shared/types.ts` | E001: frozen module, cannot modify |
| Function signatures | `formatNumber()` changes params | E005: arity_mismatch, 3 callers affected |
| Module placement | New file in wrong directory | W001: placement warning |

---

## Layer 2: TypeScript Strict

`npx tsc --noEmit` with `strict: true` in `tsconfig.json`. Catches state shape drift, missing exports, wrong types. Run by teammates in their Ralph Loop test command and by the orchestrator after each merge.

---

## Layer 3: Vitest

`npx vitest run` with per-team test scope. Tests are pre-written in Phase 0 scaffold with `test.skip` — teammates un-skip as they implement.

| Team | Test Command |
|------|-------------|
| Core | `npx vitest run tests/core/` |
| Systems | `npx vitest run tests/systems/` |
| UI | (TypeScript only — visual quality checked by Chrome MCP) |

---

## Layer 4: Chrome Browser Oracle

The orchestrator uses Chrome MCP tools directly (not scripts) to verify the running game after each merge.

### 5-Layer Verification

**L1 — Compilation Health (does it load?)**
1. `mcp__claude-in-chrome__navigate` → `http://localhost:5173`
2. `mcp__claude-in-chrome__read_console_messages` → check for errors
3. `mcp__claude-in-chrome__read_network_requests` → check for 4xx/5xx

**L2 — DOM Structure (are elements present?)**
4. `mcp__claude-in-chrome__read_page` → accessibility tree
5. Verify: clip-counter, clip-button, price-display, autoclipper-panel, wire-panel, project-list, funds-display
6. Phase-specific elements: drone-panel (P2), probe-panel (P3)

**L3 — Visual Rendering (does it look right?)**
7. `mcp__claude-in-chrome__computer` (screenshot action) → full page PNG
8. Orchestrator (with vision) evaluates against `reference/` screenshots and rubric
9. `mcp__claude-in-chrome__javascript_tool` → check `getComputedStyle(document.body).backgroundColor`

**L4 — Game Functionality (does it work?)**
10. Record initial clip count via `javascript_tool`
11. `mcp__claude-in-chrome__computer` (click action) → Make Paperclip button
12. Verify clip count incremented
13. Wait 250ms, verify tick loop running (count changes without clicks)

**L5 — BigInt & Edge Cases**
14. `javascript_tool` → inject mid-game state with BigInt values, reload
15. Verify BigInt displays correctly (not NaN, not [object Object])
16. Verify save/load preserves BigInt values

### Failure Routing

| Failure | → Team | Task |
|---------|--------|------|
| Console error in `src/core/` | Core | "Runtime error in engine.ts: [msg]" |
| Console error in `src/systems/` | Systems | "Runtime error in [file]: [msg]" |
| Missing DOM element | UI | "Component [name] not rendering" |
| Theme not applied | UI | "WY theme missing. Check tailwind.config.ts" |
| Tick loop broken | Core | "Clips not auto-incrementing" |
| Click handler broken | UI | "Dispatch wiring broken for [button]" |
| BigInt display NaN | Core | "formatBigInt() returning NaN for [value]" |
