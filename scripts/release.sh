#!/bin/sh

# abort on errors
set -e

echo "check out & sync main"
git checkout main
git pull

npx standard-version

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
  # Update the tag created by standard-version to point to the amended commit
  # Use -a to create an annotated tag so that --follow-tags will push it
  git tag -f -a "v$PACKAGE_VERSION" -m "chore(release): $PACKAGE_VERSION"
fi

echo "push tags"
git push --follow-tags

git checkout -
