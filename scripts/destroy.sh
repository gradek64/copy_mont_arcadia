#!/bin/bash

# Assume the role of the account where the deployment steps will take place
# clear any AWS keys first to avoid issues.
# Running as ASSUME_ROLE=false ./destroy.sh
ASSUME_ROLE=${ASSUME_ROLE:-true}

if [ "${ASSUME_ROLE}" == "true" ]; then
  unset AWS_ACCESS_KEY_ID
  unset AWS_SECRET_ACCESS_KEY
  unset AWS_SESSION_TOKEN
  unset AWS_DEFAULT_REGION

  aws_assume_role_json=$(aws sts assume-role --role-arn $AWS_DEPLOY_ROLE_ARN --role-session-name JenkinsSlaveDeploymentRole)

  export AWS_ACCESS_KEY_ID=$(echo $aws_assume_role_json | jq -r .Credentials.AccessKeyId)
  export AWS_SECRET_ACCESS_KEY=$(echo $aws_assume_role_json | jq -r .Credentials.SecretAccessKey)
  export AWS_SESSION_TOKEN=$(echo $aws_assume_role_json | jq -r .Credentials.SessionToken)
  export AWS_DEFAULT_REGION=eu-west-1
fi

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 EB_ENVIRONMENT_NAME" >&2
  exit 1
fi
EB_ENVIRONMENT_NAME=$1

source "$(dirname $0)/lib/config.sh"
source "$(dirname $0)/lib/shell_utils.sh"
source "$(dirname $0)/lib/eb.sh"
source "$(dirname $0)/lib/sns.sh"
source "$(dirname $0)/lib/route53.sh"
source "$(dirname $0)/lib/elasticache.sh"
source "$(dirname $0)/lib/dynamodb.sh"

cache_cluster_exists $EB_ENVIRONMENT_NAME
if [ "$?" != 0 ]; then
  echo "elasticache cluster $EB_ENVIRONMENT_NAME doesn't exist"
else
  delete_cache_cluster $EB_ENVIRONMENT_NAME
fi

environment_exists $EB_ENVIRONMENT_NAME
if [ "$?" = 0 ]; then
  echo "destroying environment $EB_ENVIRONMENT_NAME..."
  environment_id=$(destroy_environment $EB_ENVIRONMENT_NAME | get_value_of_json_key "EnvironmentId")
  wait_for_environment_state $environment_id "Terminated"
  for environment_subdomain in "${ENVIRONMENT_SUBDOMAINS[@]}"
  do
    destroy_dns_alias $EB_ENVIRONMENT_DOMAIN $environment_subdomain$ROUTE53_ZONE_DOMAIN $ROUTE53_ZONE_ID > /dev/null
  done
  if [ "$?" = 0 ]; then
    echo "The environment $EB_ENVIRONMENT_NAME has been destroyed!"
  else
    echo "Something went wrong, exiting..."
    exit 1
  fi
else
  echo "environment $EB_ENVIRONMENT_NAME does not exist!"
  echo "WARN - This is not usually a Jenkins issue, it means Jenkins cannot find the environment: ${EB_ENVIRONMENT_NAME}"
  exit 1
fi

for table in $DYNAMODB_TABLES; do
  table_name=`printf "%s_$EB_ENVIRONMENT_NAME" "$table"`
  if [ $(dynamodb_table_exists $table_name) == "true" ]; then
    delete_dynamodb_table $table_name
  else
    echo "dynamodb table with name $table_name doesn't exist"
  fi
done

declare "app_config_sns_topic_name=appConfig_$EB_ENVIRONMENT_NAME"
sns_topic_exists $app_config_sns_topic_name
if [ "$?" = 0 ]; then
  echo "destroying $app_config_sns_topic_name sns topic..."
  destroy_sns_topic $app_config_sns_topic_name
else
  echo "$app_config_sns_topic_name sns topic does not exist!"
fi
