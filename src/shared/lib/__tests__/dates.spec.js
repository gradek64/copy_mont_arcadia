import mockdate from 'mockdate'

import ecmcTimestampToISODatetime, {
  getDDPEndDate,
  formatExpiryDate,
  isCardExpiryYearInvalid,
  getCurrentDecade,
  getCurrentCentury,
} from '../dates'

describe('ecmcTimestampToISODatetime', () => {
  const validECMCDateTimestamp = '2019-08-12-15.41.02.000608'

  it('should return an ISO-8601 formatted string given a valid date', () => {
    expect(ecmcTimestampToISODatetime(validECMCDateTimestamp)).toEqual(
      '2019-08-12T15:41:02.000Z'
    )
  })

  it('should return an empty string given a bool value', () => {
    expect(ecmcTimestampToISODatetime(false)).toEqual('')
  })

  it('should return an empty string given a numeric value', () => {
    expect(ecmcTimestampToISODatetime(117)).toEqual('')
  })

  it('should return an empty string given a null value', () => {
    expect(ecmcTimestampToISODatetime(null)).toEqual('')
  })
})

describe('getDDPEndDate()', () => {
  describe('end date provided', () => {
    it('should increment year provided by 1', () => {
      const endDate = getDDPEndDate('4 April 2020')
      expect(endDate).toBe('4 April 2021')
    })
  })

  describe('no endDate provided', () => {
    let endDate

    beforeAll(() => {
      mockdate.set('2020-04-04T00:00:00.000Z')
      endDate = getDDPEndDate()
    })

    afterAll(() => {
      mockdate.reset()
    })

    it('should return whole month', () => {
      expect(endDate.includes('April')).toBe(true)
    })

    it('should return date one year in the future', () => {
      expect(endDate.substring(endDate.length - 4)).toBe('2021')
    })

    it('should return correct numeric day of month with no padding', () => {
      expect(endDate[0]).toBe('4')
    })
  })
})

describe('getCurrentDecade()', () => {
  it('should return number 20 for decade', () => {
    expect(getCurrentDecade()).toBe(21)
  })
  it('should return number 20 for decade even if date is set to below 2020', () => {
    const mockDate = new Date()
    mockDate.setFullYear(2019)
    const DateSpy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate)
    expect(getCurrentDecade()).toBe(20)
    DateSpy.mockRestore()
  })
})

describe('getCurrentCentury()', () => {
  it('should return "20" century', () => {
    expect(getCurrentCentury()).toBe(20)
  })
  it('should return "20" century even if date is set to below 2000', () => {
    const mockDate = new Date()
    mockDate.setFullYear(1653)
    const DateSpy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate)
    expect(getCurrentCentury()).toBe(20)
    DateSpy.mockRestore()
  })
})

describe('isCardExpiryYearInvalid()', () => {
  it('should return invalid(true) if set date is greater that currentYear + 11', () => {
    const isInValid = isCardExpiryYearInvalid(34)
    expect(isInValid).toBeTruthy()
  })
  it('should return invalid(false) if set date is less that currentYear + 11', () => {
    const isInValid = isCardExpiryYearInvalid(20)
    expect(isInValid).toBeFalsy()
  })
})

describe('formatExpiryDate()', () => {
  it('should return array with 2 empty strings if called with no arguments', () => {
    expect(formatExpiryDate()).toEqual(['', ''])
  })
  it('should return an empty array if called with a string', () => {
    expect(formatExpiryDate('string')).toEqual([])
  })
  describe('returns expiry Month format', () => {
    describe('has been called with number from 0 to 12', () => {
      it('should return array [0] if called with digit 0', () => {
        expect(formatExpiryDate('0')).toEqual(['0'])
      })
      it('should return array [1] if called with digit 1', () => {
        expect(formatExpiryDate('1')).toEqual(['1'])
      })
      it('should return formated string "0X /" if called with digit between 2-9', () => {
        expect(formatExpiryDate('2')).toEqual('02 / ')
        expect(formatExpiryDate('9')).toEqual('09 / ')
      })
      it('should return formated string "XX /" if called with digit between 10-12', () => {
        expect(formatExpiryDate('10')).toEqual('10 / ')
        expect(formatExpiryDate('12')).toEqual('12 / ')
      })
    })
  })
  describe('returns expiry Month and expiry Year format', () => {
    describe('has been called with number from 13 to 99', () => {
      it('should return array with 2 strings if called with double digit above 13 to 99', () => {
        expect(formatExpiryDate('13')).toEqual(['01', '3'])
        expect(formatExpiryDate('44')).toEqual(['04', '4'])
        expect(formatExpiryDate('99')).toEqual(['09', '9'])
      })
    })
    describe('has been called with number from 100 to 9999', () => {
      it('should return array with 2 strings if called with digit above 99', () => {
        expect(formatExpiryDate('100')).toEqual(['10', '0'])
        expect(formatExpiryDate('2000')).toEqual(['20', '00'])
        expect(formatExpiryDate('9999')).toEqual(['99', '99'])
      })
    })

    describe('has been called with number grater than 4 digits', () => {
      it('should return string containing 2 first digits and 2 last digits from passed number', () => {
        expect(formatExpiryDate('10000')).toEqual('10 / 00')
        expect(formatExpiryDate('4412345699')).toEqual('44 / 99')
      })
    })
  })
})
