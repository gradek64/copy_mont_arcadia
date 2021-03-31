const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

/**
 * takes a number of days and returns the corresponding number of
 * milliseconds
 * @param {number} numberOfDays
 * @return {number}
 */
export const nDaysInMs = (numberOfDays) => day * numberOfDays

/**
 * Given a timestamp from ECMC, formatted like:
 * 2019-08-12-15.41.02.000608
 *
 * Return an ISO 8601 valid date string.
 *
 * @todo We should improve this to factor in the stores timezone and
 * format the date returned accordingly.
 */
export default function ecmcTimestampToISODatetime(dateString) {
  // Check the format of the string is correct.
  if (
    !dateString ||
    (dateString &&
      !/^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{1,6}$/.test(
        dateString
      ))
  ) {
    return ''
  }

  const lastHyphen = dateString.lastIndexOf('-')
  const date = dateString.substring(0, lastHyphen)
  const time = dateString
    .substring(lastHyphen + 1, lastHyphen + 9)
    .split('.')
    .join(':')

  // So, I don't like this but date parsing is messy cross browser, using
  // moment server and client side isn't so simple either so lets just format
  // a string.
  return `${date}T${time}.000Z`
}

const months = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
}

/**
 * either takes an End Date and increments the year, Or generates a new
 * date string based on today plus 1 year.
 * @param {string} [endDate] - optional string that represents a date
 * @requires {string}
 */
export function getDDPEndDate(endDate) {
  /**
   * Takes a date string in given form and increments the year by 1
   * @param {string} endDate - Date String of the form '15 April 2020'
   * @returns {string} '15 April 2020' returns '15 April 2021'
   */
  const incrementYear = (endDate) => {
    const [day, month, year] = endDate.split(' ')
    return `${day} ${month} ${+year + 1}`
  }

  /**
   * generates new date, increments by 1 year and returns a string
   * of the form 'dd mmmm yyyy' e.g. '15 April 2020'
   */
  const constructEndDate = () => {
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1)
    const [year, month, day] = endDate
      .toISOString()
      .substring(0, 10)
      .split('-')
    const dayOfMonth = day.replace(/^0/, '')
    const dateString = `${dayOfMonth} ${months[month]} ${year}`
    return dateString
  }

  return endDate ? incrementYear(endDate) : constructEndDate()
}
const maxExpiryDateLength = 7
const cardExpiryYearLimit = 11
export const getCurrentDecade = () => {
  const currentDacade = Number(
    new Date()
      .getFullYear()
      .toString()
      .substr(-2)
  )
  return currentDacade < 20 ? 20 : Number(currentDacade)
}

export const getCurrentCentury = () => {
  const currentCentury = Number(
    new Date()
      .getFullYear()
      .toString()
      .substr(0, 2)
  )
  return currentCentury < 20 ? 20 : Number(currentCentury)
}

export const isCardExpiryYearInvalid = (year) => {
  return year > getCurrentDecade() + cardExpiryYearLimit
}

export const maxLengthExpiryDate = (value) =>
  value && value.length > maxExpiryDateLength
export const formatExpiryDate = (value) => {
  const prevExpiry = value && value.split(' / ').join('/')

  if (!value) return ['', '']
  let expiry = prevExpiry
  if (/^[2-9]$/.test(expiry)) {
    expiry = `0${expiry}`
  }

  if (prevExpiry.length === 2 && +prevExpiry > 12) {
    const [head, ...tail] = prevExpiry
    expiry = `0${head}/${tail}`
  }

  if (/^1[/-]$/.test(expiry)) {
    return `01 / `
  }

  expiry = expiry.match(/(\d{1,2})/g) || []
  if (expiry.length === 1) {
    if (prevExpiry.includes('/')) {
      return expiry[0]
    }
    if (/\d{2}/.test(expiry)) {
      return `${expiry[0]} / `
    }
  }
  if (expiry.length > 2) {
    const [, month, year] = expiry.join('').match(/^(\d{2}).*(\d{2})$/) || []
    return [month, year].join(' / ')
  }

  return expiry
}
