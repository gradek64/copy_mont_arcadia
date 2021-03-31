const path = require('path')
const readline = require('readline')
const colors = require('colors/safe')
const cwd = process.cwd()

module.exports = class MinimalJestReporter {
  onRunStart() {
    console.log('\n')
    const progressChars = ['|', '/', '-', '\\']
    this.progressIndex = 0
    this.intervalId = setInterval(() => {
      readline.clearLine(process.stdout)
      readline.cursorTo(process.stdout, 0)
      process.stdout.write(progressChars[this.progressIndex])
      this.progressIndex = (this.progressIndex + 1) % progressChars.length
    }, 100)
  }

  onTestResult(meta, testResults, allTestResults) {
    if (testResults.numFailingTests === 0) return

    readline.clearLine(process.stdout)
    readline.cursorTo(process.stdout, 0)
    console.log(`Failed test${testResults.numFailingTests > 1 ? 's' : ''} in ${meta.path.substr(cwd.length + 1)}`)
    console.log(testResults.failureMessage)
  }

  onRunComplete(contexts, results) {
    clearInterval(this.intervalId)
    readline.clearLine(process.stdout)
    readline.cursorTo(process.stdout, 0)
    const {
      numTotalTests,
      numPassedTests,
      numFailedTests,
      numPendingTests,
      startTime
    } = results
    const timeInMs = Date.now() - startTime
    if (numTotalTests > 0 && numFailedTests === 0)
      console.log(colors.green('All green! 🎉'))

    console.log([
      `Total: ${numTotalTests}`,
      `Passed: ${numPassedTests}`,
      `Pending: ${numPendingTests}`,
      `Failed: ${numFailedTests}`
    ].join(', '))
    console.log(`Finished in: ${timeInMs}ms`)
  }

  getLastError() {
    if (this._shouldFail) throw new Error()
  }
}
