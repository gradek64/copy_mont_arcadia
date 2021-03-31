#!/bin/bash

echo 'Bumping npm version...'
NEW_VERSION=$(npm version --no-git-tag-version minor)

echo 'Creating new release branch...'
BRANCH_NAME=release/$NEW_VERSION

exists=`git show-ref refs/heads/$BRANCH_NAME`
if [ -n "$exists" ]; then
  echo 'Branch $BRANCH_NAME already exists'
  exit 1
fi

git checkout -b $BRANCH_NAME
git add ./package.json ./package-lock.json

SERVER_FILES_MODIFIED=$(git diff $(git describe --abbrev=0 --tags) | egrep "src/server|docs/schemas")

if [ -z "$SERVER_FILES_MODIFIED" ]
then
  echo 'Skipping swagger api docs'
else
  echo 'Generating swagger api docs...'

  npm run generate-api-docs
  git add ./swagger-ui/swagger.json
fi

echo 'Committing changes...'
git commit -m "Release $NEW_VERSION"
