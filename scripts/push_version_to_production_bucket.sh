#!/usr/bin/env bash

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 GIT_COMMIT_HASH_OR_TAG [EB_BUCKET]" >&2
  exit 1
fi
VERSION=$1
EB_BUCKET="${2:-elasticbeanstalk-eu-west-1-330032770480}"
MONTY_MEMORY_SIZE="${MONTY_MEMORY_SIZE:-2500}"

source "$(dirname $0)/lib/config.sh"
source "$(dirname $0)/lib/shell_utils.sh"
source "$(dirname $0)/lib/eb.sh"
source "$(dirname $0)/lib/docker.sh"
source "$(dirname $0)/lib/sns.sh"

require_env_var "DOCKER_HUB_USERNAME"
require_env_var "DOCKER_HUB_PASSWORD"

tag_exists_on_docker_hub $DOCKER_IMAGE_NAME $VERSION
if [ "$?" = 0 ]; then
  echo "The image $DOCKER_IMAGE_NAME already contains the tag $VERSION, continuing..."
else
  echo "The image $DOCKER_IMAGE_NAME doesn't contain the tag $VERSION, building and pushing it..."
  build_and_push $DOCKER_IMAGE_NAME $MONTY_LB_DOCKER_IMAGE_NAME $VERSION
fi

echo "Creating application version $VERSION..."
create_application_version $APPLICATION_NAME $VERSION $EB_BUCKET $MONTY_MEMORY_SIZE "production"

echo "Cleaning up current subscriptions for 'appConfig_prod' sns topic"
cleanup_previous_sns_subscriptions "appConfig_prod"
