#!/bin/bash
source "$(dirname $0)/lib/shell_utils.sh"

function check_cloudwatchlog_group()
{
    group_name=$1
    aws logs describe-log-groups --log-group-name-prefix $group_name | grep "logGroupName" > /dev/null 2>&1
}

function create_cloudwatchlog_group()
{
    group_name=$1
    aws logs create-log-group --log-group-name $group_name > /dev/null 2>&1
}

function check_cloudwatchlog_stream()
{
    stream_prefix=$1
    aws logs describe-log-streams --log-group-name full-monty-metricbeat --log-stream-name-prefix $stream_prefix/monty-metricbeat  | grep "logStreamName" > /dev/null 2>&1
}

function delete_cloudwatchlog_stream()
{
    stream_prefix=$1
    group_name=$2
    RawName=$(aws logs describe-log-streams --log-group-name full-monty-metricbeat --log-stream-name-prefix $stream_prefix/monty-metricbeat  | grep "logStreamName" | grep -oP "\"([\w/-]+)\",")
    NameChop=${RawName::-2}
    StreamName=${NameChop:1:${#NameChop}}
    aws logs delete-log-stream --log-group-name full-monty-metricbeat --log-stream-name $StreamName
}
