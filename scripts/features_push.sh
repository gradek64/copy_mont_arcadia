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

if [ -z "$branch" ]; then
  branch=$(git rev-parse --abbrev-ref HEAD)
fi

cd packages/monty-feature-flags



if [[ `git status --porcelain` ]]; then
  echo "Changes detected in monty-feature-flags!"
  echo "----------------------------------------"
  echo $(git status --porcelain)
  echo "----------------------------------------"

  echo -n "Would you like to push to $branch? [y/N]: "
  read -n 1 shouldPush
  echo ""
  if [ "$shouldPush" = "y" ]; then
    echo -ne "\nPlease enter a commit message: "
    read commitMessage
    echo -ne "\nPushing to branch - "$branch"\n Message: "$commitMessage"\n\nIs this correct? [y/N]"
    read -n 1 shouldPush
    echo ""
    if [ "$shouldPush" = "y" ]; then
      echo ""
      git commit -am "$commitMessage"
      
      if ! git push origin $branch; then
        echo "An error occurred pushing the branch to the remote, please handle manually"
        exit 1
      fi
    fi
  fi
fi
