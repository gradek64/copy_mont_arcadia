#!/bin/bash
function get_value_of_json_key()
{
  json_key=$1
  grep -o "\"$json_key\":\s\?\"[^\",]*" | grep -o "[^\"]*$"
}

function require_env_var()
{
  requiredEnvVar=$1
  if [ "${!requiredEnvVar}" = "" ]; then
    echo "Environment variable $requiredEnvVar must be set and not empty." >&2
    exit 1
  fi
}

function sedeasy()
{
  sed -i "s/$(echo $1 | sed -e 's/\([[\/.*]\|\]\)/\\&/g')/$(echo $2 | sed -e 's/[\/&]/\\&/g')/g" $3
}

function email_environment_manager()
{
  EMAIL=$1
  APP=$2
  INSTANCE_SIZE=$3
  TRIGGERED=$4
  sendmail -vt <<EOF
To: ${EMAIL}
Subject: Full-Monty Environment Created
From: jenkins@digital.arcadiagroup.co.uk

New full-monty environment deployed: ${APP}
Instance type: ${INSTANCE_SIZE}
By: ${TRIGGERED}

EOF
}
