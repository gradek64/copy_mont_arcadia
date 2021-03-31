import {
  mapAddress,
  mapIsoCode,
  mapPaymentInfo,
  mapAccountValues,
  mapAuthenticatedResponse,
  mapAddressState,
} from './'
import { path } from 'ramda'
import wcsProfileFormView from '../../../../../../../test/apiResponses/my-account/wcs-ProfileFormView.json'
import { encodeUserId } from '../../../../../lib/bazaarvoice-utils'
import { logonCookies, logonHeaders } from '../cookies'

jest.mock('../cookies', () => ({
  logonCookies: jest.fn(),
  logonHeaders: jest.fn(),
}))

jest.mock('../../../../../lib/bazaarvoice-utils', () => ({
  encodeUserId: jest.fn(),
}))

const addressFields = [
  {
    name: 'title',
    key: 'personTitle',
    path: 'nameAndPhone',
  },
  {
    name: 'firstName',
    path: 'nameAndPhone',
  },
]

const payloadFromMonty = {
  billingDetails: {
    nameAndPhone: {
      title: 'Mr',
      firstName: 'Karthi',
      lastName: 'D',
      telephone: '1231231231',
    },
    address: {
      country: 'United Kingdom',
      postcode: 'N7 7AJ',
      address1: 'Emirates Stadium',
      address2: 'Queensland Road',
      city: 'LONDON',
      state: '',
    },
  },
  deliveryDetails: {
    nameAndPhone: {
      title: 'Ms',
      firstName: 'Testy',
      lastName: 'McTestTest',
      telephone: '73577357',
    },
    address: {
      country: 'United Kingdom',
      postcode: '1A1 1A1',
      address1: 'Test House',
      address2: 'Test Street',
      city: 'LONDON',
      state: '',
    },
  },
  creditCard: {
    expiryYear: '2018',
    expiryMonth: '01',
    type: 'VISA',
    cardNumber: '0000000000000000',
  },
}

