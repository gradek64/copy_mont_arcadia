/* eslint-disable */

var JENKINS_BASE_PATH =
  'https://jenkins.digital.arcadiagroup.co.uk/job/jenkins2/job'
var JOBS_API_PARAMS =
  'api/json?tree=jobs[name,color,lastBuild[number,duration,timestamp,result]]'
var PIPELINE_API_PARAMS = 'api/json?tree=builds[displayName,duration,result]'
var MOCKED_RESPONSE_JOBS = '../generated-reports/jenkins-builds.json'
var MOCKED_RESPONSE_PIPELINES = '../generated-reports/jenkins-pipelines.json'
var JENKINS_JOBS = [
  // MOCKED_RESPONSE_JOBS,
  'monty',
  'monty%20e2e%20tests',
  'monty%20e2e%20v2%20tests',
  'monty%20unit%20tests',
]
var JENKINS_PIPELINES = [
  // MOCKED_RESPONSE_PIPELINES,
  'monty%20deploy',
]

function msToTime(duration) {
  var seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24)

  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  return hours + ':' + minutes + ':' + seconds
}

function insertDataInTheTable(jobStats) {
  var tableBody = document.getElementById('jenkinsBuildsTable')

  var tableRow = document.createElement('tr')
  var nameLink = document.createElement('a')
  var nameColumn = document.createElement('td')
  var totalBuildsCountColumn = document.createElement('td')
  var successfulAverageBuildTimeColumn = document.createElement('td')
  var successfulShortestDurationColumn = document.createElement('td')
  var successfulLongestDurationColumn = document.createElement('td')
  var successfulBuildsCountColumn = document.createElement('td')
  var failedAverageBuildTimeColumn = document.createElement('td')
  var failedBuildsCountColumn = document.createElement('td')
  var failedShortestDurationColumn = document.createElement('td')
  var failedLongestDurationColumn = document.createElement('td')

  nameLink.setAttribute('href', `${JENKINS_BASE_PATH}/${jobStats.name}`)
  nameLink.innerText = jobStats.name.replace(/%20/g, ' ')

  nameColumn.appendChild(nameLink)
  totalBuildsCountColumn.innerText = jobStats.totalBuildsCount
  successfulBuildsCountColumn.innerText = jobStats.successfulBuildsCount
  successfulAverageBuildTimeColumn.innerText =
    jobStats.successfulAverageBuildTime
  successfulShortestDurationColumn.innerText =
    jobStats.successfulShortestDuration
  successfulLongestDurationColumn.innerText = jobStats.successfulLongestDuration
  failedBuildsCountColumn.innerText = jobStats.failedBuildsCount
  failedAverageBuildTimeColumn.innerText = jobStats.failedAverageBuildTime
  failedShortestDurationColumn.innerText = jobStats.failedShortestDuration
  failedLongestDurationColumn.innerText = jobStats.failedLongestDuration

  tableRow.appendChild(nameColumn)
  tableRow.appendChild(totalBuildsCountColumn)
  tableRow.appendChild(successfulBuildsCountColumn)
  tableRow.appendChild(successfulAverageBuildTimeColumn)
  tableRow.appendChild(successfulShortestDurationColumn)
  tableRow.appendChild(successfulLongestDurationColumn)
  tableRow.appendChild(failedBuildsCountColumn)
  tableRow.appendChild(failedAverageBuildTimeColumn)
  tableRow.appendChild(failedShortestDurationColumn)
  tableRow.appendChild(failedLongestDurationColumn)

  tableBody.appendChild(tableRow)
}

