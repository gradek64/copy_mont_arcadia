import * as utils from '../../../../__test__/utils'
import CreateOrder from '../../CreateOrder'
import wcs from '../../../../../../../../test/apiResponses/create-order/wcs.json'
import wcsFail from '../../../../../../../../test/apiResponses/create-order/wcs-failure.json'
import { createOrderErrorCodes } from '../../../../constants/wcsErrorCodes'

const jsessionid = '12345'
const getCookieFromStore = jest.fn()
const montyRequest = (payload = {}) => ({
  originEndpoint: '/api/shopping_bag/mini_bag',
  query: {},
  payload,
  method: 'post',
  headers: {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    cookie: 'jessionid=a',
  },
  params: {},
  getCookieFromStore,
})

const orderId = 700395087

const montyReturningAccountCard = {
  smsMobileNumber: '0787654321',
  remoteIpAddress: '127.0.0.1',
  cardCvv: '123',
  orderDeliveryOption: {
    orderId,
    shippingCountry: 'United Kingdom',
    shipCode: 'S',
    deliveryType: 'HOME_STANDARD',
    shipModeId: 26504,
  },
  deliveryInstructions: 'Drop by door',
  returnUrl:
    'https://pplive-m-topshop-com.digital.arcadiagroup.co.uk/order-complete?paymentMethod=ACCNT',
  cardNumberHash: 'poJy1ZvvwAb6SPEjhgVdZIbGAZLeyMmQ',
}

const montyChangeDeliveryAddress = {
  ...montyReturningAccountCard,
  deliveryAddress: {
    address1: 'Emirates Stadium',
    address2: 'Queensland Road',
    city: 'LONDON',
    state: '',
    country: 'United Kingdom',
    postcode: 'N7 7AJ',
  },
  deliveryNameAndPhone: {
    firstName: 'q',
    lastName: 'q',
    telephone: '0987654321',
    title: 'Ms',
  },
}

const montyChangeBillingAddress = {
  ...montyReturningAccountCard,
  billingDetails: {
    address: {
      address1: 'Emirates Stadium',
      address2: 'Queensland Road',
      city: 'LONDON',
      state: '',
      country: 'United Kingdom',
      postcode: 'N7 7AJ',
    },
    nameAndPhone: {
      firstName: 'q',
      lastName: 'q',
      telephone: '0987654321',
      title: 'Ms',
    },
  },
}

const montyGuestAccountCard = {
  smsMobileNumber: '0787654321',
  remoteIpAddress: '127.0.0.1',
  cardCvv: '123',
  orderDeliveryOption: {
    orderId,
    shippingCountry: 'United Kingdom',
    shipCode: 'S',
    deliveryType: 'HOME_STANDARD',
    shipModeId: 26504,
  },
  deliveryInstructions: 'Drop by door',
  returnUrl:
    'https://pplive-m-topshop-com.digital.arcadiagroup.co.uk/order-complete?paymentMethod=ACCNT',
  deliveryAddress: {
    address1: 'Arcadia Group Ltd',
    address2: 'Colegrave House, 68-70 Berners Street',
    city: 'LONDON',
    state: null,
    country: 'United Kingdom',
    postcode: 'W1T 3NL',
  },
  deliveryNameAndPhone: {
    firstName: 'werth',
    lastName: 'wertyh',
    telephone: '0987654321',
    title: 'Ms',
  },
  billingDetails: {
    address: {
      address1: 'Arcadia Group Ltd',
      address2: 'Colegrave House, 68-70 Berners Street',
      city: 'LONDON',
      state: null,
      country: 'United Kingdom',
      postcode: 'W1T 3NL',
    },
    nameAndPhone: {
      firstName: 'werth',
      lastName: 'wertyh',
      telephone: '0987654321',
      title: 'Ms',
    },
  },
  creditCard: {
    expiryYear: '2019',
    expiryMonth: '03',
    cardNumber: '6000082000000088',
    type: 'ACCNT',
  },
  accountCreate: {
    email: 'qwer@esghj.com',
    password: 'test123',
    passwordConfirm: 'test123',
    subscribe: true,
  },
}

