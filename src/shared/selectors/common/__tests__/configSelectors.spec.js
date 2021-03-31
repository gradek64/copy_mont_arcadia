import {
  getPostCodeRules,
  getCountryCodeFromQAS,
  getCountriesByAddressType,
  getRegion,
  getShippingCountries,
  getDeliveryCountryISO,
  getOrderReturnUrl,
} from '../configSelectors'

import configMock from '../../../../../test/mocks/config'
import siteOptionsMock from '../../../../../test/mocks/siteOptions'

jest.mock('../../featureSelectors')

const snapshot = (action) => expect(action).toMatchSnapshot()

describe('@Config Selectors', () => {
  const state = {
    config: configMock,
    siteOptions: siteOptionsMock,
  }

  beforeEach(jest.clearAllMocks)

  describe('[getPostCodeRules selector]', () => {
    it('getRegion should return region', () => {
      expect(getRegion(state)).toBe(state.config.region)
    })
  })

  describe('[getPostCodeRules selector]', () => {
    it('extract post code rules from config', () => {
      snapshot(getPostCodeRules(state, 'United Kingdom'))
    })

    it('return empty when state is empty', () => {
      expect(getPostCodeRules({})).toEqual({})
      expect(getPostCodeRules(null)).toEqual({})
      expect(getPostCodeRules(undefined)).toEqual({})
    })
  })

  describe('[getCountryCodeFromQAS selector]', () => {
    it('extract post country code from config', () => {
      expect(getCountryCodeFromQAS(state, 'United Kingdom')).toBe('GBR')
    })

    it('return empty when state is empty', () => {
      expect(getCountryCodeFromQAS({}, null)).toEqual('')
      expect(getCountryCodeFromQAS(null)).toEqual('')
      expect(getCountryCodeFromQAS(undefined)).toEqual('')
    })
  })

  describe('[getDeliveryCountryISO selector]', () => {
    it('should return the selected delivery country ios', () => {
      expect(getDeliveryCountryISO(state, 'Vietnam')).toEqual('VN')
    })
  })

  describe('[getCountriesByAddressType selector]', () => {
    describe('when addressType is delivery', () => {
      it('should return the `deliveryCountriesNames` from the config', () => {
        expect(getCountriesByAddressType(state, 'deliveryCheckout')).toEqual([
          'Antarctica',
          'United Kingdom',
          'Vietnam',
        ])
      })
    })

    describe('when addressType is addressBook', () => {
      it('should return the `deliveryCountriesNames` from the config', () => {
        expect(getCountriesByAddressType(state, 'addressBook')).toEqual([
          'Antarctica',
          'United Kingdom',
          'Vietnam',
        ])
      })
    })

    it('extract billing countries from siteOptions', () => {
      snapshot(getCountriesByAddressType(state, 'billingMCD'))
    })

    it('return empty when state is empty', () => {
      expect(getCountriesByAddressType({}, null)).toEqual([])
      expect(getCountriesByAddressType(null)).toEqual([])
      expect(getCountriesByAddressType(undefined)).toEqual([])
    })
  })

  describe('[getShippingCountries selector]', () => {
    describe('should return the `deliveryCountriesNames` from the config', () => {
      expect(getShippingCountries(state)).toEqual([
        'Antarctica',
        'United Kingdom',
        'Vietnam',
      ])
    })

    describe('[getOrderReturnUrl selector ]', () => {
      it('Should return value of the zig zag url for order returns', () => {
        expect(getOrderReturnUrl(state)).toEqual(
          'https://topshop.returns.international/ReturnsPortal/Details'
        )
      })
    })
  })
})
