/* eslint-disable */

var ASC = 'a'
var DESC = 'd'
var UP_ARROW = '&#8673;'
var DOWN_ARROW = '&#8675;'
var ARROW_CONTAINER_SUFFIX = 'SortOrder'
var NOT_SORTED = '-'

function sortAndDisplayCoverageInfo(
  info,
  prevSortBy,
  newSortBy,
  prevSortOrder,
  callback
) {
  var sortBy = newSortBy
  var sortOrder

  if (prevSortBy === newSortBy) {
    sortOrder = prevSortOrder === DESC ? ASC : DESC

    if (sortOrder === ASC) {
      document.getElementById(
        prevSortBy + ARROW_CONTAINER_SUFFIX
      ).innerHTML = UP_ARROW
    } else {
      document.getElementById(
        prevSortBy + ARROW_CONTAINER_SUFFIX
      ).innerHTML = DOWN_ARROW
    }
  } else {
    document.getElementById(
      prevSortBy + ARROW_CONTAINER_SUFFIX
    ).innerHTML = NOT_SORTED

    sortOrder = DESC

    document.getElementById(
      sortBy + ARROW_CONTAINER_SUFFIX
    ).innerHTML = DOWN_ARROW
  }

  if (info) {
    info.sort(function(a, b) {
      if (sortOrder === ASC) {
        return a[sortBy] > b[sortBy] ? 1 : -1
      }

      return b[sortBy] > a[sortBy] ? 1 : -1
    })

    callback(info, sortBy, sortOrder)
  }
}

/* eslint-disable */
