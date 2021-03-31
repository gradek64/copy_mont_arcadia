resource "aws_route53_zone" "monty-prod" {
  name = "digital-prod.arcadiagroup.co.uk"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route53_record" "monty-prod-ns" {
  zone_id = "${aws_route53_zone.monty-prod.zone_id}"
  name = "digital-prod.arcadiagroup.co.uk"
  type = "NS"
  ttl = "3600"
  records = [
    "${aws_route53_zone.monty-prod.name_servers.0}",
    "${aws_route53_zone.monty-prod.name_servers.1}",
    "${aws_route53_zone.monty-prod.name_servers.2}",
    "${aws_route53_zone.monty-prod.name_servers.3}"
  ]

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route53_record" "monty-jenkins" {
  zone_id = "${aws_route53_zone.monty-prod.zone_id}"
  name = "jenkins.digital-prod.arcadiagroup.co.uk"
  type = "CNAME"
  ttl = "3600"
  records = [
    "${var.jenkins_elb_hostname}"
  ]
}
