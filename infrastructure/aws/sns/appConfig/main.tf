resource "aws_sns_topic" "app_config" {
  name = "${var.sns_topic_name_app_config}"
  display_name = "${var.sns_topic_display_name_app_config}"
}
