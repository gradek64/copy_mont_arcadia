import OrderSummary from '../../OrderSummary'
import basketTransform from '../../../../transforms/basket'

import wcsRegisteredFirstTimeCheckoutHomeDelivery from 'test/apiResponses/order-summary/registered/first-time-checkout/home-delivery/wcs-home-delivery.json'
import hapiRegisteredFirstTimeCheckoutHomeDelivery from 'test/apiResponses/order-summary/registered/first-time-checkout/home-delivery/hapi-home-delivery.json'

import wcsRegisteredNthTimeCheckoutHomeDelivery from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/wcs-registered.json'
import hapiRegisteredNthTimeCheckoutHomeDelivery from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/hapiMonty-registered.json'

import wcsRegisteredNthTimeCheckoutStoreDeliveryStandard from 'test/apiResponses/order-summary/registered/nth-time-checkout/store-delivery/wcs-store-standard.json'
import hapiRegisteredNthTimeCheckoutStoreDeliveryStandard from 'test/apiResponses/order-summary/registered/nth-time-checkout/store-delivery/hapi-store-standard.json'

import wcsRegisteredNthTimeCheckoutStoreDeliveryExpress from 'test/apiResponses/order-summary/registered/nth-time-checkout/store-delivery/wcs-store-express.json'
import hapiRegisteredNthTimeCheckoutStoreDeliveryExpress from 'test/apiResponses/order-summary/registered/nth-time-checkout/store-delivery/hapi-store-express.json'

import wcsRegisteredNthTimeCheckoutStoreDeliveryImmediate from 'test/apiResponses/order-summary/registered/nth-time-checkout/store-delivery/wcs-store-immediate.json'
import hapiRegisteredNthTimeCheckoutStoreDeliveryImmediate from 'test/apiResponses/order-summary/registered/nth-time-checkout/store-delivery/hapi-store-immediate.json'

import wcsRegisteredFirstTimeCheckoutStoreStandard from 'test/apiResponses/order-summary/registered/first-time-checkout/store-delivery/wcs-store-standard.json'
import hapiRegisteredFirstTimeCheckoutStoreStandard from 'test/apiResponses/order-summary/registered/first-time-checkout/store-delivery/hapi-store-standard.json'

import wcsRegisteredFirstTimeCheckoutStoreExpress from 'test/apiResponses/order-summary/registered/first-time-checkout/store-delivery/wcs-store-express.json'
import hapiRegisteredFirstTimeCheckoutStoreExpress from 'test/apiResponses/order-summary/registered/first-time-checkout/store-delivery/hapi-store-express.json'

import wcsRegisteredFirstTimeCheckoutStoreImmediate from 'test/apiResponses/order-summary/registered/first-time-checkout/store-delivery/wcs-store-immediate.json'
import hapiRegisteredFirstTimeCheckoutStoreImmediate from 'test/apiResponses/order-summary/registered/first-time-checkout/store-delivery/hapi-store-immediate.json'

import wcsRegisteredFirstTimeCheckoutParcelShop from 'test/apiResponses/order-summary/registered/first-time-checkout/parcel-shop/wcs-parcel-shop.json'
import hapiRegisteredFirstTimeCheckoutParcelShop from 'test/apiResponses/order-summary/registered/first-time-checkout/parcel-shop/hapi-parcel-shop.json'

import wcsRegisteredNthTimeCheckoutParcelShop from 'test/apiResponses/order-summary/registered/nth-time-checkout/parcel-shop/wcs-parcel-shop.json'
import hapiRegisteredNthTimeCheckoutParcelShop from 'test/apiResponses/order-summary/registered/nth-time-checkout/parcel-shop/hapi-parcel-shop.json'

import wcsRegisteredCheckoutParcelShopNoSelected from 'test/apiResponses/order-summary/registered/first-time-checkout/parcel-shop/wcs-parcelshop-no-selection.json'
import hapiRegisteredCheckoutParcelShopNoSelected from 'test/apiResponses/order-summary/registered/first-time-checkout/parcel-shop/hapi-parcelshop-no-selection.json'

import wcsResponseWithOutOfStockProduct from 'test/apiResponses/order-summary/out-of-stock/wcs.json'
import wcsResponseWithOutOfStockProductAndBasketShape from 'test/apiResponses/order-summary/out-of-stock/wcs.1.json'

import wcsRegisteredNthTimeCheckoutFrance from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/tsfr/wcs-registered-fr.json'
import hapiRegisteredFirstTimeCheckoutFrance from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/tsfr/hapiMonty-registered-fr.json'

import wcsRegisteredNthTimeCheckoutGermany from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/tsde/wcs-registered-de.json'
import hapiRegisteredFirstTimeCheckoutGermany from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/tsde/hapiMonty-registered-de.json'

import wcsRegisteredNthTimeCheckoutUS from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/tsus/wcs-registered-us.json'
import hapiRegisteredNthTimeCheckoutUS from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/tsus/hapiMonty-registered-us.json'

import wcsRegisteredEspot from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/wcs-home-delivery-espot.json'
import hapiRegisteredEspot from 'test/apiResponses/order-summary/registered/nth-time-checkout/home-delivery/hapiMonty-home-delivery-espot.json'

