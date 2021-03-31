import * as utils from '../../../../__test__/utils'
import StoreDeliverySelector from '../StoreDeliverySelector'

//
// Guest
//
import wcsSelectStoreDeliveryAndSpecificStoreForGuestUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/guest/wcs.json'
import hapiSelectStoreDeliveryAndSpecificStoreForGuestUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/guest/hapiMonty.json'

import wcsSelectStoreExpressForGuestUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-express/wcs-guest.json'
import hapiSelectStoreExpressForGuestUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-express/hapiMonty-guest.json'

//
// Registered
//
import wcsSelectStoreDeliveryAndSpecificStoreForRegisteredUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/registered/wcs.json'
import hapiSelectStoreDeliveryAndSpecificStoreForRegisteredUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/registered/hapiMonty.json'

import wcsSelectStoreExpressForRegisteredUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-express/wcs-registered.json'
import hapiSelectStoreExpressForRegisteredUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-express/hapiMonty-registered.json'

import wcsSelectStoreNotAvailableRegisteredUser from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-not-available/wcs-registered.json'
import wcsSelectStoreNotAvailableRegisteredUserErrorCode from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-not-available/wcs-registered-error-code.json'

const defaults = {
  endpoint: 'ordersummary',
  query: {},
  payload: {},
  method: 'put',
  headers: {},
  params: {},
}

//
// payloads from Client
//

const payloadFromClientToSelectStoreDeliveryAndSpecificStore = {
  orderId: 700351015,
  deliveryType: 'STORE_STANDARD',
  shippingCountry: 'United Kingdom',
  deliveryStoreCode: 'TS0001',
  storeAddress1: '214 Oxford Street',
  storeAddress2: 'Oxford Circus',
  storeCity: 'West End',
  storePostcode: 'W1W 8LG',
}

const paylodFromClientToSelectStoreStandard = {
  orderId: 700351015,
  deliveryType: 'STORE_STANDARD',
  shippingCountry: 'United Kingdom',
  shipModeId: 45019,
  deliveryStoreCode: 'TS0001',
  storeAddress1: '214 Oxford Street',
  storeAddress2: 'Oxford Circus',
  storeCity: 'West End',
  storePostcode: 'W1W 8LG',
}

const paylodFromClientToSelectStoreExpress = {
  orderId: 700351015,
  deliveryType: 'STORE_EXPRESS',
  shippingCountry: 'United Kingdom',
  shipModeId: 56018,
  deliveryStoreCode: 'TS0001',
  storeAddress1: '214 Oxford Street',
  storeAddress2: 'Oxford Circus',
  storeCity: 'West End',
  storePostcode: 'W1W 8LG',
}

const payloadFromClientToChangeSelectedStore = {
  orderId: 700351015,
  deliveryType: 'STORE_EXPRESS',
  shippingCountry: 'United Kingdom',
  shipModeId: 56018,
  deliveryStoreCode: 'TS0001',
  storeAddress1: '214 Oxford Street',
  storeAddress2: 'Oxford Circus',
  storeCity: 'West End',
  storePostcode: 'W1W 8LG',
}

//
// paylods to WCS
//

const payloadToWcsCommon = {
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  orderId: 700351015,
  shipping_country: 'United Kingdom',
  sourcePage: 'OrderSubmitForm',
  page: 'account',
}

const payloadToWcs = {
  ...payloadToWcsCommon,
  actionType: 'updateStoreDelivery',
  field1: 'TS0001',
  deliveryType: 'store',
  deliveryOptionType: 'S',
  // URL: 'ProcessDeliveryDetails', // !!! REQUIRED FOR RETURNING CUSTOMERS
  // preventAddressOverride: 'Y', // !!! REQUIRED FOR RETURNING CUSTOMERS
  errorViewName: 'UserRegistrationForm', // !!! AddressUpdateAjaxView FOR RETURNING CUSTOMERS
  shipping_errorViewName: 'UserRegistrationForm',
  shipping_nickName: 'Default_Store_12556',
  shipping_address1: '214 Oxford Street',
  shipping_address2: 'Oxford Circus',
  shipping_city: 'West End',
  shipping_state_input: 'West End',
  shipping_zipCode: 'W1W 8LG',
}

const execute = utils.buildExecutor(StoreDeliverySelector, defaults)

