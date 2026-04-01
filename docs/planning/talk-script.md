---
tags: [keel, marketing, active]
---
# Talk Script — 10-Minute Annotated

← AI Tinkerers Talk

> Target: ~1,500 words spoken = 10 minutes. Timing marks in brackets. Bold = slide transitions. CAPS = live demo switches.

---

## Act 1: The Hook (0:00–2:30)

### [0:00–0:30] The Number

> "Twenty-four hours. Twelve parallel Claude Code sessions. Zero to a working Rust code architecture enforcer with thirteen spec modules and four language resolvers."
>
> *[pause]*
>
> "Here's what it does."

**→ SLIDE 2: What is Keel**

### [0:30–0:45] One-Liner

> "Keel sits between your AI coding agent and the filesystem. Before the agent writes code, Keel checks it against your architecture. If it breaks a contract — wrong function signature, missing type hints, removed function that still has callers — Keel blocks the write and tells the agent exactly what to fix."
>
> "Let me show you."

**→ SLIDE 3: "Let's break something."**

### [0:45–2:30] LIVE DEMO: Keel Catching a Violation

**Setup:** Pre-prepared demo repo (5-10 TypeScript files with clear call edges). Terminal visible on screen.

1. Run `keel compile` — clean compile, empty stdout, exit 0
2. Open a file, rename a function parameter that other files depend on
3. Run `keel compile` again
4. Show the output:
   - Error code `E001: broken_caller`
   - The `fix_hint` telling exactly what to change
   - `confidence: 0.95`, `resolution_tier: "tier_2_oxc"`
5. Punchline:

> "Notice three things. First, it's fast — under 200 milliseconds. Second, the fix hint is specific — it tells the agent exactly what parameter name to use. Third, the confidence score — Keel knows how sure it is. This isn't a linter. This is a real-time architectural verifier."
>
> "The key insight: the LLM is the primary user. Keel enforces rules on the AI that would be unreasonable to demand from humans."

---

## Act 2: The Workflow (2:30–7:00)

### [2:30–3:30] The Problem That Forced the Solution

**→ SLIDE 4: "13 specs. 4 languages. Compiler-adjacent."**

> "Now — how do you build something like this in 24 hours? Keel has thirteen spec modules. Four language resolvers — TypeScript uses Oxc, Python calls ty, Go uses heuristics, Rust lazy-loads rust-analyzer. It's a three-tier resolution engine. This is compiler-adjacent work."
>
> "You can't do this with one AI session. The context window can't hold it. The dependency chain is too deep. You need to decompose."

**→ SLIDE 5: Dependency DAG**

> "Keel decomposes by dependency chain, not by feature. Foundation — parsing and graph. Enforcement — validation and commands. Surface — integrations and distribution. Each layer can start against mocks of the layer below."

### [3:30–5:00] Git Worktrees + Agent Teams

**→ SLIDE 6: Worktrees + Teams (4-pane tmux diagram)**

> "Here's the actual setup. Four tmux panes. Each pane is a Claude Code session running in its own git worktree — a lightweight copy of the repo on its own branch."
>
> "Each session doesn't run alone. It launches an agent team. A lead agent in delegate mode — it can coordinate but can't write code. Three to four teammate agents that actually implement. File isolation through worktrees. Coordination through git. The lead can't introduce its own bugs."
>
> "The fourth pane is the orchestrator. It sees everything but writes nothing. It monitors all three teams, enforces quality gates, and merges branches when teams pass."

### [5:00–6:00] The Ralph Loop

**→ SLIDE 7: The Ralph Loop**

> "Each agent runs in an autonomous loop. Run tests. Analyze failures. Fix the code. Run tests again. No human in each cycle."
>
> "But autonomous loops have a failure mode: retry loops. Same fix, same failure, forever. So we added error fingerprinting. Five consecutive identical failures — inject a hint. Eight — force-skip the task, reassign to a different teammate. Fifteen — cooldown, human review."
>
> "This is the same circuit breaker pattern you'd use in microservices. Your agent swarm needs resilience patterns too."

### [6:00–7:00] Phase Gates

**→ SLIDE 8: Phase Gates (M1 → M2 → M3)**

> "The orchestrator enforces phase gates with hard numeric criteria. Gate M1: resolution precision above 85% per language, measured against LSP ground truth. Gate M2: enforcement catches over 95% of mutation tests, compile under 200 milliseconds. Gate M3: end-to-end with Claude Code and Cursor."
>
> "84% precision on TypeScript? Gate fails. Fix it before moving on. No partial credit. Progressive gates, not waterfall."

---

## Act 3: Takeaways + Live Moment (7:00–10:00)

### [7:00–8:30] Three Principles You Can Steal

**→ SLIDE 9: Three cards**

> "Three things you can take from this and apply to your own agent workflows."

**Card 1: The Verifier Is King**

> "Quote from Anthropic's C compiler team: 'Claude will solve whatever problem you give it. So it's important that the task verifier is nearly perfect.' Write ALL your tests first. Your output quality is bounded by your verifier, not your model."

**Card 2: Contracts Before Code**

> "Freeze interfaces between agents in Phase 0. Without frozen contracts, Agent A returns `FunctionNode` with a string hash while Agent B expects `GraphNode` with a byte vector. Nobody catches it until integration. Same lesson as any distributed system — just because the workers are AI doesn't mean you skip the API contract."

**Card 3: The Circuit Breaker**

> "Don't let agents spin. Error fingerprinting. Escalation tiers. Forced reassignment. Your agent swarm needs the same resilience patterns as your microservices."

### [8:30–9:30] LIVE KICKOFF

**→ SLIDE 10: QR code + "Clone. Swap specs. Run."**

> "Everything I just showed you — the worktrees, the agent teams, the ralph loop, the phase gates — I packaged it into a repo you can clone and run."

*[Show QR code]*

> "Right now, I'm going to kick off the same workflow on this screen. It's going to build a browser game using the exact pipeline I used for Keel. Watch it while you grab a drink."

**ACTION:** Run `./orchestrate.sh` on venue TV. tmux panes light up. Agents start.

### [9:30–10:00] Close

**→ SLIDE 11: Contact info + repo URLs**

> "The repo URL is on screen. Clone it, swap the game specs for your own project, run the orchestrator. If you want to go deeper — the Keel repo has the full thirteen-spec suite, the constitution, and the design principles. Everything is open."

---

## Speaker Notes

- **Pace:** Act 1 is fast and visual. Act 2 is the meat — slow down here, let diagrams breathe. Act 3 is punchy.
- **Energy:** Open strong (the number), middle is explanatory, close with action (live kickoff).
- **Hands:** When showing tmux layout, gesture at the panes. When talking about the loop, make a circular motion.
- **Fallback:** If live demo fails → "Here's what it looks like" + pre-recorded video. Don't apologize for tech, just switch.
- **Font size:** Terminal at 18pt minimum. Test from the back of the room.
