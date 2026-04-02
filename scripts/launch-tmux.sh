#!/usr/bin/env bash
set -euo pipefail

# launch-tmux.sh
# Creates a tmux session "swarm" with a single pane for the orchestrator.
# Agent teams create additional tmux panes automatically via built-in team feature.

SESSION="swarm"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Kill existing session if present
tmux kill-session -t "$SESSION" 2>/dev/null || true

echo "=== Launching tmux session: $SESSION ==="

# Initial prompt that kicks off the orchestration
INIT_PROMPT="You are the orchestrator. Read .claude/CLAUDE.md for your full instructions. Then:
1. Start the dev server: npm run dev
2. Create 3 agent teams using TeamCreate — one for each team lead (core-lead, systems-lead, ui-lead)
3. For each team, read the spawn prompt from prompts/03-agent-config/team-{core,systems,ui}.md and pass it as the team prompt
4. Each team lead works in their worktree: .swarm/worktrees/{core,systems,ui}/
5. Begin the monitor loop: observe teams, merge when ready, Chrome MCP verify, route failures
GO."

# Create session with orchestrator pane — pass initial prompt via -p flag
tmux new-session -d -s "$SESSION" -c "$REPO_ROOT" \
  "claude --dangerously-skip-permissions -p '${INIT_PROMPT}'"

echo "[launch] Orchestrator pane started with claude --dangerously-skip-permissions"
echo "[launch] Agent teams will create additional panes automatically."
echo ""
echo "Attach with: tmux attach -t $SESSION"
