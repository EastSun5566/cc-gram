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
node -e "const fs = require('fs'); const jsr = JSON.parse(fs.readFileSync('jsr.json', 'utf8')); jsr.version = process.argv[1]; fs.writeFileSync('jsr.json', JSON.stringify(jsr, null, 2) + '\n');" "$PACKAGE_VERSION"
git add jsr.json
git commit --amend --no-edit

echo "push tags"
git push --follow-tags

git checkout -
