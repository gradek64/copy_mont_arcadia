import * as utils from '../../../__test__/utils'
import UpdatePaymentDetails from '../UpdatePaymentDetails'
import wcsProfileFormView from '../../../../../../../test/apiResponses/my-account/wcs-ProfileFormView.json'
import { authenticatedCookies } from '../cookies'
import logonTransform from '../../../transforms/logon'

jest.mock('../../../transforms/logon')
jest.mock('../cookies', () => ({
  authenticatedCookies: jest.fn(),
}))

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

const payloadToWCS = {
  callingForm: 'QuickCheckout',
  storeId: 12556,
  langId: '-1',
  catalogId: '33057',
  page: 'quickcheckout',
  returnPage: '',
  errorViewName: 'ProfileFormView',
  billing_errorViewName: 'ProfileFormView',
  shipping_errorViewName: 'ProfileFormView',
  billing_nickName: 'Default_Billing_12556',
  shipping_nickName: 'Default_Shipping_12556',
  billing_email1: 'monty@desktop.com',
  URL:
    'LogonForm?shipping*=&billing*=&nickName*=&lastName*=&firstName*=&address*=&zipCode*=&city*=&state*=&country*=&phone1*=&phone2*=&pay_cardNumber*=',
  addressType: 'R',
  primary: '0',
  dropDownAction: '0',
  isoCode: '',
  billingIsoCode: 'GBR',
  shippingIsoCode: 'GBR',
  billing_personTitle: 'Mr',
  billing_firstName: 'Karthi',
  billing_lastName: 'D',
  billing_phone1: '1231231231',
  billing_country: 'United Kingdom',
  ShippingCountryInList: 'true',
  billing_house_number: '',
  billing_postcode: 'N7 7AJ',
  billing_state_hidden: '',
  billing_address1: 'Emirates Stadium',
  billing_address2: 'Queensland Road',
  billing_city: 'LONDON',
  billing_state_select: '',
  billing_state_select_canada: '',
  billing_state_input: '',
  billing_zipCode: 'N7 7AJ',
  shipping_personTitle: 'Ms',
  shipping_firstName: 'Testy',
  shipping_lastName: 'McTestTest',
  shipping_phone1: '73577357',
  shipping_country: 'United Kingdom',
  delivery_house_number: '',
  delivery_postcode: '',
  delivery_address_results: '',
  shipping_state_hidden: '',
  shipping_address1: 'Test House',
  shipping_address2: 'Test Street',
  shipping_city: 'LONDON',
  shipping_state_select: '',
  shipping_state_select_canada: '',
  shipping_state_input: '',
  shipping_postcode: '1A1 1A1',
  shipping_zipCode: '1A1 1A1',
  pay_payMethodId: '10008',
  pay_cardBrand: 'VISA',
  lastCard: '',
  pay_cardNumberStar: '0000000000000000',
  encryptedCCFlag: 'encryptedCCFlag',
  pay_cardNumber: '0000000000000000',
  pay_cardExpiryMonth: '01',
  pay_cardExpiryYear: '2018',
  'submitButton.x': '41',
  'submitButton.y': '7',
}

const transformedBody = { body: 'Monty Response' }

const execute = utils.buildExecutor(UpdatePaymentDetails)

describe('UpdatePaymentDetails mapper', () => {
  it('should get ProfileFormView then update payment details', async () => {
    const jsessionid = 1
    logonTransform.mockReturnValue(transformedBody)
    authenticatedCookies.mockReturnValue('cookie')
    utils.setWCSResponse(Promise.resolve({ body: wcsProfileFormView }))
    utils.setWCSResponse(
      Promise.resolve({
        jsessionid,
        body: {},
      }),
      { n: 1 }
    )
    const headers = { hea: 'ders' }

    const res = await execute({
      headers,
      payload: payloadFromMonty,
    })

    utils.expectRequestMadeWith({
      hostname: false,
      endpoint: '/webapp/wcs/stores/servlet/ProfileFormView',
      query: {
        catalogId: '33057',
        langId: '-1',
        storeId: 12556,
      },
      method: 'get',
      headers,
      payload: {},
    })
    utils.expectRequestMadeWith(
      {
        hostname: false,
        endpoint: '/webapp/wcs/stores/servlet/QASAddress',
        query: {
          catalogId: '33057',
          langId: '-1',
          storeId: 12556,
        },
        method: 'post',
        headers,
        payload: payloadToWCS,
      },
      1
    )
    expect(res).toEqual({
      jsessionid,
      body: transformedBody,
      setCookies: 'cookie',
    })
  })
})
