#!/bin/sh

# abort on errors
set -e

cd demo

# make sure pkg is latest version
yarn add cc-gram

# deploy
yarn deploy

cd -
