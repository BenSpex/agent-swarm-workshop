#!/usr/bin/env bash
set -euo pipefail

# launch-tmux.sh — 4-pane tmux session
# Each pane runs its own Claude Code session with its own agent team.
# Pane 0: Orchestrator (monitors, merges, Chrome MCP verifies)
# Pane 1: Core team (engine, formulas, save)
# Pane 2: Systems team (projects, subsystems)
# Pane 3: UI team (components, layout, design enforcement)

SESSION="swarm"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKTREES="$REPO_ROOT/.swarm/worktrees"

# Kill existing session if present
tmux kill-session -t "$SESSION" 2>/dev/null || true

echo "=== Launching tmux swarm: 4 panes ==="

# Create session — Pane 0: Orchestrator (repo root)
tmux new-session -d -s "$SESSION" -n "swarm" -c "$REPO_ROOT"

# Split into 4 panes (2x2 grid)
tmux split-window -h -t "$SESSION:0.0" -c "$WORKTREES/core"
tmux split-window -v -t "$SESSION:0.0" -c "$WORKTREES/systems"
tmux split-window -v -t "$SESSION:0.1" -c "$WORKTREES/ui"

# Launch Claude in each pane (interactive, no -p flag)
tmux send-keys -t "$SESSION:0.0" "claude --dangerously-skip-permissions" Enter
tmux send-keys -t "$SESSION:0.1" "claude --dangerously-skip-permissions" Enter
tmux send-keys -t "$SESSION:0.2" "claude --dangerously-skip-permissions" Enter
tmux send-keys -t "$SESSION:0.3" "claude --dangerously-skip-permissions" Enter

echo "[launch] 4 Claude sessions started:"
echo "  Pane 0: Orchestrator (repo root)"
echo "  Pane 1: Core team ($WORKTREES/core)"
echo "  Pane 2: Systems team ($WORKTREES/systems)"
echo "  Pane 3: UI team ($WORKTREES/ui)"
echo ""
echo "Attach with: tmux attach -t $SESSION"
