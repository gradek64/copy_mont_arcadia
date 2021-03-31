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

# If no branch provided, use develop for monty-feature-flags
if [ -z "$branch" ]; then
  branch="develop"
fi

echo Using branch "'"$branch"'"

if [ ! -d "./packages/monty-feature-flags" ]; then
  git clone git@github.com:ag-digital/monty-feature-flags.git ./packages/monty-feature-flags
fi
cd ./packages/monty-feature-flags
git checkout -B $branch 2>&1 | sed 's/^/|monty-feature-flags|    /'
git pull origin $branch 2>&1 | sed 's/^/|monty-feature-flags|    /'
