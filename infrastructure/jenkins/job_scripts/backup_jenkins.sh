#!/bin/bash

# Uncomment if you need to check the AWS ARN used for this request
# aws sts get-caller-identity

# Delete all files in the workspace
echo "INFO - Cleaning up current workspace ${PWD}"
rm -rf *

# Create a directory for the job definitions
echo "INFO - Creating folder for the job definitions: ${BUILD_ID}/jobs"
mkdir -p $BUILD_ID/jobs

# Copy global configuration files into the workspace
echo "INFO - Copying *.xml from ${JENKINS_HOME} to ${BUILD_ID}"
cp $JENKINS_HOME/*.xml $BUILD_ID/

# Copy keys and secrets into the workspace
#echo "INFO - Copying keys and secrets into the current workspace"
cp $JENKINS_HOME/identity.key.enc $BUILD_ID/
cp $JENKINS_HOME/secret.key $BUILD_ID/
cp $JENKINS_HOME/secret.key.not-so-secret $BUILD_ID/
cp -r $JENKINS_HOME/secrets $BUILD_ID/

# Copy user configuration files into the workspace
echo "INFO - Copying user configuration files"
cp -r $JENKINS_HOME/users $BUILD_ID/

# Copy job definitions into the workspace
echo "INFO - Copying job definitions"
cp -r $JENKINS_HOME/jobs $BUILD_ID/

# Copy the plugins folder into the workspace
echo "INFO - Copying plugins"
cp -r $JENKINS_HOME/plugins $BUILD_ID/

# Create an archive from all copied files (since the S3 plugin cannot copy folders recursively)
echo "INFO - Creating tar archive of archived files"
archive_name="jenkins_dev_new_${BUILD_ID}.tar.gz"
tar czf "${archive_name}" $BUILD_ID/
echo "INFO - Archive created:"
stat "${archive_name}"

# Remove the directory so only the archive gets copied to S3
echo "INFO - Removing the directory so only the backup archive is left"
rm -rf $BUILD_ID
echo "INFO - The archive will now be uploaded to S3"
