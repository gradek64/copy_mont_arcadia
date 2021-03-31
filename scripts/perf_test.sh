#!/bin/bash

source "$(dirname $0)/lib/shell_utils.sh"
docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD
eval $(aws ecr get-login --region eu-west-1 --no-include-email)

set -x

export COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME:-fullmonty}
export FORMATTED_BRANCH_NAME=${BRANCH_NAME//\//-} #replacing '/' with '-' as per docker tag name rules
export AWS_REGION=eu-west-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')

[ 8121118 -eq "$(stat -c %s /usr/bin/docker-compose)" ] \
&& curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose
chmod +x /usr/bin/docker-compose

touch .env .env-test-runner

[ -z "$API" ] && export API=STAGE
API_URL_VAR="API_URL_$API"
eval API_URL=\$$API_URL_VAR
API_KEY_VAR="API_KEY_$API"
eval API_KEY=\$$API_KEY_VAR
export API_KEY

docker ps -aq | xargs --no-run-if-empty docker stop
docker system prune -a -f --volumes

source "$(dirname $0)/lib/docker.sh"
delete_ecr_images_except_current_commit

env > .env

docker-compose pull --parallel monty_cache monty
NODE_ENV=production docker-compose run -d --service-ports monty

#Map the private ip to localhost as that's what jmeter looks for
PRIVATE_IP=$(ip addr | grep 'state UP' -A2 -m 1 | tail -n1 | awk '{print $2}' | cut -f1  -d'/')
echo -e "127.0.0.1\tip-${PRIVATE_IP//./-}" >> /etc/hosts

until $(curl --output /dev/null --silent --head http://127.0.0.1:3000/en/product/search?q=jumper); do
    echo 'waiting for localhost:3000...'
    sleep 5
done

wget -c https://www.dropbox.com/s/3cub3ux0t4qfn17/nmon-14g-1.el6.rf.x86_64.rpm?dl=1 && mv nmon-14g-1.el6.rf.x86_64.rpm\?dl\=1 nmon-14g-1.el6.rf.x86_64.rpm && sudo rpm -ivh nmon-14g-1.el6.rf.x86_64.rpm && rm *.rpm

docker ps -a

nc -z 0.0.0.0 3000
if [ "$?" != 0 ]; then
  echo "restarting monty docker container"
  NODE_ENV=production docker-compose run -d --service-ports monty
fi

until $(curl --output /dev/null --silent --head http://127.0.0.1:3000/en/product/search?q=jumper); do
    echo 'waiting for localhost:3000...'
    sleep 5
done

cd capacitas
rm -f results*.csv
rm -rf nmon/logs
mkdir -p nmon/logs
nmon -ft -s 15 -c 68 -m nmon/logs

apache-jmeter-3.2/bin/jmeter -n -t topshop_test_script.jmx

FIRST_TIMESTAMP=$(cat results_*.csv | sed -n 2p | cut -d, -f1)
EPOCH=$(date -d "${FIRST_TIMESTAMP}" +%s)
FIVE_SECS_LATER=$(date '+%C%y-%m-%d %H:%M:%S' -d @$(($EPOCH + 5)) | sed 's/:/\%3A/g' | sed 's/ /\%20/g')

#Send the results and nmon to Capacitas
curl -v --tlsv1.2 --cacert ${capacitas-certificate}  -T $(ls results*.csv) ftp://arcadia-analysisplatform.capacitas.co.uk/Jmeter/ -u ${USER}:${PASSWORD}

curl -v --tlsv1.2 --cacert ${capacitas-certificate}  -T $(ls nmon/logs/*.nmon) ftp://arcadia-analysisplatform.capacitas.co.uk/Nmon/ -u ${USER}:${PASSWORD}

#Get the analysis result back from Capacitas
TOKEN=$(curl -vX POST https://arcadia-analysisplatform-capacitas.co.uk:444/authorization/token -d "username=arcadiaci&password=${PASSWORD}&grant_type=password&client_id=7&client_secret=${SECRET}" \
 --header "Content-Type: application/x-www-form-urlencoded" | get_value_of_json_key "access_token")

curl -vXGET -H "authorization: bearer $TOKEN" -H "content-type: application/x-www-form-urlencoded" \
"https://arcadia-analysisplatform-capacitas.co.uk:444/Api/FileScraper/BeginTest?testName=Config%20Test&hostAddr=127.0.0.1&startTime=${FIVE_SECS_LATER}&scraperID=2&entityMaskID=3&environmentID=0&testID=3&testPlanID=1"
