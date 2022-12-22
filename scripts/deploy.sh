#!/bin/sh

# abort on errors
set -e

cd demo

# make sure pkg is latest version
pnpm i cc-gram@latest

# deploy
pnpm run deploy

cd -
