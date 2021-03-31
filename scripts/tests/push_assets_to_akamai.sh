#!/usr/bin/env bash
docker run -e UID=$(id -u $USER) -e GID=$(id -g $USER) --rm -v $(pwd)/scripts/tests/:/root/.ssh/ --entrypoint /bin/sh ourtownrentals/sshd -c \
'ssh-keygen -t rsa -b 4096 -C "test" -f /root/.ssh/id_rsa -N "" && chown $UID:$GID /root/.ssh/id_rsa*'
docker run --name sshd -d -p 2222:22 -v $(pwd)/scripts/tests/id_rsa.pub:/root/.ssh/authorized_keys ourtownrentals/sshd
docker exec sshd ls -la /root/
sleep 2
SSH_OPTIONS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" scripts/push_assets_to_akamai.sh $(pwd)/scripts/tests/id_rsa localhost /root/ root 2222
docker exec sshd ls -la /root/assets/
docker exec sshd ls -la /root/vp/
docker exec sshd ls -la /root/5xx/
docker stop sshd && docker rm sshd
rm -f scripts/tests/id_rsa*
