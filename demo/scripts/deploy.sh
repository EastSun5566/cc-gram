#!/usr/bin/env sh

# abort on errors
set -e

# build parent package first to ensure dist files exist
cd ..
pnpm build
cd demo

# build demo
pnpm build

# navigate into the build output directory
cd dist

git init
git checkout -B main
git add -A
git commit -m 'chore: deploy demo'

git push -f git@github.com:EastSun5566/cc-gram.git main:gh-pages

cd -
