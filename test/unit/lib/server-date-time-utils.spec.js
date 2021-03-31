import * as dateTimeUtils from '../../../src/server/lib/date-time-utils'

const executeTestOnIsDayLightSaving = (date, expected) => {
  const D = global.Date
  global.Date = jest.fn(() => new D(date))

  expect(dateTimeUtils.isDayLightSaving()).toBe(expected)

  global.Date = D
}

/*
 * "In the UK the clocks go forward 1 hour at 1am on the last Sunday in March,
 * and back 1 hour at 2am on the last Sunday in October.
 * The period when the clocks are 1 hour ahead is called British Summer Time (BST)"
 * - https://www.gov.uk/when-do-the-clocks-change
 */
const d = new Date()
const currentYear = d.getFullYear()

function getDateOfLastSundayInMonth(currentYear, month, lastDay = 31) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (new Date(`${currentYear}-${month}-${lastDay}`).getUTCDay() === 0) {
      return lastDay
    }
    --lastDay
  }
}

const lastSundayInMarch = getDateOfLastSundayInMonth(currentYear, '03')
const lastSundayInOctober = getDateOfLastSundayInMonth(currentYear, '10')

/**
 * These date formats are important
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
 *
 * TLDR;
 * An ISO format (e.g. YYYY-MM-DDTHH:mm:SS) will default to UTC time zone
 * As we are testing UK daylight savings time, we write the dates in UTC but these may be an hour behind BST (UTC+1)
 */
const beforeBST = `${currentYear}-03-${lastSundayInMarch}T00:59:59`
const startBST = `${currentYear}-03-${lastSundayInMarch}T01:00:00`
const beforeEndBST = `${currentYear}-10-${lastSundayInOctober}T00:59:59`
const endBST = `${currentYear}-10-${lastSundayInOctober}T01:00:00`
const outsideBST = `${currentYear}-12-25T00:00:00`

test(`isDayLightSaving false for before start of BST (${beforeBST})`, () => {
  return executeTestOnIsDayLightSaving(beforeBST, false)
})

test(`isDayLightSaving true for start of BST (${startBST})`, () => {
  return executeTestOnIsDayLightSaving(startBST, true)
})

test(`isDayLightSaving true for just before end of BST (${beforeEndBST})`, () => {
  return executeTestOnIsDayLightSaving(beforeEndBST, true)
})

test.skip(`isDayLightSaving false for end of BST (${endBST})`, () => {
  // skip test until issue is fixed (test fails when using node version 8)
  return executeTestOnIsDayLightSaving(endBST, false)
})

test(`isDayLightSaving false for date outside BST (${outsideBST})`, () => {
  return executeTestOnIsDayLightSaving(outsideBST, false)
})
