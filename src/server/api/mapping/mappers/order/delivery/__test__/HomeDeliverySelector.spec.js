import * as utils from '../../../../__test__/utils'
import HomeDeliverySelector from '../HomeDeliverySelector'

import wcsSelectHomeExpressRegistered from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-express/registered/wcs.json'
import hapiSelectHomeExpressRegistered from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-express/registered/hapiMonty.json'

import wcsSelectHomeExpressGuest from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-express/guest/wcs.json'
import hapiSelectHomeExpressGuest from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-express/guest/hapiMonty.json'

import wcsSelectHomStandardRegistered from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-standard/registered/wcs.json'
import hapiSelectHomeStandardRegistered from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-standard/registered/hapiMonty.json'

import wcsSelectHomStandardGuest from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-standard/guest/wcs.json'
import hapiSelectHomeStandardGuest from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-standard/guest/hapiMonty.json'

const defaults = {
  endpoint: 'ordersummary',
  query: {},
  payload: {},
  method: 'put',
  headers: {},
  params: {},
}

const commonPayload = {
  storeId: 12556,
  langId: '-1',
  catalogId: '33057',
  deliveryOptionType: 'H',
  errorViewName: 'UserRegistrationForm',
  orderId: 'orderId',
  status: 'P',
  outOrderItemName: '',
  page: 'account',
  shipping_country: 'United Kingdom',
}

const commonPayloadExpressStandard = {
  proceed: 'Y',
  registerType: 'R',
  returnPage: 'ShoppingBag',
  isoCode: '',
  shippingIsoCode: '',
  editRegistration: 'Y',
  editSection: '',
  actionType: 'updateHomeDelivery',
  sourcePage: 'DeliveryPage',
  shipping_errorViewName: 'UserRegistrationForm',
  shipping_nickName: 'Default_Shipping_12556',
  shipping_personTitle: '',
  shipping_firstName: '',
  shipping_lastName: '',
  shipping_phone1: '',
  lookupHouseNumber: '',
  lookupPostcode: '',
  shipping_state_hidden: '',
  shipping_address1: '',
  shipping_address2: '',
  shipping_city: '',
  shipping_state_input: '',
  shipping_state_select_canada: '',
  shipping_state_select: '',
  shipping_zipCode: '',
  preferredLanguage: '',
  preferredCurrency: 's',
}

const payloadToWcsHomeDelivery = {
  ...commonPayload,
  actionType: 'updateShipping',
  sourcePage: 'OrderSubmitForm',
  deliveryType: 'home',
}

const payloadToWcsHomeStandard = {
  ...commonPayload,
  ...commonPayloadExpressStandard,
  shipModeId: 'shipModeId',
}

const payloadToWcsHomeExpress = {
  ...commonPayload,
  ...commonPayloadExpressStandard,
  shipModeId: undefined,
  available_date: 'shipModeId',
}

const execute = utils.buildExecutor(HomeDeliverySelector, defaults)

describe('HomeDeliverySelector Mapper', () => {
  const mockAPI = () => utils.setWCSResponse({ body: { orderSummary: {} } })

  beforeEach(() => {
    jest.clearAllMocks()

    mockAPI()
  })

  it('maps correctly the endpoint', async () => {
    await execute()
    expect(utils.getRequestArgs(0).endpoint).toBe(
      '/webapp/wcs/stores/servlet/ProcessDeliveryDetails'
    )
  })

  it('should use the correct method', async () => {
    await execute()
    expect(utils.getRequestArgs(0).method).toBe('post')
  })

  it('should send the correct payload for Home Delivery option selection', async () => {
    // This is the scenario where the User selects Home Delivery in a situation where the current
    // delivery option selected is Parcel or Store.

    await execute({
      payload: {
        deliveryType: 'HOME_STANDARD',
        orderId: 'orderId',
        shippingCountry: 'United Kingdom',
      },
    })
    expect(utils.getRequestArgs(0).payload).toEqual(payloadToWcsHomeDelivery)
  })

  it('should send the correct payload for home standard delivery', async () => {
    await execute({
      payload: {
        deliveryType: 'HOME_STANDARD',
        orderId: 'orderId',
        shipModeId: 'shipModeId',
        shippingCountry: 'United Kingdom',
      },
    })
    expect(utils.getRequestArgs(0).payload).toEqual(payloadToWcsHomeStandard)
  })

  it('should send the correct payload for home express delivery', async () => {
    await execute({
      payload: {
        deliveryType: 'HOME_EXPRESS',
        orderId: 'orderId',
        shipModeId: 'shipModeId',
        shippingCountry: 'United Kingdom',
      },
    })
    expect(utils.getRequestArgs(0).payload).toEqual(payloadToWcsHomeExpress)
  })

  it('should send by default the payload associated with home standard', async () => {
    await execute({
      payload: {
        orderId: 'orderId',
        shipModeId: 'shipModeId',
        shippingCountry: 'United Kingdom',
      },
    })
    expect(utils.getRequestArgs(0).payload).toEqual(payloadToWcsHomeStandard)
  })

  describe('Guest User', () => {
    it('should correctly map the response for home standard', async () => {
      utils.setWCSResponse({
        body: wcsSelectHomStandardGuest,
      })

      await expect(execute()).resolves.toEqual({
        body: hapiSelectHomeStandardGuest,
      })
    })
    it('should correctly map the response for home express', async () => {
      utils.setWCSResponse({
        body: wcsSelectHomeExpressGuest,
      })

      await expect(execute()).resolves.toEqual({
        body: hapiSelectHomeExpressGuest,
      })
    })
  })

  describe('Registered User', () => {
    it('should correctly map the response for home express', async () => {
      utils.setWCSResponse({
        body: wcsSelectHomeExpressRegistered,
      })

      await expect(
        execute({
          headers: {
            cookie: 'authenticated=yes;',
          },
        })
      ).resolves.toEqual({
        body: hapiSelectHomeExpressRegistered,
      })
    })
    it('should correctly map the response for home standard', async () => {
      utils.setWCSResponse({
        body: wcsSelectHomStandardRegistered,
      })

      await expect(
        execute({
          headers: {
            cookie: 'authenticated=yes;',
          },
        })
      ).resolves.toEqual({
        body: hapiSelectHomeStandardRegistered,
      })
    })
  })
})
