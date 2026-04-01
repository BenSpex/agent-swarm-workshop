---
tags: [keel, marketing, active]
---
# Prep Checklist

← AI Tinkerers Talk

---

## Ben Prepares (requires human judgment)

### Week 1-2

- [x] **Game concept brief:** Full Paperclip Maximizer spec provided (3 phases, ~120 vars, 50+ projects)
- [ ] **Google Stitch mockups:** Designs being generated. Export to Figma → Pencil.dev for wireframes
- [ ] **Keel demo repo:** Small purpose-built project (5-10 TypeScript files with clear call edges). Three prepared violations:
  1. Parameter rename → E001 broken_caller
  2. Function removal → E004 function_removed
  3. Missing type hints → E002 missing_type_hints

### Week 3

- [ ] **QR code:** Generate for `github.com/BenSpex/agent-swarm-workshop`. Test from phone camera

### Week 4 (Apr 14-16)

- [ ] **Rehearsals:** 3-5 full run-throughs of the 10-minute talk, timed per section
- [ ] **Venue logistics:** Confirm TV/projector setup, wifi speed, power outlets, display resolution
- [ ] **Day-of setup:** Arrive 30 min early. Run pre-talk checklist

---

## We Build (Claude Code sessions)

### Week 1 — Planning Docs

- [x] Vault planning docs (7 files in `Talks/2026-04-16-ai-tinkerers/`)
- [x] Game decomposition: team split, constitution, contracts, build order

### Week 2 — Workshop Repo + Remotion

- [ ] Workshop repo skeleton: `agent-swarm-workshop` on GitHub
  - Phase 0 scaffold: `src/shared/` contracts, stub files, `package.json`
  - `orchestrate.sh` + `scripts/` (worktrees, tmux, merge, teardown)
  - `.claude/CLAUDE.md` + `settings.json`
  - `prompts/` with all game content filled in
  - `patches/integration-wiring.patch`
  - `tests/integration.test.ts`
- [ ] Fill game specs: `spec-core.md`, `spec-systems.md`, `spec-ui.md`
- [ ] Write spawn prompts: `team-core.md`, `team-systems.md`, `team-ui.md`
- [ ] Remotion repo: `keel-talk` on GitHub
  - 11 slides as React components
  - Dark theme, monospace (JetBrains Mono)
  - QR code component
  - Presenter mode + MP4 export

### Week 3 — Practice Runs + Polish

- [ ] Practice Run 1: identify prompt failures, fix specs
- [ ] Practice Run 2: timing benchmark (how long to playable Phase 1?)
- [ ] Practice Run 3: full build + merge + Vercel deploy
- [ ] Practice Run 4-5: polish prompts based on failure patterns
- [ ] Record backup video (60s of orchestrator running, 4 tmux panes)
- [ ] Test Remotion slides on external display

---

## Practice Run Protocol

Each practice run follows the same steps. Document failures and fixes.

### Setup
1. Fresh clone of `agent-swarm-workshop`
2. `npm install` (should be no-op — deps committed)
3. Verify Phase 0 scaffold compiles: `npm run typecheck`

### Build
4. Run `./orchestrate.sh`
5. Start timer
6. Monitor all 4 tmux panes via `/tmux-observe`
7. Note: which team finishes first? Which struggles?

### Merge + Deploy
8. Run `./merge-all.sh`
9. Check typecheck passes after each merge step
10. Apply integration patch
11. `npm run dev` — is the game playable?
12. `npx vercel` — does it deploy?

### Post-Run Analysis
13. Check `.swarm/checkpoints/` — did agents write checkpoints before context resets? Missing checkpoints = Article 9 not enforced in CLAUDE.md
14. Run `./analyze-run.sh` → parses `.swarm/logs/*.jsonl`
14. Review failure report:
    - Failure frequency by layer (Keel / TS / Vitest / Chrome MCP)
    - Failure frequency by team and agent
    - Prompt fix recommendations with severity
15. **Time to playable Phase 1?** Target: <15 minutes
16. **Time to full 3-phase game?** Target: <45 minutes
17. **Keel violations count?** Should decrease each run (proves Keel works)
18. **Chrome MCP layers passing?** Target: 5/5
19. **Lead plan rejections?** High count = specs unclear
20. **Agent escalations?** Target: 0

### Fix Cycle
21. Apply prompt fixes recommended by `analyze-run.sh`
22. Track cross-run patterns (violations decreasing per fix)
23. Commit fixes, run next practice run

### "Bulletproof" Definition

3 consecutive clean runs with:
- [ ] Zero human intervention
- [ ] All 4 backpressure layers green (Keel + TS + Vitest + Chrome MCP)
- [ ] Full game playable after merge
- [ ] <45 min total build time
- [ ] Keel violations trending to zero
- [ ] Zero lead plan rejections
- [ ] Zero agent escalations (15-repeat)

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-24 | Remotion for slides | Code-as-slides is on-brand for the talk's message |
| 2026-03-24 | 3 teams, prompts dir swappable | Rate limits + audience attention + reusability |
| 2026-03-24 | Backup video on USB | Network failure is the #1 risk at venue |
| 2026-03-24 | Teams: Core / Systems / UI | Dependency DAG split (not Frontend/Backend/GameLogic) |
| 2026-03-24 | Full game scope | Ben wants wow effect — practice-run until it works reliably |
| 2026-03-24 | React + Vite + Tailwind | Vercel deploy with zero config, agents know it well |
| 2026-03-24 | UI skin only (not full reskin) | Same game terms, Weyland-Yutani visual aesthetic |
| 2026-03-24 | Moved from Keel/ to Talks/ | Talk is broader than Keel — covers workflow + demo game |
