#!/usr/bin/env bash

cd "$(dirname "$0")"

args=`getopt b:h $*`

usage() { echo "Usage: $0 [-h] [-b <develop>] " 1>&2; exit 1; }
set -- $args

for i
do
  case "$i" in
  -b)
    branch="$2"; shift;
    shift;;
  -h)
    usage
    ;;
  esac
done

cd ..

# If no branch provided, attempt to use full_monty branch for monty-feature-flags
if [ -z "$branch" ]; then
  branch=$(git rev-parse --abbrev-ref HEAD)
fi
 

cd packages/monty-feature-flags
git fetch

echo "Checking out $branch (monty-feature-flags)"
git checkout -B $branch 2>&1 | sed 's/^/|monty-feature-flags|    /'
git rebase origin/develop 2>&1 | sed 's/^/|monty-feature-flags|    /'
 
