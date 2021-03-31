#!/bin/bash
yum update -y \
&& yum install -y docker git jq java-1.8.0-openjdk-devel \
&& alternatives --set java /usr/lib/jvm/jre-1.8.0-openjdk.x86_64/bin/java \
&& mkdir ~/.docker \
&& echo "{\"auths\": {\"https://index.docker.io/v1/\": {\"auth\": \"${dockerhub_auth}\"}}}" > ~/.docker/config.json \
&& service docker start \
&& docker run --name jenkins-master --restart unless-stopped -d -p 8080:8080 -p 50000:50000 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /var/jenkins_home/:/var/jenkins_home/ \
arcadiagroup/production-jenkins:latest \
&& curl --create-dirs -sSLo ./swarm-client-2.2-jar-with-dependencies.jar http://repo.jenkins-ci.org/releases/org/jenkins-ci/plugins/swarm-client/2.2/swarm-client-2.2-jar-with-dependencies.jar \
&& java -jar ./swarm-client-2.2-jar-with-dependencies.jar -master http://127.0.0.1:8080 -name localhost -username admin -password $(cat /var/jenkins_home/secrets/initialAdminPassword) -executors 1