function getJobStatistics(job, builds) {
  var successfulCount = 0
  var successfulSum = 0
  var successfulShortestDuration = -1
  var successfulLongestDuration = 0
  var failedCount = 0
  var failedSum = 0
  var failedShortestDuration = -1
  var failedLongestDuration = 0

  builds.forEach((build) => {
    var buildInfo =
      build.lastBuild && build.lastBuild.result ? build.lastBuild : build

    if (buildInfo.result === 'SUCCESS') {
      successfulCount++
      successfulSum += buildInfo.duration

      if (successfulShortestDuration === -1) {
        successfulShortestDuration = buildInfo.duration
        successfulLongestDuration = buildInfo.duration
      } else {
        successfulShortestDuration =
          successfulShortestDuration < buildInfo.duration
            ? successfulShortestDuration
            : buildInfo.duration
        successfulLongestDuration =
          successfulLongestDuration > buildInfo.duration
            ? successfulLongestDuration
            : buildInfo.duration
      }
    } else if (
      buildInfo.result === 'FAILURE' ||
      buildInfo.result === 'UNSTABLE'
    ) {
      failedCount++
      failedSum += buildInfo.duration

      if (failedShortestDuration === -1) {
        failedShortestDuration = buildInfo.duration
        failedLongestDuration = buildInfo.duration
      } else {
        failedShortestDuration =
          failedShortestDuration < buildInfo.duration
            ? failedShortestDuration
            : buildInfo.duration
        failedLongestDuration =
          failedLongestDuration > buildInfo.duration
            ? failedLongestDuration
            : buildInfo.duration
      }
    }
  })

  return {
    name: job,
    successfulAverageBuildTime:
      successfulCount > 0
        ? msToTime(successfulSum / successfulCount)
        : '00:00:00',
    successfulBuildsCount: successfulCount.toString(),
    successfulShortestDuration:
      successfulCount > 0 ? msToTime(successfulShortestDuration) : '00:00:00',
    successfulLongestDuration:
      successfulCount > 0 ? msToTime(successfulLongestDuration) : '00:00:00',
    failedAverageBuildTime:
      failedCount > 0 ? msToTime(failedSum / failedCount) : '00:00:00',
    failedBuildsCount: failedCount.toString(),
    totalBuildsCount: successfulCount + failedCount,
    failedShortestDuration:
      failedCount > 0 ? msToTime(failedShortestDuration) : '00:00:00',
    failedLongestDuration:
      failedCount > 0 ? msToTime(failedLongestDuration) : '00:00:00',
  }
}

function filterBuilds(builds) {
  return builds.filter(
    (build) => build.result || (build.lastBuild && build.lastBuild.result)
  )
}

function getJenkinsJobsInfo() {
  var requests = JENKINS_JOBS.map((job) => {
    var url =
      job === MOCKED_RESPONSE_JOBS
        ? MOCKED_RESPONSE_JOBS
        : `${JENKINS_BASE_PATH}/${job}/${JOBS_API_PARAMS}`

    return axios
      .get(url)
      .then(function(response) {
        var stats = getJobStatistics(job, filterBuilds(response.data.jobs))
        insertDataInTheTable(stats)
      })
      .catch(function(e) {
        console.log('Could not retrieve the jenkins info', e)

        var errorMessage = document.createElement('p')
        errorMessage.innerText = `Could not retrieve the info for: ${url}`

        document.getElementById('errorMessage').appendChild(errorMessage)
      })
  })

  return Promise.all(requests)
}

function getJenkinsPipelinesInfo() {
  var requests = JENKINS_PIPELINES.map((pipeline) => {
    var url =
      pipeline === MOCKED_RESPONSE_PIPELINES
        ? MOCKED_RESPONSE_PIPELINES
        : `${JENKINS_BASE_PATH}/${pipeline}/${PIPELINE_API_PARAMS}`

    return axios
      .get(url)
      .then(function(response) {
        var stats = getJobStatistics(
          pipeline,
          filterBuilds(response.data.builds)
        )
        insertDataInTheTable(stats)
      })
      .catch(function(e) {
        console.log('Could not retrieve the info for', e)

        var errorMessage = document.createElement('p')
        errorMessage.innerText = `Could not retrieve the info for: ${url}`

        document.getElementById('errorMessage').appendChild(errorMessage)
      })
  })

  return Promise.all(requests)
}

Promise.all([getJenkinsJobsInfo(), getJenkinsPipelinesInfo()])

/* eslint-disable */
