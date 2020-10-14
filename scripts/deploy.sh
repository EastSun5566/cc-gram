#!/bin/sh

# abort on errors
set -e

cd demo

# make sure pkg is latest version
npm i cc-gram@latest

# deploy
npm run deploy

cd -
