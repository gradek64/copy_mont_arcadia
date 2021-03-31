/* eslint-disable */
var DESC = 'd'
var SORT_BY = 'name'
var SORT_ORDER = DESC
var SRC_COMPLEXITY = '../generated-reports/src-complexity.txt'
var TESTS_COMPLEXITY = '../generated-reports/tests-complexity.txt'
var currentFileType
var complexityInfoToDisplay

function insertDataInTheTable(files, newSortBy, newSortOrder) {
  SORT_BY = newSortBy
  SORT_ORDER = newSortOrder

  var tableBody = document.getElementById('complexityTable')

  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild)
  }

  files.forEach((file) => {
    var tableRow = document.createElement('tr')
    var nameColumn = document.createElement('td')
    var functionNameColumn = document.createElement('td')
    var functionComplexityColumn = document.createElement('td')

    nameColumn.innerText = file.name
    functionNameColumn.innerText = file.functionName
    functionComplexityColumn.innerText = file.functionComplexity

    tableRow.appendChild(nameColumn)
    tableRow.appendChild(functionNameColumn)
    tableRow.appendChild(functionComplexityColumn)

    tableBody.appendChild(tableRow)
  })
}

function sortCoverageInfo(by) {
  sortAndDisplayCoverageInfo(
    complexityInfoToDisplay,
    SORT_BY,
    by,
    SORT_ORDER,
    insertDataInTheTable
  )
}

function extractComplexity(text) {
  var lines = text.split('\n')

  var lastIndex = lines.length - 1

  while (!lines[lastIndex] || !lines[lastIndex].includes('full-monty')) {
    lastIndex--
  }

  lines = lines.slice(0, lastIndex + 1)

  return lines.map((line) => {
    var fileInfo = line.split(' ')

    return {
      name: fileInfo[0]
        .slice([fileInfo[0].indexOf('full-monty') + 11])
        .replace(':', ''),
      functionName:
        (fileInfo[7] === 'Arrow'
          ? 'Arrow Function'
          : fileInfo[7] === 'Constructor'
            ? 'Constructor'
            : fileInfo[8].replace(/\'/g, '')) +
        ', line ' +
        fileInfo[2].replace(',', ''),
      functionComplexity: parseInt(
        fileInfo[fileInfo.length - 2].replace('.', '')
      ),
    }
  })
}

function getSourceCodeComplexity() {
  return axios
    .get(SRC_COMPLEXITY)
    .then(function(response) {
      return extractComplexity(response.data)
    })
    .catch(function(e) {
      console.log(
        'Make sure the src complexity file is generated: src-complexity.txt',
        e
      )
    })
}

function getTestsComplexity() {
  return axios
    .get(TESTS_COMPLEXITY)
    .then(function(response) {
      return extractComplexity(response.data)
    })
    .catch(function(e) {
      console.log(
        'Make sure the src complexity file is generated: tests-complexity.txt',
        e
      )
    })
}

function processComplexity(complexity, minComplexityToDisplay) {
  complexityInfoToDisplay = !minComplexityToDisplay
    ? complexity
    : complexity.filter(
        (complexityItem) =>
          complexityItem.functionComplexity >= minComplexityToDisplay
      )

  sortAndDisplayCoverageInfo(
    complexityInfoToDisplay,
    SORT_BY,
    SORT_BY,
    SORT_ORDER,
    insertDataInTheTable
  )

  document.getElementById('totalFilesCount').innerText = complexity.length

  var averageCyclomaticComplexity = 0

  for (var complexityItem in complexity) {
    averageCyclomaticComplexity += complexity[complexityItem].functionComplexity
  }

  document.getElementById('averageCyclomaticComplexity').innerText = (
    averageCyclomaticComplexity / complexity.length
  ).toFixed(2)
}

function setSelectionButtonAsActive(selectedBtn) {
  if (selectedBtn) {
    var selectedButtons = document.getElementsByClassName('btn-light')

    for (var i = 0; i < selectedButtons.length; i++) {
      selectedButtons[i].classList.remove('active')
    }

    selectedBtn.classList.add('active')
  }
}

function selectFileType(type, selectedBtn) {
  setSelectionButtonAsActive(selectedBtn)

  if (type !== currentFileType) {
    currentFileType = type

    if (type === 'src') {
      getSourceCodeComplexity()
        .then(function(complexity) {
          document.getElementById('errorMessage').innerHTML = ''

          processComplexity(complexity)
        })
        .catch(function() {
          document.getElementById('errorMessage').innerHTML =
            'Make sure that src-complexity.txt is generated'
        })
    } else {
      getTestsComplexity()
        .then(function(complexity) {
          document.getElementById('errorMessage').innerHTML = ''

          processComplexity(complexity, 2)
        })
        .catch(function() {
          document.getElementById('errorMessage').innerHTML =
            'Make sure that test-complexity.txt is generated'
        })
    }
  }
}

selectFileType('src')

/* eslint-disable */
