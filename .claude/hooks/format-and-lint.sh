#!/usr/bin/env bash
# PostToolUse (Edit|Write) — format and lint the single file that just changed.
#
# Without this the first signal is `bun run check` or CI, which batch every
# violation across the workspace. Silent when clean; exits 2 (stderr goes back
# to the agent) only when something survives the auto-fix.
set -uo pipefail

repo_root=$(cd "$(dirname "$0")/../.." && pwd)
file=$(jq -r '.tool_input.file_path // empty')

[ -n "$file" ] && [ -f "$file" ] || exit 0

abs=$(cd "$(dirname "$file")" && pwd)/$(basename "$file")

# Sessions also write to scratchpads and ~/.claude; leave those alone.
case "$abs" in
  "$repo_root"/*) ;;
  *) exit 0 ;;
esac

case "$abs" in
  */node_modules/* | */dist/* | */.angular/* | */.nx/* | */coverage/* | */test-results/* | */playwright-report/* | */bun.lock) exit 0 ;;
esac

# On success Prettier only echoes the filename; on failure its output is a
# parse or config error the agent has to see.
prettier="$repo_root/node_modules/.bin/prettier"
if [ -x "$prettier" ] && ! err=$("$prettier" --write --ignore-unknown "$abs" 2>&1 >/dev/null); then
  {
    echo "prettier could not format $file:"
    echo
    echo "$err"
  } >&2
  exit 2
fi

# .html is included for Angular templates (angular-eslint template rules).
case "$abs" in
  *.ts | *.mts | *.cts | *.js | *.mjs | *.cjs | *.html) ;;
  *) exit 0 ;;
esac

eslint="$repo_root/node_modules/.bin/eslint"
[ -x "$eslint" ] || exit 0

# ESLint 9 resolves flat config from the cwd, so run from the nearest project
# that has its own eslint.config.mjs (falls back to the root config).
dir=$(dirname "$abs")
while [ "$dir" != "$repo_root" ] && [ "$dir" != "/" ]; do
  ls "$dir"/eslint.config.* >/dev/null 2>&1 && break
  dir=$(dirname "$dir")
done

# Stylish output is empty for a clean file, which is the silence-on-success
# signal. --no-warn-ignored keeps files without a matching config quiet.
report=$(cd "$dir" && "$eslint" --fix --no-warn-ignored "$abs" 2>&1)
[ -n "$report" ] || exit 0

{
  echo "eslint could not auto-fix everything in $file:"
  echo
  echo "$report"
  echo
  echo "Fix these now — bun run check runs lint before tests and build."
} >&2
exit 2
