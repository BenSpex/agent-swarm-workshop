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

## Design Layout Spec (extracted from design.pen)

DO NOT invent layouts. Implement exactly this structure.

### Design Tokens (from Pencil)
```css
--background: #F5F5F0;    /* page bg — warm off-white, NOT pure white */
--foreground: #1A1A1A;    /* text */
--card: #FFFFFF;           /* panel/card bg */
--border: #D4D4D0;         /* panel borders — light gray, NOT black */
--muted-foreground: #7A7A75; /* secondary text */
--accent-gold: #D4A843;    /* gold CTA accent */
--black: #000000;           /* panel headers */
--white: #FFFFFF;
--color-success-foreground: #2D8A4E;
--color-warning-foreground: #D4A843;
--color-error-foreground: #CC3314;
--font-primary: 'JetBrains Mono', monospace;  /* used EVERYWHERE */
--font-secondary: 'JetBrains Mono', monospace;
```

CRITICAL: The font is JetBrains Mono everywhere — headers, labels, data, buttons. NOT Orbitron. NOT Inter.

### App Shell Layout (ALL screens share this)
```
┌──────────────────────────────────────────────────┐
│ 260px SIDEBAR  │  MAIN CONTENT (flex-1)          │
│                │                                  │
│ WEYLAND CORP   │  TERMINAL ALPHA                  │
│ AI INIT:       │  Manufacturing Interface          │
│ MU-TH-UR 6000 │                                  │
│                │  ┌─────┬──────────┬─────┐       │
│ ▸ Terminal     │  │LEFT │ CENTER   │RIGHT│       │
│   Alpha        │  │280px│ flex-1   │280px│       │
│ ▸ Computational│  │     │          │     │       │
│ ▸ Strategic    │  │     │          │     │       │
│ ▸ Galactic     │  └─────┴──────────┴─────┘       │
│                │                                  │
│ ● SYS.STATUS  │                                  │
│   NOMINAL      │                                  │
└──────────────────────────────────────────────────┘
```

