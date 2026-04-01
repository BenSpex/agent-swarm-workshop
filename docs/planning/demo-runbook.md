---
tags: [keel, marketing, active]
---
# Demo Runbook

← AI Tinkerers Talk

Exact steps, terminal commands, and fallback plans for both live demo moments.

---

## Equipment Checklist

- [ ] Laptop with Claude Code Max plan active
- [ ] USB-C to HDMI adapter (or venue-provided)
- [ ] USB drive with backup video (60s screen recording of orchestrator running)
- [ ] Phone with QR code pre-scanned (verify it works)
- [ ] Power cable (10 min talk but arrive early for setup/testing)

## Pre-Talk Setup (30 min before)

### Venue

1. Connect to venue wifi — test speed: `curl -o /dev/null -w "%{speed_download}" https://api.anthropic.com`
2. Connect laptop to TV/projector — verify resolution and font readability from back row
3. If wifi unreliable: tether to phone hotspot as backup

### Terminal Setup

```bash
# Font size 18pt+ in terminal settings
# High-contrast theme (dark bg, bright text)
# Hide menu bar, maximize terminal

# Kill any existing tmux sessions
tmux kill-server 2>/dev/null

# Verify Claude Code works
claude --version
```

### Demo 1 Prep (Keel Violation)

```bash
# Clone the demo repo fresh
cd ~/demo
git clone git@github.com:BenSpex/keel-demo-repo.git
cd keel-demo-repo

# Verify clean compile
keel compile
# Expected: empty stdout, exit 0

# Test violation 1: parameter rename
# (pre-scripted edit in a specific file)
# Verify E001 fires with fix_hint

# Reset for live demo
git checkout .
```

### Demo 2 Prep (Live Kickoff)

```bash
# Clone workshop repo fresh
cd ~/demo
git clone git@github.com:BenSpex/agent-swarm-workshop.git
cd agent-swarm-workshop

# Verify orchestrator works (dry run)
./orchestrate.sh --dry-run
# Should print: "Would create 3 worktrees, launch tmux with 4 panes"

# Kill dry run artifacts
./scripts/teardown.sh
```

---

## Live Demo 1: Keel Catching a Violation [0:45–2:30]

### Happy Path

```bash
cd ~/demo/keel-demo-repo

# Step 1: Show clean compile
keel compile
# Empty stdout, exit 0

# Step 2: Introduce violation (pre-planned edit)
# Open src/user-service.ts, rename parameter `userId` to `id`
# This breaks callers in src/api-handler.ts

# Step 3: Run compile again
keel compile
# Shows: E001 broken_caller, fix_hint, confidence 0.95, tier_2_oxc
```

### Fallback: If keel binary doesn't work

- Show pre-recorded terminal output (screenshot or video)
- Say: "Let me show you what this looks like" — not "Sorry, tech issues"
- Continue to Act 2 without dwelling on it

### Fallback: If violation doesn't fire

- Have 3 violations pre-scripted in different files
- Skip to the next one: `git checkout . && [apply violation 2]`
- If none work: "I'll show the output on screen" → static screenshot slide

---

## Live Demo 2: Kickoff on Venue TV [8:30–9:30]

### Happy Path

```bash
cd ~/demo/agent-swarm-workshop

# Single command — this is the money shot
./orchestrate.sh

# Expected: tmux session with 4 panes appears
# Each pane shows a Claude Code session starting up
# Agents begin reading specs and creating initial files
```

### Fallback: Network failure

1. Say: "Network's not cooperating — let me show you what it looks like."
2. Play backup video from USB: `mpv /media/usb/orchestrator-demo.mp4`
3. Continue to close slide

### Fallback: Rate limiting

- Same as network failure fallback
- Don't wait or retry — switch to video immediately

### Fallback: tmux crashes

```bash
# One-command recovery
tmux kill-server 2>/dev/null && ./orchestrate.sh
```

### Fallback: Agents produce errors immediately

- First 60 seconds of agent output is usually setup (reading CLAUDE.md, creating files) — this looks impressive regardless
- If agents error immediately: switch to video backup
- Key insight: the audience watches for ~2-3 minutes during mingling. They see tmux panes with activity. The "wow" is the parallel activity, not the output quality.

---

## Post-Talk

- Leave the tmux session running on the TV
- Have the QR code slide visible on a second screen or printed
- Be available near the TV to answer questions about what the agents are doing
- If agents finish or crash after 20+ minutes: `./scripts/teardown.sh && ./orchestrate.sh` to restart

---

## Timing Marks (Practice Target)

| Section | Target | Hard Stop |
|---------|--------|-----------|
| Act 1: Hook + Demo 1 | 2:30 | 3:00 |
| Act 2: Workflow | 4:30 | 5:00 |
| Act 3: Principles | 1:30 | 2:00 |
| Live Kickoff + Close | 1:30 | 1:30 |
| **Total** | **10:00** | **11:30** |

If running long: cut Phase Gates (slide 8) to one sentence. The principles and live kickoff are non-negotiable.