const montyRegisteredFirstAccountCard = {
  ...montyGuestAccountCard,
  accountCreate: undefined,
}
const updateAddressPayload = {
  URL: 'ProcessDeliveryDetails?actionType=updateDeliveryDetails',
  orderId,
  proceed: 'Y',
  registerType: 'R',
  returnPage: 'ShoppingBag',
  isoCode: '',
  storeId: 12556,
  catalogId: '33057',
  langId: '-1',
  page: 'account',
  editRegistration: 'Y',
  editSection: '',
  outOrderItemName: '',
  actionType: 'updateCountryAndOrderItems',
  sourcePage: 'DeliveryPage',
  deliveryOptionType: 'H',
  shipping_errorViewName: 'UserRegistrationForm',
  shipping_nickName: 'Default_Shipping_12556',
  shipping_personTitle: 'Ms',
  shipping_firstName: 'werth',
  shipping_lastName: 'wertyh',
  shipping_phone1: '0987654321',
  shipping_country: 'United Kingdom',
  lookupHouseNumber: '',
  lookupPostcode: '',
  addressResults: '',
  shipping_state_hidden: '',
  shipping_address1: 'Arcadia Group Ltd',
  shipping_address2: 'Colegrave House, 68-70 Berners Street',
  shipping_city: 'LONDON',
  shipping_state_input: '',
  shipping_state_select_canada: '',
  shipping_state_select: '',
  shipping_zipCode: 'W1T 3NL',
  preferredLanguage: '-1',
  preferredCurrency: 'GBP',
  status: 'P',
  errorViewName: 'UserRegistrationForm',
  nominatedDate: '',
  shipModeId: 26504,
  available_date: 26504,
  carrier_instructions: 'Drop by door',
  deliveryInstructions: 'Drop by door',
  carrier_mobile: '0787654321',
  smsAlerts: '0787654321',
  orderItemShipMode: 26504,
  orderItemShipCode: 'S',
  field1: '',
  redirectPageChange: 'Y',
  montyUserAction: 'shipping',
}

const registerPayload = {
  create_logonId: 'qwer@esghj.com',
  logonPassword: 'test123',
  logonPasswordVerify: 'test123',
  proceed: 'Y',
  registerType: 'R',
  returnPage: 'ShoppingBag',
  fromBillingPage: 'y',
  shipping_nickName: 'Default_Shipping_12556',
  DTS_Shipping: 'false',
  source: 'CHECKOUT',
  isoCode: '',
  storeId: 12556,
  catalogId: '33057',
  orderId,
  langId: '-1',
  page: 'account',
  editRegistration: 'Y',
  editSection: 'NA',
  outOrderItemName: '',
  shipping_addressType: 'SB',
  shipping_primary: '0',
  shipping_lastName: 'wertyh',
  shipping_firstName: 'werth',
  shipping_address1: 'Arcadia Group Ltd',
  shipping_address2: 'Colegrave House, 68-70 Berners Street',
  shipping_city: 'LONDON',
  shipping_state: '',
  shipping_zipCode: 'W1T 3NL',
  shipping_country: 'United Kingdom',
  shipping_phone1: '0987654321',
  shipping_phone2: '0787654321',
  shipping_personTitle: 'Ms',

  saved_title: 'Ms',
  saved_firstName: 'werth',
  saved_lastName: 'wertyh',
  saved_addressLine1: 'Arcadia Group Ltd',
  saved_addressLine2: 'Colegrave House, 68-70 Berners Street',
  saved_townCity: 'LONDON',
  saved_state: '',
  saved_postcode: 'W1T 3NL',
  saved_country: 'United Kingdom',
  saved_telephone: '0987654321',

  URL: 'OrderCalculate?URL=OrderPrepare?URL=PaymentPageUpdateAjaxView',
  errorViewName: 'PaymentPageUpdateAjaxView',
  billing_nickName: 'Default_Billing_12556',
  billing_errorViewName: 'UserRegistrationForm',
  billing_personTitle: 'Ms',
  billing_firstName: 'werth',
  billing_lastName: 'wertyh',
  billing_phone1: '0987654321',
  billing_country: 'United Kingdom',
  ShippingCountryInList: 'true',
  lookupHouseNumber: '',
  lookupPostcode: '',
  billing_state_hidden: '',
  billing_address1: 'Arcadia Group Ltd',
  billing_address2: 'Colegrave House, 68-70 Berners Street',
  billing_city: 'LONDON',
  billing_state_input: '',
  billing_state_select_canada: '',
  billing_state_select: '',
  billing_zipCode: 'W1T 3NL',
  preferredLanguage: '-1',
  preferredCurrency: 'GBP',
  subscribe: 'YES',
  montyUserAction: 'billing',
}

