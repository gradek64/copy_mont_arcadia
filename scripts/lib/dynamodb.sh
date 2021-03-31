#!/usr/bin/env bash

source "$(dirname $0)/lib/shell_utils.sh"

function dynamodb_table_exists()
{
  table_name=$1
  aws dynamodb list-tables --query "contains(TableNames,'${table_name}')"
}

function create_dynamodb_table()
{
  table_name=$1
  attribute_definitions=$2
  key_schema=$3
  echo "attribute definitions for dynamodb $table_name table is: $attribute_definitions"
  echo "key schema for dynamodb $table_name table is: $key schema"
  aws dynamodb create-table --table-name $table_name \
      --attribute-definitions $attribute_definitions \
      --key-schema $key_schema \
      --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
}

function wait_for_dynamodb_table_creation()
{
  table_name=$1
  echo "Stand by.. Waiting until dynamodb table $table_name is fully active"
  aws dynamodb wait table-exists --table-name $table_name
  if [ "$?" != 0 ]; then
    echo "dynamodb table $table_name failed to come up!"
    exit 1
  fi
}

function tag_dynamodb_table()
{
  table_name=$1
  environment_name=$2
  ARN=$(aws dynamodb describe-table --table-name ${table_name} --query "Table.TableArn")
  ARN=$(sed -e 's/^"//' -e 's/"$//' <<<"$ARN")
  aws dynamodb tag-resource --resource-arn ${ARN} --tags "Key=Project,Value=${APPLICATION_NAME:-full-monty}" "Key=Environment,Value=Dev" "Key=elasticbeanstalk:environment-name,Value=${environment_name}"
}

function seed_dynamodb_table_data_with_template()
{
  data_template=$1
  batch_data=$2
  table_type=$3
  table_name=$4

  sed -i "s|<$table_type>|$table_name|g" $data_template
  eval dynamodb_env_vars=( $(cat $data_template | jq -r --arg table_name $table_name '.[$table_name][].PutRequest.Item.key.S' ) )
  for env_var in "${dynamodb_env_vars[@]}"; do
    env_var_value="${!env_var}"
    env_var_value="${env_var_value//\"/\\\"}"
    sedeasy "<$env_var>" $env_var_value $data_template
  done
  mv $data_template $batch_data
  aws dynamodb batch-write-item --request-items file://$batch_data
  if [ "$?" != 0 ]; then
    echo "seeding dynamodb table $table_name caused an error! Please check that table's state."
    exit 1
  else
    echo "seeding dynamodb $table_name table with batch data from $data_template success!"
  fi
}

function seed_dynamodb_table_data()
{
  table_name=$1
  table_type=$2

  case "$table_type" in
    appConfig)
      app_config_template="$(dirname $0)/lib/app_config.json.dist"
      app_config="$(dirname $0)/lib/app_config.json"
      app_config_template_pt2="$(dirname $0)/lib/app_config.json.pt2.dist"
      app_config_pt2="$(dirname $0)/lib/app_config.pt2.json"
      # klarna_template="$(dirname $0)/lib/klarna.json.dist" 
      # klarna="$(dirname $0)/lib/klarna.json"
      seed_dynamodb_table_data_with_template $app_config_template $app_config $table_type $table_name
      seed_dynamodb_table_data_with_template $app_config_template_pt2 $app_config_pt2 $table_type $table_name
      # seed_dynamodb_table_data_with_template $klarna_template $klarna $table_type $table_name
      ;;
    *)
      echo "$table_name dynamodb table name not recognized, not seeding and aborting..."
      exit 1
  esac
}

function delete_dynamodb_table()
{
  table_name=$1
  aws dynamodb delete-table --table-name $table_name
}

function wait_for_dynamodb_table_deletion()
{
  aws dynamodb wait table-not-exists --table-name $1
  if [ "$?" != 0 ]; then
    echo "dynamodb table $1 still exists! Please check for specific environment \"${TABLES[@]}\" tables."
    exit 1
  fi
}
