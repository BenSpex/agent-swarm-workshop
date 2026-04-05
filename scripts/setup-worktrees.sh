#!/usr/bin/env bash
set -euo pipefail

# setup-worktrees.sh
# Creates git worktrees for each team branch under .swarm/worktrees/

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKTREE_DIR="$REPO_ROOT/.swarm/worktrees"
CHECKPOINT_DIR="$REPO_ROOT/.swarm/checkpoints"

echo "=== Setting up worktrees ==="

# Ensure directories exist
mkdir -p "$WORKTREE_DIR" "$CHECKPOINT_DIR"

# Teams and their branches
TEAMS=("core" "systems" "ui")

for team in "${TEAMS[@]}"; do
  BRANCH="$team"
  TREE_PATH="$WORKTREE_DIR/$team"

  # Create branch from scaffold if it doesn't exist
  if ! git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/$BRANCH"; then
    echo "[setup] Creating branch: $BRANCH"
    git -C "$REPO_ROOT" branch "$BRANCH" scaffold
  fi

  # Create worktree if it doesn't exist
  if [ ! -d "$TREE_PATH" ]; then
    echo "[setup] Creating worktree: $TREE_PATH -> $BRANCH"
    git -C "$REPO_ROOT" worktree add "$TREE_PATH" "$BRANCH"
  else
    echo "[setup] Worktree already exists: $TREE_PATH"
  fi
done

# Backup orchestrator CLAUDE.md so team merges don't clobber it
if [ -f "$REPO_ROOT/.claude/CLAUDE.md" ]; then
  cp "$REPO_ROOT/.claude/CLAUDE.md" "$REPO_ROOT/.claude/CLAUDE.md.orchestrator-backup"
  echo "[setup] Backed up orchestrator CLAUDE.md"
fi

# Copy team-specific CLAUDE.md into each worktree
# Each worktree gets: team spawn prompt as its CLAUDE.md (so Claude auto-reads it)
for team in "${TEAMS[@]}"; do
  TREE_PATH="$WORKTREE_DIR/$team"
  mkdir -p "$TREE_PATH/.claude"

  # Copy settings
  cp "$REPO_ROOT/.claude/settings.json" "$TREE_PATH/.claude/" 2>/dev/null || true

  # Team's CLAUDE.md = their spawn prompt (Claude reads this automatically on startup)
  if [ -f "$REPO_ROOT/prompts/03-agent-config/team-${team}.md" ]; then
    cp "$REPO_ROOT/prompts/03-agent-config/team-${team}.md" "$TREE_PATH/.claude/CLAUDE.md"
    echo "[setup] Wrote .claude/CLAUDE.md for $team team"
  fi
done

# Create .swarm/logs
mkdir -p "$REPO_ROOT/.swarm/logs"

echo ""
echo "=== Worktrees ready ==="
echo "  core:    $WORKTREE_DIR/core"
echo "  systems: $WORKTREE_DIR/systems"
echo "  ui:      $WORKTREE_DIR/ui"
echo ""
echo "Each worktree has .claude/CLAUDE.md with its team prompt."
echo "Checkpoints: $CHECKPOINT_DIR"
