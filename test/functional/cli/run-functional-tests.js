const inquirer = require('inquirer')
const runCommands = require('./run-commands')
const questions = require('./questions')

function handleAnswers(answers) {
  runCommands(answers)
}

function launchSession() {
  const session = inquirer.prompt(questions)

  session.then(handleAnswers)
}

launchSession()
