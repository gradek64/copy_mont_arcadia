#!/bin/bash
source "$(dirname $0)/lib/shell_utils.sh"

function tag_exists_on_docker_hub()
{
  image=$1
  tag=$2
  token="$(curl -sSL -u $DOCKER_HUB_USERNAME:$DOCKER_HUB_PASSWORD "https://auth.docker.io/token?service=registry.docker.io&scope=repository:$image:pull" | get_value_of_json_key 'token')"
  curl -fsSL -H "Authorization: Bearer $token" "https://index.docker.io/v2/$image/manifests/$tag" > /dev/null
}

function build_and_push()
{
  image=$1
  monty_lb_image=$2
  tag=$3
  current_sha1=$(git rev-parse HEAD)
  current_tag=$(git describe --tags --exact-match)
  current_branch=$(git name-rev --name-only HEAD)

  if [[ "$current_sha1" != "$tag" ]] && [[ $current_tag != *$tag ]] && [[ $current_branch != *$tag ]]; then
    echo "Your git's HEAD needs to match the requested deployment ($tag), please run \"git checkout $tag\""
    exit 1
  fi

  scripts/write_version_info_file.sh

  docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t $image:$tag . && \
  docker push $image:$tag

  if [ "$?" != 0 ]; then
    echo "building or pushing to docker hub has failed"
    exit 1
  fi
}

function delete_ecr_images_except_current_commit()
{
  AWS_ACCOUNT_ID=${1:-623971903498}
  docker image prune -f
  docker volume prune -f
  echo "Deleting monty* ECR images from previous builds..."
  docker images ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/monty* --format "{{.ID}} {{.Tag}}" | grep -v -e develop -e latest -e ${GIT_COMMIT} -e ${BRANCH_NAME} | awk '{print $1}' | xargs --no-run-if-empty docker image rm || true
}
