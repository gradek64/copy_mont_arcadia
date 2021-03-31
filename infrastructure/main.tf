provider "aws" {
  region = "${var.aws_region}"
}

module "aws_vpc" {
  source = "./aws/vpc/"
  region = "${var.aws_region}"
  vpc_cidr_block = "${var.vpc_cidr_block}"
  subnet_a_cidr_block = "${var.subnet_a_cidr_block}"
  subnet_b_cidr_block = "${var.subnet_b_cidr_block}"
  subnet_c_cidr_block = "${var.subnet_c_cidr_block}"
  arcadia_cidrs = "${var.arcadia_cidrs}"
  loadbalancer_allowed_cidrs_akamai_production = "${var.loadbalancer_allowed_cidrs_akamai_production}"
  loadbalancer_allowed_cidrs_akamai_staging = "${var.loadbalancer_allowed_cidrs_akamai_staging}"
}

module "aws_elasticache" {
  source = "./aws/elasticache/"
  subnet_ids = "${module.aws_vpc.monty-a_subnet_id},${module.aws_vpc.monty-b_subnet_id},${module.aws_vpc.monty-c_subnet_id}"
}

module "aws_iam" {
  source = "./aws/iam/"
}

module "aws_dynamodb_app_config" {
  source = "./aws/dynamodb/appConfig/"
  table_name_app_config = "${var.table_name_app_config}"
  read_capacity_app_config = "${var.read_capacity_app_config}"
  write_capacity_app_config = "${var.write_capacity_app_config}"
  hash_key_app_config = "${var.hash_key_app_config}"
  attr_name_app_config = "${var.attr_name_app_config}"
}

module "aws_sns_topic_app_config" {
  source = "./aws/sns/appConfig/"
  sns_topic_name_app_config = "${var.sns_topic_name_app_config}"
  sns_topic_display_name_app_config = "${var.sns_topic_display_name_app_config}"
}

module "aws_elasticBeanstalk" {
  source = "./aws/elasticBeanstalk/"
  certificate_arn = "${var.certificate_arn}"
  access_key_id_dynamodb = "${module.aws_iam.access_key_id_dynamodb}"
  secret_access_key_dynamodb = "${module.aws_iam.secret_access_key_dynamodb}"
  sns_topic_arn_app_config = "${module.aws_sns_topic_app_config.arn}"
  newrelic_key = "${var.newrelic_key}"
  newrelic_app_name = "${var.newrelic_app_name}"
  app_config_tablename = "${var.app_config_tablename}"
  service_role = "${module.aws_iam.elastic_beanstalk_service_role_name}"
  instance_profile = "${module.aws_iam.elastic_beanstalk_instance_profile_name}"
  instance_type = "${var.instance_type}"
  keypair_name = "${var.keypair_name}"
  asg_min_size = "${var.asg_min_size}"
  asg_max_size = "${var.asg_max_size}"
  environment_name = "${var.environment_name}"
  ec2_security_group = "${module.aws_vpc.monty-ec2_security_group_id}"
  elb_security_group_ids = "${module.aws_vpc.monty-elb_security_group_ids}"
  vpc_id = "${module.aws_vpc.monty_vpc_id}"
  subnet_ids = "${module.aws_vpc.monty-a_subnet_id},${module.aws_vpc.monty-b_subnet_id},${module.aws_vpc.monty-c_subnet_id}"
}

module "aws_route53" {
  source = "./aws/route53/"
  jenkins_elb_hostname = "${module.aws_ec2.jenkins_elb_hostname}"
}

module "aws_s3" {
  source = "./aws/s3/"
  elasticbeanstalk_s3_bucket = "${var.elasticbeanstalk_s3_bucket}"
  dockerhub_auth = "${var.dockerhub_auth}"
}

module "aws_ec2" {
  source = "./aws/ec2/"
  jenkins_ami_id = "${var.jenkins_ami_id}"
  jenkins_master_instance_type = "${var.jenkins_master_instance_type}"
  jenkins_master_key_name = "${var.jenkins_master_key_name}"
  jenkins_master_security_groups = "${module.aws_vpc.jenkins_master_security_group_id}"
  jenkins_master_subnet_id = "${module.aws_vpc.monty-a_subnet_id}"
  dockerhub_auth = "${var.dockerhub_auth}"
}

module "aws_elk" {
  source = "./aws/elk/"
  elasticsearch_node_security_group = "${module.aws_vpc.elasticsearch_security_group_id}"
}
