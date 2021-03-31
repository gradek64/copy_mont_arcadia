#!/usr/bin/env bash

source "$(dirname $0)/lib/shell_utils.sh"

require_env_var "NEWRELIC_INSIGHTS_API_KEY"
require_env_var "SLACK_WEBHOOK_URL"

SINCE_MINUTES_AGO="${SINCE_MINUTES_AGO:-30}"
NUMBER_ORDERS=$(curl \
-H "Accept: application/json" \
-H "X-Query-Key: $NEWRELIC_INSIGHTS_API_KEY" \
"https://insights-api.newrelic.com/v1/accounts/1306259/query?nrql=\
SELECT%20count(*)%20\
FROM%20Transaction%20\
WHERE%20appName%20%3D%20%27monty-production%27%20\
AND%20name%20%3D%20%27WebTransaction%2FHapi%2FPOST%2F%2Forder-complete%27%20\
AND%20%60response.status%60%20%3D%20200%20\
SINCE%20$SINCE_MINUTES_AGO%20minutes%20ago" \
| grep -o "\"count\":[^\}]*" | grep -o "[^\":]*$")

echo "Number of successful orders in the last $SINCE_MINUTES_AGO minutes: $NUMBER_ORDERS"

if [ "$NUMBER_ORDERS" = 0 ]; then
  message="No successful orders in the last $SINCE_MINUTES_AGO minutes!!!"

  curl -X POST "$SLACK_WEBHOOK_URL" \
  -d "{\"channel\": \"#devops\", \
\"username\": \"monty_prod_panicbot\", \
\"text\": \"$message\", \
\"icon_emoji\": \":cowboy:\"}"

  echo "$message"
  exit 1
fi
