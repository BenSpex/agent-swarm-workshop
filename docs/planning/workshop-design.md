---
tags: [keel, marketing, active]
---
# Workshop Repo Design

← AI Tinkerers Talk

Architecture for the `agent-swarm-workshop` repo — a "clone and run" package that demonstrates the same workflow Ben used to build Keel. Builds a Universal Paperclips clone with Weyland-Yutani UI. The audience takes it home and runs it on their own projects.

---

## Repo Structure

```
agent-swarm-workshop/
├── README.md                         # Setup, prerequisites, quick start
├── orchestrate.sh                    # One command: worktrees + tmux + agents
├── merge-all.sh                      # Deterministic merge: core → systems → ui
├── analyze-run.sh                    # Post-practice-run log analysis
├── keel.toml                         # Keel config: file ownership + frozen modules
├── LICENSE
│
├── .claude/
│   ├── CLAUDE.md                     # Orchestrator instructions
│   ├── settings.json                 # Agent teams enabled, tmux mode
│   └── hooks.json                    # Logging hooks (PostToolUse, TeammateIdle)
│
├── prompts/                          # ← THE IP (swap these to build anything)
│   ├── README.md                     # How prompt files work in this workflow
│   ├── 00-ideation/
│   │   ├── game-concept.md           # Paperclip Maximizer + Weyland-Yutani theme
│   │   ├── features.md               # 3 phases, ~120 state vars, 50+ projects
│   │   └── tech-decisions.md         # React + Vite + Tailwind, Vercel deploy
│   ├── 01-design/
│   │   ├── stitch-prompts.md         # Google Stitch prompts for UI mockups
│   │   └── pencil-prompts.md         # Pencil.dev → Figma → component scaffolds
│   ├── 02-architecture/
│   │   ├── constitution.md           # 9 articles (Keel pattern + data-testid + context checkpoints)
│   │   ├── contracts.ts              # Frozen TypeScript interfaces (5 contracts)
│   │   ├── spec-core.md              # Self-contained spec: engine, formulas, save
│   │   ├── spec-systems.md           # Self-contained spec: projects, investment, probes
│   │   └── spec-ui.md               # Self-contained spec: components, theme, layout
│   └── 03-agent-config/
│       ├── team-core.md              # Spawn prompt for Core team
│       ├── team-systems.md           # Spawn prompt for Systems team
│       └── team-ui.md               # Spawn prompt for UI team
│
├── src/
│   ├── shared/                       # FROZEN after Phase 0 — all teams read, none modify
│   │   ├── types.ts                  # GameState, GameFlags, InvestmentState
│   │   ├── actions.ts                # GameAction discriminated union
│   │   ├── projects.ts               # ProjectDefinition, ProjectCost
│   │   ├── engine.ts                 # GameEngine interface, format utilities
│   │   ├── theme.ts                  # WY_THEME color/font/effect constants
│   │   ├── initialState.ts           # createInitialState() defaults
│   │   └── mockState.ts              # createMockState() for UI testing
│   ├── core/                         # Team Core owns
│   │   ├── engine.ts                 # GameEngine implementation
│   │   ├── formulas.ts               # All game formulas (pure functions)
│   │   └── save.ts                   # localStorage persistence + BigInt JSON
│   ├── systems/                      # Team Systems owns
│   │   ├── projects/
│   │   │   ├── index.ts              # Project registry
│   │   │   ├── phase1.ts             # Phase 1 projects
│   │   │   ├── phase2.ts             # Phase 2 projects
│   │   │   └── phase3.ts             # Phase 3 projects
│   │   ├── investment.ts             # Stock/bond simulation
│   │   ├── quantum.ts                # Creativity generation
│   │   ├── trust.ts                  # Trust/processor/memory allocation
│   │   └── probes.ts                 # Probe launch/explore/replicate/combat
│   ├── components/                   # Team UI owns
│   │   └── App.tsx                   # Main layout (stub)
│   ├── hooks/                        # Team UI owns
│   │   └── useGameState.ts           # Engine subscription hook (stub)
│   └── styles/                       # Team UI owns
│       └── global.css                # Base styles (stub)
│
├── reference/                        # Evaluator calibration images (from Stitch)
│   ├── wy-theme-target.png           # Ideal WY look
│   ├── phase1-layout.png             # Expected Phase 1 layout
│   ├── phase2-layout.png             # Expected Phase 2 layout
│   └── phase3-layout.png             # Expected Phase 3 layout
│
├── .swarm/                           # Orchestrator artifacts (gitignored)
│   ├── checkpoints/                  # Context reset handoff files per agent
│   ├── logs/                         # 7 JSONL log streams for prompt improvement
│   │   ├── keel-violations.jsonl
│   │   ├── typescript-errors.jsonl
│   │   ├── vitest-failures.jsonl
│   │   ├── chrome-results.jsonl
│   │   ├── plan-rejections.jsonl
│   │   ├── escalations.jsonl
│   │   └── agent-decisions.jsonl
│   ├── tasks-core.md                 # Orchestrator → Core team feedback
│   ├── tasks-systems.md              # Orchestrator → Systems team feedback
│   ├── tasks-ui.md                   # Orchestrator → UI team feedback
│   ├── swarm-status.md               # Live dashboard
│   └── verification-results.md       # Latest Chrome oracle results
│
├── patches/
│   └── integration-wiring.patch      # Pre-built: connects engine to React context
│
├── tests/
│   └── integration.test.ts           # 7 integration tests (engine, clips, save, BigInt)
│
├── scripts/
│   ├── setup-worktrees.sh            # Create 3 git worktrees (core, systems, ui)
│   ├── launch-tmux.sh                # tmux session with 4 panes
│   ├── verify-ownership.sh           # Pre-merge: check no team touched other dirs
│   └── teardown.sh                   # Clean up worktrees + tmux
│
├── package.json                      # ALL deps pre-installed
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json                     # strict: true
├── index.html
└── main.tsx                          # Entry point
```

