#!/bin/bash
[ -n "$DOCKER_HUB_USERNAME" ] && docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD
#set -x

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 VERSION EB_ENVIRONMENT_NAME [EB_BUCKET] [MANAGE_CACHE_SERVER (default: true)] [MANAGE_DNS (default: true)] [MANAGE_DYNAMODB (default: true)] [MANAGE_SNS (default:true)]" >&2
  exit 1
fi
VERSION=$1
EB_ENVIRONMENT_NAME=$2
EB_BUCKET="${3:-elasticbeanstalk-eu-west-1-623971903498}"
MANAGE_CACHE="${4:-true}"
MANAGE_DNS="${5:-true}"
MANAGE_DYNAMODB="${6:-true}"
MANAGE_SNS="${7:-true}"
MONTY_MEMORY_SIZE="${MONTY_MEMORY_SIZE:-512}"
MONTY_ASSETS_BUCKET="${8:-ag-monty-dev-assets-repo20181017115138062800000001}"

if [[ "${#EB_ENVIRONMENT_NAME}" -lt 4 ]]; then
  echo "Please enter an environment name of at least 4 characters"
  exit 1
fi

source "$(dirname $0)/lib/config.sh"
source "$(dirname $0)/lib/shell_utils.sh"
source "$(dirname $0)/lib/eb.sh"
source "$(dirname $0)/lib/route53.sh"
source "$(dirname $0)/lib/docker.sh"
source "$(dirname $0)/lib/elasticache.sh"
source "$(dirname $0)/lib/newrelic.sh"
source "$(dirname $0)/lib/dynamodb.sh"
source "$(dirname $0)/lib/sns.sh"
source "$(dirname $0)/lib/sg.sh"
source "$(dirname $0)/lib/cwl.sh"

# tag_exists_on_docker_hub $DOCKER_IMAGE_NAME $VERSION
# if [ "$?" = 0 ]; then
#   echo "The image $DOCKER_IMAGE_NAME already contains the tag $VERSION, continuing..."
# else
# echo "The image $DOCKER_IMAGE_NAME doesn't contain the tag $VERSION, building and pushing it..."
echo "Building and pushing: $DOCKER_IMAGE_NAME with version tag: $VERSION"
build_and_push $DOCKER_IMAGE_NAME $MONTY_LB_DOCKER_IMAGE_NAME $VERSION
# fi

if [ "$?" != 0 ]; then
  echo "something when wrong, exiting..."
  exit 1
fi

rm -fr assets_tmp
mkdir assets_tmp
docker create --name $VERSION $DOCKER_IMAGE_NAME:$VERSION /bin/true
docker start $VERSION
docker cp $VERSION:/monty/public assets_tmp/assets
docker stop $VERSION
docker rm $VERSION
aws s3 sync --acl private --metadata "git=${VERSION},environment=${EB_ENVIRONMENT_NAME}" assets_tmp s3://${MONTY_ASSETS_BUCKET}

echo "Creating application version $VERSION..."
create_application_version $APPLICATION_NAME $VERSION $EB_BUCKET $MONTY_MEMORY_SIZE $EB_ENVIRONMENT_NAME

# Check for environment count
environment_limit_hit $APPLICATION_NAME
STOP_NEW=$?

if [ "$MANAGE_CACHE" = "true" ]; then
  cache_cluster_exists $EB_ENVIRONMENT_NAME
  if [ "$?" != 0 ]; then
    # Condition check for both vars to evaluate to true
    if [ $STOP_NEW = 0 ] && [ "$CREATE_CACHE_INSTANCE" = "true" ]; then
      NEW_CLUSTER=0
      echo "elasticache cluster $EB_ENVIRONMENT_NAME doesn't exist, creating it..."
      create_cache_cluster $EB_ENVIRONMENT_NAME
      wait_for_cache_cluster_creation $EB_ENVIRONMENT_NAME
    elif [ $STOP_NEW = 1 ]; then
      echo "Over limit, not creating cluster"
      echo "Assigning DEVELOPMENT DEFAULT cache cluster"
    else
      echo "Assigning DEVELOPMENT DEFAULT cache cluster"
    fi
  else
    echo "elasticache cluster $EB_ENVIRONMENT_NAME already exists"
  fi
  # Default Redis cluster
  REDIS_URL="tcp://development-default.wsfxoz.ng.0001.euw1.cache.amazonaws.com:6379"
  REDIS_HOST_FOR_SESSION_STORE="development-default.wsfxoz.ng.0001.euw1.cache.amazonaws.com"
  if [ "$NEW_CLUSTER" = 0 ]; then
    # New Redis cluster
    REDIS_URL=tcp://$(get_cache_cluster_info $EB_ENVIRONMENT_NAME | get_value_of_json_key "Address"):6379
    REDIS_HOST_FOR_SESSION_STORE=$(get_cache_cluster_info $EB_ENVIRONMENT_NAME | get_value_of_json_key "Address")
  fi
fi

declare "app_config_sns_topic_name=appConfig_$EB_ENVIRONMENT_NAME"
if [ "$MANAGE_SNS" = "true" ]; then
  sns_topic_exists $app_config_sns_topic_name
  if [ "$?" -eq 0 ]; then
    echo "$app_config_sns_topic_name sns topic already exists"
    echo "cleaning up current subscriptions for $app_config_sns_topic_name sns topic"
    cleanup_previous_sns_subscriptions $app_config_sns_topic_name
  else
    if [ $STOP_NEW = 0 ]; then
      echo "$app_config_sns_topic_name sns topic doesn't exist, creating it..."
      create_sns_topic $app_config_sns_topic_name
    else
      echo "Over limit, not creating SNS topic."
    fi
  fi
  APP_CONFIG_SNS_TOPIC_ARN=$(get_sns_topic_arn $app_config_sns_topic_name)
