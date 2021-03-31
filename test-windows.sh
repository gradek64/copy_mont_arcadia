TAGS="--cucumberOpts.tags=$1"
if [ $# -eq 0 ]
  then TAGS=""
fi
cmd //c start cmd //k node node_modules/webdriverio/bin/wdio $TAGS test/e2e/wdio.config.js
