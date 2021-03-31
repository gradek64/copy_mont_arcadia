import {
  getEnglishDate,
  getEarliestCollectionDate,
  isValidTimeRange,
} from '../../../src/shared/components/common/StoreLocator/date-time'

describe('getEnglishDate', () => {
  it('getEnglishDate returns date in English format for a date in the future', () => {
    const D = global.Date
    global.Date = jest.fn(
      (...args) => (args.length ? new D(...args) : new D(2000, 0, 1))
    )

    expect(getEnglishDate('2016-10-23')).toBe('23rd October')
    expect(getEnglishDate('2016-10-11')).toBe('11th October')
    expect(getEnglishDate('2016-10-12')).toBe('12th October')
    expect(getEnglishDate('2016-10-13')).toBe('13th October')
    expect(getEnglishDate('2016-10-01')).toBe('1st October')
    expect(getEnglishDate('2016-01-02')).toBe('2nd January')
    expect(getEnglishDate('2016-05-31')).toBe('31st May')

    global.Date = D
  })

  it('getEnglishDate returns date in English format for today', () => {
    const D = global.Date
    global.Date = jest.fn(
      (...args) => (args.length ? new D(...args) : new D(2000, 0, 1))
    )

    expect(getEnglishDate('2000-01-01')).toBe('today, 1st January')

    global.Date = D
  })

  it('getEnglishDate returns date in English format for tomorrow', () => {
    const D = global.Date
    global.Date = jest.fn(
      (...args) => (args.length ? new D(...args) : new D(1999, 11, 31))
    )

    expect(getEnglishDate('2000-01-01')).toBe('tomorrow, 1st January')

    global.Date = D
  })
})

describe('getEarliestCollectionDate', () => {
  beforeEach(() => {
    // sets the current date to friday Nov 18 2016 GMT+0000
    jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000)
  })
  const dates = [
    {
      availableUntil: '2019-06-19 11:30:00',
      collectFrom: '2019-06-22',
    },
    {
      availableUntil: '2019-06-26 11:30:00',
      collectFrom: '2019-06-29',
    },
    {
      availableUntil: '2019-07-03 11:30:00',
      collectFrom: '2019-07-06',
    },
  ]

  it('returns back the earliest collect from store date', () => {
    expect(getEarliestCollectionDate(dates)).toBe('2019-06-22')
  })

  it('returns undefined if no date passed', () => {
    expect(getEarliestCollectionDate()).toBe(undefined)
  })
})

describe('isValidTimeRange', () => {
  it('returns false if the argument is not a valid type', () => {
    expect(isValidTimeRange([])).toBe(false)
  })
  it('returns false if the argument is not defined', () => {
    expect(isValidTimeRange()).toBe(false)
  })
  it('returns false if the string does not match a time range format', () => {
    expect(isValidTimeRange('Closed')).toBe(false)
  })
  it('returns true if the date matches hh:mm-hh:mm format', () => {
    expect(isValidTimeRange('09:00-21:00')).toBe(true)
  })
  it('returns true if the date matches hh:mm-hh:mm format with optional 2-digit hour', () => {
    expect(isValidTimeRange('9:00-21:00')).toBe(true)
  })
})
