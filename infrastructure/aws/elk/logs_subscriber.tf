resource "aws_cloudwatch_log_subscription_filter" "test_lambdafunction_logfilter" {
  name            = "tf_lambdafunction_logfilter"
  log_group_name  = "full-monty-app"
  filter_pattern  = "{$.request_uri != \"/health\"}"
  destination_arn = "${var.log_filter_destination_arn}"
  distribution    = "Random"
}
