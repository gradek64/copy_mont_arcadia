#!/bin/bash

set -x

[ -n "$DOCKER_HUB_USERNAME" ] && docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD

EB_ENVIRONMENT_NAME_1="production-json"
EB_ENVIRONMENT_NAME_2="production-json-g"
GREEN_ENV_URL="production-json-g"
APPLICATION_NAME="full-monty"
EB_BUCKET="elasticbeanstalk-eu-west-1-330032770480"
MONTY_MEMORY_SIZE="1500"


source "$(dirname $0)/lib/shell_utils.sh"
source "$(dirname $0)/lib/eb.sh"
source "$(dirname $0)/lib/config.sh"

export GIT_COMMIT=$(git rev-parse HEAD)

docker ps -aq | xargs --no-run-if-empty docker stop
docker ps -aq | xargs --no-run-if-empty docker rm
docker images -q | grep arcadiagroup/full-monty | xargs --no-run-if-empty docker rmi
if [[ $DEPLOY_BRANCH_OR_TAG_OR_HASH =~ v[0-9]\. ]]; then
    VERSION=$DEPLOY_BRANCH_OR_TAG_OR_HASH
else
    VERSION=$GIT_COMMIT
fi

echo "Determining which environment is live..."
env_1=$(get_environment_info $EB_ENVIRONMENT_NAME_1 | get_value_of_json_key "CNAME")
env_2=$(get_environment_info $EB_ENVIRONMENT_NAME_2 | get_value_of_json_key "CNAME")

if [[ $env_1 == ${GREEN_ENV_URL}* ]]; then
  deploy_into_next_prod $EB_ENVIRONMENT_NAME_1
else
  deploy_into_next_prod $EB_ENVIRONMENT_NAME_2
fi
