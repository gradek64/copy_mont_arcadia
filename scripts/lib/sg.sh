#!/usr/bin/env bash

function open_eb_security_group_for_sns()
{
  EB_ENVIRONMENT_NAME=$1
  aws elasticbeanstalk describe-environment-resources --environment-name $EB_ENVIRONMENT_NAME |
    jq -r '.EnvironmentResources.Instances[].Id' |
    xargs aws ec2 describe-instances --instance-ids |
    jq -r '.Reservations[0].Instances[0].SecurityGroups[].GroupId' |
    xargs -n 1 aws ec2 authorize-security-group-ingress --protocol tcp --port 9001-9002 --cidr 0.0.0.0/0 --group-id
}
