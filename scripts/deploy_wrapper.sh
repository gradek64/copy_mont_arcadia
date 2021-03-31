#!/bin/bash
set -e
[ -n "$DOCKER_HUB_USERNAME" ] && docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD
#set -x

# This has been added in the User Data EC2 Instance section of AWS Monty-Dev
#yum install -y gettext
API_URL_VAR="API_URL_$API"
API_KEY_VAR="API_KEY_$API"
eval API_URL=\$$API_URL_VAR
eval API_KEY=\$$API_KEY_VAR

#Using IAM role now
#API_KEY_VAR="API_KEY_$API"
#eval API_KEY=\$$API_KEY_VAR

echo "API_URL:$API_URL & API_KEY:$API_KEY"

export GIT_COMMIT=$(git rev-parse HEAD)

docker ps -aq | xargs --no-run-if-empty docker stop
docker ps -aq | xargs --no-run-if-empty docker rm
# docker images | grep arcadiagroup/full-monty | awk "{print \$3}" | xargs --no-run-if-empty docker rmi
if [[ $DEPLOY_BRANCH_OR_TAG_OR_HASH =~ ^v[0-9]\. ]]; then
    VERSION=$DEPLOY_BRANCH_OR_TAG_OR_HASH
else
    VERSION=$GIT_COMMIT
fi
MONTY_DOCKERFILE=Dockerfile ./scripts/deploy.sh $VERSION $EB_ENVIRONMENT_NAME
