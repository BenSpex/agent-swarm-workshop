---
tags: [keel, marketing, active]
---
# Slide Content — Remotion

← AI Tinkerers Talk

Minimal slides for structure and transitions. Dark theme, monospace typography. Slides are visual anchors between live terminal/browser demos — not the main content.

**Design:** Dark background (#0D1117), monospace font (JetBrains Mono or Fira Code), accent color (#58A6FF). No animations beyond simple fade-in. Large text. Nothing that can't be read from the back of the room.

---

## Slide 1: Title

```
KEEL

24 Hours. 12 Agents.
1 Architecture Enforcer.

Ben Niehaus
@BenSpex · FRYR
```

## Slide 2: What is Keel

```
The guard between the model
and the filesystem.

Real-time architectural enforcement
for AI coding agents.

Before the agent writes → Keel checks.
Violation? → Block + fix hint.
Clean? → Write proceeds.
```

## Slide 3: Live Demo Transition

```
LIVE DEMO

Let's break something.
```

*Speaker switches to terminal. Slide stays on secondary screen or fades.*

## Slide 4: The Problem

```
13 spec modules
4 language resolvers
3-tier resolution engine
667 pre-written tests

"Compiler-adjacent work.
 One AI session can't hold it."
```

## Slide 5: Dependency DAG

```
┌─────────────┐
│  Foundation  │  Parsing + Graph
│  4 agents    │  tree-sitter, Oxc, ty, rust-analyzer
└──────┬───────┘
       │
┌──────▼───────┐
│ Enforcement  │  Validation + Commands
│  3 agents    │  compile, discover, explain
└──────┬───────┘
       │
┌──────▼───────┐
│   Surface    │  Integration + Distribution
│  4 agents    │  Claude Code, Cursor, MCP, VS Code
└──────────────┘

Decompose by dependency chain, not feature.
```

## Slide 6: Worktrees + Agent Teams

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   FOUNDATION        │   ENFORCEMENT       │
│   worktree-a/       │   worktree-b/       │
│                     │                     │
│   Lead (delegate)   │   Lead (delegate)   │
│   + 4 teammates     │   + 3 teammates     │
│                     │                     │
├─────────────────────┼─────────────────────┤
│                     │                     │
│   SURFACE           │   ORCHESTRATOR      │
│   worktree-c/       │   root worktree     │
│                     │                     │
│   Lead (delegate)   │   Sees everything   │
│   + 4 teammates     │   Writes nothing    │
│                     │                     │
└─────────────────────┴─────────────────────┘

File isolation → git worktrees
Coordination → git push/pull
Leads can't write code → delegate mode
```

## Slide 7: The Ralph Loop

```
        ┌──────────┐
        │ Run Tests│
        └────┬─────┘
             │
        ┌────▼─────┐
        │ Analyze  │
        │ Failures │
        └────┬─────┘
             │
        ┌────▼─────┐
        │ Fix Code │
        └────┬─────┘
             │
             └──────→ repeat

ESCALATION
  5 failures → inject hint
  8 failures → reassign teammate
 15 failures → human review

"Same circuit breaker as microservices."
```

## Slide 8: Phase Gates

```
 M1: RESOLUTION           M2: ENFORCEMENT          M3: INTEGRATION
 ─────────────            ─────────────            ─────────────
 >85% precision           >95% true positive       End-to-end with
 per language             rate on mutations         Claude Code + Cursor

 All 4 langs parse        compile <200ms           MCP server responds
 without panic            clean = empty stdout     VS Code extension works

 Graph within 10%         Circuit breaker          Cross-platform builds
 of LSP baseline          escalation verified      Linux, macOS, Windows

        ────── PASS ──────→────── PASS ──────→────── SHIP ──────→
        No partial credit. 84%? Gate fails. Fix it.
```

## Slide 9: Three Principles

```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│                    │  │                    │  │                    │
│  THE VERIFIER      │  │  CONTRACTS         │  │  THE CIRCUIT       │
│  IS KING           │  │  BEFORE CODE       │  │  BREAKER           │
│                    │  │                    │  │                    │
│  Write ALL tests   │  │  Freeze interfaces │  │  Error fingerprint │
│  first.            │  │  in Phase 0.       │  │  + escalation.     │
│                    │  │                    │  │                    │
│  Quality bounded   │  │  Same as any       │  │  Agent swarms need │
│  by verifier,      │  │  distributed       │  │  resilience too.   │
│  not model.        │  │  system contract.  │  │                    │
│                    │  │                    │  │                    │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

## Slide 10: Your Turn

```
CLONE. SWAP SPECS. RUN.

[QR CODE]

github.com/BenSpex/agent-swarm-workshop

1. Clone the repo
2. Swap the game specs for your project
3. Run ./orchestrate.sh
4. Watch agents build
```

## Slide 11: Close

```
Ben Niehaus
FRYR — AI that frees your team

github.com/BenSpex/Keel
github.com/BenSpex/agent-swarm-workshop

@BenSpex
```

---

## Remotion Implementation Notes

- Repo: `BenSpex/keel-talk` (TypeScript/React)
- Framework: Remotion (code-as-slides, renders to video or live presentation)
- Slides are React components — can embed live SVG diagrams
- Presenter mode: arrow keys to navigate, no auto-advance
- Export: can render to MP4 as backup video
- ASCII diagrams above become clean SVG components in the actual slides
