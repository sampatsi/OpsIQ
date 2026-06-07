#!/bin/bash
# Runs lint + build before git commit in opsiq-ui.
set -euo pipefail

input=$(cat)
command=$(python3 -c "import json,sys; print(json.load(sys.stdin).get('command',''))" <<< "$input")

# Only gate git commit from this repo
if [[ ! "$command" =~ git[[:space:]]+commit ]]; then
  echo '{ "permission": "allow" }'
  exit 0
fi

if [[ ! -f package.json ]] || ! grep -q '"name": "opsiq-ui"' package.json 2>/dev/null; then
  echo '{ "permission": "allow" }'
  exit 0
fi

log=$(mktemp)
if npm run check >"$log" 2>&1; then
  echo '{ "permission": "allow" }'
  rm -f "$log"
  exit 0
fi

tail -40 "$log" >&2
rm -f "$log"

python3 - <<'PY'
import json
print(json.dumps({
    "permission": "deny",
    "user_message": "Commit blocked: `npm run check` failed (lint or build). Fix errors, or run the opsiq-smoke-test skill if API/agent changes were made.",
    "agent_message": "Pre-commit check failed. Run `npm run check` in opsiq-ui, fix lint/build errors, then retry the commit. For agent/API changes, also run the opsiq-smoke-test skill.",
}))
PY
