#!/bin/bash
source "$(dirname $0)/lib/shell_utils.sh"
source "$(dirname $0)/lib/docker.sh"
source "$(dirname $0)/lib/sns.sh"

function application_version_exists()
{
  application_name=$1
  version=$2
  aws elasticbeanstalk describe-application-versions \
    --application-name $application_name \
    --version-labels $version | grep $version > /dev/null 2>&1
}

function environment_limit_hit()
{
  application_name=$1
  LISTENV=$(aws elasticbeanstalk describe-environments --application-name ${application_name} --query 'Environments[*].EnvironmentName' | wc -l)
  COUNT=$((LISTENV-2))
  if [ $COUNT -gt ${JENKINS_ENV_LIMIT:-50} ]
  then
    return 1
  else
    return 0
  fi
}

function create_application_version()
{
  application_name=$1
  version=$2
  eb_s3_bucket=$3
  monty_memory_size=$4
  EB_ENVIRONMENT_NAME=$5
  dockerrun_file=$version-$EB_ENVIRONMENT_NAME-Dockerrun.aws.json

  application_version_exists $application_name $version
  if [ "$?" = 0 ]; then
    echo "Application version $2 already exists, replacing it..."
    delete_application_version $application_name $version
  fi

  cp -f Dockerrun.aws.json.template $dockerrun_file
  sed -i "s/<TAG>/$version/g" $dockerrun_file
  sed -i "s/<EB_BUCKET>/$eb_s3_bucket/g" $dockerrun_file
  sed -i "s/<MONTY_MEMORY_SIZE>/$monty_memory_size/g" $dockerrun_file
  sed -i "s/<APP_NAME>/$EB_ENVIRONMENT_NAME/g" $dockerrun_file

  aws s3 cp $dockerrun_file s3://$eb_s3_bucket/dockerrun/$dockerrun_file \
    --region eu-west-1

  aws elasticbeanstalk create-application-version \
    --application-name $application_name \
    --version-label "$EB_ENVIRONMENT_NAME - $version" \
    --source-bundle S3Bucket=$eb_s3_bucket,S3Key=dockerrun/$dockerrun_file \
    --region eu-west-1 \
    --process
}

function delete_application_version()
{
  application_name=$1
  version=$2

  aws elasticbeanstalk delete-application-version \
    --application-name $1 \
    --version-label $2 \
    --delete-source-bundle
}

function environment_exists()
{
  environment_name=$1
  aws elasticbeanstalk retrieve-environment-info \
    --environment-name $environment_name \
    --info-type tail > /dev/null 2>&1
}

