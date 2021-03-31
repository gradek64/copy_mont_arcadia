#!/bin/bash
set -e

[ -n "$DOCKER_HUB_USERNAME" ] && docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD

eval $(aws ecr get-login --region eu-west-1 --no-include-email)
set -x

export COMPOSE_PROJECT_NAME=fullmonty
export FORMATTED_BRANCH_NAME=${BRANCH_NAME//\//-} #replacing '/' with '-' as per docker tag name rules
export GIT_COMMIT=$(git rev-parse HEAD)
export AWS_REGION=eu-west-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')

source "$(dirname $0)/lib/docker.sh"
delete_ecr_images_except_current_commit ${AWS_ACCOUNT_ID}

touch .env .env-test-runner

[ 8121118 -eq "$(stat -c %s /usr/bin/docker-compose)" ] \
&& curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose \
&& chmod +x /usr/bin/docker-compose

if [[ "$@" =~ monty$ || "$@" =~ monty\  ]]; then
    # We're asked to build monty (and monty_tests which is dependency)
    # Exit if it already exists in ECR
    scripts/docker_tag_exists_on_ecr.sh monty ${GIT_COMMIT} \
    && echo "monty image is already built and pushed" && exit 0
else
    # We're asked to build monty_tests. Exit if it already exists in ECR
    scripts/docker_tag_exists_on_ecr.sh monty_tests ${GIT_COMMIT} \
    && echo "monty_tests image is already built and pushed" && exit 0
fi

# Use cached baselayer from develop branch to speed up npm install
for IMAGE in "$@" ; do
    if [[ "${IMAGE}" == "monty" ]]; then
        docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty:${FORMATTED_BRANCH_NAME} \
        || docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty:develop \
        || true
    fi

    if [[ "${IMAGE}" == "monty_tests" ]]; then
        docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty_tests:${FORMATTED_BRANCH_NAME} \
        || docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty_tests:develop \
        || true
    fi
done

if [[ "${BRANCH_NAME}" == "develop" ]]; then
    # Avoid docker-compose crash when BRANCH_NAME=develop and both cache_from entries are duplicates
    sed -e 's/          - ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com\/monty.*:develop//' -i docker-compose.yml
fi

if [ -f "scripts/write_version_info_file.sh" ]; then
  ./scripts/write_version_info_file.sh
  echo "EXIT CODE after generating version file: $?"
fi

docker-compose build --pull "$@"
docker-compose push "$@"

for IMAGE in "$@" ; do
    if [[ "${IMAGE}" == "monty" ]]; then
        docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty:${GIT_COMMIT} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty:${FORMATTED_BRANCH_NAME}
        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty:${FORMATTED_BRANCH_NAME}
    fi

    if [[ "${IMAGE}" == "monty_tests" ]]; then
        docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty_tests:${GIT_COMMIT} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty_tests:${FORMATTED_BRANCH_NAME}
        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty_tests:${FORMATTED_BRANCH_NAME}
    fi
done
