#!/bin/sh

# abort on errors
set -e

echo "check out & sync main"
git checkout main
git pull

npx standard-version

echo "push tags"
git push --follow-tags

git checkout -
