#!/usr/bin/env bash

function cache_cluster_exists()
{
  cache_cluster_id=$1
  aws elasticache describe-cache-clusters --cache-cluster-id $cache_cluster_id > /dev/null 2>&1
}

function create_cache_cluster()
{
  cache_cluster_id=$1
  redis_sg=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=monty-redis-server-*" --query 'SecurityGroups[*].GroupId' --output=text)
  aws elasticache create-cache-cluster \
  --cache-cluster-id $cache_cluster_id \
  --num-cache-nodes 1 \
  --cache-node-type "${CACHE_SIZE:-cache.t2.micro}" \
  --engine redis \
  --engine-version 2.8.24 \
  --security-group-ids "${redis_sg}" \
  --cache-subnet-group-name monty-subnet-group \
  --tags "Key=Project,Value=${APPLICATION_NAME:-full-monty}" "Key=Environment,Value=Dev" "Key=elasticbeanstalk:environment-name,Value=${cache_cluster_id}"
}

function wait_for_cache_cluster_creation()
{
  cache_cluster_id=$1
  echo "waiting for cache cluster \"$cache_cluster_id\" to be available..."
  aws elasticache wait cache-cluster-available \
  --cache-cluster-id $cache_cluster_id
}

function get_cache_cluster_info()
{
  cache_cluster_id=$1
  aws elasticache describe-cache-clusters \
  --cache-cluster-id $cache_cluster_id \
  --show-cache-node-info
}

function delete_cache_cluster()
{
  cache_cluster_id=$1
  echo "deleting cache cluster \"$cache_cluster_id\"..."
  aws elasticache delete-cache-cluster \
  --cache-cluster-id $cache_cluster_id
}

function wait_for_cache_cluster_deletion()
{
  cache_cluster_id=$1
  echo "waiting for cache cluster \"$cache_cluster_id\" to be deleted..."
  aws elasticache wait cache-cluster-deleted \
  --cache-cluster-id $cache_cluster_id
}
