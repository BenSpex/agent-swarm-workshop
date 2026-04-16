#!/usr/bin/env bash
# verify-ownership.sh — Keel ownership enforcement (medium: orchestrator gate)
#
# Usage: verify-ownership.sh <branch> [<base>]
#   Default base: scaffold
#
# Checks:
# 1. No files outside the branch's allowed team paths
# 2. src/shared/ is frozen for all teams
# 3. No *Stub.ts / *Mock.ts under src/core/ or src/hooks/ (Article 10)
# 4. No src/core/*Registry.ts with local Map/Set state (detected by grep pattern)
#
# Exit 0 = clean, 1 = violation(s) found.
set -uo pipefail

BRANCH="${1:-}"
BASE="${2:-scaffold}"

if [ -z "$BRANCH" ]; then
  echo "usage: $0 <branch> [<base>]" >&2
  exit 2
fi

# Team -> allowed path patterns. Each pattern is a regex anchored at start-of-path.
# Paths that match ANY listed pattern for the branch's team are allowed.
declare -A ALLOWED
ALLOWED[core]='^src/core/|^tests/core/'
ALLOWED[systems]='^src/systems/|^tests/systems/'
ALLOWED[ui]='^src/components/|^src/hooks/|^src/styles/|^src/App\.tsx$|^src/main\.tsx$|^tailwind\.config\.ts$|^index\.html$|^public/|^tests/ui/'

TEAM="$BRANCH"
if [ -z "${ALLOWED[$TEAM]:-}" ]; then
  echo "unknown team branch: $BRANCH (expected core|systems|ui)" >&2
  exit 2
fi

# Get changed files between base and branch
CHANGED=$(git diff --name-only "$BASE..$BRANCH" 2>/dev/null || true)

if [ -z "$CHANGED" ]; then
  echo "ok: no files changed on $BRANCH vs $BASE"
  exit 0
fi

VIOLATIONS=0
report() {
  echo "VIOLATION: $1" >&2
  VIOLATIONS=$((VIOLATIONS + 1))
}

while IFS= read -r f; do
  [ -z "$f" ] && continue

  # Check 1: path must be allowed for this team
  if ! echo "$f" | grep -qE "${ALLOWED[$TEAM]}"; then
    report "$f — outside $TEAM team's allowed paths"
    continue
  fi

  # Check 2: src/shared/ frozen for everyone
  if echo "$f" | grep -qE '^src/shared/'; then
    report "$f — src/shared/ is frozen (Article 5)"
    continue
  fi

  # Check 3: no stub shadow files under src/core/ or src/hooks/
  #   Allowed exception: src/hooks/mockState.ts (explicitly permitted in team-ui.md)
  if echo "$f" | grep -qE '^(src/core|src/hooks)/.*[Ss]tub\.ts$'; then
    report "$f — stub-shadow file banned (Article 10)"
    continue
  fi
  if echo "$f" | grep -qE '^src/core/.*[Mm]ock\.ts$'; then
    report "$f — mock-shadow file banned (Article 10)"
    continue
  fi
  if echo "$f" | grep -qE '^src/hooks/.*[Mm]ock\.ts$' && [ "$f" != "src/hooks/mockState.ts" ]; then
    report "$f — mock-shadow file banned (Article 10)"
    continue
  fi

  # Check 4: *Registry.ts under src/core/ with local Map/Set = stub registry
  if echo "$f" | grep -qE '^src/core/.*Registry\.ts$'; then
    if [ -f "$f" ]; then
      if grep -qE 'new Map\(\)|new Set\(\)' "$f"; then
        report "$f — src/core/*Registry.ts with local Map/Set is a stub (Article 10); delegate to src/systems/"
        continue
      fi
    fi
  fi

done <<< "$CHANGED"

# Check 5: TODO-INTEGRATION markers must not survive into merge candidate
TODO_COUNT=$(git grep -c 'TODO-INTEGRATION' "$BRANCH" -- 'src/' 2>/dev/null | awk -F: '{sum+=$NF} END{print sum+0}')
if [ "${TODO_COUNT:-0}" -gt 0 ]; then
  echo "VIOLATION: $TODO_COUNT TODO-INTEGRATION markers in $BRANCH — replace with real imports before merge" >&2
  git grep -n 'TODO-INTEGRATION' "$BRANCH" -- 'src/' >&2 || true
  VIOLATIONS=$((VIOLATIONS + 1))
fi

if [ "$VIOLATIONS" -eq 0 ]; then
  echo "ok: $BRANCH clean ($(echo "$CHANGED" | wc -l) files)"
  exit 0
fi

echo "" >&2
echo "FAILED: $VIOLATIONS ownership violation(s) on $BRANCH" >&2
exit 1
