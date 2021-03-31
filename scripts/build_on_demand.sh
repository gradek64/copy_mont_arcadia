#!/usr/bin/env bash
set -e
[ -n "$DOCKER_HUB_USERNAME" ] && docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD
eval $(aws ecr get-login --region eu-west-1 --no-include-email)
set -x

export COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME:-fullmonty}
export FORMATTED_BRANCH_NAME=${BRANCH_NAME//\//-} #replacing '/' with '-' as per docker tag name rules
export GIT_COMMIT=$(git rev-parse HEAD)
export AWS_REGION=eu-west-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')

[[ ${ENABLE_DEBUG} = "true" ]] && { DEBUG="monty:*"; }
[[ ${TEST_COVERAGE} != "true" ]] && { CI="false"; }

echo ${GIT_BRANCH}
# Run E2E test only if code change is from e2e/ branch
[[ ${GIT_BRANCH} == "origin/e2e/"* ]] && { E2E_ONLY=true; }

[ -z "$API" ] && export API=STAGE
[ -z "$BREAKPOINT" ] && export BREAKPOINT=mobileM
API_URL_VAR="API_URL_$API"
eval API_URL=\$$API_URL_VAR
API_KEY_VAR="API_KEY_$API"
eval API_KEY=\$$API_KEY_VAR
export CMS_TEST_MODE=true

[ 8121118 -eq "$(stat -c %s /usr/bin/docker-compose)" ] \
&& curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose \
&& chmod +x /usr/bin/docker-compose

if [[ "${BRANCH_NAME}" == "develop" ]]; then
    # Avoid docker-compose crash when BRANCH_NAME=develop and both cache_from entries are duplicates
    sed -e 's/          - ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com\/monty.*:develop//' -i docker-compose.yml
fi

touch .env .env-test-runner
docker-compose down --remove-orphans
docker ps -aq | xargs --no-run-if-empty docker stop \
&& docker ps -a -q --no-trunc --filter "status=exited" | xargs --no-run-if-empty docker rm -v \
&& docker volume ls -qf "dangling=true" | xargs --no-run-if-empty docker volume rm \
&& docker images -q --no-trunc --filter "dangling=true" | xargs --no-run-if-empty docker rmi -f

echo "GIT_BRANCH:" ${GIT_BRANCH}
echo "[API_URL] $API_URL"
echo "BASE_URL:$BASE_URL"
echo "BASE_URL_PORT:$BASE_URL_PORT"
echo "DEBUG:$DEBUG"
echo "E2E_ONLY:$E2E_ONLY"
echo "FEATURE_TAG:$CUCUMBER_TAGS"
echo "FEATURES_PATH:$FEATURES_PATH"
echo "CUCUMBER_TAGS:$CUCUMBER_TAGS"
echo "WDIO_CONFIG_FILEPATH:$WDIO_CONFIG_FILEPATH"
echo "BUILD_NUMBER:$BUILD_NUMBER"
echo "BUILD_ID:$BUILD_ID"
echo "BUILD_TAG:$BUILD_TAG"

# Execute when monty_tests fails
function handleBuildFailure() {
    echo "EXIT CODE OF PREVIOUS COMMAND: $?"
  if [ "$ENABLE_DEBUG" = "true" ]; then
    docker-compose logs monty > test/e2e/logs/monty.log
  fi

  # exit code required else build will pass
    exit 1
}

if [ -f "scripts/write_version_info_file.sh" ]; then
  ./scripts/write_version_info_file.sh
  echo "EXIT CODE after generating version file: $?"
fi

source "$(dirname $0)/lib/docker.sh"
delete_ecr_images_except_current_commit ${AWS_ACCOUNT_ID}

if [[ $@ == *"smoke"* ]]; then
  # Remove links to monty container which is not built.
  # It requires webpack to have run which we only do for e2e
  grep -v -e '^        - monty$' -e '^        - monty:' docker-compose.yml > docker-compose-lite.yml

  docker-compose pull --parallel monty_tests monty_tests_cache
  NODE_ENV=production docker-compose -f docker-compose-lite.yml run --rm monty_tests docker/run_tests.sh "$@" || handleBuildFailure

elif [[ $# -eq 0 || $@ == *"e2e"* ]]; then
  docker-compose pull --parallel monty_cache monty monty_tests_cache monty_tests
  NODE_ENV=production docker-compose run --rm monty_tests docker/run_tests.sh e2e || handleBuildFailure

elif [[ $# -eq 0 || $@ == *"coreapiintegration"* ]]; then
  docker-compose pull --parallel monty_cache monty monty_tests_cache monty_tests
  NODE_ENV=production docker-compose run --rm monty_tests docker/run_tests.sh coreapiintegration || handleBuildFailure
else
  # Remove links to monty container which is not built.
  # It requires webpack to have run which we only do for e2e
  grep -v -e '^        - monty$' -e '^        - monty:' docker-compose.yml > docker-compose-lite.yml

  docker-compose pull --parallel monty_tests monty_tests_cache
  NODE_ENV=production docker-compose -f docker-compose-lite.yml run --rm monty_tests docker/run_tests.sh "$@" || handleBuildFailure
fi
echo "EXIT CODE OF AFTER COMMAND: $?"
