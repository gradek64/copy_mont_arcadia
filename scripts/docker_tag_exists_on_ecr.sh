#!/usr/bin/env bash
aws_ecr_curl() {
  login_cmd=$(aws ecr get-login --no-include-email)
  username=$(echo "$login_cmd" | cut -d " " -f 4)
  password=$(echo "$login_cmd" | cut -d " " -f 6)
  endpoint=$(echo "$login_cmd" | cut -d " " -f 9)

  args=("$@")
  args_length=${#args[@]}
  args_last=${args[$args_length-1]}
  unset 'args[${args_length}-1]'
  path="${args_last}"

  curl \
    -u "${username}:${password}" \
    "${args[@]}" \
    "${endpoint}${path}"
}

# Usage: docker_tag_exists somerepo sometag
#docker_tag_exists_on_ecr() {
  repo_name="$1"
  tag="$2"
  aws_ecr_curl \
    --head \
    --fail \
    -s \
    "/v2/${repo_name}/manifests/${tag}" \
    > /dev/null
#}
