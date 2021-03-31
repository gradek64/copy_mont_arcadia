output "elastic_beanstalk_service_role_name" {
  value = "${aws_iam_role.elasticbeanstalk_service_role.name}"
}

output "elastic_beanstalk_instance_profile_name" {
  value = "${aws_iam_instance_profile.elasticbeanstalk_ec2_role.name}"
}

output "access_key_id_dynamodb" {
  value = "${aws_iam_access_key.monty.id}"
}

output "secret_access_key_dynamodb" {
  value = "${aws_iam_access_key.monty.secret}"
}