import { getConfigByStoreCode } from '../../../../../../config/index'

describe('Functional: OrderSummary', () => {
  describe('#mapResponseBody', () => {
    describe('response with out of stock product', () => {
      describe('WCS response is order summary shaped', () => {
        it('should be mapped correctly', async () => {
          const orderSummary = new OrderSummary()
          const response = await orderSummary.mapResponseBody(
            wcsResponseWithOutOfStockProduct
          )
          expect(response).toEqual(
            basketTransform(
              wcsResponseWithOutOfStockProduct.orderSummary.MiniBagForm.Basket,
              '£'
            )
          )
        })
      })
      describe('WCS response is basket shaped', () => {
        it('should be mapped correctly', async () => {
          const orderSummary = new OrderSummary()
          const response = await orderSummary.mapResponseBody(
            wcsResponseWithOutOfStockProductAndBasketShape
          )
          expect(response).toEqual(
            basketTransform(
              wcsResponseWithOutOfStockProductAndBasketShape.Basket,
              '£'
            )
          )
        })
      })
    })
    describe('response from a registered user, first time checkout, ParcelShop', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(wcsRegisteredFirstTimeCheckoutParcelShop)
        ).toEqual(hapiRegisteredFirstTimeCheckoutParcelShop)
      })
    })
    describe('response from a registered user, Nth time checkout, ParcelShop', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(wcsRegisteredNthTimeCheckoutParcelShop)
        ).toEqual(hapiRegisteredNthTimeCheckoutParcelShop)
      })
    })
    describe('response from registered user, first time checkout, home delivery', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(
            wcsRegisteredFirstTimeCheckoutHomeDelivery
          )
        ).toEqual(hapiRegisteredFirstTimeCheckoutHomeDelivery)
      })
    })

    describe('response from a registered user, Nth time checkout, home delivery', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(wcsRegisteredNthTimeCheckoutHomeDelivery)
        ).toEqual(hapiRegisteredNthTimeCheckoutHomeDelivery)
      })
    })

    describe('response from a registered user, Nth time checkout, store delivery (standard)', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(
            wcsRegisteredNthTimeCheckoutStoreDeliveryStandard,
            false,
            '£'
          )
        ).toEqual(hapiRegisteredNthTimeCheckoutStoreDeliveryStandard)
      })
    })

    describe('response from registered user, Nth time checkout, store delivery (express)', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(
            wcsRegisteredNthTimeCheckoutStoreDeliveryExpress
          )
        ).toEqual(hapiRegisteredNthTimeCheckoutStoreDeliveryExpress)
      })
    })

    describe('response from a registered user, Nth time checkout, store delivery (immediate)', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(
            wcsRegisteredNthTimeCheckoutStoreDeliveryImmediate
          )
        ).toEqual(hapiRegisteredNthTimeCheckoutStoreDeliveryImmediate)
      })
    })

    describe('response from a registered user, first time checkout, store delivery (standard) ', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(
            wcsRegisteredFirstTimeCheckoutStoreStandard
          )
        ).toEqual(hapiRegisteredFirstTimeCheckoutStoreStandard)
      })
    })

    describe('response from a registered user, first time checkout, store delivery (express) ', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(
            wcsRegisteredFirstTimeCheckoutStoreExpress
          )
        ).toEqual(hapiRegisteredFirstTimeCheckoutStoreExpress)
      })
    })

    describe('response from a registered user, first time checkout, store delivery (immediate) ', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(
            wcsRegisteredFirstTimeCheckoutStoreImmediate
          )
        ).toEqual(hapiRegisteredFirstTimeCheckoutStoreImmediate)
      })
    })

    // @note : this is a edge case
    describe('response from a registered user with parcelshop and no store selected', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(
          orderSummary.mapResponseBody(
            wcsRegisteredCheckoutParcelShopNoSelected
          )
        ).toEqual(hapiRegisteredCheckoutParcelShopNoSelected)
      })
    })
  })

  describe('#mapResponseBody -- international store responses', () => {
    describe('response from a registered user on tsfr', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        orderSummary.storeConfig = getConfigByStoreCode('tsfr')
        expect(
          orderSummary.mapResponseBody(wcsRegisteredNthTimeCheckoutFrance)
        ).toEqual(hapiRegisteredFirstTimeCheckoutFrance)
      })
    })

    describe('response from a registered user on tsde', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        orderSummary.storeConfig = getConfigByStoreCode('tsde')
        expect(
          orderSummary.mapResponseBody(wcsRegisteredNthTimeCheckoutGermany)
        ).toEqual(hapiRegisteredFirstTimeCheckoutGermany)
      })
    })

    describe('response from a registered user on tsus', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        orderSummary.storeConfig = getConfigByStoreCode('tsus')
        expect(
          orderSummary.mapResponseBody(wcsRegisteredNthTimeCheckoutUS)
        ).toEqual(hapiRegisteredNthTimeCheckoutUS)
      })
    })

    describe('response with Espot data', () => {
      it('should be mapped correctly', () => {
        const orderSummary = new OrderSummary()
        expect(orderSummary.mapResponseBody(wcsRegisteredEspot)).toEqual(
          hapiRegisteredEspot
        )
      })
    })
  })
})