---

## Key Design Decisions

### The `prompts/` directory is the product

Orchestrator scripts are reusable plumbing. The `prompts/` directory defines **what** gets built. To build something different:

1. Replace `00-ideation/` with your project concept
2. Replace `02-architecture/spec-*.md` with your project specs
3. Update `03-agent-config/team-*.md` spawn prompts
4. Run `./orchestrate.sh`

### Mirrors Keel's patterns

| Keel Pattern | Workshop Equivalent |
|-------------|-------------------|
| Constitution | `prompts/02-architecture/constitution.md` |
| Self-contained specs | `prompts/02-architecture/spec-*.md` |
| Frozen contracts | `prompts/02-architecture/contracts.ts` |
| Spawn prompts | `prompts/03-agent-config/team-*.md` |
| Design principles | Embedded in constitution |

### Three teams — Core / Systems / UI

| Team | Worktree | Branch | Builds |
|------|----------|--------|--------|
| Core | `worktree-core/` | `core` | Tick loop, state, formulas, save/load, BigInt, formatting |
| Systems | `worktree-systems/` | `systems` | 50+ projects, investment, quantum, probes, prestige |
| UI | `worktree-ui/` | `ui` | React components, Weyland-Yutani theme, layout, combat canvas |

See Game Decomposition for team rationale and build order. See Orchestration System for 4-layer backpressure, Chrome oracle, and logging.

---

## `orchestrate.sh` Behavior

```
1. Verify prerequisites (claude, git, tmux, Node.js, ANTHROPIC_API_KEY)
2. Initialize git repo + initial commit (if not already)
3. Create 3 worktrees: worktree-core/, worktree-systems/, worktree-ui/
4. Copy per-worktree .claude/CLAUDE.md from template (embeds team spec + constitution)
5. Launch tmux session with 4 panes: orchestrator | core | systems | ui
6. Start Claude Code in each pane with team's initial prompt
7. Orchestrator pane monitors via /tmux-observe
```

---

## Pipeline

### Phase 0: Scaffold (single agent, ~10 min)

Creates the `src/shared/` contracts, stub files, `package.json` with all deps, and the Phase 0 scaffold that all teams build on. Commits to `main`. All worktrees branch from this.

### Phase 1: Build (automated, `./orchestrate.sh`)

1. Orchestrator creates worktrees and launches tmux
2. Each Claude Code session reads its spec and starts implementing
3. Each session launches an agent team: lead (delegate) + teammates
4. Teammates run in Ralph Loop: test → fix → test
5. Orchestrator monitors progress via `/tmux-observe`

### Phase 2: Merge (deterministic, `./merge-all.sh`)

1. Verify file ownership (`scripts/verify-ownership.sh`)
2. Merge `core` → `main`, typecheck
3. Merge `systems` → `main`, typecheck
4. Merge `ui` → `main`, typecheck
5. Apply integration patch, `npm run dev`

### Phase 3: Deploy

1. `npx vercel` → live URL
2. Verify game playable in browser

---

## Game Content

**Game:** Universal Paperclips clone — incremental/idle browser game

**Theme:** Weyland-Yutani (Alien franchise) UI skin. Dystopian minimalist corporate brutalism. Clinical stark whites, harsh black structural grids, monospace typography, and aggressive caution amber accents.

**Stack:** React 18 + Vite + Tailwind CSS v4 + TypeScript strict. Deploys to Vercel.

**Scope:** Full 3-phase game:
- Phase 1 (Business): manual clips → autoclippers → megaclippers → pricing → marketing → trust → investment → strategic modeling
- Phase 2 (Earth Consumption): harvesters → wire drones → factories → solar/power → momentum → swarm computing
- Phase 3 (Universe): probes → exploration → replication → combat → honor → prestige/true ending

**Persistence:** localStorage with BigInt-safe JSON serialization. Auto-save every 25s.

---

## Prerequisites

```
Required:
- Claude Code CLI (claude) with Max plan ($200/mo for rate limits)
- git 2.30+
- tmux 3.0+
- Node.js 18+

Optional:
- Google Stitch account (for UI mockups)
- Pencil.dev account (for component generation)
- Vercel account (for deployment)
```
