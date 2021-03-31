#!/usr/bin/env bash

function create_deployment_notification()
{
  application_id=$1
  api_key=$2
  version=$3
  user=$4

  curl -X POST "https://api.newrelic.com/v2/applications/${application_id}/deployments.json" \
  -H "X-Api-Key:${api_key}" \
  -H 'Content-Type: application/json' \
  -d "{\"deployment\": {\"revision\": \"${version}\", \"user\": \"${user}\"}}"
}
