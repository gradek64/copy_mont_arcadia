#!/usr/bin/env bash
terraform remote config \
  -backend=s3 \
  -backend-config="bucket=monty-production-terraform-state" \
  -backend-config="key=terraform.tfstate" \
  -backend-config="region=eu-west-1"
