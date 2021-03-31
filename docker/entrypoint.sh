#!/bin/sh

# aws-cli still doesn't seem to work without this
aws_region=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document|grep region|awk -F\" '{print $4}')
ssm_googleauth_name="${SSM_NAMESPACE:-/monty}/encrypted/google-auth-json"

echo "initialising SSM credentials for '${ssm_googleauth_name}' variable using '${SSM_NAMESPACE}' namespace"
aws --region ${aws_region} ssm get-parameter --name ${ssm_googleauth_name} --with-decryption --output=text --query='Parameter.Value' > /monty/googleauth.json

# set the environment variable needed for the google API
if [ "$?" -eq "0" ]
then
  export GOOGLE_APPLICATION_CREDENTIALS=/monty/googleauth.json
  echo "SSM parameters retrieved"
else
  echo "Unable to retrieve SSM parameters"
fi

# run the CMD
exec "$@"
