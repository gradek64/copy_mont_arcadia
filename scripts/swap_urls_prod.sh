#!/usr/bin/env bash

ENVIRONMENT_1="production"
ENVIRONMENT_2="production-g"
MIN_INSTANCE_EXPECTED=${1:-3}

source "$(dirname $0)/lib/eb.sh"
source "$(dirname $0)/lib/shell_utils.sh"

RUNNING_INSTANCES=$(get_number_of_instances_by_env_name ${ENVIRONMENT_1})
if [ "${RUNNING_INSTANCES}" -lt "${MIN_INSTANCE_EXPECTED}" ]; then
  echo "Min expected instance count is ${MIN_INSTANCE_EXPECTED}, actual #instances running in in ${ENVIRONMENT_1} is ${RUNNING_INSTANCES}, exiting..."
  exit 1
fi

RUNNING_INSTANCES=$(get_number_of_instances_by_env_name ${ENVIRONMENT_2})
if [ "${RUNNING_INSTANCES}" -lt "${MIN_INSTANCE_EXPECTED}" ]; then
  echo "Min expected instance count is ${MIN_INSTANCE_EXPECTED}, actual #instances running in in ${ENVIRONMENT_2} is ${RUNNING_INSTANCES}, exiting..."
  exit 1
fi

echo "Swapping CNAMEs between ${ENVIRONMENT_1} ${ENVIRONMENT_2}"

swap_environment_cnames ${ENVIRONMENT_1} ${ENVIRONMENT_2}
if [ "$?" != 0 ]; then
  echo "Something went wrong, exiting..."
  exit 1
else
  echo "CNAME swap completed!"
fi
