resource "aws_instance" "jenkins-master" {
  ami = "${var.jenkins_ami_id}"
  instance_type = "${var.jenkins_master_instance_type}"
  key_name = "${var.jenkins_master_key_name}"
  vpc_security_group_ids = ["${split(",", var.jenkins_master_security_groups)}"]
  subnet_id = "${var.jenkins_master_subnet_id}"
  user_data = "${data.template_file.jenkins_master_init.rendered}"

  root_block_device {
    volume_size = "40"
  }
  tags {
    Name = "jenkins-master"
  }
  lifecycle {
    create_before_destroy = true
  }
}

data "template_file" "jenkins_master_init" {
  template = "${file("${path.module}/jenkins_master_init.tpl")}"

  vars {
    dockerhub_auth = "${var.dockerhub_auth}"
  }
}

resource "aws_elb" "jenkins" {
  name = "jenkins"
  subnets = ["${var.jenkins_master_subnet_id}"]
  security_groups = ["${split(",", var.jenkins_master_security_groups)}"]
  instances = ["${aws_instance.jenkins-master.id}"]

  listener {
    instance_port = 8080
    instance_protocol = "http"
    lb_port = 443
    lb_protocol = "https"
    ssl_certificate_id = "arn:aws:acm:eu-west-1:330032770480:certificate/618b8773-a394-4180-a1bb-4a9ac844999c"
  }

  health_check {
    healthy_threshold = 3
    unhealthy_threshold = 3
    timeout = 3
    target = "TCP:8080"
    interval = 10
  }

  cross_zone_load_balancing = true
  connection_draining = true
  connection_draining_timeout = 300

  tags {
    Name = "jenkins"
  }
}

