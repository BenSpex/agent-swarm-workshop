# Spec: UI Team

## Team Info

| Field | Value |
|-------|-------|
| Team | UI |
| Branch | `ui` |
| Directories | `src/components/`, `src/hooks/`, `src/styles/` |
| Teammates | layout-theme, components-p1, components-p2p3, message-log |
| Test command | `npx vitest run tests/ui/` |
| Typecheck | `npx tsc --noEmit` |

## File Ownership

You may ONLY touch files in:
- `src/components/*`
- `src/hooks/*`
- `src/styles/*`
- `tailwind.config.ts`
- `index.html`
- `public/*`

You may READ `src/shared/*` but never modify it. Any edit outside your directories is a Constitution violation and will be reverted.

---

## Design Source of Truth: design.pen

The Pencil design file `design.pen` at repo root defines the exact screens and components to implement. Your job is to translate these designs pixel-for-pixel into React + Tailwind. Do NOT invent layouts — implement what's in the design.

### Screens (implement in this order)
1. **Terminal Alpha (Manufacturing)** — Phase 1 main view: clip manufacturing, automation, market strategy, metrics ledger, activity log
2. **Computational Resources** — Trust/computing panel: operations, creativity, processor/memory allocation
3. **Strategic Projects** — Quantum computing matrix, extract operations, initiative cards
4. **Galactic Expansion** — Phase 3: probe stats, probe config, combat panel

### Pencil Components → React Files

| Pencil Component | React File | data-testid |
|-----------------|------------|-------------|
| Section Panel | `Panel.tsx` | — (wrapper) |
| Button Primary | `AmberButton.tsx` | — (reusable) |
| Button Outline | `OutlineButton.tsx` | — (reusable) |
| Nav Sidebar + Nav Item | `NavSidebar.tsx` | `nav-sidebar` |
| Metric Display | `MetricDisplay.tsx` | — (reusable) |
| Big Metric | `BigMetric.tsx` | — (reusable) |
| Initiative Card | `InitiativeCard.tsx` | `initiative-card` |
| Progress Bar | `ProgressBar.tsx` | `progress-bar` |
| Activity Log + Log Entry | `ActivityLog.tsx` | `activity-log` |
| Status Badge | `StatusBadge.tsx` | — (reusable) |
| Stepper Control | `StepperControl.tsx` | — (reusable) |
| Resource Bar | `ResourceBar.tsx` | — (reusable) |
| Top Bar | `TopBar.tsx` | `page-header` |
| Table Row | `TableRow.tsx` | — (reusable) |

Open `design.pen` in Pencil.dev to see exact layout, spacing, colors, and component hierarchy. The design IS the spec for visual output.

---

## Constitution Articles (Your Law)

**Article 1 -- Single State Tree:** Components read from `useGameState()` hook. Never use `useState` for game values. Dispatch actions to mutate state.

**Article 3 -- BigInt for Large Numbers:** Use `formatBigInt()` from `src/shared/engine.ts` for display. Never call `.toString()` on bigints directly in JSX.

**Article 5 -- Contracts Are Frozen:** Import types from `src/shared/` but never modify them.

**Article 6 -- File Ownership:** UI owns `src/components/*`, `src/hooks/*`, `src/styles/*`, `tailwind.config.ts`, `index.html`, `public/*`.

**Article 7 -- Max 300 Lines Per File:** Split components by phase, split large components into sub-components.

**Article 8 -- data-testid on All Components (CRITICAL):** Every React component that renders game state MUST have a `data-testid` attribute. The orchestrator's Chrome MCP oracle uses these to verify the DOM. Missing `data-testid` = Chrome MCP can't verify = unknown state.

**Article 9 -- Context Checkpoints:** Write checkpoints before context resets.

---

## WY_THEME Reference -- Weyland Corporate Clinical

**Design direction:** Dystopian minimalist corporate brutalism. NOT dark CRT. NOT retro terminal.

