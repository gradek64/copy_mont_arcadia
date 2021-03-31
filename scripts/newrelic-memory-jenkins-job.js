'use strict';

var request = require('superagent');

var hostIds = [];
var hostMemoryUsages = [];

request.get('https://api.newrelic.com/v2/applications.json?filter[name]=monty-production').set('X-Api-Key', process.env.NEWRELIC_PROD_API_KEY).set('Accept', 'application/json').end(function (err, res) {
  hostIds = res.body['applications'][0]['links']['application_hosts'];
  var fetchUsedMbByHosts = hostIds.map(function (hostId) {
    return new Promise(function (resolve, reject) {
      request.get('https://api.newrelic.com/v2/applications/19649078/hosts/' + hostId + '/metrics/data.json?names[]=Memory/Physical&values[]=used_mb_by_host&summarize=false').set('X-Api-Key', process.env.NEWRELIC_PROD_API_KEY).set('Accept', 'application/json').then(function (res) {
        var usedMb = res.body['metric_data']['metrics'][0]['timeslices'][0]['values']['used_mb_by_host'];
        resolve(usedMb);
      });
    });
  });

  Promise.all(fetchUsedMbByHosts).then(function (usedMbByHosts) {
    var hostMemoryUsages = usedMbByHosts.filter(function (usedMb) {
      return usedMb !== 0;
    });
    var averageHostMemoryUsage = (hostMemoryUsages.reduce(function (current, next) {
      return current + next;
    }, 0) / hostMemoryUsages.length).toFixed(2);

    if (hostMemoryUsages.filter(function (memory) {
      return memory >= 1024;
    }).length > 0) {
      request.post('https://hooks.slack.com/services/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').send({ "channel": "#monty", "username": "monty_prod_panicbot", "text": 'Someone please check Newrelic, I\'m freaking out because the average memory for the hosts is ' + averageHostMemoryUsage + '!!!', "icon_emoji": ":ghost:" }).end(function (err, res) {
        return console.log('panicking big time!');
      });
    } else {
      console.log('No Memory Leakages per host!');
      console.log('Current average memory per host is ' + averageHostMemoryUsage)
    }
  });
});

