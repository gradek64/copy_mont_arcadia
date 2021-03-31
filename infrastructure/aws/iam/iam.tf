resource "aws_iam_role" "elasticbeanstalk_service_role" {
  name = "elasticbeanstalk_service_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "elasticbeanstalk.amazonaws.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "elasticbeanstalk"
        }
      }
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "elasticbeanstalk_enhanced_health" {
  name = "elasticbeanstalk_enhanced_health"
  roles = ["${aws_iam_role.elasticbeanstalk_service_role.name}"]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth"
}

resource "aws_iam_policy_attachment" "elasticbeanstalk_service" {
  name = "elasticbeanstalk_service"
  roles = ["${aws_iam_role.elasticbeanstalk_service_role.name}"]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkService"
}

resource "aws_iam_role" "elasticbeanstalk_ec2_role" {
  name = "elasticbeanstalk_ec2_role"
  assume_role_policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "elasticbeanstalk_web_tier" {
  name = "elasticbeanstalk_web_tier"
  roles = ["${aws_iam_role.elasticbeanstalk_ec2_role.name}"]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_policy_attachment" "elasticbeanstalk_multicontainer_docker" {
  name = "elasticbeanstalk_multicontainer_docker"
  roles = ["${aws_iam_role.elasticbeanstalk_ec2_role.name}"]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}

resource "aws_iam_instance_profile" "elasticbeanstalk_ec2_role" {
  name = "elasticbeanstalk_ec2_role"
  roles = ["${aws_iam_role.elasticbeanstalk_ec2_role.name}"]
}

resource "aws_iam_user" "monty" {
  name = "monty"
}

resource "aws_iam_access_key" "monty" {
  user = "${aws_iam_user.monty.name}"
}

resource "aws_iam_user_policy" "monty_dynamodb" {
  name = "monty_dynamodb_and_sns_full_access"
  user = "${aws_iam_user.monty.name}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1478796041823",
      "Action": "dynamodb:*",
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Sid": "Stmt1478796052363",
      "Action": "sns:*",
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}