function create_environment()
{
  environment_name=$1
  application_name=$2
  version=$3
  required_env_vars=()
  required_env_vars+=("NEWRELIC_KEY")

  for requiredEnvVar in "${required_env_vars[@]}"
  do
    require_env_var $requiredEnvVar
  done


  vpcid="vpc-ec4dd58a"
  cdn_sg=$(get_security_groupid_from_name "platform-loadbalancer-from-cdn" ${vpcid})
  corp_web_sg=$(get_security_groupid_from_name "platform-loadbalancer-from-misc" ${vpcid})
  managed_alb_sg=$(get_security_groupid_from_name "platform-loadbalancer-beanstalk" ${vpcid})
  alb_client_sg=$(get_security_groupid_from_name "platform-loadbalancer-client" ${vpcid})
  redis_client_sg=$(get_security_groupid_from_name "monty-redis-client" ${vpcid})
  bastion_sg=$(get_security_groupid_from_name "ssh_bastion" ${vpcid})
  monty_sg=$(get_security_groupid_from_name "platform-monty-instance-" ${vpcid})

  echo "SG....."
  echo ${cdn_sg}
  echo ${managed_alb_sg}
  echo ${corp_web_sg}
  echo ${alb_client_sg}
  echo ${redis_client_sg}
  echo ${bastion_sg}
  echo ${monty_sg}
  echo "End SG....."

  # latest version is at https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.mcdocker
  aws elasticbeanstalk create-environment \
    --application-name $application_name \
    --environment-name $environment_name \
    --cname-prefix monty-$environment_name \
    --version-label "$version" \
    --tags "Key=Project,Value=${application_name}" "Key=Environment,Value=Dev" "Key=elasticbeanstalk:environment-name,Value=${environment_name}" "Key=use_spot,Value=${USE_SPOT_INSTANCES}" "Key=CreatedBy,Value=${BUILD_USER} ${BUILD_USER_EMAIL}"\
    --tier Name=WebServer,Type=Standard \
    --solution-stack-name "64bit Amazon Linux 2018.03 v2.11.5 running Multi-container Docker 18.06.1-ce (Generic)" \
    --option-settings "[
  {
    \"Namespace\": \"aws:ec2:vpc\",
    \"OptionName\": \"VPCId\",
    \"Value\": \"${vpcid}\"
  },
  {
    \"Namespace\": \"aws:ec2:vpc\",
    \"OptionName\": \"Subnets\",
    \"Value\": \"subnet-3b14b25d,subnet-8673c4ce,subnet-2c957576\"
  },
  {
    \"Namespace\": \"aws:ec2:vpc\",
    \"OptionName\": \"ELBSubnets\",
    \"Value\": \"subnet-510caa37,subnet-f071c6b8,subnet-359c7c6f\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:command\",
    \"OptionName\": \"DeploymentPolicy\",
    \"Value\": \"Rolling\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:environment\",
    \"OptionName\": \"EnvironmentType\",
    \"Value\": \"LoadBalanced\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:environment\",
    \"OptionName\": \"ServiceRole\",
    \"Value\": \"aws-elasticbeanstalk-service-role\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:environment\",
    \"OptionName\": \"LoadBalancerType\",
    \"Value\": \"application\"
  },
  {
    \"Namespace\": \"aws:elbv2:loadbalancer\",
    \"OptionName\": \"ManagedSecurityGroup\",
    \"Value\": \"${managed_alb_sg}\"
  },
  {
    \"Namespace\": \"aws:elbv2:loadbalancer\",
    \"OptionName\": \"SecurityGroups\",
    \"Value\": \"${cdn_sg},${corp_web_sg},${managed_alb_sg}\"
  },
  {
    \"Namespace\": \"aws:elbv2:loadbalancer\",
    \"OptionName\": \"AccessLogsS3Bucket\",
    \"Value\": \"elb-logs-eu-west-1-623971903498\"
  },
  {
    \"Namespace\": \"aws:elbv2:loadbalancer\",
    \"OptionName\": \"AccessLogsS3Enabled\",
    \"Value\": \"true\"
  },
  {
    \"Namespace\": \"aws:elbv2:listener:default\",
    \"OptionName\": \"ListenerEnabled\",
    \"Value\": \"false\"
  },
  {
    \"Namespace\": \"aws:elbv2:listener:443\",
    \"OptionName\": \"Protocol\",
    \"Value\": \"HTTPS\"
  },
  {
    \"Namespace\": \"aws:elbv2:listener:443\",
    \"OptionName\": \"SSLCertificateArns\",
    \"Value\": \"arn:aws:acm:eu-west-1:623971903498:certificate/fa0dec13-03e7-4668-99de-f61a46636186\"
  },
  {
    \"Namespace\": \"aws:elbv2:listener:443\",
    \"OptionName\": \"SSLPolicy\",
    \"Value\": \"ELBSecurityPolicy-TLS-1-2-2017-01\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:environment:process:default\",
    \"OptionName\": \"HealthCheckPath\",
    \"Value\": \"/health\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:environment:process:default\",
    \"OptionName\": \"HealthCheckInterval\",
    \"Value\": \"60\"
  },

  {
    \"Namespace\": \"aws:elasticbeanstalk:application\",
    \"OptionName\": \"Application Healthcheck URL\",
    \"Value\": \"/health\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:application:environment\",
    \"OptionName\": \"NEWRELIC_KEY\",
    \"Value\": \"${NEWRELIC_KEY}\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:application:environment\",
    \"OptionName\": \"NEWRELIC_APP_NAME\",
    \"Value\": \"${NEWRELIC_APP_NAME:-monty-$environment_name}\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:application:environment\",
    \"OptionName\": \"NRSYSMOND_license_key\",
    \"Value\": \"${NEWRELIC_KEY}\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:application:environment\",
    \"OptionName\": \"APP_CONFIG_TABLENAME\",
    \"Value\": \"${APP_CONFIG_TABLENAME}\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:application:environment\",
    \"OptionName\": \"APP_CONFIG_SNS_TOPIC_ARN\",
    \"Value\": \"${APP_CONFIG_SNS_TOPIC_ARN}\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:application:environment\",
    \"OptionName\": \"ENVIRONMENT_NAME\",
    \"Value\": \"${environment_name}\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:healthreporting:system\",
    \"OptionName\": \"SystemType\",
    \"Value\": \"enhanced\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:managedactions\",
    \"OptionName\": \"ManagedActionsEnabled\",
    \"Value\": \"true\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:managedactions\",
    \"OptionName\": \"PreferredStartTime\",
    \"Value\": \"Sat:02:00\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:managedactions:platformupdate\",
    \"OptionName\": \"UpdateLevel\",
    \"Value\": \"patch\"
  },
  {
    \"Namespace\": \"aws:elasticbeanstalk:managedactions:platformupdate\",
    \"OptionName\": \"InstanceRefreshEnabled\",
    \"Value\": \"true\"
  },
  {
    \"Namespace\": \"aws:autoscaling:launchconfiguration\",
    \"OptionName\": \"IamInstanceProfile\",
    \"Value\": \"aws-elasticbeanstalk-ec2-role\"
  },
  {
    \"Namespace\": \"aws:autoscaling:launchconfiguration\",
    \"OptionName\": \"InstanceType\",
    \"Value\": \"${INSTANCE_SIZE:-t2.medium}\"
  },
  {
    \"Namespace\": \"aws:autoscaling:launchconfiguration\",
    \"OptionName\": \"EC2KeyName\",
    \"Value\": \"arcadia-group\"
  },
  {
    \"Namespace\": \"aws:autoscaling:launchconfiguration\",
    \"OptionName\": \"SecurityGroups\",
    \"Value\": \"${alb_client_sg},${redis_client_sg},${monty_sg}\"
  },
  {
    \"Namespace\": \"aws:autoscaling:launchconfiguration\",
    \"OptionName\": \"SSHSourceRestriction\",
    \"Value\": \"tcp, 22, 22, ${bastion_sg}\"
  },
  {
    \"Namespace\": \"aws:autoscaling:asg\",
    \"OptionName\": \"MinSize\",
    \"Value\": \"1\"
  },
  {
    \"Namespace\": \"aws:autoscaling:asg\",
    \"OptionName\": \"MaxSize\",
    \"Value\": \"2\"
  }
]"
}

