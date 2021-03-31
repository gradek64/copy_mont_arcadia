import Boom from 'boom'

import * as utils from '../../../__test__/utils'
import AddDeliveryAddress from '../AddDeliveryAddress'
import wcs from 'test/apiResponses/orders/wcs-addDeliveryAddress.json'
import monty from 'test/apiResponses/orders/hapi-addDeliveryAddress.json'
import monty_orderSummary from 'test/apiResponses/orders/hapi-addDeliveryAddress-orderSummary.json'

jest.mock('boom')

describe('AddDeliveryAddressMapper', () => {
  const orderId = '11223344'

  beforeEach(() => {
    jest.clearAllMocks()

    utils.setUserSession({
      cookies: [
        utils.createCookies()(
          utils.createCartIdCookie(orderId),
          utils.createJSessionIdCookie(123456)
        ),
      ],
    })
    utils.setWCSResponse({ body: { orderSummary: {} } })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const payloadFromMonty = {
    addressDetailsId: 111111,
    address: {
      state: '',
      address1: '1234 Test Street',
      address2: '',
      postcode: 'A1A 1A1',
      city: 'London',
      country: 'United Kingdom',
    },
    nameAndPhone: {
      lastName: 'McTest',
      title: 'Ms',
      firstName: 'Test',
      telephone: '0123456789',
    },
  }

  const payloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    shipping_address1: payloadFromMonty.address.address1,
    shipping_address2: payloadFromMonty.address.address2,
    shipping_city: payloadFromMonty.address.city,
    proceed: '',
    registerType: 'R',
    returnPage: 'ShoppingBag',
    isoCode: '',
    orderId,
    page: 'account',
    editRegistration: 'Y',
    editSection: '',
    outOrderItemName: '',
    actionType: 'updateCountryAndOrderItems',
    sourcePage: '',
    deliveryOptionType: 'H',
    URL: 'ProcessDeliveryDetails',
    errorViewName: 'AddressUpdateAjaxView',
    preventAddressOverride: 'Y',
    shipping_errorViewName: 'UserRegistrationForm',
    shipping_nickName: `Default_Shipping_${config.siteId}`,
    shipping_personTitle: payloadFromMonty.nameAndPhone.title,
    shipping_firstName: payloadFromMonty.nameAndPhone.firstName,
    shipping_lastName: payloadFromMonty.nameAndPhone.lastName,
    shipping_phone1: payloadFromMonty.nameAndPhone.telephone,
    shipping_country: payloadFromMonty.address.country,
    lookupHouseNumber: '',
    lookupPostcode: '',
    addressResults: '',
    shipping_state_hidden: '',
    shipping_state_input: payloadFromMonty.address.state,
    shipping_state_select_canada: '',
    shipping_state_select: '',
    shipping_zipCode: payloadFromMonty.address.postcode,
    preferredLanguage: '',
    preferredCurrency: '',
    montyUserAction: 'shipping',
  }

  const defaults = {
    method: 'post',
    endpoint: '',
    query: '',
    payload: payloadFromMonty,
    headers: {
      cookie: utils.createCookies()(
        utils.createJSessionIdCookie(12345),
        'authenticated=yes;'
      ),
    },
    getOrderId: () => Promise.resolve(orderId),
  }

  const execute = utils.buildExecutor(AddDeliveryAddress, defaults)

  describe('Requests as a registered user', () => {
    it('should use the correct endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
      )
    })
  })

  describe('Requests as a guest user', () => {
    it('should use the correct endpoint', async () => {
      await execute({
        headers: {
          cookie: utils.createJSessionIdCookie(12345),
        },
      })
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ProcessDeliveryDetails'
      )
    })
  })

  describe('Requests for both guest and registered users', () => {
    it('should set the correct payload', async () => {
      await execute({})
      expect(utils.getRequestArgs(0).payload).toEqual(payloadToWCS)
    })
  })

  describe('Responses for both guest and registered users', () => {
    it('should be mapped correctly', async () => {
      utils.setWCSResponse({ body: wcs })
      await expect(execute({})).resolves.toEqual({ body: monty })
    })
  })

  describe('Responses for both guest and registered users (responseType = orderSummary)', () => {
    it('should be mapped correctly', async () => {
      AddDeliveryAddress.responseType = 'orderSummary'
      utils.setWCSResponse({ body: wcs })
      await expect(
        execute({
          payload: {
            ...payloadFromMonty,
            responseType: 'orderSummary',
          },
        })
      ).resolves.toEqual({ body: monty_orderSummary })
      AddDeliveryAddress.responseType = 'basket'
    })
  })

  describe('WCS errorCodes', () => {
    beforeEach(() => {
      Boom.create.mockImplementation((status, message, data) => ({
        status,
        message,
        data,
      }))
    })

    it('should throw a 406 if wcs returns the _ERR_CMD_INVALID_PARAM.ERROR_CODE_INVALID_PHONE_NUMBER errorCode', async () => {
      utils.setWCSResponse({
        body: {
          errorCode: '_ERR_CMD_INVALID_PARAM.ERROR_CODE_INVALID_PHONE_NUMBER',
          message: 'something fishy going on',
        },
      })
      await expect(execute({})).rejects.toEqual({
        status: 406,
        message: 'something fishy going on',
        data: {
          wcsErrorCode:
            '_ERR_CMD_INVALID_PARAM.ERROR_CODE_INVALID_PHONE_NUMBER',
        },
      })
    })

    it('should throw a 406 if wcs returns the ERROR_CODE_INVALID_PHONE_NUMBER errorCode', async () => {
      utils.setWCSResponse({
        body: {
          errorCode: 'ERROR_CODE_INVALID_PHONE_NUMBER',
          message: 'something fishy going on',
        },
      })
      await expect(execute({})).rejects.toEqual({
        status: 406,
        message: 'something fishy going on',
        data: {
          wcsErrorCode: 'ERROR_CODE_INVALID_PHONE_NUMBER',
        },
      })
    })

    it('should throw a 406 if wcs returns the ERROR_INVALID_STATE errorCode', async () => {
      utils.setWCSResponse({
        body: {
          errorCode: 'ERROR_INVALID_STATE',
          message: 'something fishy going on',
        },
      })
      await expect(execute({})).rejects.toEqual({
        status: 406,
        message: 'something fishy going on',
        data: {
          wcsErrorCode: 'ERROR_INVALID_STATE',
        },
      })
    })

    it('should throw a 406 if wcs returns the 2020 errorCode', async () => {
      utils.setWCSResponse({
        body: {
          errorCode: 2020,
          message: 'something fishy going on',
        },
      })
      await expect(execute({})).rejects.toEqual({
        status: 406,
        message: 'something fishy going on',
        data: {
          wcsErrorCode: 2020,
        },
      })
    })
  })
})
