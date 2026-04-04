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
│ 260px SIDEBAR  │  MAIN CONTENT (flex-1, stacked) │
│                │                                  │
│ WEYLAND CORP   │  TERMINAL ALPHA                  │
│ AI INIT:       │  Manufacturing Interface          │
│ MU-TH-UR 6000 │                                  │
│                │  ┌──────────────────────────┐    │
│ ▸ Terminal     │  │ Manufacturing Panel      │    │
│   Alpha        │  ├──────────────────────────┤    │
│ ▸ Computational│  │ Business Panel           │    │
│ ▸ Strategic    │  ├──────────────────────────┤    │
│ ▸ Galactic     │  │ Computing Panel          │    │
│                │  ├──────────────────────────┤    │
│ ● SYS.STATUS  │  │ Projects / Activity Log  │    │
│   NOMINAL      │  └──────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

Main content is a **single-column stacked layout** (panels stack vertically). This matches the original Universal Paperclips game layout. NO 3-column grid.

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

### Screen 1: Terminal Alpha (Manufacturing) — Stacked Panels

Main content has title + vertically stacked panels:

**Title section:**
- "TERMINAL ALPHA" — JetBrains Mono 28px 700
- "Manufacturing Interface" — 13px muted

### PROGRESSIVE REVEAL (Critical — matches original game)
Metrics/sections are HIDDEN until unlocked by purchasing projects:
- "Clips per Second" → shown after buying AutoClippers project
- "Avg. Rev. per sec", "Avg. Clips Sold per sec", "Unsold Inventory" → shown after buying **RevTracker** project (check `flags.revTrackerEnabled`)
- Wire Buyer toggle → shown after buying Wire Buyer project (check `flags.wireBuyerUnlocked`)
- MegaClippers section → shown after buying MegaClippers project (check `flags.megaClippersUnlocked`)
- Strategic Modeling → shown after buying Strategic Modeling project (check `flags.strategicModelingUnlocked`)
- Trust milestone display: "+1 Trust at: X clips" — always show the next milestone

### Layout: 2-column (matching original, but better styled)
Left column (50%): Business + Manufacturing. Right column (50%): Computational Resources + Projects.

**Left Column — Top: Clip Production**
- "Paperclips: [clips]" — large header (data-testid="clip-counter")
- Make Paperclip button (data-testid="clip-button")
- "Clips per Second: X" — ONLY shown if autoClippersUnlocked

**Left Column — Business Section** (data-testid="business-panel")
- "Available Funds: $X.XX" (data-testid="funds-display")
- "Avg. Rev. per sec: $X.XX" — ONLY if `flags.revTrackerEnabled`
- "Avg. Clips Sold per sec: X" — ONLY if `flags.revTrackerEnabled`
- "Unsold Inventory: X" — ONLY if `flags.revTrackerEnabled`
- Price per Clip: $X.XX + [lower] [raise] buttons (data-testid="price-display")
- "Public Demand: X%"
- Marketing: Level X + [Marketing] button + "Cost: $X"

**Left Column — Manufacturing Section** (data-testid="manufacturing-controls")
- Wire: X inches + [Wire] buy button + "Cost: $X" (data-testid="wire-panel")
- Wire Buyer: ON/OFF toggle — ONLY if `flags.wireBuyerUnlocked`
- AutoClippers: count + [AutoClippers] buy button + "Cost: $X"
- MegaClippers: count + button + cost — ONLY if `flags.megaClippersUnlocked`

**Panel 4: Computing** (data-testid="computing-panel")
- Processors: count + ADD button
- Memory: count + ADD button
- Operations: current / max
- Operations generation rate
- Creativity: count (if creativityUnlocked)
- COMPUTE button: "10 ops -> 1 creativity" (if quantumUnlocked)

**Panel 5: Strategic Modeling** (data-testid="strat-modeling-panel") — only if strategicModelingUnlocked
- Yomi: count display
- Tournament round display
- Pick buttons: A / B / RANDOM
- Auto-tournament indicator (if autoTourneyEnabled)

**Panel 6: Investment** (data-testid="investment-panel") — only if investmentUnlocked
- Portfolio value
- Deposit/Withdraw buttons for each tier (low/med/high)
- Risk level display

**Panel 7: Projects** (data-testid="project-list")
- Scrollable list of available projects
- Each project: name, description, cost, BUY button

**Panel 8: Activity Log** (data-testid="activity-log")
- Scrollable message feed, newest at top
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
| App | `app` | Root layout, sidebar + stacked main |
| NavSidebar | `nav-sidebar` | 260px sidebar, phase-aware |
| Panel | `panel-{name}` | Reusable panel wrapper with dark header bar |

### Phase 1 Components (stacked panels)
| Component | data-testid | Notes |
|-----------|-------------|-------|
| ManufacturingPanel | `manufacturing-panel` | Clip button, clip counter, clips/sec, unsold inventory |
| ClipCounter | `clip-counter` | Shows total clips (bigint formatted) inside manufacturing panel |
| ClipButton | `clip-button` | Click to make one clip |
| BusinessPanel | `business-panel` | Pricing, demand, marketing, wire, wire buyer toggle |
| FundsDisplay | `funds-display` | Available funds + revenue/sec |
| PriceDisplay | `price-display` | Current price + LOWER/RAISE buttons |
| WirePanel | `wire-panel` | Wire count, buy button, wire price (inside business panel) |
| ManufacturingControls | `manufacturing-controls` | Autoclipper + megaclipper buy section |
| ComputingPanel | `computing-panel` | Processors, memory, ops, creativity, COMPUTE button |
| StratModelingPanel | `strat-modeling-panel` | Yomi, A/B/Random picks, tournament round |
| InvestmentPanel | `investment-panel` | Deposit/withdraw tiers, portfolio value |
| ProjectList | `project-list` | Filterable list of available projects |

