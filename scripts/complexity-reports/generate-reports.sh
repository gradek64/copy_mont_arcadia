echo 'Generating the reports ...'

if [ ! -d "$(dirname $0)/generated-reports" ]; then
 mkdir $(dirname $0)/generated-reports
fi

source $(dirname $0)/common/bash-scripts/git-history.sh $(dirname $0)/generated-reports

source $(dirname $0)/common/bash-scripts/cyclomatic-complexity.sh $(dirname $0)/generated-reports
