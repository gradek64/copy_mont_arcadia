//
// Registered
//

// Short Profile - Standard
import wcsSelectStoreStandardRegistered from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/registered/wcs.json'
import hapiSelectStoreStandardRegistered from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/registered/hapiMonty.json'

// Short Profile - Express
import wcsSelectStoreExpressRegistered from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-express/wcs-registered.json'
import hapiSelectStoreExpressRegistered from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-express/hapiMonty-registered.json'

// Short Profile - Immediate
import wcsSelectStoreImmediateRegistered from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-immediate/wcs-registered.json'
import hapiSelectStoreImmediateRegistered from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-immediate/hapiMonty-registered.json'

// Full Profile - Home Standard delivery in first checkout -> Store Standard in seconds
import wcsHomeStandardToStoreStandard from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/registered/fullProfile/wcs_home-to-store.json'
import hapiHomeStandardToStoreStandard from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/registered/fullProfile/hapiMonty_home-to-store.json'

//
// Guest
//

// Standard
import wcsSelectStoreStandardGuest from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/guest/wcs.json'
import hapiSelectStoreStandardGuest from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-standard/guest/hapiMonty.json'

// Express
import wcsSelectStoreExpressGuest from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-express/wcs-guest.json'
import hapiSelectStoreExpressGuest from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-express/hapiMonty-guest.json'

// Immediate
import wcsSelectStoreImmediateGuest from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-immediate/wcs-guest.json'
import hapiSelectStoreImmediateGuest from 'test/apiResponses/order-summary/update-order/change-store-delivery/select-store-immediate/hapiMonty-guest.json'

import StoreDeliverySelector from '../../StoreDeliverySelector'

describe('Functional: UpdateOrderSummary', () => {
  describe('mapResponseBody', () => {
    describe('Guest User', () => {
      describe('select STORE_STANDARD delivery', () => {
        it('should be mapped correctly', () => {
          const UpdateOrderSummary = new StoreDeliverySelector('', {}, {}, '', {
            cookie: 'authenticated=;',
          })
          expect(
            UpdateOrderSummary.mapResponseBody(wcsSelectStoreStandardGuest)
          ).toEqual(hapiSelectStoreStandardGuest)
        })
      })

      describe('select STORE_EXPRESS delivery', () => {
        it('should be mapped correctly', () => {
          const UpdateOrderSummary = new StoreDeliverySelector('', {}, {}, '', {
            cookie: 'authenticated=;',
          })
          expect(
            UpdateOrderSummary.mapResponseBody(wcsSelectStoreExpressGuest)
          ).toEqual(hapiSelectStoreExpressGuest)
        })
      })

      describe('select STORE_IMMEDATE delivery ', () => {
        it('should be mapped correctly', () => {
          const UpdateOrderSummary = new StoreDeliverySelector('', {}, {}, '', {
            cookie: 'authenticated=;',
          })
          expect(
            UpdateOrderSummary.mapResponseBody(wcsSelectStoreImmediateGuest)
          ).toEqual(hapiSelectStoreImmediateGuest)
        })
      })
    })
    describe('Registered User', () => {
      describe('Full Profile', () => {
        // User already completed a checkout journey by using a different delivery option and during the current
        // checkout journey (redirected to the Confirmation page autocompleted with the previou delivery data) is selecting a different one.
        describe('Home Standard -> Store Standard', () => {
          it('should be mapped correctly', () => {
            const UpdateOrderSummary = new StoreDeliverySelector(
              '',
              {},
              {},
              '',
              { cookie: 'authenticated=yes;' }
            )
            expect(
              UpdateOrderSummary.mapResponseBody(wcsHomeStandardToStoreStandard)
            ).toEqual(hapiHomeStandardToStoreStandard)
          })
        })
      })
      describe('Short Profile', () => {
        // First checkout attempt
        describe('select STORE_STANDARD delivery', () => {
          it('should be mapped correctly', () => {
            const UpdateOrderSummary = new StoreDeliverySelector(
              '',
              {},
              {},
              '',
              { cookie: 'authenticated=yes;' }
            )
            expect(
              UpdateOrderSummary.mapResponseBody(
                wcsSelectStoreStandardRegistered
              )
            ).toEqual(hapiSelectStoreStandardRegistered)
          })
        })

        describe('Select STORE_EXPRESS delivery', () => {
          it('should be mapped correctly', () => {
            const UpdateOrderSummary = new StoreDeliverySelector(
              '',
              {},
              {},
              '',
              { cookie: 'authenticated=yes;' }
            )
            expect(
              UpdateOrderSummary.mapResponseBody(
                wcsSelectStoreExpressRegistered
              )
            ).toEqual(hapiSelectStoreExpressRegistered)
          })
        })

        describe('Select STORE_IMMEDATE delivery ', () => {
          it('should be mapped correctly', () => {
            const UpdateOrderSummary = new StoreDeliverySelector(
              '',
              {},
              {},
              '',
              { cookie: 'authenticated=yes;' }
            )
            expect(
              UpdateOrderSummary.mapResponseBody(
                wcsSelectStoreImmediateRegistered
              )
            ).toEqual(hapiSelectStoreImmediateRegistered)
          })
        })
      })
    })
  })
})
