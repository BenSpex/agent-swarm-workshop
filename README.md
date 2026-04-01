# Agent Swarm Workshop

A "clone and run" workshop demonstrating multi-agent software engineering with Claude Code. Builds a Universal Paperclips clone with Weyland-Yutani corporate aesthetic using 3 parallel agent teams.

**Talk:** AI Tinkerers — April 16, 2026

## Quick Start

```bash
./orchestrate.sh
```

This single command:
1. Creates 3 git worktrees (core, systems, ui)
2. Launches a tmux session with 4 panes
3. Starts Claude Code in each pane with team-specific instructions
4. The orchestrator monitors, merges, and verifies via Chrome MCP

## Prerequisites

```
Required:
- Claude Code CLI (claude) with Max plan
- git 2.30+
- tmux 3.0+
- Node.js 18+
- ANTHROPIC_API_KEY set

Optional:
- Google Stitch account (for UI mockups)
- Pencil.dev account (for component generation)
- Vercel account (for deployment)
```

## Architecture

3 teams build against frozen contracts in `src/shared/`:

| Team | Branch | Owns | Builds |
|------|--------|------|--------|
| Core | `core` | `src/core/` | Tick engine, formulas, save/load |
| Systems | `systems` | `src/systems/` | 50+ projects, investment, probes |
| UI | `ui` | `src/components/`, `src/hooks/`, `src/styles/` | React components, WY theme |

## 4-Layer Backpressure

| Layer | Tool | Catches |
|-------|------|---------|
| Pre-write | Keel (hook) | File ownership, contract freeze |
| Compile | TypeScript strict | Type mismatches, missing exports |
| Test | Vitest | Wrong formulas, broken BigInt |
| Runtime | Chrome MCP | Doesn't render, clicks broken, theme wrong |

## Design Direction

**Weyland Corporate Clinical** — Dystopian minimalist corporate brutalism. Clinical stark whites, harsh black structural grids, and aggressive caution amber accents.

## Repo Structure

- `prompts/` — The swappable IP. Replace these to build anything.
- `src/shared/` — Frozen contracts. All teams code against these.
- `scripts/` — Worktree setup, tmux launch, teardown.
- `docs/planning/` — Planning docs from Obsidian vault.
- `.claude/` — Orchestrator instructions + hooks.

## Swapping the Project

1. Replace `prompts/00-ideation/` with your concept
2. Replace `prompts/02-architecture/spec-*.md` with your specs
3. Update `prompts/03-agent-config/team-*.md` spawn prompts
4. Run `./orchestrate.sh`
