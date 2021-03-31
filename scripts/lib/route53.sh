#!/bin/bash
function create_dns_alias()
{
  original_dns_record=$1
  alias_dns_record=$2
  route53_zone_id=$3
  dns_record_file="$(dirname $0)/lib/dns_record.json"
  cp -f $(dirname $0)/lib/dns_record_template.json $dns_record_file
  sed -i "s/<ACTION>/UPSERT/" $dns_record_file
  update_dns_record $original_dns_record $alias_dns_record $dns_record_file $route53_zone_id
}

function update_dns_record()
{
  original_dns_record=$1
  alias_dns_record=$2
  dns_record_file=$3
  route53_zone_id=$4
  sed -i "s;<CNAME_RECORD_NAME>;$alias_dns_record;" $dns_record_file
  sed -i "s;<CNAME_RECORD_VALUE>;$original_dns_record;" $dns_record_file
  aws route53 change-resource-record-sets \
    --hosted-zone-id $route53_zone_id \
    --change-batch file://$dns_record_file
}

function destroy_dns_alias()
{
  original_dns_record=$1
  alias_dns_record=$2
  route53_zone_id=$3
  dns_record_file="$(dirname $0)/lib/dns_record.json"
  cp -f $(dirname $0)/lib/dns_record_template.json $dns_record_file
  sed -i "s/<ACTION>/DELETE/" $dns_record_file
  update_dns_record $original_dns_record $alias_dns_record $dns_record_file $route53_zone_id
}

function wait_for_dns_changes()
{
  change_id=$1
  aws route53 wait resource-record-sets-changed \
    --id $1
}
