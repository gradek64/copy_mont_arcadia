resource "aws_elastic_beanstalk_application" "monty" {
  name = "full-monty"
  description = "Mobile site for brands of the Arcadia Group"
}

resource "aws_elastic_beanstalk_configuration_template" "monty" {
  name = "monty"
  application = "${aws_elastic_beanstalk_application.monty.name}"
  solution_stack_name = "64bit Amazon Linux 2016.09 v2.4.0 running Multi-container Docker 1.12.6 (Generic)"
  setting = { namespace = "aws:elasticbeanstalk:command" name = "DeploymentPolicy" value = "Immutable" }
  setting = { namespace = "aws:autoscaling:updatepolicy:rollingupdate" name = "RollingUpdateType" value = "Immutable" }
  setting = { namespace = "aws:elasticbeanstalk:environment" name = "ServiceRole" value = "${var.service_role}" }
  #VPC
  setting = { namespace = "aws:ec2:vpc" name = "VPCId" value = "${var.vpc_id}" }
  setting = { namespace = "aws:ec2:vpc" name = "Subnets" value = "${var.subnet_ids}" }
  setting = { namespace = "aws:ec2:vpc" name = "ELBSubnets" value = "${var.subnet_ids}" }
  # load balancer
  setting = { namespace = "aws:elb:loadbalancer" name = "CrossZone" value = "true" }
  setting = { namespace = "aws:elb:loadbalancer" name = "LoadBalancerHTTPSPort" value = "443" }
  setting = { namespace = "aws:elb:loadbalancer" name = "SecurityGroups" value = "${var.elb_security_group_ids}" }
  setting = { namespace = "aws:elb:listener:80" name = "ListenerEnabled" value = "false" }
  setting = { namespace = "aws:elb:listener:443" name = "ListenerProtocol" value = "HTTPS" }
  setting = { namespace = "aws:elb:listener:443" name = "InstancePort" value = "80" }
  setting = { namespace = "aws:elb:listener:443" name = "InstancePort" value = "80" }
  setting = { namespace = "aws:elb:listener:443" name = "InstanceProtocol" value = "HTTP" }
  setting = { namespace = "aws:elb:listener:443" name = "SSLCertificateId" value = "${var.certificate_arn}" }
  # autoscaling
  setting = { namespace = "aws:autoscaling:launchconfiguration" name = "IamInstanceProfile" value = "${var.instance_profile}" }
  setting = { namespace = "aws:autoscaling:launchconfiguration" name = "InstanceType" value = "${var.instance_type}" }
  setting = { namespace = "aws:autoscaling:launchconfiguration" name = "EC2KeyName" value = "${var.keypair_name}" }
  setting = { namespace = "aws:autoscaling:launchconfiguration" name = "SecurityGroups" value = "${var.ec2_security_group}" }
  setting = { namespace = "aws:autoscaling:asg" name = "MinSize" value = "${var.asg_min_size}" }
  setting = { namespace = "aws:autoscaling:asg" name = "MaxSize" value = "${var.asg_max_size}" }
  setting = { namespace = "aws:autoscaling:asg" name = "Cooldown" value = "600" }
  setting = { namespace = "aws:autoscaling:trigger" name = "MeasureName" value = "CPUUtilization" }
  setting = { namespace = "aws:autoscaling:trigger" name = "LowerThreshold" value = "30" }
  setting = { namespace = "aws:autoscaling:trigger" name = "Unit" value = "Percent" }
  setting = { namespace = "aws:autoscaling:trigger" name = "UpperThreshold" value = "60" }
  # health checks
  setting = { namespace = "aws:elasticbeanstalk:healthreporting:system" name = "SystemType" value = "enhanced" }
  setting = { namespace = "aws:elasticbeanstalk:application" name = "Application Healthcheck URL" value = "/health" }
  setting = { namespace = "aws:elb:healthcheck" name = "Timeout" value = "2" }
  setting = { namespace = "aws:elb:healthcheck" name = "Interval" value = "5" }
  setting = { namespace = "aws:elb:healthcheck" name = "UnhealthyThreshold" value = "3" }
  setting = { namespace = "aws:elb:healthcheck" name = "HealthyThreshold" value = "3" }
  # Environment variables
  setting = { namespace = "aws:elasticbeanstalk:application:environment" name = "NEWRELIC_APP_NAME" value = "${var.newrelic_app_name}" }
  setting = { namespace = "aws:elasticbeanstalk:application:environment" name = "NEWRELIC_KEY" value = "${var.newrelic_key}" }
  setting = { namespace = "aws:elasticbeanstalk:application:environment" name = "NRSYSMOND_license_key" value = "${var.newrelic_key}" }
  setting = { namespace = "aws:elasticbeanstalk:application:environment" name = "APP_CONFIG_TABLENAME" value = "${var.app_config_tablename}" }
  setting = { namespace = "aws:elasticbeanstalk:application:environment" name = "ACCESS_KEY_ID_DYNAMODB" value = "${var.access_key_id_dynamodb}" }
  setting = { namespace = "aws:elasticbeanstalk:application:environment" name = "SECRET_ACCESS_KEY_DYNAMODB" value = "${var.secret_access_key_dynamodb}" }
  setting = { namespace = "aws:elasticbeanstalk:application:environment" name = "APP_CONFIG_SNS_TOPIC_ARN" value = "${var.sns_topic_arn_app_config}" }
}


resource "aws_elastic_beanstalk_environment" "monty-environment" {
  name = "${var.environment_name}"
  application = "${aws_elastic_beanstalk_application.monty.name}"
  template_name = "${aws_elastic_beanstalk_configuration_template.monty.name}"
  tier = "WebServer"
}
