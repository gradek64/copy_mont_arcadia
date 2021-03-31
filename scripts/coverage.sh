#!/bin/bash

SEND_COVERAGE="docker run --entrypoint /opt/sonar-runner-2.4/bin/sonar-runner   -e SONAR_USER_HOME=/data/.sonar-cache   -v $(pwd):/data -u $(id -u) sebp/sonar-runner     -Dsonar.host.url=http://webstats.digital.arcadiagroup.co.uk:9000     -Dsonar.jdbc.url=jdbc:postgresql://webstats.digital.arcadiagroup.co.uk:5432/sonar     -Dsonar.jdbc.username=sonar     -Dsonar.jdbc.password=xaexohquaetiesoo     -Dsonar.jdbc.driverClassName=org.postgresql.Driver     -Dsonar.embeddedDatabase.port=5432" 

$SEND_COVERAGE
