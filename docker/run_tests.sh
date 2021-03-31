#!/usr/bin/env bash
set -e
set -x

export DISPLAY=:0.0
export REPORTERS=cucumber,junit

Xvfb :0 -ac -screen 0 1024x768x24 &

# clean up before running test
TEST_REPORTS=${TEST_REPORTS:-test/reports}
[[ `ls -1 test/e2e/screenshots/*.png 2>/dev/null` ]] && { rm test/e2e/screenshots/*.png; }
[[ `ls -1 test/e2e/**/*.log 2>/dev/null` ]] && { rm test/e2e/**/*.log; }
[[ -d ${TEST_REPORTS}/bdd ]] && { rm ${TEST_REPORTS}/bdd/*; } || { mkdir -p ${TEST_REPORTS}/bdd; }


if [[ "${E2E_ONLY}" = "true" ]]; then
  export ENABLE_UNIT=false ENABLE_INTEGRATION=false
fi

if [[ "${E2E_ONLY}" != "true" && $# -eq 0 || $@ == *"lint"* ]]; then
  npm run lint
fi

if [[ "${E2E_ONLY}" != "true" && $# -eq 0 ]]; then
  npm run unit:test
else
  if [[ $@ == *"jest"* ]]; then
    TEST_REPORT_PATH=test/reports TEST_REPORT_FILENAME=jest.xml npm run jest
  elif [[ $@ == *"coreapiintegration"* ]]; then
    ./scripts/wait-for-it.sh local.m.topshop.com:3000 -t 45 -- npm run integration:coreapi
  fi
fi

if [[ $# -eq 0 || $@ == *"e2e"* || $@ == *"smoke"* ]]; then
  ./scripts/wait-for-it.sh local.m.topshop.com:3000 -t 45

  WDIO_CONFIG_FILEPATH=${WDIO_CONFIG_FILEPATH:-test/e2e/wdio.config.js}
  if [ -d "e2ev2" ]; then
    ln -s /usr/bin/chromium-browser /usr/bin/google-chrome
    ls -la /usr/bin/google-chrome
    cd e2ev2
    npm install
    npm run retry
  else
    node_modules/.bin/wdio ${WDIO_CONFIG_FILEPATH} || \
    ( [ -f test/reports/rerun-fail.txt ] && echo "ERROR: E2E TESTS FAILED - RERUNNING FAILED E2E TESTS (1/2)" && FEATURES_PATH=$(cat test/reports/rerun-fail.txt) node_modules/.bin/wdio ${WDIO_CONFIG_FILEPATH}) || \
    ( [ -f test/reports/rerun-fail.txt ] && echo "ERROR: E2E TESTS FAILED - RERUNNING FAILED E2E TESTS (2/2)" && FEATURES_PATH=$(cat test/reports/rerun-fail.txt) node_modules/.bin/wdio ${WDIO_CONFIG_FILEPATH})
  fi

fi
