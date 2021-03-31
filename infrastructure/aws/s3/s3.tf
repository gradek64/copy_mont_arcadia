resource "aws_s3_bucket_object" "dockerconfig" {
  key = ".dockercfg"
  bucket = "${var.elasticbeanstalk_s3_bucket}"
  content = "{\"https://index.docker.io/v1/\": {\"auth\": \"${var.dockerhub_auth}\"}}"
}
