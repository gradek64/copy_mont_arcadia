FROM jenkins:2.19.3-alpine
USER root
RUN apk update \
  && apk add docker
COPY executors.groovy /usr/share/jenkins/ref/init.groovy.d/executors.groovy
COPY job_scripts/ /usr/share/jenkins/ref/job_scripts/
RUN /usr/local/bin/install-plugins.sh \
role-strategy \
github \
s3 \
ansicolor \
simple-theme-plugin \
slack \
rebuild \
build-timeout \
build-name-setter \
build-environment \
build-monitor-plugin \
credentials-binding \
swarm \
nodejs
