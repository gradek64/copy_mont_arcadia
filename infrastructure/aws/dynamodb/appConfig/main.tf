resource "aws_dynamodb_table" "appConfig" {
  name = "${var.table_name_app_config}"
  read_capacity = "${var.read_capacity_app_config}"
  write_capacity = "${var.write_capacity_app_config}"
  hash_key = "${var.hash_key_app_config}"

  attribute {
    name = "${var.attr_name_app_config}"
    type = "S"
  }

  provisioner "local-exec" {
    command = "aws dynamodb --region=eu-west-1 wait table-exists --table-name ${var.table_name_app_config} && aws dynamodb --region=eu-west-1 batch-write-item --request-items file://app_config.json && aws dynamodb --region=eu-west-1 batch-write-item --request-items file://klarna.json"
  }
}