describe('account utils', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('mapAddress', () => {
    it('returns an empty object if no address fields are given', () => {
      expect(mapAddress('delivery', 'shipping', [])).toEqual({})
    })

    it('should correctly map an address field from the Monty payload to the WCS payload', () => {
      expect(
        mapAddress('delivery', 'shipping', addressFields, payloadFromMonty)
      ).toEqual({
        shipping_firstName: 'Testy',
        shipping_personTitle: 'Ms',
      })
    })
  })
  describe('mapIsoCode', () => {
    it('should return an empty string if the country value does not have a corresponding ISO code', () => {
      expect(
        mapIsoCode(
          'Djibouti',
          path(['quickCheckoutForm', 'countryIsoCodes'], wcsProfileFormView)
        )
      ).toBe('')
    })

    it('should return an ISO if the country value has a corresponding ISO code', () => {
      expect(
        mapIsoCode(
          'Poland',
          path(['quickCheckoutForm', 'countryIsoCodes'], wcsProfileFormView)
        )
      ).toBe('POL')
    })

    it('should return an empty string if the country is not found', () => {
      expect(
        mapIsoCode(
          'Fooland',
          path(['quickCheckoutForm', 'countryIsoCodes'], wcsProfileFormView)
        )
      ).toBe('')
    })

    it('should return an empty string one of the arguments is missing', () => {
      expect(mapIsoCode()).toBe('')
      expect(mapIsoCode('Canada')).toBe('')
      expect(
        mapIsoCode(null, [
          {
            countryName: 'Canada',
            countryISO: 'CAN',
          },
        ])
      ).toBe('')
    })
  })
  describe('mapPaymentInfo', () => {
    it('should return paymentInfo based on information provided in the payload', () => {
      expect(mapPaymentInfo(payloadFromMonty.creditCard)).toEqual({
        pay_cardExpiryYear: '2018',
        pay_cardExpiryMonth: '01',
        pay_cardBrand: 'VISA',
        pay_cardNumber: '0000000000000000',
        pay_cardNumberStar: '0000000000000000',
      })
    })

    it('should return an object with default values if any are missing', () => {
      expect(mapPaymentInfo({})).toEqual({
        pay_cardBrand: '',
        pay_cardNumberStar: '',
        pay_cardNumber: '',
        pay_cardExpiryMonth: '',
        pay_cardExpiryYear: '',
      })
    })
  })
  describe('mapAccountValues', () => {
    it('should return an object with default values if any are missing', () => {
      expect(mapAccountValues({})).toEqual({
        returnPage: '',
        isoCode: '',
        addressType: '',
        lastCard: '',
        billing_email1: '',
        billing_house_number: '',
        billing_state_hidden: '',
        billing_state_select: '',
        billing_state_input: '',
        delivery_house_number: '',
        delivery_postcode: '',
        delivery_address_results: '',
        shipping_state_hidden: '',
        shipping_state_select: '',
        shipping_state_input: '',
        pay_payMethodId: '',
      })
    })

    it('should map the account values obtained from WCS', () => {
      expect(mapAccountValues(wcsProfileFormView.quickCheckoutForm)).toEqual({
        returnPage: '',
        isoCode: '',
        addressType: 'R',
        lastCard: '',
        billing_email1: 'monty@desktop.com',
        billing_house_number: '',
        billing_state_hidden: '',
        billing_state_select: '',
        billing_state_input: '',
        delivery_house_number: '',
        delivery_postcode: '',
        delivery_address_results: '',
        shipping_state_hidden: '',
        shipping_state_select: '',
        shipping_state_input: '',
        pay_payMethodId: '10008',
      })
    })
  })

  describe('mapAuthenticatedResponse', () => {
    const response = { jsessionid: 'ABCITSEASYAS123' }
    const expectedSetCookies = ['cookie1', 'cookie2']
    const expectedSetHeaders = [{ bob: 'baz' }]
    const expectedBody = { foo: 'bar' }
    let actual

    beforeEach(() => {
      logonCookies.mockReturnValue(expectedSetCookies)
      logonHeaders.mockReturnValue(expectedSetHeaders)
      encodeUserId.mockReturnValue('bv')

      actual = mapAuthenticatedResponse(response, expectedBody)
    })

    it('maps the auth cookies to the setCookies property', () => {
      expect(actual.setCookies).toBe(expectedSetCookies)
    })

    it('maps the auth headers to the setHeaders property', () => {
      expect(actual.setHeaders).toBe(expectedSetHeaders)
    })

    it('maps the jsessionid from the response', () => {
      expect(actual.jsessionid).toBe(response.jsessionid)
    })

    it('maps the body', () => {
      expect(actual.body).toBe(expectedBody)
    })
  })

  describe('mapAddressState', () => {
    const payloadUnitedStates = {
      billingDetails: {
        nameAndPhone: {
          lastName: 'Nguyen',
          telephone: '7763685281',
          title: 'Mr',
          firstName: 'Van',
        },
        address: {
          address1: 'Flat 2, 62 Fairthorn road',
          address2: 'nevada',
          city: 'nevada ',
          state: 'DE',
          country: 'United States',
          postcode: '12312',
        },
      },
      deliveryDetails: {
        nameAndPhone: {
          lastName: 'guy',
          telephone: '7763685281',
          title: 'Mr',
          firstName: 'mock',
        },
        address: {
          address1: 'Flat 1, 22 mock address road',
          address2: 'nevada',
          city: 'nevada ',
          state: 'DE',
          country: 'United States',
          postcode: '12312',
        },
      },
      creditCard: {
        expiryYear: 2019,
        expiryMonth: 5,
        type: 'PYPAL',
        cardNumber: '0',
      },
    }

    it('returns object with state information', () => {
      expect(mapAddressState(payloadUnitedStates)).toEqual({
        billing_state_input: 'DE',
        billing_state_select_canada: '',
        billing_state_hidden: 'DE',
        billing_state_select: 'DE',
        shipping_state_input: 'DE',
        shipping_state_select_canada: '',
        shipping_state_hidden: 'DE',
        shipping_state_select: 'DE',
      })
    })

    it('returns items blank if there are no address state or country', () => {
      expect(mapAddressState(payloadFromMonty)).toEqual({
        billing_state_input: '',
        billing_state_select_canada: '',
        billing_state_hidden: '',
        billing_state_select: '',
        shipping_state_input: '',
        shipping_state_select_canada: '',
        shipping_state_hidden: '',
        shipping_state_select: '',
      })
    })

    it('removes diacritics on all items fields returned ', () => {
      const diacriticsPayload = {
        ...payloadUnitedStates,
        deliveryDetails: {
          ...payloadUnitedStates.deliveryDetails.nameAndPhone,
          address: {
            address1: 'Flat 1, 22 mock address road',
            address2: 'nevada',
            city: 'nevada ',
            state: 'DÊ',
            country: 'United States',
            postcode: '12312',
          },
        },
      }

      expect(mapAddressState(diacriticsPayload)).toEqual({
        billing_state_input: 'DE',
        billing_state_select_canada: '',
        billing_state_hidden: 'DE',
        billing_state_select: 'DE',
        shipping_state_input: 'DE',
        shipping_state_select_canada: '',
        shipping_state_hidden: 'DE',
        shipping_state_select: 'DE',
      })
    })
  })
})
