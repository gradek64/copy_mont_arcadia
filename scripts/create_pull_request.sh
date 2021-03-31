#!/bin/bash

branch=$1

if git log -1 | grep -q Finishes ; then
  hub pull-request -m $branch -b develop -h $branch
else
  echo "Refuse to create PR on github for a failed build"
fi
