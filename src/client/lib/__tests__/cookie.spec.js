import { errorReport } from '../reporter'
import {
  setItem,
  getItem,
  setProductIsActive,
  setStoreCookie,
  getJSON,
  setJSON,
} from '../cookie'

jest.mock('../cookie/utils', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

jest.mock('../reporter', () => ({
  errorReport: jest.fn(),
}))

describe('Describe Cookie Handling', () => {
  beforeEach(() => {
    global.process.browser = true
    jest.resetAllMocks()
  })

  it('getJSON should fetch an item from the cookie and parse it into json', () => {
    getItem.mockImplementation(() => undefined)
    expect(getJSON('jsonFalse')).toEqual(undefined)
    expect(getItem).toHaveBeenCalledWith('jsonFalse')
  })

  it('setJSON should stringify a JavaScript object and set the result into the cookie', () => {
    setJSON('testkey', { test: 'value' })
    expect(setItem).toHaveBeenCalledWith('testkey', '{"test":"value"}')
  })

  it('getJSON should fetch an item from the cookie and parse it into json', () => {
    getItem.mockImplementation(() => '{"test":"value"}')
    expect(getJSON('testkey')).toEqual({ test: 'value' })
    expect(getItem).toHaveBeenCalledWith('testkey')
  })

  it('getJSON should report error for invalid json', () => {
    getItem.mockImplementation(() => '{/t":Ohno.lue"}')
    expect(getJSON('testkey')).toEqual(undefined)
    expect(errorReport).toHaveBeenCalledWith(expect.any(Error))
    expect(errorReport.mock.calls[0][0].message).toEqual(
      expect.stringMatching('JSON')
    )
  })

  describe('setStoreCookie', () => {
    let pickUpStoreCookieValue
    let physicalStoresCookieValue
    beforeEach(() => {
      pickUpStoreCookieValue = ''
      physicalStoresCookieValue = ''
      getItem.mockImplementation(
        (cookieName) =>
          cookieName === 'WC_pickUpStore'
            ? pickUpStoreCookieValue
            : physicalStoresCookieValue
      )
      setItem.mockImplementation((cookieName, value) => {
        if (cookieName === 'WC_pickUpStore') {
          pickUpStoreCookieValue = value
        } else {
          physicalStoresCookieValue = value
        }
      })
    })
    afterEach(() => {
      getItem.mockClear()
      setItem.mockClear()
    })

    it('should not set store cookies if storeId is not valid', () => {
      setStoreCookie({})
      setStoreCookie(1)
      setStoreCookie('someCookie')

      expect(setItem).not.toHaveBeenCalled()
    })

    it('should set FFS Store cookie', () => {
      setStoreCookie({ storeId: 'TM3000' })

      expect(pickUpStoreCookieValue).toBe('TM3000')
      expect(setItem).toHaveBeenCalledWith('WC_pickUpStore', 'TM3000', 90)
    })

    it('Sets the physical store cookie', () => {
      setStoreCookie({ storeId: 'TM1' })
      setStoreCookie({ storeId: 'TM2' })
      setStoreCookie({ storeId: 'TM3' })
      setStoreCookie({ storeId: 'TM4' })
      setStoreCookie({ storeId: 'TM5' })

      const cookieLength = physicalStoresCookieValue.split('|')
      expect(physicalStoresCookieValue).toBe('TM1|TM2|TM3|TM4|TM5')
      expect(cookieLength.length).toBe(5)
      expect(setItem).toHaveBeenLastCalledWith(
        'WC_physicalStores',
        physicalStoresCookieValue,
        90
      )
    })

    it('Six store ids are added but first will be removed if  >5', () => {
      setStoreCookie({ storeId: 'TM1' })
      setStoreCookie({ storeId: 'TM2' })
      setStoreCookie({ storeId: 'TM3' })
      setStoreCookie({ storeId: 'TM4' })
      setStoreCookie({ storeId: 'TM5' })
      setStoreCookie({ storeId: 'TM6' })

      const cookieLength = physicalStoresCookieValue.split('|')
      expect(physicalStoresCookieValue).toBe('TM2|TM3|TM4|TM5|TM6')
      expect(cookieLength.length).toBe(5)
      expect(setItem).toHaveBeenLastCalledWith(
        'WC_physicalStores',
        physicalStoresCookieValue,
        90
      )
    })

    it('should not change cookie if store already exists', () => {
      physicalStoresCookieValue = 'TM1|TM2|TM3|TM4|TM5'

      setStoreCookie({ storeId: 'TM3' })

      const cookieLength = physicalStoresCookieValue.split('|')
      expect(physicalStoresCookieValue).toBe('TM1|TM2|TM3|TM4|TM5')
      expect(cookieLength.length).toBe(5)
      expect(setItem).toHaveBeenCalledTimes(1)
    })
  })

  it('setProductIsActive sets productActive cookie', () => {
    const mockParam = 'mock'
    setProductIsActive(mockParam)
    expect(setItem).toBeCalledWith('productIsActive', mockParam, 90)
  })
})
