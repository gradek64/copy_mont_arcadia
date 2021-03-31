/* eslint-disable no-console */

const { createWriteStream } = require('fs')
const { readFile } = require('fs').promises
const { join } = require('path')

const logPath = join(process.env.INIT_CWD, 'results.log')

module.exports = {
  writeToLog(data, path = logPath) {
    const log = createWriteStream(path, {
      flags: 'a',
    })
    log.end(`${JSON.stringify(data)}\n`)
  },
  logToJSON(path = logPath) {
    return readFile(path, 'utf8')
      .then((logs) =>
        logs
          .split('\n')
          .filter(Boolean)
          .map(JSON.parse)
      )
      .catch(console.error)
  },
}
/* eslint-enable no-console */
