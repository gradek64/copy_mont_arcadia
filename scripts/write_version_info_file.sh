#!/usr/bin/env sh
version=$(cat package.json | grep -o '"version": "[^"]*' | grep -o '[^\"]*$')
git_tag=$(git describe --abbrev=0 --tags --always)
date=$(git log -1 --pretty=format:%cD)
hash=$(git log -1 --pretty=format:%H)
echo "{ \"version\": \"$version (package.json)\", \"tag\": \"$git_tag\", \"date\": \"$date\", \"hash\": \"$hash\" }" > version.json