### Phase 2 Components
| Component | data-testid | Notes |
|-----------|-------------|-------|
| DronePanel | `drone-panel` | Harvester + wire drone counts and buy (with bulk count) |
| FactoryPanel | `factory-panel` | Clip factory count (bigint) and buy |
| PowerPanel | `power-panel` | Solar farms, batteries, stored power |
| MatterPanel | `matter-panel` | Matter + acquired matter display |

### Phase 3 Components
| Component | data-testid | Notes |
|-----------|-------------|-------|
| ProbePanel | `probe-panel` | Probe count, launch button |
| ProbeStatsPanel | `probe-stats-panel` | 8-stat trust allocation (all ProbeStat values) |
| ExplorationDisplay | `exploration-display` | Sectors explored, drifter count, probeDescendants |
| CombatDisplay | `combat-display` | Honor, combat results, probeLosses |

### Cross-Phase Components
| Component | data-testid | Notes |
|-----------|-------------|-------|
| ActivityLog | `activity-log` | Scrolling event feed |
| PhaseTransition | `phase-transition` | Full-screen overlay on phase change |
| NotificationToast | `notification-toast` | Ephemeral alerts |
| SaveLoadPanel | `save-load-panel` | Save/load/reset buttons |

---

## Build Order

### BUILD ORDER (STRICT)

**CRITICAL: NavSidebar.tsx must be the FIRST component. App.tsx must use sidebar+main layout from minute 0. Chrome L2 FAILS if nav-sidebar data-testid is missing.**

1. **layout-theme (Minutes 0-5):** NavSidebar.tsx FIRST (260px sidebar, data-testid="nav-sidebar"), then App.tsx with sidebar + stacked-panel main layout (NOT 3-column grid), Panel.tsx, global.css (bg #F5F5F0, JetBrains Mono on body)
2. **components-p1 (Minutes 3-8):** Phase 1 stacked panels: ManufacturingPanel, BusinessPanel, ManufacturingControls, ComputingPanel, StratModelingPanel, InvestmentPanel, ProjectList
3. **message-log (Minutes 8-12):** ActivityLog, PhaseTransition, NotificationToast
4. **components-p2p3 (Minutes 12-15):** Phase 2: DronePanel, FactoryPanel, PowerPanel, MatterPanel. Phase 3: ProbePanel, ProbeStatsPanel (8 stats), ExplorationDisplay, CombatDisplay

### Minute 3-8: components-p1

- `src/components/ManufacturingPanel.tsx` -- clip button, clip counter (bigint), clips/sec, unsold inventory
- `src/components/BusinessPanel.tsx` -- funds + revenue/sec, pricing + LOWER/RAISE, demand, marketing, wire + buy, wire buyer toggle
- `src/components/ManufacturingControls.tsx` -- autoclipper + megaclipper buy/count/cost
- `src/components/ComputingPanel.tsx` -- processors, memory, ops, creativity, COMPUTE button
- `src/components/StratModelingPanel.tsx` -- yomi, tournament round, A/B/RANDOM pick buttons, auto-tourney indicator
- `src/components/InvestmentPanel.tsx` -- portfolio display, deposit/withdraw by tier
- `src/components/ProjectList.tsx` -- lists available projects, buy button for each

Use `createMockState()` from `src/shared/mockState.ts` for development. The `useGameState()` hook won't be wired until integration -- use mock data directly.

### Minute 8-12: message-log

- `src/components/MessageLog.tsx` -- scrolling feed, newest at top, auto-scroll
- `src/components/PhaseTransition.tsx` -- full-screen overlay with JetBrains Mono header (28px bold), fade in/out
- `src/components/NotificationToast.tsx` -- ephemeral alerts, auto-dismiss after 3 seconds

### Minute 12-15: components-p2p3

- `src/components/DronePanel.tsx` -- harvester + wire drone display, bulk buy with count
- `src/components/FactoryPanel.tsx` -- clip factory count (bigint), bulk buy
- `src/components/PowerPanel.tsx` -- solar farms/batteries/stored power, bulk buy
- `src/components/MatterPanel.tsx` -- matter + acquired matter display
- `src/components/ProbePanel.tsx` -- probe count + launch button (shows cost)
- `src/components/ProbeStatsPanel.tsx` -- trust allocation for ALL 8 stats (speed, exploration, selfReplication, combat, hazardRemediation, factoryProd, harvesterProd, wireDroneProd)
- `src/components/ExplorationDisplay.tsx` -- sectors explored, drifter count, probeDescendants
- `src/components/CombatDisplay.tsx` -- honor, combat log, probeLosses

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
Required data-testids: `app`, `page-header`, `nav-sidebar`, `manufacturing-panel`, `business-panel`, `manufacturing-controls`, `computing-panel`, `clip-counter`, `clip-button`, `funds-display`, `activity-log`, `project-list`. Phase 2+: `drone-panel`, `factory-panel`, `power-panel`, `matter-panel`. Phase 3+: `probe-panel`, `probe-stats-panel`, `exploration-display`, `combat-display`.
**Missing any = L2 FAIL.**

### L3 — Theme Verification
- Body bg: `rgb(245, 245, 240)` (#F5F5F0, NOT pure white)
- Panel borders: #D4D4D0 (NOT black)
- Font: JetBrains Mono everywhere (no Orbitron, no Inter)
**Wrong = L3 FAIL.**

### L5 — No NaN/undefined in `.font-data` elements. **Any = L5 FAIL.**

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
