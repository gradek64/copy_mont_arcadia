#!/usr/bin/env bash

function get_sns_topic_arn()
{
  sns_topic_name=$1
  local SNS_TOPIC_ARN=$(aws sns list-topics | grep $sns_topic_name)
  echo "${SNS_TOPIC_ARN##* }" | tr -d '"'
}

function sns_topic_exists()
{
  sns_topic_name=$1
  aws sns list-topics | grep $sns_topic_name
}

function create_sns_topic()
{
  sns_topic_name=$1
  aws sns create-topic --name $sns_topic_name | jq -r '.TopicArn'
}

function destroy_sns_topic()
{
  sns_topic_name=$1
  local SNS_TOPIC_ARN=$(get_sns_topic_arn $sns_topic_name)
  aws sns delete-topic --topic-arn $SNS_TOPIC_ARN
}

function cleanup_previous_sns_subscriptions()
{
  sns_topic_name=$1
  local sns_topic_arn=$(get_sns_topic_arn $sns_topic_name)
  eval current_sns_topic_subscriptions=( $(aws sns list-subscriptions-by-topic --topic-arn $sns_topic_arn | jq -r '.["Subscriptions"][].SubscriptionArn') )
  for subscription_arn in "${current_sns_topic_subscriptions[@]}"; do
    aws sns unsubscribe --subscription-arn $subscription_arn
  done
}