const addBillingAddressPayload = {
  proceed: 'Y',
  registerType: 'R',
  returnPage: 'ShoppingBag',
  fromBillingPage: 'y',
  shipping_nickName: 'Default_Shipping_12556',
  DTS_Shipping: 'false',
  source: 'CHECKOUT',
  isoCode: '',
  storeId: 12556,
  catalogId: '33057',
  orderId,
  langId: '-1',
  page: 'account',
  editRegistration: 'Y',
  editSection: 'NA',
  outOrderItemName: '',
  shipping_addressType: 'SB',
  shipping_primary: '0',
  shipping_lastName: 'wertyh',
  shipping_firstName: 'werth',
  shipping_address1: 'Arcadia Group Ltd',
  shipping_address2: 'Colegrave House, 68-70 Berners Street',
  shipping_city: 'LONDON',
  shipping_state: '',
  shipping_zipCode: 'W1T 3NL',
  shipping_country: 'United Kingdom',
  shipping_phone1: '0987654321',
  shipping_phone2: '0787654321',
  shipping_personTitle: 'Ms',

  saved_title: 'Ms',
  saved_firstName: 'werth',
  saved_lastName: 'wertyh',
  saved_addressLine1: 'Arcadia Group Ltd',
  saved_addressLine2: 'Colegrave House, 68-70 Berners Street',
  saved_townCity: 'LONDON',
  saved_state: '',
  saved_postcode: 'W1T 3NL',
  saved_country: 'United Kingdom',
  saved_telephone: '0987654321',

  URL: 'OrderCalculate?URL=OrderPrepare?URL=PaymentPageUpdateAjaxView',
  errorViewName: 'PaymentPageUpdateAjaxView',
  billing_nickName: 'Default_Billing_12556',
  billing_errorViewName: 'UserRegistrationForm',
  billing_personTitle: 'Ms',
  billing_firstName: 'werth',
  billing_lastName: 'wertyh',
  billing_phone1: '0987654321',
  billing_country: 'United Kingdom',
  ShippingCountryInList: 'true',
  lookupHouseNumber: '',
  lookupPostcode: '',
  billing_state_hidden: '',
  billing_address1: 'Arcadia Group Ltd',
  billing_address2: 'Colegrave House, 68-70 Berners Street',
  billing_city: 'LONDON',
  billing_state_input: '',
  billing_state_select_canada: '',
  billing_state_select: '',
  billing_zipCode: 'W1T 3NL',
  preferredLanguage: '-1',
  preferredCurrency: 'GBP',
  montyUserAction: 'billing',
}

const wcsPayload = {
  ipAddress: '127.0.0.1',
  orderId,
  errorViewName: 'DoPaymentErrorView',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
  contentType: '*/*',
  notifyShopper: '0',
  notifyOrderSubmitted: '0',
  deliveryInstructions: 'Drop by door',
  smsAlerts: '0787654321',
  shipCode: 'S',
  nominatedDate: '',
  URL: 'OrderPrepare?URL=ConfirmAndPay',
  acceptHeader: '*/*',
  auth_token: undefined,
  cardBrand: undefined,
  cardExpiryMonth: undefined,
  cardExpiryYear: undefined,
  cardNumber: 'poJy1ZvvwAb6SPEjhgVdZIbGAZLeyMmQ',
  cardNumberStar: undefined,
  cardSecurityNumber: '123',
  TERMSANDCONDITIONS_OPTIN: 'true',
  save_details: 'on',
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
}

const wcsChangeDeliveryAddressPayload = {
  proceed: '',
  registerType: 'R',
  returnPage: 'ShoppingBag',
  isoCode: '',
  storeId: 12556,
  catalogId: '33057',
  orderId,
  langId: '-1',
  page: 'account',
  editRegistration: 'Y',
  editSection: '',
  outOrderItemName: '',
  actionType: 'updateCountryAndOrderItems',
  sourcePage: '',
  deliveryOptionType: 'H',
  URL: 'ProcessDeliveryDetails',
  errorViewName: 'AddressUpdateAjaxView',
  shipping_errorViewName: 'UserRegistrationForm',
  shipping_nickName: 'Default_Shipping_12556',
  shipping_personTitle: 'Ms',
  shipping_firstName: 'q',
  shipping_lastName: 'q',
  shipping_phone1: '0987654321',
  shipping_country: 'United Kingdom',
  lookupHouseNumber: '',
  lookupPostcode: '',
  shipping_state_hidden: '',
  shipping_address1: 'Emirates Stadium',
  shipping_address2: 'Queensland Road',
  shipping_city: 'LONDON',
  shipping_state_input: '',
  shipping_state_select_canada: '',
  shipping_state_select: '',
  shipping_zipCode: 'N7 7AJ',
  preferredLanguage: '',
  preferredCurrency: '',
  status: 'P',
  montyUserAction: 'shipping',
}

