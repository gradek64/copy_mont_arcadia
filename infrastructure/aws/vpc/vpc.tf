resource "aws_vpc" "monty" {
  cidr_block = "${var.vpc_cidr_block}"
  enable_dns_hostnames = "true"
  instance_tenancy = "default"

  tags {
    Name = "monty"
  }
}

resource "aws_internet_gateway" "monty" {
  vpc_id = "${aws_vpc.monty.id}"

  tags {
    Name = "monty"
  }
}

resource "aws_route" "internet_access" {
  route_table_id         = "${aws_vpc.monty.main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.monty.id}"
}

resource "aws_subnet" "monty-a" {
  vpc_id                  = "${aws_vpc.monty.id}"
  cidr_block              = "${var.subnet_a_cidr_block}"
  map_public_ip_on_launch = true
  availability_zone = "${var.region}a"

  tags {
    Name = "monty-a"
  }
}

resource "aws_subnet" "monty-b" {
  vpc_id                  = "${aws_vpc.monty.id}"
  cidr_block              = "${var.subnet_b_cidr_block}"
  map_public_ip_on_launch = true
  availability_zone = "${var.region}b"

  tags {
    Name = "monty-b"
  }
}

resource "aws_subnet" "monty-c" {
  vpc_id                  = "${aws_vpc.monty.id}"
  cidr_block              = "${var.subnet_c_cidr_block}"
  map_public_ip_on_launch = true
  availability_zone = "${var.region}c"

  tags {
    Name = "monty-c"
  }
}

resource "aws_security_group" "monty-elb-arcadia" {
  name = "monty-elb-arcadia"
  description = "sg for monty elb for arcadia networks"
  vpc_id = "${aws_vpc.monty.id}"

  ingress {
    from_port = "443"
    to_port = "443"
    protocol = "tcp"
    cidr_blocks = ["${split(",", var.arcadia_cidrs)}"]
  }

  egress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "monty-elb-arcadia"
  }
}

resource "aws_security_group" "monty-elb-akamai-production" {
  name = "monty-elb-akamai-production"
  description = "sg for monty elb for akamai production network"
  vpc_id = "${aws_vpc.monty.id}"

  ingress {
    from_port = "443"
    to_port = "443"
    protocol = "tcp"
    cidr_blocks = ["${split(",", var.loadbalancer_allowed_cidrs_akamai_production)}"]
  }

  egress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "monty-elb-akamai-production"
  }
}

resource "aws_security_group" "monty-elb-akamai-staging" {
  name = "monty-elb-akamai-staging"
  description = "sg for monty elb for akamai staging network"
  vpc_id = "${aws_vpc.monty.id}"

  ingress {
    from_port = "443"
    to_port = "443"
    protocol = "tcp"
    cidr_blocks = ["${split(",", var.loadbalancer_allowed_cidrs_akamai_staging)}"]
  }

  egress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "monty-elb-akamai-staging"
  }
}

resource "aws_security_group" "monty-ec2" {
  name = "monty-ec2"
  description = "sg for ec2 instances running monty"
  vpc_id = "${aws_vpc.monty.id}"

  ingress {
    from_port = "80"
    to_port = "80"
    protocol = "tcp"
    security_groups = ["${aws_security_group.monty-elb-arcadia.id}","${aws_security_group.monty-elb-akamai-production.id}","${aws_security_group.monty-elb-akamai-staging.id}"]
  }

  ingress {
    from_port = "22"
    to_port = "22"
    protocol = "tcp"
    cidr_blocks = ["${split(",", var.arcadia_cidrs)}"]
  }

  ingress {
    from_port = "9001"
    to_port = "9002"
    protocol = "tcp"
    security_groups = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["${split(",", var.arcadia_cidrs)}"]
  }

  egress {
    from_port = "443"
    to_port = "443"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = "6379"
    to_port = "6379"
    protocol = "tcp"
    cidr_blocks = ["${aws_vpc.monty.cidr_block}"]
  }

  tags {
    Name = "monty-ec2"
  }
}

resource "aws_security_group" "monty-cache" {
  name = "monty-cache"
  description = "sg for monty cache"
  vpc_id = "${aws_vpc.monty.id}"

  ingress {
    from_port = "6379"
    to_port = "6379"
    protocol = "tcp"
    security_groups = ["${aws_security_group.monty-ec2.id}"]
  }

  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    self = true
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "monty-cache"
  }
}

resource "aws_security_group" "jenkins_master" {
  name = "jenkins_master"
  description = "sg for jenkins master"
  vpc_id = "${aws_vpc.monty.id}"

  ingress {
    from_port = "443"
    to_port = "443"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = "22"
    to_port = "22"
    protocol = "tcp"
    cidr_blocks = ["${split(",", var.arcadia_cidrs)}"]
  }

  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    self = true
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "jenkins_master"
  }
}


resource "aws_security_group" "elasticsearch" {
  name = "vpc-322eff56"
  description = "sg for elasticsearch cluster"
  vpc_id = "${aws_vpc.monty.id}"

  ingress {
    from_port = "443"
    to_port = "443"
    protocol = "tcp"
    cidr_blocks = ["10.199.1.128/25"]
  }

  ingress {
    from_port = "80"
    to_port = "80"
    protocol = "tcp"
    security_groups = ["sg-7aef5a00"]
  }

  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    self = true
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "elasticsearch"
  }
}
