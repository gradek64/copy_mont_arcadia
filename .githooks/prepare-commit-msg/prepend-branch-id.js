#!/usr/bin/env node

const exec = require('child_process').exec
const util = require('util')
const fs = require('fs')
const utils = require('../utils')
let contents = null

const commitFile = process.env.GIT_PARAMS

// expect .git/COMMIT_EDITMSG
if (/COMMIT_EDITMSG/g.test(commitFile)) {
  // look for current branch name
  exec('git branch | grep \'*\'',
    function (err, stdout) {
      if (err) {
        // git branch will fail if initial commit has not been done,
        // so we can safely skip this hook
        process.exit(0)
      }
      // opens .git/COMMIT_EDITMSG
      contents = fs.readFileSync(commitFile)

      // trims extra characters from start/end of line
      let name = stdout.replace('* ', '').replace('\n', '')

      // On the release branch: no need for Jira ticket ID
      if (name.includes('release')) process.exit(0)

      // If the branch has a description, pull that
      exec('git config branch.' + name + '.description',
        function (err, stdout) {
          // don't handle errors (because we write out branch anyway)

          // we found a description, add to 'name'
          if (stdout) {
            name = util.format(`${name} (${stdout.replace(/\n/g, '')})`)
          }

          // '(no branch)' indicates we are in a rebase or other non-HEAD scenario
          if (name !== '(no branch)') {
            const branchId = utils.getBranchId(name)
            const contentsStartWithValidBranchId = utils.startsWithValidBranchId(contents.toString())
            if (!branchId && !contentsStartWithValidBranchId) {
              process.stdout.write(`COMMIT FAILED: No {JIRA_ID}, E2E or HOTFIX found in branch name or at the beginning of your commit message.\n`)
              process.exitCode = 1
              process.exit()
            }

            // Prepend ID to original contents.
            if (!contentsStartWithValidBranchId) contents = util.format(`${branchId.toUpperCase()} ${contents}\n`)

            // write contents back out to .git/COMMIT_EDITMSG
            fs.writeFileSync(commitFile, contents)
            process.exit(0)
          } else {
            process.exit(0)
          }
        })
    })
}
