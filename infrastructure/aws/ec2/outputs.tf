output "jenkins_elb_hostname" {
  value = "${aws_elb.jenkins.dns_name}"
}
