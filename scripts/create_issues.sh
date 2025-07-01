#!/usr/bin/env bash

# create_issues.sh
# Description: Read issues from a text file (default: issues.txt) and create them on GitHub one by one.
# If the GitHub CLI (gh) is not installed or not authenticated, the script falls back to a dry-run mode
# and simply echoes the command that would be executed.

set -euo pipefail

# Determine where the script lives so we can reference the default issues file alongside it.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_ISSUES_FILE="$SCRIPT_DIR/issues.txt"

# Allow the caller to supply a custom issues file as the first argument, otherwise use the default.
ISSUES_FILE="${1:-$DEFAULT_ISSUES_FILE}"

if [[ ! -f "$ISSUES_FILE" ]]; then
  echo "Error: issues file not found -> $ISSUES_FILE" >&2
  exit 1
fi

# Use a temporary directory to store split entries.
TMPDIR="$(mktemp -d)"
# shellcheck disable=SC2064
trap "rm -rf \"$TMPDIR\"" EXIT

# Split the issues file on lines that contain only '---'.
# Each resulting chunk is written to $TMPDIR/issueN
awk -v RS='---' 'NF { print > (dir "/issue" NR) }' dir="$TMPDIR" "$ISSUES_FILE"

DRY_RUN=0
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) not found – switching to dry-run mode." >&2
  DRY_RUN=1
fi

COUNT=0
for CHUNK in "$TMPDIR"/issue*; do
  [[ ! -e "$CHUNK" ]] && continue  # No files matched (e.g. empty issues file)

  TITLE="$(grep -m1 '^title:' "$CHUNK" | sed 's/^title:[[:space:]]*//')"
  BODY="$(sed -n '/^body:/,$p' "$CHUNK" | sed '1d')"

  if [[ -z "$TITLE" ]]; then
    echo "Skipping an issue without a title in $CHUNK" >&2
    continue
  fi

  echo "Creating issue: $TITLE"

  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "[DRY RUN] gh issue create --title \"$TITLE\" --body \"$BODY\" --label todo"
  else
    gh issue create --title "$TITLE" --body "$BODY" --label "todo"
  fi

  COUNT=$((COUNT + 1))
  echo "---"
  # Small delay to avoid hitting secondary rate limits when creating many issues quickly.
  sleep 0.5
done

echo "Finished processing $COUNT issue(s)."