const wcsChangeBillingAddressPayload = {
  proceed: '',
  registerType: 'R',
  returnPage: 'ShoppingBag',
  fromBillingPage: 'y',
  shipping_nickName: 'Default_Shipping_12556',
  DTS_Shipping: 'false',
  subscribe: '', // ?
  source: 'CHECKOUT',
  isoCode: '',
  storeId: 12556,
  catalogId: '33057',
  orderId,
  langId: '-1',
  page: 'account',
  editRegistration: 'Y',
  editSection: 'CB',
  outOrderItemName: '',
  URL: 'OrderCalculate?URL=OrderPrepare?URL=AddressUpdateAjaxView',
  errorViewName: 'AddressUpdateAjaxView',
  billing_errorViewName: 'DeliveryPaymentPageUpdateAjaxView',
  billing_personTitle: 'Ms',
  billing_firstName: 'q',
  billing_lastName: 'q',
  billing_phone1: '0987654321',
  billing_country: 'United Kingdom',
  ShippingCountryInList: 'true',
  lookupHouseNumber: '',
  lookupPostcode: '',
  addressResults: '1',
  billing_state_hidden: '',
  billing_address1: 'Emirates Stadium',
  billing_address2: 'Queensland Road',
  billing_city: 'LONDON',
  billing_state_input: '',
  billing_state_select_canada: '',
  billing_state_select: '',
  billing_zipCode: 'N7 7AJ',
  preferredLanguage: '',
  preferredCurrency: '',
  montyUserAction: 'billing',
  billing_nickName: 'Default_Billing_12556',
}

const creditCard = {
  expiryYear: '2019',
  expiryMonth: '03',
  cardNumber: '6000082000000088',
  type: 'ACCNT',
}

const wcsPayloadWithCreditCard = {
  ...wcsPayload,
  cardBrand: creditCard.type,
  cardNumberStar: creditCard.cardNumber,
  cardExpiryMonth: creditCard.expiryMonth,
  cardExpiryYear: creditCard.expiryYear,
}

const wcsPayloadGuest = {
  ...wcsPayloadWithCreditCard,
  cardNumber: undefined,
}
const addressId = '905061'
const addAddressResponse = { ConfirmAndPayCardDetailsForm: { addressId } }
const updateAddressResponse = {
  orderSummary: { OrderCalculateForm: { addressId } },
}
const updateBillingAddressResponse = {
  orderSummary: { OrderCalculateForm: { billing_address_id: addressId } },
}
const registerResponse = {
  ConfirmAndPayCardDetailsForm: { billing_address_id: addressId },
}

const execute = utils.buildExecutor(
  CreateOrder,
  montyRequest(montyReturningAccountCard)
)

const happyApi = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
  getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
}

const happyApiChangeDelivery = () => {
  utils.setWCSResponse({ body: updateAddressResponse, jsessionid })
  utils.setWCSResponse({ body: wcs, jsessionid }, { n: 1 })
  getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
}

const happyApiChangeBilling = () => {
  utils.setWCSResponse({ body: updateBillingAddressResponse, jsessionid })
  utils.setWCSResponse({ body: wcs, jsessionid }, { n: 1 })
  getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
}

const happyApiGuest = () => {
  getCookieFromStore.mockReturnValue(Promise.resolve('N'))
  utils.setWCSResponse({ body: addAddressResponse, jsessionid })
  utils.setWCSResponse({ body: registerResponse, jsessionid }, { n: 1 })
  utils.setWCSResponse({ body: wcs, jsessionid }, { n: 2 })
}

const unhappyApiChangeDelivery = (error) => {
  utils.setWCSResponse({ body: error, jsessionid })
  utils.setWCSResponse({ body: wcs, jsessionid }, { n: 1 })
  getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
}

const unhappyApiChangeBilling = (error) => {
  utils.setWCSResponse({ body: error, jsessionid })
  utils.setWCSResponse({ body: wcs, jsessionid }, { n: 1 })
  getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
}

const unhappyApiGuest = (error, iteration) => {
  getCookieFromStore.mockReturnValue(Promise.resolve('N'))
  if (error && iteration === 0) {
    utils.setWCSResponse({ body: error, jsessionid })
  } else {
    utils.setWCSResponse({ body: addAddressResponse, jsessionid })
  }
  if (error && iteration === 1) {
    utils.setWCSResponse({ body: error, jsessionid })
  } else {
    utils.setWCSResponse({ body: registerResponse, jsessionid }, { n: 1 })
  }
  utils.setWCSResponse({ body: wcs, jsessionid }, { n: 2 })
}

const unhappyApi = () => {
  utils.setWCSResponse({ body: wcsFail, jsessionid })
  getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
}

const expectError = async (
  { statusCode, errorMessage, errorCode },
  payload
) => {
  try {
    const res = await execute(payload)
    await res.body
    throw new Error('Expected promise to reject')
  } catch (error) {
    expect(error.output.payload.statusCode).toBe(statusCode)
    expect(error.output.payload.message).toBe(errorMessage)
    expect(error.data.wcsErrorCode).toBe(errorCode)
  }
}

