#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  ./scripts/sync_from_B.sh [--dry-run]
#
# Copies files from vendor/B into the repository root while preserving
# C-specific overlays. By default performs a dry-run; remove --dry-run to execute.

DRY_RUN=1
if [[ "${1:-}" == "--apply" ]]; then
  DRY_RUN=0
fi

SRC_DIR="vendor/B"
EXCLUDES=(
  ".git"
  ".github/workflows"
  "adhoc"
  "backup_b_candidates"
  "node_modules"
)

RSYNC_EXCLUDE_ARGS=()
for e in "${EXCLUDES[@]}"; do
  RSYNC_EXCLUDE_ARGS+=(--exclude="$e")
done

RSYNC_OPTS=( -av --delete )
if [[ $DRY_RUN -eq 1 ]]; then
  echo "Performing dry-run sync from $SRC_DIR to repo root (no files will be modified)."
  RSYNC_OPTS+=(--dry-run)
fi

echo "rsync ${RSYNC_OPTS[*]} ${RSYNC_EXCLUDE_ARGS[*]} $SRC_DIR/ ./"
rsync "${RSYNC_OPTS[@]}" "${RSYNC_EXCLUDE_ARGS[@]}" "$SRC_DIR/" ./

echo
if [[ $DRY_RUN -eq 1 ]]; then
  echo "Dry-run complete. Inspect changes, then run with --apply to perform actual sync."
else
  echo "Sync applied. Review changes and commit."
fi
