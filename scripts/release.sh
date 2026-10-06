#!/bin/sh

set -eu

branch=$(git symbolic-ref --short HEAD)
[ "$branch" = main ] || { echo "release must start on main (got $branch)" >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "working tree must be clean" >&2; exit 1; }
git fetch origin main
[ "$(git rev-parse main)" = "$(git rev-parse origin/main)" ] || { echo "main does not match origin/main" >&2; exit 1; }
pnpm verify:release
pnpm exec standard-version

# Sync jsr.json version with package.json
echo "syncing jsr.json version with package.json"
PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_VERSION="$PACKAGE_VERSION" node -e "
const fs = require('fs');
const jsr = JSON.parse(fs.readFileSync('jsr.json', 'utf8'));
jsr.version = process.env.PACKAGE_VERSION;
fs.writeFileSync('jsr.json', JSON.stringify(jsr, null, 2) + '\n');
"

# Check if jsr.json was modified
if git diff --quiet jsr.json; then
  echo "jsr.json version already in sync"
else
  echo "updating release commit to include jsr.json"
  git add jsr.json
  git commit --amend --no-edit
  git tag -f -a "v$PACKAGE_VERSION" -m "chore(release): $PACKAGE_VERSION"
fi
echo "Release prepared locally: v$PACKAGE_VERSION. Push manually after review."