```
Colors:
  bg:          #FFFFFF    White page/panel background
  panelBg:     #FFFFFF    Panel content area
  headerBg:    #1A1A1A    Dark header bars on panels
  text:        #000000    Primary text
  textLight:   #FFFFFF    Text on dark backgrounds
  accent:      #DAA520    Amber/gold CTAs, important data, active states
  accentHover: #C8A200    Darker amber for hover
  warning:     #CC0000    Red for alerts, danger, critical
  muted:       #666666    Secondary/disabled text
  border:      #000000    All structural borders
  success:     #228B22    Positive indicators

Fonts:
  mono:    'JetBrains Mono', monospace   -- code/data display
  display: 'Orbitron', sans-serif        -- headers/titles
  body:    'Inter', sans-serif           -- body text

Effects:
  borderWidth:  1px       All borders
  borderStyle:  solid     No dashed, no dotted
  borderRadius: 2px       Minimal — sharp, corporate
```

**Visual rules:**
- White backgrounds, black 1px structural borders everywhere
- Dark (#1A1A1A) header bars on each panel
- Amber (#DAA520) for buttons, active states, important numbers
- JetBrains Mono for all numeric data
- Orbitron for panel titles and headers
- NO scanlines, NO CRT glow, NO green-on-black
- Grid layout with visible structural lines

---

## Component List with data-testid Requirements

Every component below MUST have the specified `data-testid`:

### Layout
| Component | data-testid | Notes |
|-----------|-------------|-------|
| App | `app-container` | Root layout, multi-column grid |
| Panel | `panel-{name}` | Reusable panel wrapper with dark header bar |

### Phase 1 Components
| Component | data-testid | Notes |
|-----------|-------------|-------|
| ClipCounter | `clip-counter` | Shows total clips (bigint formatted) |
| ManualClipButton | `manual-clip-btn` | Click to make one clip |
| PricingPanel | `pricing-panel` | Price slider/input, demand display |
| AutoClipperPanel | `autoclipper-panel` | Buy/count for auto + mega clippers |
| WirePanel | `wire-panel` | Wire inventory, buy button, wire price |
| TrustPanel | `trust-panel` | Trust count, processor/memory allocation |
| ProjectList | `project-list` | Filterable list of available projects |
| InvestmentPanel | `investment-panel` | Portfolio, risk slider, stock/bond split |
| CreativityDisplay | `creativity-display` | Creativity counter, quantum status |

### Phase 2 Components
| Component | data-testid | Notes |
|-----------|-------------|-------|
| DronePanel | `drone-panel` | Harvester + wire drone counts and buy |
| FactoryPanel | `factory-panel` | Clip factory count (bigint) and buy |
| PowerPanel | `power-panel` | Solar farms, batteries, stored power |
| MomentumDisplay | `momentum-display` | Swarm computing momentum |

### Phase 3 Components
| Component | data-testid | Notes |
|-----------|-------------|-------|
| ProbePanel | `probe-panel` | Probe count, launch button |
| ProbeStatsPanel | `probe-stats-panel` | Trust allocation sliders |
| ExplorationDisplay | `exploration-display` | Sectors explored, drifter count |
| CombatDisplay | `combat-display` | Honor, combat results |

### Cross-Phase Components
| Component | data-testid | Notes |
|-----------|-------------|-------|
| MessageLog | `message-log` | Scrolling event feed |
| PhaseTransition | `phase-transition` | Full-screen overlay on phase change |
| NotificationToast | `notification-toast` | Ephemeral alerts |
| SaveLoadPanel | `save-load-panel` | Save/load/reset buttons |

---

## Build Order

### Minute 0-3: layout-theme

- Configure `tailwind.config.ts` with WY_THEME colors, fonts, spacing
- Create `src/styles/global.css` -- base styles, font imports, structural borders, grid lines
- Build `src/components/App.tsx` -- main layout with multi-column CSS grid
- Build `src/components/Panel.tsx` -- reusable panel wrapper (dark header bar, white body, black border)
- Import fonts: JetBrains Mono, Orbitron, Inter (from Google Fonts via CDN in `index.html`)

### Minute 3-8: components-p1

- `src/components/ClipCounter.tsx` -- big number display, formatted with formatBigInt
- `src/components/ManualClipButton.tsx` -- dispatches MAKE_CLIP
- `src/components/PricingPanel.tsx` -- price input/slider, demand readout
- `src/components/AutoClipperPanel.tsx` -- buy buttons, count display, cost display
- `src/components/WirePanel.tsx` -- wire count, buy button, wire price
- `src/components/TrustPanel.tsx` -- trust points, +processor/-memory buttons
- `src/components/ProjectList.tsx` -- lists available projects, buy button for each
- `src/components/InvestmentPanel.tsx` -- portfolio display, risk slider
- `src/components/CreativityDisplay.tsx` -- creativity counter

Use `createMockState()` from `src/shared/mockState.ts` for development. The `useGameState()` hook won't be wired until integration — use mock data directly.

### Minute 8-12: message-log

- `src/components/MessageLog.tsx` -- scrolling feed, newest at top, auto-scroll
- `src/components/PhaseTransition.tsx` -- full-screen overlay with Orbitron header, fade in/out
- `src/components/NotificationToast.tsx` -- ephemeral alerts, auto-dismiss after 3 seconds

### Minute 12-15: components-p2p3

- `src/components/DronePanel.tsx` -- harvester + wire drone display
- `src/components/FactoryPanel.tsx` -- clip factory count (bigint)
- `src/components/PowerPanel.tsx` -- solar/battery/power display
- `src/components/MomentumDisplay.tsx` -- momentum readout
- `src/components/ProbePanel.tsx` -- probe count + launch
- `src/components/ProbeStatsPanel.tsx` -- trust allocation sliders for 4 stats
- `src/components/ExplorationDisplay.tsx` -- sectors explored, drifter encounters
- `src/components/CombatDisplay.tsx` -- honor, combat log

Phase 2/3 components can be stub panels (correct layout, placeholder data) if time is tight.

---

## Hooks

### useGameState (src/hooks/useGameState.ts)

Stub exists. After integration, this subscribes to GameEngine and returns current state:

```typescript
function useGameState(): GameState
function useDispatch(): (action: GameAction) => void
```

During build, components use `createMockState()` directly.

---

## Test Strategy

Run tests with: `npx vitest run tests/ui/`

- Test that components render without crashing
- Test that data-testid attributes are present
- Test that formatBigInt/formatNumber output appears correctly

---

## Chrome MCP Backpressure (Layer 4)

The orchestrator verifies your work in a real browser using Chrome MCP tools. Here's exactly what it checks — **you will fail** if any of these are wrong:

### L2 — DOM Structure
```js
// Must find ALL of these:
document.querySelectorAll('[data-testid]')
// Required: app, page-header, clip-button, metrics-ledger,
// clip-counter, funds-display, wire-panel, price-display,
// activity-log, autoclipper-panel, project-list
```
**Missing any data-testid = L2 FAIL → task routed back to you.**

### L3 — Theme Verification
```js
getComputedStyle(document.body).backgroundColor  // must be rgb(255, 255, 255)
getComputedStyle(header).backgroundColor          // must be rgb(26, 26, 26)
getComputedStyle(clipBtn).backgroundColor         // must be rgb(218, 165, 32)
getComputedStyle(body).fontFamily                 // must include 'Inter'
getComputedStyle('.font-data').fontFamily          // must include 'JetBrains Mono'
```
**Wrong colors/fonts = L3 FAIL → "WY theme missing" routed to you.**

### L5 — Data Display
```js
// Every .font-data element is checked for:
// - No "NaN" in textContent
// - No "[object" in textContent
// - No "undefined" in textContent
```
**Any NaN/undefined = L5 FAIL → "formatBigInt() broken" routed to Core, display issue to you.**

### Design Fidelity Check
The orchestrator takes a screenshot via `mcp__claude-in-chrome__computer` and compares it visually against the Pencil design. If the layout doesn't match the design.pen screens, it's scored as Theme Coherence < 3 and routed back to you.

---

## Context Checkpoint Format

Before any context reset, write to `.swarm/checkpoints/{your-name}.md`:

```markdown
# Checkpoint: {agent-name}
## Timestamp: {ISO-8601}
## Status: {in-progress | blocked | done}

### Completed
- [x] file.tsx -- description

### In Progress
- [ ] file.tsx -- what remains

### Blocked On
- {blocker description}

### Next Steps
1. First thing after reset
2. Second thing
```
