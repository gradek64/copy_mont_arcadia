output "monty-a_subnet_id" {
  value = "${aws_subnet.monty-a.id}"
}

output "monty-b_subnet_id" {
  value = "${aws_subnet.monty-b.id}"
}

output "monty-c_subnet_id" {
  value = "${aws_subnet.monty-c.id}"
}

output "monty-cache_security_group_id" {
  value = "${aws_security_group.monty-cache.id}"
}

output "monty-ec2_security_group_id" {
  value = "${aws_security_group.monty-ec2.id}"
}

output "monty-elb_security_group_ids" {
  value = "${aws_security_group.monty-elb-arcadia.id},${aws_security_group.monty-elb-akamai-production.id},${aws_security_group.monty-elb-akamai-staging.id}"
}

output "monty_vpc_id" {
  value = "${aws_vpc.monty.id}"
}

output "jenkins_master_security_group_id" {
  value = "${aws_security_group.jenkins_master.id}"
}

output "elasticsearch_security_group_id" {
  value = "${aws_security_group.jenkins_master.id}"
}
