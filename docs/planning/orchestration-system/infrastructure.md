---
tags: [keel, marketing, active]
---
# Infrastructure — tmux, Ralph Loop, Gates

← Orchestration System

---

## Launch Sequence (`orchestrate.sh`)

```bash
1. Verify prerequisites (claude, git, tmux, node, keel)
2. git init + Phase 0 scaffold commit
3. keel init
4. git worktree add worktree-core -b core
5. git worktree add worktree-systems -b systems
6. git worktree add worktree-ui -b ui
7. Copy team-specific .claude/CLAUDE.md into each worktree
8. mkdir -p .swarm/{logs,checkpoints}
9. tmux new-session -d -s swarm (4 panes)
10. Each pane: cd worktree-{team} && claude --dangerously-skip-permissions
```

---

## Ralph Loop at 3 Levels

### Teammate Level (innermost)

Each teammate runs `/ralph-loop` with their team's test command. Cycle: implement → test → analyze → fix → test. Escalation: 5 → hint, 8 → reassign, 15 → human.

### Lead Level (team coordination)

1. Check `.swarm/tasks-{team}.md` for orchestrator feedback
2. Distribute tasks to teammates via `SendMessage`
3. **After teammate commits → run team tests** (not just plan review)
4. **For UI team → take screenshot, score against rubric** (see rubric)
5. **Grade: A (merge-ready) / B (minor fix) / C (rework) / F (reject)**
6. Two consecutive C grades → more detailed sub-plan. F → reassign.
7. Apply escalation tiers (5/8/15) when teammates idle
8. If pass: `git add -A && git commit && git push`
9. Update `.swarm/status-{team}.md`

### Orchestrator Level (outermost)

Every ~60 seconds:
1. `/tmux-observe` panes 1-3 — check team activity
2. `git fetch --all` — detect new commits
3. If new commits:
   a. Verify file ownership (`git diff --name-only`)
   b. Merge in order: core → systems → ui (typecheck between each)
   c. If fail → write to `.swarm/tasks-{team}.md`, abort
4. Restart dev server: `kill $(lsof -t -i:5173); npm run dev &`
5. Run Chrome MCP 5-layer verification
6. Route failures → team task files
7. Check phase gate criteria
8. Update `.swarm/swarm-status.md`
9. Repeat

---

## Lead Plan Questioning

Before approving any teammate plan, leads challenge against 5 questions:

1. **Contract compliance:** "Does this modify `src/shared/`?" → reject
2. **File ownership:** "Does this touch another team's directory?" → reject
3. **Constitution articles:** Check all 9 articles
4. **Integration risk:** "Will this merge cleanly?"
5. **Chrome MCP testability:** "Does every component have `data-testid`?"

---

## Phase Gates

### G1: Skeleton
- [ ] All 3 branches have commits beyond Phase 0
- [ ] `npx tsc --noEmit` passes after merging all 3
- [ ] Dev server starts, shows stub UI
- [ ] Chrome L1 passes (no console errors)
- [ ] `keel compile` clean on merged code

### G2: Phase 1 Playable
- [ ] Manual clip button works (Chrome L4)
- [ ] Autoclippers produce clips (tick loop verified)
- [ ] Wire depletes and can be purchased
- [ ] 5+ Phase 1 projects purchasable
- [ ] Pricing affects demand
- [ ] Save/load works (localStorage round-trip)
- [ ] WY theme applied (Chrome L3, rubric score 3+)
- [ ] Zero console errors

### G3: Full Game
- [ ] All G2 criteria still pass
- [ ] Phase 2 transition works, panels render
- [ ] Phase 3 transition works, panels render
- [ ] BigInt displays correctly (Chrome L5)
- [ ] 25+ projects across all phases
- [ ] Prestige/reset works

---

## Prerequisites Pipeline

```
Stitch → 4 screen designs
    ↓
Figma export → annotated component names
    ↓
Pencil.dev → React + Tailwind scaffolds
    ↓
Phase 0 scaffold → frozen contracts + stubs + keel.toml + reference/
    ↓
Ready-to-build checklist → orchestrate.sh
```

### Ready-to-Build Checklist

- [ ] Stitch designs for all 4 screens
- [ ] Pencil.dev scaffolds merged into `src/components/`
- [ ] `src/shared/` frozen contracts compile
- [ ] `keel init` passes, `keel compile` clean
- [ ] `npm run dev` shows stub app
- [ ] Worktrees created with team-specific `.claude/CLAUDE.md`
- [ ] Keel hooks active (test: modify `src/shared/` → blocked)
- [ ] `.swarm/logs/` and `.swarm/checkpoints/` exist
- [ ] `reference/` screenshots from Stitch designs
- [ ] `data-testid` on all stub components