function get_security_groupid_from_name()
{
  name=$1
  VPCId=$2
  aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPCId" "Name=group-name,Values=${name}*" --query 'SecurityGroups[*].{id:GroupId}' --output=text
}

function wait_for_environment_state()
{
  environment_id=$1
  expected_state=$2
  max_tries=70
  sleep_time=30
  number_tries=0

  if [[ "$environment_id" != e-* ]]; then
    echo "Could not find an environment ID, exiting..."
    exit 1
  fi

  until [ $number_tries -ge $max_tries ]
  do
    aws elasticbeanstalk describe-environments \
      --environment-ids $environment_id | grep "\"Status\": \"$expected_state\"" && state="$expected_state" && break
    number_tries=$[$number_tries+1]
    sleep $sleep_time
  done

  if [ -z $state ]; then
      echo "The environment $environment_name did not have a $expected_state state after $(($max_tries*$sleep_time)) seconds"
      exit 1
  fi
}

function update_environment()
{
  environment_name=$1
  version=$2
  aws elasticbeanstalk update-environment \
    --environment-name $environment_name \
    --version-label "$version" \
    --region eu-west-1
}

function destroy_environment()
{
  environment_name=$1
  aws elasticbeanstalk terminate-environment \
    --environment-name $environment_name \
    --terminate-resources
}

