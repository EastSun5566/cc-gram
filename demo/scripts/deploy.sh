#!/bin/sh

# abort on errors
set -e

# verify script is run from demo directory
if [ ! -f "package.json" ] || [ ! -d "../src" ]; then
  echo "Error: This script must be run from the demo directory" >&2
  exit 1
fi

# build parent package first to ensure dist files exist
cd .. || exit 1
pnpm build
cd demo || exit 1

# build demo
pnpm build

# navigate into the build output directory
cd dist || exit 1
DIST_DIR="$(pwd)"

# setup cleanup function to remove git metadata
cleanup() {
  if [ -d "${DIST_DIR}/.git" ]; then
    rm -rf "${DIST_DIR}/.git"
  fi
}

# ensure cleanup happens on exit
trap cleanup EXIT

git init
git checkout -B main
git add -A
git commit -m 'chore: deploy demo'

git push -f git@github.com:EastSun5566/cc-gram.git main:gh-pages

# return to demo directory
cd ..
