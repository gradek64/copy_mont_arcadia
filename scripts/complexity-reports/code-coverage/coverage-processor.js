/* eslint-disable */
var MIN_COVERAGE = 80
var ASC = 'a'
var DESC = 'd'
var SORT_BY = 'changes'
var SORT_ORDER = ASC
var JEST_COVERAGE_REPORT = '../../../coverage/coverage-summary.json'
var GIT_HISTORY = '../generated-reports/git-history.txt'
var finalCoverageInfo

function processData(coverageData) {
  var files = []

  for (var data in coverageData) {
    if (data !== 'total') {
      files.push({
        name: data.slice(data.indexOf('full-monty/') + 11),
        statements: coverageData[data].statements.pct,
        branches: coverageData[data].branches.pct,
      })
    }
  }

  return files
}

function insertDataInTheTable(files, newSortBy, newSortOrder) {
  SORT_BY = newSortBy
  SORT_ORDER = newSortOrder

  var tableBody = document.getElementById('coverageTable')

  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild)
  }

  files.forEach((file) => {
    var tableRow = document.createElement('tr')
    var nameColumn = document.createElement('td')
    var gitChangesColumn = document.createElement('td')
    var jestStatementsColumn = document.createElement('td')
    var jestBranchesColumn = document.createElement('td')
    var highestStatementsColumn = document.createElement('td')
    var highestBranchesColumn = document.createElement('td')

    nameColumn.innerText = file.name
    gitChangesColumn.innerText = file.changes
    jestStatementsColumn.innerText = file.statements
    jestBranchesColumn.innerText = file.branches
    highestStatementsColumn.innerText = file.highestStatements
    highestBranchesColumn.innerText = file.highestBranches

    if (file.highestStatements < MIN_COVERAGE) {
      highestStatementsColumn.setAttribute('class', 'valueTooLow')
    }

    if (file.highestBranches < MIN_COVERAGE) {
      highestBranchesColumn.setAttribute('class', 'valueTooLow')
    }

    tableRow.appendChild(nameColumn)
    tableRow.appendChild(gitChangesColumn)
    tableRow.appendChild(highestStatementsColumn)
    tableRow.appendChild(highestBranchesColumn)
    tableRow.appendChild(jestStatementsColumn)
    tableRow.appendChild(jestBranchesColumn)

    tableBody.appendChild(tableRow)
  })
}

function getJestCoverageData() {
  return axios
    .get(JEST_COVERAGE_REPORT)
    .then(function(response) {
      return processData(response.data)
    })
    .catch(function() {
      console.log(
        'Make sure the Jest coverage report is generated: coverage/coverage-summary.json'
      )
    })
}

function extractGitChangesCount(text) {
  var lines = text.split('\n').slice(1)

  var changes = lines.map((line) => {
    var fileInfo = line.split(' ')
    var countIndex = fileInfo.lastIndexOf('') + 1

    return {
      name: fileInfo[countIndex + 1],
      changes: fileInfo[countIndex],
    }
  })

  return changes
}

function getGitHistory() {
  return axios
    .get(GIT_HISTORY)
    .then(function(response) {
      return extractGitChangesCount(response.data)
    })
    .catch(function() {
      console.log(
        'Make sure the Git history file is generated: git-history.txt'
      )
    })
}

function sortCoverageInfo(by) {
  sortAndDisplayCoverageInfo(
    finalCoverageInfo,
    SORT_BY,
    by,
    SORT_ORDER,
    insertDataInTheTable
  )
}

function displayAverageCoverage(coverage, coverageType, elementID) {
  var coverageSum = 0

  for (var coverageItem in coverage) {
    coverageSum += coverage[coverageItem][coverageType]
  }

  document.getElementById(elementID).innerText +=
    (coverageSum / coverage.length).toFixed(2) + '%'
}

getJestCoverageData()
  .then(function(jestCoverage) {
    return jestCoverage.map((jest) => {
      jest.highestStatements = jest.statements
      jest.highestBranches = jest.branches

      return jest
    })
  })
  .then(function(totalCoverage) {
    return getGitHistory().then(function(gitHistory) {
      return totalCoverage.map((file) => {
        var gitChanges = gitHistory.find(
          (history) => history.name === file.name
        )

        file.changes = gitChanges ? parseInt(gitChanges.changes) : 0

        return file
      })
    })
  })
  .then(function(coverageAndGitHistory) {
    finalCoverageInfo = coverageAndGitHistory

    sortAndDisplayCoverageInfo(
      finalCoverageInfo,
      SORT_BY,
      SORT_BY,
      SORT_ORDER,
      insertDataInTheTable
    )

    document.getElementById('totalFilesCount').innerText +=
      coverageAndGitHistory.length

    displayAverageCoverage(
      coverageAndGitHistory,
      'highestStatements',
      'averageStatementsCoverage'
    )
    displayAverageCoverage(
      coverageAndGitHistory,
      'highestBranches',
      'averageBranchesCoverage'
    )
  })
  .catch(function(e) {
    console.log('Make sure all reports are generated', e)

    document.getElementById('errorMessage').innerHTML =
      'Make sure that all reports are generated: ' +
      '<ul>' +
      '<li>coverage/coverage-summary.json</li>' +
      '<li>scripts/coverage-custom-report/git-history.txt</li>' +
      '</ul>'
  })
/* eslint-disable */
