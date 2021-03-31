import { is, isEmpty } from 'ramda'

export const isNonEmptyArray = (x) => Array.isArray(x) && !isEmpty(x)

export const isNonEmptyObject = (x) =>
  is(Object, x) && !isEmpty(x) && !Array.isArray(x)

export const getDayNames = () => [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const getMonthNames = () => [
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

export const getCurrentDate = () => new Date()

export const generateCutoffTimestamp = (date, cutoffTime) => {
  const [hours, minutes] = Array.isArray(cutoffTime)
    ? cutoffTime
    : cutoffTime.split(':')
  const cutoffDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  )
  return cutoffDate.getTime()
}

export const isTimePast = (cutoffTime) => {
  if (!cutoffTime) return true
  const now = new Date()
  const time = generateCutoffTimestamp(now, cutoffTime)
  return !isNaN(time) && now.getTime() >= time
}

export const formatDateAsYMD = (date) => {
  return [
    date.getFullYear(),
    `0${date.getMonth() + 1}`.slice(-2),
    `0${date.getDate()}`.slice(-2),
  ].join('-')
}

export const getNumberOfDaysFromNow = (day) => {
  if (day === 'today' || !day) return 0
  const dayNames = getDayNames()
  const dayIndex = dayNames.findIndex((d) => day === d)
  const todayIndex = new Date().getDay()
  const calcDay = dayIndex - todayIndex
  return calcDay < 0 ? dayNames.length + 1 + calcDay : calcDay
}

export const getDayFromDateString = (d) => {
  const dayNames = getDayNames()
  const date = new Date(d)
  return !isNaN(date.getDay()) && dayNames[date.getDay()]
}

export const getMonthFromDateString = (d) => {
  const monthNames = getMonthNames()
  const date = new Date(d)
  return !isNaN(date.getMonth()) && monthNames[date.getMonth()]
}

export const getLongDate = (date) => {
  if(date) {
    const d = new Date(date)
    const dayString = getDayFromDateString(date)
    const dateNumber = d.getDate()
    const monthString = getMonthFromDateString(date)
    const yearNumber = d.getFullYear(date)
    const longDateString = `${dayString} ${dateNumber} ${monthString} ${yearNumber}`
    return longDateString
  }
  return null
}
