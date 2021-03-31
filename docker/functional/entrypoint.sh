#!/bin/sh

cd /monty && node ./mock-server/index.js >> mock-server/output.log &

# usually this will be $(npm bin)/cypress run or something similar. but we want to keep it flexible
exec "$@"