describe('StoreDeliverySelector Mapper', () => {
  const mockAPI1 = () =>
    utils.setWCSResponse({ body: { orderSummary: {} } }, { n: 0 })
  beforeEach(() => {
    jest.clearAllMocks()

    mockAPI1()
  })

  describe('Endpoint mapping', () => {
    it('maps correctly the endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ProcessStoreDetails'
      )
    })
  })

  describe('Method mapping', () => {
    it('should use the correct method', async () => {
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })
  })

  describe('ErrorCode mapping', () => {
    describe('WCS errorCode', () => {
      it('should throw a 409 if wcs returns errorCode _ERR_DELIVERY_STORE_INVALID', () => {
        utils.setWCSResponse({
          body: {
            errorCode: '_ERR_DELIVERY_STORE_INVALID',
            errorMessage: 'something fishy goin on',
          },
        })

        return utils.expectFailedWith(execute(), {
          statusCode: 409,
          message: 'something fishy goin on',
          wcsErrorCode: '_ERR_DELIVERY_STORE_INVALID',
        })
      })

      it('should throw a 409 if wcs returns errorCode _ERR_DELIVERY_STORE_ADDRESS_INVALID', () => {
        utils.setWCSResponse({
          body: {
            errorCode: '_ERR_DELIVERY_STORE_ADDRESS_INVALID',
            errorMessage: 'something fishy goin on',
          },
        })

        return utils.expectFailedWith(execute(), {
          statusCode: 409,
          message: 'something fishy goin on',
          wcsErrorCode: '_ERR_DELIVERY_STORE_ADDRESS_INVALID',
        })
      })

      it('should throw a 409 if wcs returns errorCode _ERR_DELIVERY_STORE_ADDRESS_INACTIVE', () => {
        utils.setWCSResponse({
          body: {
            errorCode: '_ERR_DELIVERY_STORE_ADDRESS_INACTIVE',
            errorMessage: 'something fishy goin on',
          },
        })

        return utils.expectFailedWith(execute(), {
          statusCode: 409,
          message: 'something fishy goin on',
          wcsErrorCode: '_ERR_DELIVERY_STORE_ADDRESS_INACTIVE',
        })
      })
    })
  })

  describe('Payload mapping', () => {
    describe('Select Store Delivery and Specific Store', () => {
      it('maps correctly the payload', async () => {
        await execute({
          payload: payloadFromClientToSelectStoreDeliveryAndSpecificStore,
        })
        expect(utils.getRequestArgs(0).payload).toEqual(payloadToWcs)
      })
    })
    describe('Change Store Delivery type (e.g.: Express, Immediate)', () => {
      describe('Select Store Standard type', () => {
        it('maps correctly the payload', async () => {
          await execute({ payload: paylodFromClientToSelectStoreStandard })
          expect(utils.getRequestArgs(0).payload).toEqual({
            ...payloadToWcs,
            shipModeId: 45019,
          })
        })
      })
      describe('Select Store Express type', () => {
        it('maps correctly the payload', async () => {
          await execute({ payload: paylodFromClientToSelectStoreExpress })
          expect(utils.getRequestArgs(0).payload).toEqual({
            ...payloadToWcs,
            shipModeId: 56018,
          })
        })
      })
    })
    describe('Change Store selected', () => {
      it('maps correctly the payload', async () => {
        await execute({ payload: payloadFromClientToChangeSelectedStore })
        expect(utils.getRequestArgs(0).payload).toEqual({
          ...payloadToWcs,
          shipModeId: 56018,
        })
      })
    })
  })

  describe('Response mapping', () => {
    describe('Guest User', () => {
      describe('Select Store Delivery and Specific Store - Store Standard', () => {
        it('maps correctly the response', async () => {
          utils.setWCSResponse(
            {
              body: wcsSelectStoreDeliveryAndSpecificStoreForGuestUser,
            },
            { n: 0 }
          )

          await expect(execute()).resolves.toEqual({
            body: hapiSelectStoreDeliveryAndSpecificStoreForGuestUser,
          })
        })
      })
      describe('Select Store Express', () => {
        it('maps correctly the response', async () => {
          utils.setWCSResponse(
            {
              body: wcsSelectStoreExpressForGuestUser,
            },
            { n: 0 }
          )

          await expect(execute()).resolves.toEqual({
            body: hapiSelectStoreExpressForGuestUser,
          })
        })
      })
    })
    describe('Registered User', () => {
      describe('Select Store Delivery and Specific Store - Store Standard', () => {
        it('maps correctly the response', async () => {
          utils.setWCSResponse(
            {
              body: wcsSelectStoreDeliveryAndSpecificStoreForRegisteredUser,
            },
            { n: 0 }
          )

          await expect(
            execute({
              ...defaults,
              headers: {
                cookie: 'authenticated=yes;',
              },
            })
          ).resolves.toEqual({
            body: hapiSelectStoreDeliveryAndSpecificStoreForRegisteredUser,
          })
        })
      })
      describe('Select Store Express', () => {
        it('maps correctly the response', async () => {
          utils.setWCSResponse(
            {
              body: wcsSelectStoreExpressForRegisteredUser,
            },
            { n: 0 }
          )

          await expect(
            execute({
              ...defaults,
              headers: {
                cookie: 'authenticated=yes;',
              },
            })
          ).resolves.toEqual({
            body: hapiSelectStoreExpressForRegisteredUser,
          })
        })
      })
    })

    describe('When store delivery is not available for a product in the basket ', () => {
      it('should throw an error', async () => {
        utils.setWCSResponse(
          {
            body: wcsSelectStoreNotAvailableRegisteredUser,
          },
          { n: 0 }
        )
        try {
          await execute({
            ...defaults,
            headers: {
              cookie: 'authenticated=yes;',
            },
          })
        } catch (err) {
          return expect(err).toHaveProperty('output.payload', {
            error: 'Unprocessable Entity',
            message:
              'Unfortunately this delivery option is no longer available for this store. Please choose another option or select an alternative store.',
            statusCode: 422,
          })
        }
      })

      it('should throw an error code if its there', async () => {
        utils.setWCSResponse(
          {
            body: wcsSelectStoreNotAvailableRegisteredUserErrorCode,
          },
          { n: 0 }
        )
        try {
          await execute({
            ...defaults,
            headers: {
              cookie: 'authenticated=yes;',
            },
          })
        } catch (err) {
          return expect(err).toHaveProperty('output.payload', {
            error: 'Conflict',
            message: 'SOme error',
            statusCode: 409,
          })
        }
      })
    })
  })
})
