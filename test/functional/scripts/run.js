const cypress = require('cypress')
const mergeRep = require('mochawesome-report-generator')
const {merge} = require('mochawesome-merge')
const fse = require('fs-extra')
const argv = require('minimist')(process.argv.slice(2))
const {error} = console

async function runCypress() {
    await fse.remove('mochawesome-report')
    await cypress
        .run({
            spec: argv['spec'] || 'test/functional/cypress/integration/**/*.js'
        })
        .then(
            () => {
                generateReport()
            },
            (err) => {
                generateReport()
                error(err)
                process.exit(1)
            }
        )
}

function generateReport(options) {
    return merge(options).then((report) => mergeRep.create(report, options))
}

runCypress()
