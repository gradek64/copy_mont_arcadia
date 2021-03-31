const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// String expression for time format HH:MM with optional leading 0 (ie 09:00/9:00)
const TIME_EXP = '([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]'
// RegExp for time range `hh:mm - hh:mm` format
const TIME_RANGE_EXP = RegExp(`^${TIME_EXP}\s?-\s?${TIME_EXP}$`) //eslint-disable-line

export function getTimeInMinutes(hours, minutes) {
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10)
}

function getOrdinalDay(number) {
  const suffix =
    {
      1: 'st',
      2: 'nd',
      3: 'rd',
      21: 'st',
      22: 'nd',
      23: 'rd',
      31: 'st',
    }[number] || 'th'

  return `${number}${suffix}`
}

export function getEnglishDate(dateString) {
  const today = new Date(new Date().toDateString())
  const tomorrow = new Date(
    new Date(new Date().setDate(today.getDate() + 1)).toDateString()
  )
  const date = new Date(new Date(dateString).toDateString())
  const englishDate = `${getOrdinalDay(date.getDate())} ${
    MONTHS[date.getMonth()]
  }`
  const dateTime = date.getTime()

  if (dateTime === today.getTime()) {
    return `today, ${englishDate}`
  }

  if (dateTime === tomorrow.getTime()) {
    return `tomorrow, ${englishDate}`
  }

  return englishDate
}

export const getEarliestCollectionDate = (dates = []) => {
  const presentDate = Date.now()
  const earliestDate = dates.find(({ availableUntil }) => {
    const formattedDate = availableUntil.replace(/-/g, '/')
    return new Date(formattedDate) > presentDate
  })
  return earliestDate && earliestDate.collectFrom
}

export const isValidTimeRange = (timeRangeString = '') => {
  if (
    typeof timeRangeString === 'string' &&
    TIME_RANGE_EXP.test(timeRangeString)
  ) {
    return true
  }
  return false
}
