provider "aws" {
  region = "${var.aws_region}"
}

resource "aws_elasticsearch_domain" "es" {
  domain_name           = "${var.es_domain_name}"
  elasticsearch_version = "${var.es_version}"

  advanced_options {
    "rest.action.multi.allow_explicit_index" = "true"
  }

  encrypt_at_rest {
    enabled    = true
    kms_key_id = "aws/es"
  }

  ebs_options {
    ebs_enabled = true
    volume_size = "${var.es_volume_size}"
  }

  access_policies = <<CONFIG
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": "*"
        },
        "Action": "es:*",
        "Resource": "arn:aws:es:${var.aws_region}:${var.aws_account_id}:domain/${var.es_domain_name}/*"
      }
    ]
  }
CONFIG

  cluster_config {
    zone_awareness_enabled = true
    instance_count = 4
    instance_type = "${var.es_instance_type}"
    dedicated_master_enabled = true
    dedicated_master_type = "${var.es_instance_type}"
    dedicated_master_count = 3
  }

  vpc_options {
    security_group_ids = ["${var.elasticsearch_node_security_group}"]
    subnet_ids = ["${split(",", var.subnet_ids)}"]
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }
}

resource "aws_instance" "oauth2_proxy" {
  ami = "ami-ac7e0cd5"
  instance_type = "t2.micro"

  tags {
    Name = "oauth2 proxy server"
  }
}

resource "aws_cloudwatch_metric_alarm" "es_out_of_space" {
  alarm_name                = "Elasticsearch Out of Space"
  comparison_operator       = "LessThanOrEqualToThreshold"
  evaluation_periods        = "2"
  metric_name               = "FreeStorageSpace"
  namespace                 = "AWS/ES"
  dimensions                = { Name="DomainName" Value="${var.es_domain_name}" }
  period                    = "300"
  statistic                 = "Average"
  threshold                 = "20000"
  alarm_description         = "This metric monitors free storage space in Elastic Search"
  insufficient_data_actions = []
  treat_missing_data        = "missing"
  alarm_actions             = ["arn:aws:sns:eu-west-1:330032770480:devops_alerts:627365c8-886c-47b6-9976-b85cec31962e"]
}


resource "aws_cloudwatch_metric_alarm" "es_high_cpu_use" {
  alarm_name                = "terraform-test-foobar5"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = "2"
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ES"
  period                    = "300"
  dimensions                = { Name="DomainName" Value="${var.es_domain_name}" }
  statistic                 = "Average"
  threshold                 = "60"
  alarm_description         = "This metric monitors ec2 cpu utilization"
  insufficient_data_actions = []
  treat_missing_data        = "missing"
  alarm_actions             = ["arn:aws:sns:eu-west-1:330032770480:devops_alerts:627365c8-886c-47b6-9976-b85cec31962e"]
}


