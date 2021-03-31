# Global
aws_region = "eu-west-1"
aws_account_id = "623971903498"

# ElasticSearch
es_instance_type = "m4.large.elasticsearch"
es_domain_name = "elasticsearch-tf"
es_version = "6.0"
es_volume_size = "400"
elasticsearch_node_security_group = "sg-0ca79e74"
subnet_ids = "subnet-08a39e6c,subnet-44632433"
log_filter_destination_arn = "arn:aws:lambda:eu-west-1:623971903498:function:LogsToElasticsearch_tf-test"
log_group_name = "full-monty-app"
