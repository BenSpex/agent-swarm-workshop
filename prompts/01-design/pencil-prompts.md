# Pencil.dev Conversion Prompts

Convert Stitch screen designs into React 18 + Tailwind CSS v4 components.

**Source:** [Stitch Project — MU/TH/UR Terminal](https://stitch.withgoogle.com/projects/5899920511434600933)

---

## Design Direction: Weyland Corporate Clinical

Dystopian minimalist corporate brutalism. Clinical stark whites, harsh black structural grids, monospace typography, and aggressive caution amber accents.

### Design Tokens

```
Background:     #FFFFFF (white)
Panel BG:       #FFFFFF with 1px solid #000000 border
Header bars:    #1A1A1A (near-black) with white text
Text:           #000000 (black), monospace
CTA buttons:    #DAA520 (amber/gold) with black text, uppercase
Warning text:   #CC0000 (red)
Muted text:     #666666
Borders:        1px solid #000000, structural grid lines
Border radius:  2px (sharp, brutalist)

Font - Headers:  'Orbitron', sans-serif (uppercase)
Font - Data:     'JetBrains Mono', monospace
Font - Body:     'Inter', sans-serif
```

---

## Screen 1: Terminal Alpha (Manufacturing) — Phase 1

**Stitch screen:** `8580cd7fc00f462d8858f0d24c426632`

### Layout
3-column grid:
- **Left column:** Action panels (Manufacture Clip button, Automation, Market Strategy)
- **Center column:** Live Metrics Ledger (Paperclips count, Funds, Wire, Demand)
- **Right column:** System Activity Log (timestamped monospace entries)

### Components to extract

| Component | data-testid | Props |
|-----------|------------|-------|
| `ManufactureButton` | `clip-button` | onClick, disabled |
| `AutomationPanel` | `autoclipper-panel` | autoClipperCount, deployCost, onDeploy |
| `MarketStrategyPanel` | `market-panel` | unitPrice, marketingLevel, onLower, onRaise, onUpgradeMarketing, upgradeCost |
| `MetricsLedger` | `metrics-ledger` | clips, funds, wireInventory, publicDemand, wireCost |
| `BuyWireButton` | `buy-wire` | wireCost, onBuy |
| `SystemActivityLog` | `activity-log` | messages: Array<{timestamp, text, severity}> |
| `PageHeader` | `page-header` | title, subtitle |

### Pencil prompt

```
Convert this Stitch HTML into React + Tailwind CSS components.

Design system: Weyland Corporate Clinical
- White backgrounds, 1px black borders, structural grid layout
- Amber (#DAA520) CTA buttons with black uppercase text
- Dark (#1A1A1A) panel header bars with white text
- JetBrains Mono for data/numbers, Orbitron for headers, Inter for body
- All numbers right-aligned in monospace

Split into these components:
1. ManufactureButton — large amber CTA, "EXECUTE: MANUFACTURE CLIP"
2. AutomationPanel — AutoClippers count, deploy button with cost
3. MarketStrategyPanel — Unit price with LOWER/RAISE buttons, marketing level with upgrade
4. MetricsLedger — Paperclips count (large), funds, wire inventory, public demand, wire cost
5. BuyWireButton — inside MetricsLedger
6. SystemActivityLog — scrollable monospace log with timestamps
7. PageHeader — "WEYLAND CORPORATE CLINICAL" / "TERMINAL ALPHA" / subtitle

Every component MUST have a data-testid attribute.
Use TypeScript interfaces for all props.
Keep layout as CSS Grid (3 columns).
```

---

## Screen 2: Computational Resources — Trust/Computing

**Stitch screen:** `f976f9a2e99f42d7a0bcc10dcf37ea6c`

### Layout
3-column grid:
- **Left column:** System Metrics (Operations counter + bar, Creativity counter + bar)
- **Center column:** Navigation sidebar (Terminal Alpha, Computational Resources, Strategic Projects, Galactic Expansion)
- **Right column:** Trust panel (Trust count, next trust milestone, Processors/Memory/Quantum/Parallel allocation)

### Components to extract

| Component | data-testid | Props |
|-----------|------------|-------|
| `OperationsPanel` | `operations-panel` | currentOps, maxCapacity, generationRate |
| `CreativityPanel` | `creativity-panel` | currentIdeas, status |
| `TrustPanel` | `trust-panel` | trust, nextTrustAt, processors, memory, quantumChips, parallelClusters |
| `ResourceAllocator` | `resource-allocator` | label, qty, onAdd, onRemove, available |
| `NavigationSidebar` | `nav-sidebar` | activeScreen, screens[] |
| `ProgressBar` | `progress-bar` | value, max, segments? |

### Pencil prompt

```
Convert this Stitch HTML into React + Tailwind CSS components.

Design system: Weyland Corporate Clinical (same tokens as Screen 1)

Split into these components:
1. OperationsPanel — "OPERATIONS" dark header, current ops (large number), max capacity, generation rate, segmented progress bar
2. CreativityPanel — "CREATIVITY" dark header, current ideas count, status text, block-style progress visualization
3. TrustPanel — "TRUST: {n}" large display, "AVAILABLE TRUST FOR HARDWARE SCALING", next trust milestone, resource allocation rows
4. ResourceAllocator — reusable row: icon + label + description + "Qty: N" (used for processors, memory, quantum, parallel)
5. NavigationSidebar — vertical nav: screen names, active state has amber left border + bold text
6. ProgressBar — segmented bar with filled/empty blocks (brutalist style, not rounded)

Every component MUST have a data-testid attribute.
Use TypeScript interfaces for all props.
```

---

## Screen 3: Strategic Projects — Projects/Initiatives

**Stitch screen:** `53668f8385ba4706a564b9aff2b43cef`

### Layout
3-column grid:
- **Left column:** System Metrics (same as Screen 2)
- **Center column:** Navigation sidebar
- **Right column:** Strategic Projects (Quantum Computing matrix, Extract Operations button, Available Initiatives cards)

### Components to extract

| Component | data-testid | Props |
|-----------|------------|-------|
| `QuantumComputingPanel` | `quantum-panel` | matrix: number[][], coherence, expectedYield, onExtract |
| `InitiativeCard` | `initiative-card` | name, description, cost, costUnit, available, onAuthorize |
| `InitiativesList` | `initiatives-list` | initiatives[] |

### Pencil prompt

```
Convert this Stitch HTML into React + Tailwind CSS components.

Design system: Weyland Corporate Clinical (same tokens)

Split into these components:
1. QuantumComputingPanel — "QUANTUM COMPUTING" dark header with "SYNCING..." badge, number matrix grid (6 columns), coherence warning, expected yield, amber "EXTRACT OPERATIONS" CTA
2. InitiativeCard — project card with: name (bold), description, cost row (e.g. "10,000 OPS"), "AUTHORIZE PROJECT" button. Unavailable state shows "INSUFFICIENT CRE..." in red
3. InitiativesList — "AVAILABLE INITIATIVES" header, horizontal scrolling card row

Reuse NavigationSidebar, OperationsPanel, CreativityPanel from Screen 2.
Every component MUST have a data-testid attribute.
```

---

## Screen 4: Galactic Expansion — Phase 3

**Stitch screen:** `37c92d0961414650a2ef0ff94ea3ef02`

### Layout
Full-width with probe management panels.

### Components to extract

| Component | data-testid | Props |
|-----------|------------|-------|
| `GalacticHeader` | `galactic-header` | title |
| `ProbeStatsPanel` | `probe-stats` | explorationPct, replicationPct |
| `ProbeConfigPanel` | `probe-config` | speed, exploration, selfReplication, combat, onAdjust |
| `ProbeControlPanel` | `probe-control` | probeCount, honor, onLaunch |
| `CombatPanel` | `combat-panel` | drifterCount, combatLog[] |

### Pencil prompt

```
Convert this Stitch HTML into React + Tailwind CSS components.

Design system: Weyland Corporate Clinical (same tokens)
Note: This screen may use darker backgrounds for the space/galactic theme while keeping the same typography and border system.

Split into these components:
1. GalacticHeader — "GALACTIC EXPANSION" large Orbitron header
2. ProbeStatsPanel — large percentage displays (e.g. "0.088600081%" and "99.99999999%"), labels below
3. ProbeConfigPanel — "PROBE DESIGN/LOADOUT" section, sliders or allocation for speed/exploration/self-replication/combat
4. ProbeControlPanel — probe count, honor display, "LAUNCH PROBES" amber CTA
5. CombatPanel — drifter encounters, combat resolution log

Every component MUST have a data-testid attribute.
BigInt values must use formatBigInt() for display.
```

---

## Shared Components (extract from any screen)

| Component | data-testid | Used In |
|-----------|------------|---------|
| `Panel` | — | Wrapper: white bg, 1px black border, optional dark header bar |
| `DarkHeaderBar` | — | Black bar with white uppercase text + optional status badge |
| `AmberButton` | — | Amber bg, black text, uppercase, full-width or inline |
| `DataRow` | — | Label (left, muted) + Value (right, mono, bold) |
| `StatusBadge` | — | Small pill: "SYNCED", "GENERATING...", "NORMAL" |
| `MonospaceValue` | — | Large number display in JetBrains Mono |

---

## File Ownership (for agent teams)

After Pencil.dev generates scaffolds, split files by team ownership:

| Team | Owns | Components |
|------|------|-----------|
| UI | `src/components/` | All React components above |
| UI | `src/hooks/` | useGameState, useEngine |
| UI | `src/styles/` | global.css, tailwind config |
| Core | `src/core/` | Engine, formulas, save — no UI |
| Systems | `src/systems/` | Projects, investment — no UI |
