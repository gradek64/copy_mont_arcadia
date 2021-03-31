# Global
aws_region = "eu-west-1"
aws_account_id = "330032770480"

# VPC
vpc_cidr_block = "10.199.1.128/25"
subnet_a_cidr_block = "10.199.1.128/27"
subnet_b_cidr_block = "10.199.1.160/27"
subnet_c_cidr_block = "10.199.1.192/27"

# Elastic Beanstalk
environment_name = "production"
certificate_arn = "arn:aws:acm:eu-west-1:330032770480:certificate/618b8773-a394-4180-a1bb-4a9ac844999c"
instance_type = "c4.large"
keypair_name = "montyprod"
asg_min_size = "3"
asg_max_size = "6"
elasticbeanstalk_s3_bucket = "elasticbeanstalk-eu-west-1-330032770480"
newrelic_app_name = "monty-production"
app_config_tablename = "appConfig_production"
arcadia_cidrs = "194.72.50.0/25,81.149.233.190/32,81.136.146.69/32,81.136.224.53/32,217.22.82.162/32,116.66.154.46/32,203.99.198.240/32,203.99.196.179/32,91.194.142.80/29"
loadbalancer_allowed_cidrs_akamai_production = "131.103.136.0/24,61.246.63.64/26,72.246.184.0/24,131.103.137.0/24,195.10.11.0/24,23.57.69.0/24,66.171.227.0/24,77.67.85.0/24,165.254.137.64/26,23.57.74.0/24,69.192.3.0/24,80.157.149.0/24,184.51.199.0/24,209.170.78.128/25,23.62.238.0/24,69.192.4.0/24,80.239.234.128/25,209.170.97.0/24,23.15.33.0/24,69.31.33.0/24,72.246.150.0/24,72.247.181.0/24"
loadbalancer_allowed_cidrs_akamai_staging = "209.170.113.98/31,209.170.113.100/31,209.170.113.106/31,209.170.113.108/32,204.2.166.173/32,204.2.166.174/31,204.2.166.176/30,204.2.166.180/32,209.8.112.100/30,209.8.112.104/31,208.49.157.49/32,208.49.157.50/31,208.49.157.52/31,208.49.157.54/32,184.84.242.21/32,184.84.242.22/31,63.151.118.0/24,67.220.142.19/32,67.220.142.20/32,67.220.142.21/32,67.220.142.22/32,66.198.8.141/32,66.198.8.142/32,66.198.8.143/32,66.198.8.144/32,209.8.112.96/30,184.84.242.32/30,23.48.168.0/22,23.50.48.0/20"

# Dynamodb App Config
table_name_app_config = "appConfig_production"
read_capacity_app_config = "10"
write_capacity_app_config = "10"
hash_key_app_config = "key"
attr_name_app_config = "key"

# SNS App Config Topic
sns_topic_name_app_config = "appConfig_production"
sns_topic_display_name_app_config = "production"

#jenkins
jenkins_master_key_name = "montyprod"
jenkins_master_instance_type = "t2.small"
jenkins_ami_id = "ami-f9dd458a"

# ElasticSearch
es_instance_type = "m4.large.elasticsearch"
es_domain_name = "elasticsearch-tf"
es_version = "6.0"
es_volume_size = "400"
elasticsearch_node_security_group = "sg-b3f164cb"
subnet_ids = "subnet-6c842637,subnet-528aec35"
log_filter_destination_arn = "arn:aws:lambda:eu-west-1:330032770480:function:LogsToElasticsearch_monty-prod-es"
