#!/bin/sh

# abort on errors
set -e

echo "check out & sync master"

git checkout master
git pull

echo "update & tag ${1:="patch"} version"

npm version $1

echo "push tags"

git push --follow-tags
git checkout -