const getExampleErrorMapping = () => {
  const errorCode = Object.keys(createOrderErrorCodes)[0]
  const statusCode = createOrderErrorCodes[errorCode]
  return { errorCode, statusCode }
}

describe('CreateOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@assertResponseError', () => {
    it('detects success = false', () => {
      const mapper = new CreateOrder()
      mapper.mapResponseError = jest.fn()
      const defaultErrorMessage = 'test-default'
      mapper.assertResponseError({
        responseBody: {
          success: false,
        },
        defaultErrorMessage,
      })
      expect(mapper.mapResponseError).toHaveBeenCalledWith({
        errorMessage: defaultErrorMessage,
      })
    })

    it('detects errorMessage', () => {
      const mapper = new CreateOrder()
      mapper.mapErrorCode = jest.fn()
      mapper.assertResponseError({
        responseBody: {
          errorMessage: 'test-error',
        },
      })
      expect(mapper.mapErrorCode).toHaveBeenCalled()
    })

    it('detects orderSummary.errorMessage', () => {
      const mapper = new CreateOrder()
      mapper.mapResponseError = jest.fn()
      mapper.assertResponseError({
        responseBody: {
          orderSummary: {
            errorMessage: 'test-error',
          },
        },
      })
      expect(mapper.mapResponseError).toHaveBeenCalled()
    })
  })

  describe('Guest User', () => {
    describe('Adding the delivery address', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/UserRegistrationUpdate', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(0).endpoint).toBe(
          '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
        )
      })
      it('should call with the post method', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(0).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(0).payload).toEqual(updateAddressPayload)
      })
      describe('ordering to a store', () => {
        it('sets store specific parameters', async () => {
          happyApiGuest()
          const deliveryStoreCode = 'TS001'
          const payloadWithState = {
            ...montyGuestAccountCard,
            orderDeliveryOption: {
              ...montyGuestAccountCard.orderDeliveryOption,
              deliveryStoreCode,
            },
          }
          await execute({ payload: payloadWithState })
          const wcsPayload = utils.getRequestArgs(0).payload
          expect(wcsPayload.deliveryOptionType).toBe('S')
          expect(wcsPayload.field1).toBe(deliveryStoreCode)
          expect(wcsPayload.available_date).toBeUndefined()
          expect(wcsPayload.shipping_nickName).toBe('Default_Store_12556')
        })
      })
      describe('for a country with States', () => {
        it('sets the state', async () => {
          happyApiGuest()
          const state = 'AZ'
          const payloadWithState = {
            ...montyGuestAccountCard,
            deliveryAddress: {
              ...montyGuestAccountCard.deliveryAddress,
              state,
            },
          }
          await execute({ payload: payloadWithState })
          const wcsPayload = utils.getRequestArgs(0).payload
          expect(wcsPayload.shipping_state_input).toBe(state)
          expect(wcsPayload.shipping_state_select).toBe(state)
          expect(wcsPayload.shipping_state_hidden).toBe(state)
        })
        describe('Canada', () => {
          it('sets Canada specific state', async () => {
            happyApiGuest()
            const state = 'ON'
            const shippingCountry = 'Canada'
            const payloadWithState = {
              ...montyGuestAccountCard,
              deliveryAddress: {
                ...montyGuestAccountCard.deliveryAddress,
                state,
              },
              orderDeliveryOption: {
                ...montyGuestAccountCard.orderDeliveryOption,
                shippingCountry,
              },
            }
            await execute({ payload: payloadWithState })
            const wcsPayload = utils.getRequestArgs(0).payload
            expect(wcsPayload.shipping_state_input).toBe('')
            expect(wcsPayload.shipping_state_select).toBe('')
            expect(wcsPayload.shipping_state_hidden).toBe(state)
            expect(wcsPayload.shipping_state_select_canada).toBe(state)
          })
        })
      })
    })
    describe('registering the user', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/UserRegistrationUpdate', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(1).endpoint).toBe(
          '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
        )
      })
      it('should call with the post method', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(1).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(1).payload).toEqual(registerPayload)
      })
      describe('ordering to a store', () => {
        it('sets store specific parameters', async () => {
          happyApiGuest()
          const deliveryStoreCode = 'TS001'
          const payloadWithState = {
            ...montyGuestAccountCard,
            orderDeliveryOption: {
              ...montyGuestAccountCard.orderDeliveryOption,
              deliveryStoreCode,
            },
          }
          await execute({ payload: payloadWithState })
          const wcsPayload = utils.getRequestArgs(1).payload
          expect(wcsPayload.DTS_Shipping).toBe('true')
          expect(wcsPayload.shipping_nickName).toBe('Default_Store_12556')
        })
      })
      describe('for a country with States', () => {
        it('sets the state', async () => {
          happyApiGuest()
          const state = 'AZ'
          const payloadWithState = {
            ...montyGuestAccountCard,
            deliveryAddress: {
              ...montyGuestAccountCard.deliveryAddress,
              state,
            },
            billingDetails: {
              nameAndPhone: montyGuestAccountCard.billingDetails.nameAndPhone,
              address: {
                ...montyGuestAccountCard.billingDetails.address,
                state,
              },
            },
          }
          await execute({ payload: payloadWithState })
          const wcsPayload = utils.getRequestArgs(1).payload
          expect(wcsPayload.shipping_state).toBe(state)
          expect(wcsPayload.saved_state).toBe(state)
          expect(wcsPayload.billing_state_input).toBe(state)
          expect(wcsPayload.billing_state_select).toBe(state)
          expect(wcsPayload.billing_state_hidden).toBe(state)
        })
        describe('Canada', () => {
          it('sets Canada specific state', async () => {
            happyApiGuest()
            const state = 'ON'
            const shippingCountry = 'Canada'
            const payloadWithState = {
              ...montyGuestAccountCard,
              deliveryAddress: {
                ...montyGuestAccountCard.deliveryAddress,
                state,
              },
              billingDetails: {
                nameAndPhone: montyGuestAccountCard.billingDetails.nameAndPhone,
                address: {
                  ...montyGuestAccountCard.billingDetails.address,
                  state,
                },
              },
              orderDeliveryOption: {
                ...montyGuestAccountCard.orderDeliveryOption,
                shippingCountry,
              },
            }
            await execute({ payload: payloadWithState })
            const wcsPayload = utils.getRequestArgs(1).payload
            expect(wcsPayload.shipping_state).toBe(state)
            expect(wcsPayload.saved_state).toBe(state)
            expect(wcsPayload.billing_state_input).toBe('')
            expect(wcsPayload.billing_state_select).toBe('')
            expect(wcsPayload.billing_state_hidden).toBe(state)
            expect(wcsPayload.billing_state_select_canada).toBe(state)
          })
        })
      })
    })
    describe('creating the order', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/ConfirmAndPay', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(2).endpoint).toBe(
          '/webapp/wcs/stores/servlet/ConfirmAndPay'
        )
      })
      it('should call with the post method', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(2).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })

        const wcsPayloadG = Object.assign({}, wcsPayloadGuest)
        delete wcsPayloadG.URL

        expect(utils.getRequestArgs(2).payload).toEqual({
          ...wcsPayloadG,
          addressId,
          billing_address_id: addressId,
        })
      })
    })
  })
  describe('User with no checkout profile', () => {
    describe('Adding the delivery address', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/UserRegistrationUpdate', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })
        expect(utils.getRequestArgs(0).endpoint).toBe(
          '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
        )
      })
      it('should call with the post method', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })
        expect(utils.getRequestArgs(0).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })
        expect(utils.getRequestArgs(0).payload).toEqual(updateAddressPayload)
      })
    })
    describe('Adding the billing address', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/UserRegistrationUpdate', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })
        expect(utils.getRequestArgs(1).endpoint).toBe(
          '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
        )
      })
      it('should call with the post method', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })
        expect(utils.getRequestArgs(1).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })
        expect(utils.getRequestArgs(1).payload).toEqual(
          addBillingAddressPayload
        )
      })
    })
    describe('creating the order', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/ConfirmAndPay', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })
        expect(utils.getRequestArgs(2).endpoint).toBe(
          '/webapp/wcs/stores/servlet/ConfirmAndPay'
        )
      })
      it('should call with the post method', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })
        expect(utils.getRequestArgs(2).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiGuest()
        await execute({ payload: montyRegisteredFirstAccountCard })

        const wcsPayloadG = Object.assign({}, wcsPayloadGuest)
        delete wcsPayloadG.URL

        expect(utils.getRequestArgs(2).payload).toEqual({
          ...wcsPayloadG,
          addressId,
          billing_address_id: addressId,
        })
      })
    })
  })
  describe('Registered User changing delivery address', () => {
    describe('Adding the delivery address', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/UserRegistrationUpdate', async () => {
        happyApiChangeDelivery()
        await execute({ payload: montyChangeDeliveryAddress })
        expect(utils.getRequestArgs(0).endpoint).toBe(
          '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
        )
      })
      it('should call with the post method', async () => {
        happyApiChangeDelivery()
        await execute({ payload: montyChangeDeliveryAddress })
        expect(utils.getRequestArgs(0).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiChangeDelivery()
        await execute({ payload: montyChangeDeliveryAddress })
        expect(utils.getRequestArgs(0).payload).toEqual(
          wcsChangeDeliveryAddressPayload
        )
      })
    })
    describe('creating the order', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/ConfirmAndPay', async () => {
        happyApiChangeDelivery()
        await execute({ payload: montyChangeDeliveryAddress })
        expect(utils.getRequestArgs(1).endpoint).toBe(
          '/webapp/wcs/stores/servlet/OrderCalculate'
        )
      })
      it('should call with the post method', async () => {
        happyApiChangeDelivery()
        await execute({ payload: montyChangeDeliveryAddress })
        expect(utils.getRequestArgs(1).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiChangeDelivery()
        await execute({ payload: montyChangeDeliveryAddress })
        expect(utils.getRequestArgs(1).payload).toEqual({
          ...wcsPayload,
          addressId,
        })
      })
    })
  })
  describe('Registered User changing billing address', () => {
    describe('Adding the billing address', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/UserRegistrationUpdate', async () => {
        happyApiChangeBilling()
        await execute({ payload: montyChangeBillingAddress })
        expect(utils.getRequestArgs(0).endpoint).toBe(
          '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
        )
      })
      it('should call with the post method', async () => {
        happyApiChangeBilling()
        await execute({ payload: montyChangeBillingAddress })
        expect(utils.getRequestArgs(0).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiChangeBilling()
        await execute({ payload: montyChangeBillingAddress })
        expect(utils.getRequestArgs(0).payload).toEqual(
          wcsChangeBillingAddressPayload
        )
      })
    })
    describe('creating the order', () => {
      it('should call the endpoint /webapp/wcs/stores/servlet/ConfirmAndPay', async () => {
        happyApiChangeBilling()
        await execute({ payload: montyChangeBillingAddress })
        expect(utils.getRequestArgs(1).endpoint).toBe(
          '/webapp/wcs/stores/servlet/OrderCalculate'
        )
      })
      it('should call with the post method', async () => {
        happyApiChangeBilling()
        await execute({ payload: montyChangeBillingAddress })
        expect(utils.getRequestArgs(1).method).toBe('post')
      })
      it('should call with the correct payload', async () => {
        happyApiChangeBilling()
        await execute({ payload: montyChangeBillingAddress })
        expect(utils.getRequestArgs(1).payload).toEqual({
          ...wcsPayload,
          billing_address_id: addressId,
        })
      })
    })
  })

  describe('All requests to create an order', () => {
    it('should call the endpoint /webapp/wcs/stores/servlet/OrderCalculate', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/OrderCalculate'
      )
    })
    it('should call with the post method', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })
    it('should set the save_details flag to "on" when true', async () => {
      happyApi()
      await execute({
        payload: { ...wcsPayloadWithCreditCard, save_details: true },
      })
      expect(utils.getRequestArgs(0).payload.save_details).toBe('on')
    })
    it('should set the save_details flag to "on" when undefined', async () => {
      happyApi()
      await execute({ payload: { ...wcsPayloadWithCreditCard } })
      expect(utils.getRequestArgs(0).payload.save_details).toBe('on')
    })
    it('should set the save_details flag to undefined when false', async () => {
      happyApi()
      await execute({
        payload: { ...wcsPayloadWithCreditCard, save_details: false },
      })
      expect(utils.getRequestArgs(0).payload.save_details).toBe(undefined)
    })
  })
  describe('An order that fails', () => {
    describe('response', () => {
      beforeEach(() => {
        unhappyApi()
      })
      it('should reject with a 422 and the wcs error message', async () => {
        await expect(execute()).rejects.toHaveProperty('output.payload', {
          error: 'Unprocessable Entity',
          statusCode: 422,
          message: wcsFail.errorMessage,
        })
      })
    })
  })

  describe('Guest and Returning User Error', () => {
    it('handles missing addressId in registerGuest()', async () => {
      const statusCode = 406
      const errorMessage = 'Unable to determine delivery address'
      getCookieFromStore.mockReturnValue(Promise.resolve('N'))
      utils.setWCSResponse({
        body: { ConfirmAndPayCardDetailsForm: {} },
        jsessionid,
      })

      try {
        await execute({
          payload: {
            deliveryAddress: {},
            billingDetails: {},
          },
        })
      } catch (error) {
        expect(error.output.payload.statusCode).toBe(statusCode)
        expect(error.output.payload.message).toBe(errorMessage)
      }
    })

    it('handles missing billingAddressId in registerGuest()', async () => {
      const statusCode = 406
      const errorMessage = 'Unable to determine billing address'
      getCookieFromStore.mockReturnValue(Promise.resolve('N'))
      utils.setWCSResponse({ body: addAddressResponse, jsessionid })
      utils.setWCSResponse(
        { body: { ConfirmAndPayCardDetailsForm: {} }, jsessionid },
        { n: 1 }
      )

      try {
        await execute({
          payload: {
            deliveryAddress: {},
            billingDetails: {},
          },
        })
      } catch (error) {
        expect(error.output.payload.statusCode).toBe(statusCode)
        expect(error.output.payload.message).toBe(errorMessage)
      }
    })

    it('handles error from updateDeliveryAddressPayload', async () => {
      const { errorCode, statusCode } = getExampleErrorMapping()
      const errorMessage = 'Whoops'
      unhappyApiGuest(
        {
          errorMessage,
          errorCode,
          orderSummary: {
            errorMessage: 'IGNORE ME',
          },
        },

        0
      )
      const payload = {
        deliveryAddress: {},
        billingDetails: {},
      }
      await expectError({ errorCode, statusCode, errorMessage }, { payload })
    })

    it('handles error from billingAddressPayload', async () => {
      const { errorCode, statusCode } = getExampleErrorMapping()
      const errorMessage = 'Whoops'
      unhappyApiGuest(
        {
          errorMessage,
          errorCode,
          orderSummary: {
            errorMessage: 'IGNORE ME',
          },
        },
        1
      )
      const payload = {
        deliveryAddress: {},
        billingDetails: {},
      }
      await expectError({ errorCode, statusCode, errorMessage }, { payload })
    })

    it('handles error from createDeliveryPayload', async () => {
      const { errorCode, statusCode } = getExampleErrorMapping()
      const errorMessage = 'Whoops'
      unhappyApiChangeDelivery({
        errorMessage,
        errorCode,
        orderSummary: {
          errorMessage: 'IGNORE ME',
        },
      })
      await expectError(
        { errorCode, statusCode, errorMessage },
        {
          payload: montyChangeDeliveryAddress,
        }
      )
    })

    it('handles missing addressId in changeDeliveryAddress()', async () => {
      const statusCode = 406
      const errorMessage = 'Unable to determine delivery address'
      getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
      utils.setWCSResponse({
        body: { orderSummary: { OrderCalculateForm: {} } },
        jsessionid,
      })

      try {
        await execute({
          payload: montyChangeDeliveryAddress,
        })
      } catch (error) {
        expect(error.output.payload.statusCode).toBe(statusCode)
        expect(error.output.payload.message).toBe(errorMessage)
      }
    })

    it('handles error from createBillingPayload', async () => {
      const { errorCode, statusCode } = getExampleErrorMapping()
      const errorMessage = 'Whoops'
      unhappyApiChangeBilling({
        errorMessage,
        errorCode,
        orderSummary: {
          errorMessage: 'IGNORE ME',
        },
      })
      await expectError(
        { errorCode, statusCode, errorMessage },
        {
          payload: montyChangeBillingAddress,
        }
      )
    })

    it('handles missing billingAddressId in changeBillingAddress()', async () => {
      const statusCode = 406
      const errorMessage = 'Unable to determine billing address'
      getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
      utils.setWCSResponse({
        body: { orderSummary: { OrderCalculateForm: {} } },
        jsessionid,
      })

      try {
        await execute({
          payload: montyChangeBillingAddress,
        })
      } catch (error) {
        expect(error.output.payload.statusCode).toBe(statusCode)
        expect(error.output.payload.message).toBe(errorMessage)
      }
    })
  })

  describe('WCS errorCodes', () => {
    const CreateOrderMapper = new CreateOrder()
    const errorMap = CreateOrderMapper.mapWCSErrorCodes

    Object.entries(errorMap).forEach(([errorCode, statusCode]) => {
      it(`should throw a ${statusCode} if wcs returns ${errorCode} errorCode`, async () => {
        utils.setWCSResponse({
          body: {
            errorCode,
            message: 'oh no not again',
          },
          jsessionid,
        })
        getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
        await expect(execute()).rejects.toMatchObject({
          message: 'oh no not again',
          output: { statusCode },
          data: {
            wcsErrorCode: errorCode,
          },
        })
      })
    })

    describe('when the out of stock error code is received', () => {
      it('should throw a 409', async () => {
        const errorCode = '_API_CANT_RESOLVE_FFMCENTER.2'
        const statusCode = createOrderErrorCodes[errorCode]
        expect(statusCode).not.toBeUndefined()

        const errorMessage = 'none left, soz'
        utils.setWCSResponse({
          body: {
            errorCode,
            errorMessage,
          },
          jsessionid,
        })
        getCookieFromStore.mockReturnValue(Promise.resolve('Y'))

        await expectError(
          { errorCode, statusCode, errorMessage },
          {
            payload: montyChangeBillingAddress,
          }
        )
      })
    })
  })
})