function get_environment_info()
{
  environment_name=$1
  aws elasticbeanstalk describe-environments \
    --environment-names $environment_name \
    --no-include-deleted
}

function get_deployed_version_by_environment_id()
{
  environment_id=$1
  aws elasticbeanstalk describe-environments \
    --environment-id $environment_id \
    --query 'Environments[0].VersionLabel' \
    --output text
}

function get_elb_name()
{
  environment_name=$1
  echo $(aws elasticbeanstalk describe-environment-resources --environment-name ${environment_name} | jq '.EnvironmentResources.LoadBalancers[].Name' | sed -e 's/^"//' -e 's/"$//')
}

function get_number_of_instances_by_env_name()
{
  environment_name=$1
  elb_name=$(get_elb_name $environment_name)
  aws elb describe-load-balancers --load-balancer-names ${elb_name} | jq '.LoadBalancerDescriptions[].Instances | length'
}

function deploy_into_next_prod()
{
  NEXT_ENVIRONMENT=$1
  MONTY_ASSETS_BUCKET="${2:-ag-monty-prod-assets-repo20181018115426386300000001}"
  APP_LABEL="${NEXT_ENVIRONMENT} - ${VERSION}"
  echo "Deploying application version $VERSION to $NEXT_ENVIRONMENT..."

  tag_exists_on_docker_hub $DOCKER_IMAGE_NAME $VERSION
  if [ "$?" = 0 ]; then
    echo "The image $DOCKER_IMAGE_NAME already contains the tag $VERSION, continuing..."
  else
    echo "The image $DOCKER_IMAGE_NAME doesn't contain the tag $VERSION, building and pushing it..."
    build_and_push $DOCKER_IMAGE_NAME $MONTY_LB_DOCKER_IMAGE_NAME $VERSION
  fi

  rm -fr assets_tmp
  mkdir assets_tmp
  docker create --name $VERSION $DOCKER_IMAGE_NAME:$VERSION /bin/true
  docker start $VERSION
  docker cp $VERSION:/monty/public assets_tmp/assets
  docker stop $VERSION
  docker rm $VERSION
  aws s3 sync --acl private --metadata "git=${VERSION},environment=${NEXT_ENVIRONMENT}" assets_tmp s3://${MONTY_ASSETS_BUCKET}

  echo "Creating application version $VERSION..."
  ENV_NAME=$(get_environment_info $NEXT_ENVIRONMENT | get_value_of_json_key "EnvironmentName")
  echo "Environment name to deploy the application into: $ENV_NAME"

  echo "Creating application version $VERSION..."
  create_application_version $APPLICATION_NAME $VERSION $EB_BUCKET $MONTY_MEMORY_SIZE $ENV_NAME

  echo "Cleaning up current subscriptions for 'appConfig_prod' sns topic"
  cleanup_previous_sns_subscriptions "appConfig_prod"

  environment_id=$(update_environment $NEXT_ENVIRONMENT "$APP_LABEL" | get_value_of_json_key "EnvironmentId")
  wait_for_environment_state $environment_id "Ready"
  deployed_version=$(get_deployed_version_by_environment_id $environment_id)
  if [ "${deployed_version}" != "${APP_LABEL}" ]; then
    echo "Deployment failed! Previous version (${deployed_version}) is still in the ${ENV_NAME} environment"
    exit 1
  else
    echo "Deployment complete! Please run QA tasks."
  fi
}


function swap_environment_cnames()
{
  env_1=$1
  env_2=$2
  aws elasticbeanstalk swap-environment-cnames \
  --source-environment-name $env_1 \
  --destination-environment-name $env_2
}
