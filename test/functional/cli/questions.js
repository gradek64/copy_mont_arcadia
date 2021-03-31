module.exports = [
  {
    type: 'list',
    message: 'How do you want to run monty?',
    name: 'buildOrRun',
    choices: ['dev', 'build', 'skip'],
  },
  {
    type: 'list',
    message: 'Which breakpoint?',
    name: 'breakpoint',
    choices: ['mobile', 'desktop'],
  },
  {
    type: 'list',
    message: 'How do you want to run cypress?',
    name: 'runOrOpen',
    choices: ['open', 'run'],
  },
  {
    type: 'list',
    message: 'Rerun failures?',
    name: 'retries',
    choices: ['no', 'yes'],
  },
  {
    type: 'input',
    message:
      'What tests should be run? (* or path relative to integration folder)',
    name: 'runPattern',
    when: (answers) => answers.run === 'run',
    validate: (answer) => {
      if (!answer) {
        return 'Please enter a path or *'
      }

      if (answer.trim() === '*') {
        return true
      }

      if (!/^\/?([^/]+\/)+.*\.js$/.test(answer)) {
        return 'Please enter a valid path'
      }

      return true
    },
  },
  {
    type: 'list',
    message: 'Run in chrome or electron?',
    name: 'platform',
    choices: ['chrome', 'electron'],
    when: (answers) => answers.run === 'run',
  },
]
