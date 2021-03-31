import * as utils from '../../../../__test__/utils'
import CreateOrder from '../../CreateOrder'
import wcs from '../../../../../../../../test/apiResponses/create-order/wcs.json'
import monty from '../../../../../../../../test/apiResponses/create-order/hapi.json'

describe('CreateOrder Mapper: Account Card', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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

  const wcsPayload = {
    ipAddress: '127.0.0.1',
    orderId: 700366413,
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
    langId: '-1',
    storeId: 12556,
    catalogId: '33057',
    save_details: 'on',
  }

  const montyReturningAccountCard = {
    smsMobileNumber: '0787654321',
    remoteIpAddress: '127.0.0.1',
    cardCvv: '123',
    orderDeliveryOption: {
      orderId: 700366413,
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

  const creditCard = {
    expiryYear: '2019',
    expiryMonth: '03',
    cardNumber: '6000082000000088',
    type: 'ACCNT',
  }

  const montyReturningNewAccountCard = {
    ...montyReturningAccountCard,
    creditCard,
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
  const montyGuestAccountCard = {
    smsMobileNumber: '0787654321',
    remoteIpAddress: '127.0.0.1',
    cardCvv: '123',
    orderDeliveryOption: {
      orderId: 700366413,
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

  const updateAddressPayload = {
    URL: 'ProcessDeliveryDetails?actionType=updateDeliveryDetails',
    orderId: 700366413,
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
    orderId: 700366413,
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

  const addressId = '905061'
  const updateAddressResponse = { ConfirmAndPayCardDetailsForm: { addressId } }
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

  const happyApiGuest = () => {
    utils.setWCSResponse({ body: updateAddressResponse, jsessionid })
    utils.setWCSResponse({ body: registerResponse, jsessionid }, { n: 1 })
    utils.setWCSResponse({ body: wcs, jsessionid }, { n: 2 })
  }

  describe('Guest User', () => {
    describe('Adding the delivery address', () => {
      it('should call with the correct payload', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(0).payload).toEqual(updateAddressPayload)
      })
    })
    describe('registering the user', () => {
      it('should call with the correct payload', async () => {
        happyApiGuest()
        await execute({ payload: montyGuestAccountCard })
        expect(utils.getRequestArgs(1).payload).toEqual(registerPayload)
      })
    })
    describe('creating the order', () => {
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

  describe('A returning customer', () => {
    describe('Paying with an Account card already used', () => {
      describe('calling the wcs endpoint for creating an Order', () => {
        it('should call with the correct payload', async () => {
          happyApi()
          await execute()
          expect(utils.getRequestArgs(0).payload).toEqual(wcsPayload)
        })
      })
      describe('response', () => {
        beforeEach(() => {
          happyApi()
        })
        it('should transform the wcs response into a monty response', async () => {
          const result = await execute()
          expect(result.body).toEqual(monty)
        })
        it('should contain the jsessionid', async () => {
          const result = await execute()
          expect(result.jsessionid).toBe(jsessionid)
        })
      })
    })

    describe('Paying with a new Account card, with an old billing address', () => {
      describe('calling the wcs endpoint for creating an Order', () => {
        it('should call with the correct payload', async () => {
          happyApi()
          await execute({
            payload: montyReturningNewAccountCard,
          })
          expect(utils.getRequestArgs(0).payload).toEqual(
            wcsPayloadWithCreditCard
          )
        })
      })
      describe('response', () => {
        beforeEach(() => {
          happyApi()
        })
        it('should transform the wcs response into a monty response', async () => {
          const result = await execute()
          expect(result.body).toEqual(monty)
        })
        it('should contain the jsessionid', async () => {
          const result = await execute()
          expect(result.jsessionid).toBe(jsessionid)
        })
      })
    })
  })
})