### NavSidebar.tsx (260px, left side, ALL screens)
- data-testid="nav-sidebar"
- Background: $--card (#FFFFFF)
- Border right: 1px solid $--border (#D4D4D0)
- Logo: shield icon + "WEYLAND CORP" (JetBrains Mono 14px 700)
- Subtitle: "AI INIT: MU-TH-UR 6000" (10px, muted)
- Status badge: gold bg, black text, "COMPUTING" (10px 700)
- Nav items: 4 items, each 44px tall, JetBrains Mono 13px
  - Active item: bg $--tile (#F5F5F5), left 3px gold border, bold
  - Inactive: muted text
- Footer: green dot + "SYS.STATUS" + "NOMINAL" (green, 10px)

### Panel.tsx (reusable wrapper — EVERY data section uses this)
- White bg (#FFFFFF), 1px solid border (#D4D4D0), border-radius 4px
- Dark header bar: bg #000000, h=48px, px=20px
  - Title: white text, JetBrains Mono 14px 700, letter-spacing 1px, UPPERCASE
  - Optional status badge: gold bg (#D4A843), black text, 10px 700
- Content area: padding 20px, vertical layout, gap 16px

### Screen 1: Terminal Alpha (Manufacturing)
Main content has title + 3 columns (gap 20px):

**Title section:**
- "TERMINAL ALPHA" — JetBrains Mono 28px 700
- "Manufacturing Interface" — 13px muted

**Left column (280px):**
1. Manufacture button: Panel with dark header "EXECUTE: MANUFACTURE CLIP", icon + text
2. "MANUAL PRODUCTION YIELD: 1" small muted text
3. Automation Panel: header "AUTOMATION", AutoClippers Active count, DEPLOY AUTOCLIPPER button (outline), cost text
4. Market Strategy Panel: header "MARKET STRATEGY", price display, LOWER/RAISE buttons, demand bar, marketing level + UPGRADE button

**Center column (flex-1):**
1. Metrics Panel: header "LIVE METRICS LEDGER" + gold "SYNCED" badge
   - Paperclips: large BigMetric component (28px bold)
   - Available Funds: gold colored value
   - Wire Inventory + Public Demand + Wire Cost as Metric rows
   - BUY WIRE button (outline)

**Right column (280px):**
1. Activity Log: header "SYSTEM ACTIVITY LOG" + copy icon
   - Scrollable list of LogEntry components
   - Each entry: timestamp (muted 10px) + message (12px)
   - Warning entries: gold-colored text

### Button Primary (black bg, NOT gold)
- Background: #000000 (black), text: white
- JetBrains Mono 12px 700, letter-spacing 1px, UPPERCASE
- Height: 48px, padding: 0 24px
- Icon (optional, lucide) + label

### Button Outline
- Background: white, border: 1px solid $--border
- JetBrains Mono 12px 700, letter-spacing 1px
- Height: 40px, padding: 0 20px

### Reusable Components

| Component | React File | data-testid |
|-----------|-----------|-------------|
| Nav Sidebar | `NavSidebar.tsx` | `nav-sidebar` |
| Panel (wrapper) | `Panel.tsx` | — |
| Button Primary | `ButtonPrimary.tsx` | — |
| Button Outline | `ButtonOutline.tsx` | — |
| Status Badge | `StatusBadge.tsx` | — |
| Metric Display | `MetricDisplay.tsx` | — |
| Big Metric | `BigMetric.tsx` | — |
| Activity Log | `ActivityLog.tsx` | `activity-log` |
| Initiative Card | `InitiativeCard.tsx` | `initiative-card` |
| Progress Bar | `ProgressBar.tsx` | `progress-bar` |
| Stepper Control | `StepperControl.tsx` | — |

### Reference Image
See `images/image.png` in the repo root — this is the Stitch screenshot showing the target look (Computational Resources screen with nav sidebar).

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

## WY_THEME Reference (from Pencil design tokens)

**CRITICAL: JetBrains Mono is the ONLY font. No Orbitron. No Inter. Everything is monospace.**

```
Colors (EXACT from design.pen):
  --background:      #F5F5F0    Page bg (warm off-white, NOT pure white)
  --foreground:      #1A1A1A    Primary text
  --card:            #FFFFFF    Panel/card backgrounds
  --border:          #D4D4D0    Panel borders (light gray, NOT black)
  --muted-foreground:#7A7A75    Secondary/disabled text
  --accent-gold:     #D4A843    Gold accent (badges, highlights)
  --black:           #000000    Panel header bars
  --white:           #FFFFFF    Text on dark backgrounds
  --success:         #2D8A4E    Green status indicators
  --warning:         #D4A843    Gold warnings
  --error:           #CC3314    Red alerts

Fonts:
  EVERYTHING: 'JetBrains Mono', monospace — headers, body, data, buttons, labels

Sizes:
  Title:    28px 700
  Header:   14px 700, letter-spacing 1px, UPPERCASE
  Body:     13px 400
  Small:    10-11px, muted color
  Button:   12px 700, letter-spacing 1px, UPPERCASE

Border radius: 4px (panels), 2px (badges/buttons)
Border: 1px solid #D4D4D0 (NOT black — light gray)
```

**Visual rules:**
- Page background is #F5F5F0 (warm off-white) NOT pure white
- Panel borders are #D4D4D0 (light gray) NOT #000000 (black)
- Panel header bars are #000000 (black) with white text
- Gold accent is #D4A843 NOT #DAA520
- JetBrains Mono EVERYWHERE — no other fonts, no Orbitron, no Inter
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

### BUILD ORDER (STRICT)

**CRITICAL: NavSidebar.tsx must be the FIRST component. App.tsx must use sidebar+main layout from minute 0. Chrome L2 FAILS if nav-sidebar data-testid is missing.**

1. **layout-theme (Minutes 0-5):** NavSidebar.tsx FIRST (260px sidebar, data-testid="nav-sidebar"), then App.tsx with sidebar+main flex layout, Panel.tsx, global.css (bg #F5F5F0, JetBrains Mono on body)
2. **components-p1 (Minutes 3-8):** Phase 1 components inside Panel wrappers
3. **message-log (Minutes 8-12):** ActivityLog, PhaseTransition, NotificationToast
4. **components-p2p3 (Minutes 12-15):** Phase 2/3 components

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
- `src/components/PhaseTransition.tsx` -- full-screen overlay with JetBrains Mono header (28px bold), fade in/out
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
