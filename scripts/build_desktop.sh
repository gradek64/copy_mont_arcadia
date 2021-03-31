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
[[ ${GIT_BRANCH} == "origin/"* ]] && { E2E_ONLY=true; }
# Run additional desktop tests
[[ ${GIT_BRANCH} == *"/DES-"* ]] && { RUN_ADDITIONAL_DESKTOP_GUI_TESTS=true; }
[[ ${GIT_BRANCH} == *"/des-"* ]] && { RUN_ADDITIONAL_DESKTOP_GUI_TESTS=true; }
[[ ${GIT_BRANCH} == *"feature/desktop"* ]] && { RUN_ADDITIONAL_DESKTOP_GUI_TESTS=true; }
echo "RUN ADDITIONAL DESKTOP TESTS: ${RUN_ADDITIONAL_DESKTOP_GUI_TESTS}"

[ -z "$API" ] && export API=STAGE
[ -z "$BREAKPOINT" ] && export BREAKPOINT=desktop
[[ ${API} == "STAGE" ]] && { SHORT_TIMEOUT=5000; }
# Localisation E2E branches to run on tsfr
# [[ ${GIT_BRANCH} == "origin/e2e/loc-"* ]] && { WDIO_BRAND="tsfr"; }

API_URL_VAR="API_URL_$API"
eval API_URL=\$$API_URL_VAR
API_KEY_VAR="API_KEY_$API"
eval API_KEY=\$$API_KEY_VAR

echo "GIT_BRANCH:" ${GIT_BRANCH}
touch .env .env-test-runner

[ 8121118 -eq "$(stat -c %s /usr/bin/docker-compose)" ] \
&& curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose \
&& chmod +x /usr/bin/docker-compose

if [[ "${BRANCH_NAME}" == "develop" ]]; then
    # Avoid docker-compose crash when BRANCH_NAME=develop and both cache_from entries are duplicates
    sed -e 's/          - ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com\/monty.*:develop//' -i docker-compose.yml
fi

docker-compose down
docker ps -aq | xargs --no-run-if-empty docker stop \
&& docker ps -a -q --no-trunc --filter "status=exited" | xargs --no-run-if-empty docker rm -v \
&& docker volume ls -qf "dangling=true" | xargs --no-run-if-empty docker volume rm \
&& docker images -q --no-trunc --filter "dangling=true" | xargs --no-run-if-empty docker rmi -f

echo "API_URL:$API_URL"
echo "FEATURE TAG SET:$CUCUMBER_TAGS"
echo "BASE URL:$BASE_URL"
echo "BASE URL PORT:$BASE_URL_PORT"
echo "DEBUG:$DEBUG"
echo "FEATURES_PATH:$FEATURES_PATH"

# docker-compose build && DEBUG=$DEBUG docker-compose run monty_tests
# if [ "$ENABLE_DEBUG" = "true" ]; then
#   docker-compose logs monty
# fi

# NB: Only run outputMontyLog when monty_tests fails
function outputMontyLog {
  echo "EXIT CODE OF PREVIOUS COMMAND: $?"
  if [ "$ENABLE_DEBUG" = "true" ]; then
    docker-compose logs monty > test/e2e/logs/monty.log
      # exit code required else build will pass
  fi
    exit 1
}

if [ -f "scripts/write_version_info_file.sh" ]; then
  ./scripts/write_version_info_file.sh
fi

source "$(dirname $0)/lib/docker.sh"
delete_ecr_images_except_current_commit

docker-compose pull --parallel monty_cache monty monty_tests_cache monty_tests
NODE_ENV=production docker-compose run --rm monty_tests docker/run_tests.sh "$@" || outputMontyLog
echo "EXIT CODE OF AFTER COMMAND: $?"