fi

if [ "$MANAGE_DYNAMODB" = "true" ]; then
  for table in $DYNAMODB_TABLES; do
    table_name=`printf "%s_$EB_ENVIRONMENT_NAME" "$table"`
    if [ $(dynamodb_table_exists $table_name) == "true" ]; then
      echo "dynamodb table $table_name already exists, not touching current data in it..."
    else
      if [ $STOP_NEW = 0 ]; then
        echo "dynamodb table with name $table_name doesn't exist, creating it..."
        declare "attribute_definitions_variable=${table}_attribute_definitions"
        declare "key_schema_variable=${table}_key_schema"
        create_dynamodb_table $table_name "${!attribute_definitions_variable}" "${!key_schema_variable}"
        wait_for_dynamodb_table_creation $table_name
        tag_dynamodb_table $table_name $EB_ENVIRONMENT_NAME
        seed_dynamodb_table_data $table_name $table
      else
        echo "Over limit, not creating DynamoDB table."
      fi
    fi
  done
  APP_CONFIG_TABLENAME=`printf "%s_$EB_ENVIRONMENT_NAME" "appConfig"`
fi

log_groups=( "full-monty-metricbeat" "full-monty-app" "full-monty-lb" )
for i in "${log_groups[@]}"
do
	check_cloudwatchlog_group $i
  if [ "$?" != 0 ]; then
    echo "Creating CloudWatch Log Group..."
    create_cloudwatchlog_group $i
  fi
done

environment_exists $EB_ENVIRONMENT_NAME
if [ "$?" != 0 ]; then
  if [ $STOP_NEW = 0 ]; then
    echo "elasticbeanstalk environment with name $EB_ENVIRONMENT_NAME doesn't exist, creating it..."
    environment_id=$(create_environment $EB_ENVIRONMENT_NAME $APPLICATION_NAME "${EB_ENVIRONMENT_NAME} - ${VERSION}" | get_value_of_json_key "EnvironmentId")
    wait_for_environment_state $environment_id "Ready"
    email_environment_manager $ENV_MANAGER_EMAIL $EB_ENVIRONMENT_NAME $INSTANCE_SIZE "${BUILD_USER} ${BUILD_USER_EMAIL}"
  else
    echo "Over maximum environment limit"
    aws elasticbeanstalk describe-environments --application-name $APPLICATION_NAME --query "Environments[*].[EnvironmentName, DateCreated, DateUpdated] | sort_by(@, &[0])" --output table
    exit 1
  fi
else
  echo "elasticbeanstalk environment with name $EB_ENVIRONMENT_NAME already exists, waiting for it to be ready and then deploying $VERSION to it..."
  environment_id=$(get_environment_info $EB_ENVIRONMENT_NAME | get_value_of_json_key "EnvironmentId")
  wait_for_environment_state $environment_id "Ready"
  environment_id=$(update_environment $EB_ENVIRONMENT_NAME "${EB_ENVIRONMENT_NAME} - ${VERSION}" | get_value_of_json_key "EnvironmentId")
  wait_for_environment_state $environment_id "Ready"
  deployed_version=$(get_deployed_version_by_environment_id $environment_id)
  if [ "${deployed_version}" != "${EB_ENVIRONMENT_NAME} - ${VERSION}" ]; then
    echo "Deployment failed! Previous version (${deployed_version}) is still in the ${EB_ENVIRONMENT_NAME} environment"
    exit 1
  fi
  if [[ "$NEWRELIC_APPLICATION_ID" != "" ]] && [[ "$NEWRELIC_API_KEY" != "" ]]; then
    create_deployment_notification $NEWRELIC_APPLICATION_ID $NEWRELIC_API_KEY $VERSION $DEPLOYMENT_USER
  fi
fi
# right, so no matter if we published new or updated old, failed or not, lets try to spotify this
# arn:aws:sns:eu-west-1:623971903498:monty-dev-spotify-instances
SPOTIFY_TOPIC_ARN="arn:aws:sns:eu-west-1:623971903498:monty-dev-spotify-instances"
aws sns publish --topic-arn ${SPOTIFY_TOPIC_ARN} --message "monty_deploy invoke" --message-attributes="{\"name\":{\"DataType\":\"String\",\"StringValue\":\"${EB_ENVIRONMENT_NAME}\"}}"

if [ "$MANAGE_DNS" = "true" ]; then
  # update DNS entries every time, as to guarantee old envs still get new additions
  for environment_subdomain in "${ENVIRONMENT_SUBDOMAINS[@]}"
  do
    change_id=$(create_dns_alias $EB_ENVIRONMENT_DOMAIN $environment_subdomain$ROUTE53_ZONE_DOMAIN $ROUTE53_ZONE_ID | get_value_of_json_key "Id")
  done
  # only wait for the final dns entry to be complete
  wait_for_dns_changes $change_id

  if [ "$?" != 0 ]; then
    echo "Something went wrong, exiting..."
    exit 1
  else
    echo "You can now reach this environment on:"
    for environment_subdomain in "${ENVIRONMENT_SUBDOMAINS[@]}"
    do
      echo "https://$environment_subdomain$ROUTE53_ZONE_DOMAIN"
    done
  fi
fi
