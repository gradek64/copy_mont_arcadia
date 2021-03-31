import * as utils from '../../../../__test__/utils'
import ParcelDeliverySelector from '../ParcelDeliverySelector'

import wcsSelectParcelshopStoreForGuestUser from 'test/apiResponses/order-summary/update-order/select-parcelshop/guest/wcs.json'
import hapiSelectParcelshopStoreForGuestUser from 'test/apiResponses/order-summary/update-order/select-parcelshop/guest/hapi.json'

import wcsSelectParcelshopStoreForRegisteredUser from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/shortProfile/wcs.json'
import hapiSelectParcelshopStoreForRegisteredUser from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/shortProfile/hapiMonty.json'

const defaults = {
  endpoint: 'ordersummary',
  query: {},
  payload: {},
  method: 'put',
  headers: {},
  params: {},
}

const payloadFromClient = {
  orderId: 700347603,
  deliveryType: 'PARCELSHOP_COLLECTION',
  shippingCountry: 'United Kingdom',
  shipModeId: 50517,
  deliveryStoreCode: 'S12419',
  storeAddress1: '456-459 Strand',
  storeAddress2: '',
  storeCity: 'Greater London',
  storePostcode: 'WC2R 0RG',
}

const payloadtoWcsCommon = {
  catalogId: '33057',
  storeId: 12556,
  langId: '-1',
  orderId: 700347603,
  errorViewName: 'UserRegistrationForm',
  sourcePage: 'OrderSubmitForm',
  page: 'account',
  shipping_country: 'United Kingdom',
}

const payloadToWcsToSelectParcelshop = {
  ...payloadtoWcsCommon,
  actionType: 'updateShipping',
  deliveryType: 'parcel_collection',
}

const payloadToWcsToSelectParcelshopStore = {
  ...payloadtoWcsCommon,
  actionType: 'updateCountryAndOrderItems',
  field1: 'S12419',
  deliveryOptionType: 'S',
  URL: 'ProcessDeliveryDetails',
  preventAddressOverride: 'Y',
  shipping_errorViewName: 'UserRegistrationForm',
  shipping_nickName: 'Default_Store_12556',
  shipping_address1: '456-459 Strand',
  shipping_address2: '',
  shipping_city: 'Greater London',
  shipping_state_input: 'Greater London',
  shipping_zipCode: 'WC2R 0RG',
}

const execute = utils.buildExecutor(ParcelDeliverySelector, defaults)

describe('ParcelDeliverySelector Mapper', () => {
  const mockAPI1 = () =>
    utils.setWCSResponse({ body: { orderSummary: {} } }, { n: 0 })
  const mockAPI2 = () =>
    utils.setWCSResponse({ body: { orderSummary: {} } }, { n: 1 })
  beforeEach(() => {
    jest.clearAllMocks()

    mockAPI1()
    mockAPI2()
  })

  it('maps correctly the endpoint', async () => {
    await execute()
    expect(utils.getRequestArgs(0).endpoint).toBe(
      '/webapp/wcs/stores/servlet/ProcessStoreDetails'
    )
  })

  it('should use the correct method', async () => {
    await execute()
    expect(utils.getRequestArgs(0).method).toBe('post')
  })

  it('should send the correct payload to select Parcelshop as delivery location', async () => {
    await execute({ payload: payloadFromClient })
    expect(utils.getRequestArgs(0).payload).toEqual(
      payloadToWcsToSelectParcelshop
    )
  })

  it('should send the correct payload to select specific Parcelshop Store', async () => {
    await execute({ payload: payloadFromClient })
    expect(utils.getRequestArgs(1).payload).toEqual(
      payloadToWcsToSelectParcelshopStore
    )
  })

  describe('Guest User', () => {
    it('should correctly map the response', async () => {
      utils.setWCSResponse(
        {
          body: { orderSummary: {} },
        },
        { n: 0 }
      )
      utils.setWCSResponse(
        {
          body: wcsSelectParcelshopStoreForGuestUser,
        },
        { n: 1 }
      )

      await expect(execute()).resolves.toEqual({
        body: hapiSelectParcelshopStoreForGuestUser,
      })
    })
  })

  describe('Registered User', () => {
    it('should correctly map the response', async () => {
      utils.setWCSResponse(
        {
          body: { orderSummary: {} },
        },
        { n: 0 }
      )
      utils.setWCSResponse(
        {
          body: wcsSelectParcelshopStoreForRegisteredUser,
        },
        { n: 1 }
      )

      await expect(
        execute({
          ...defaults,
          headers: {
            cookie: 'authenticated=yes;',
          },
        })
      ).resolves.toEqual({
        body: hapiSelectParcelshopStoreForRegisteredUser,
      })
    })
  })
})
