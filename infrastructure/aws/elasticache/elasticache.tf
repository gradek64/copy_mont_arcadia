resource "aws_elasticache_subnet_group" "monty-cache" {
  name = "monty-cache"
  description = "elasticache subnet group for monty"
  subnet_ids = ["${split(",", var.subnet_ids)}"]
}
