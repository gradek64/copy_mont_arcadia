import wcsSelectHomeExpressRegistered from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-express/registered/wcs.json'
import hapiSelectHomeExpressRegistered from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-express/registered/hapiMonty.json'

import wcsSelectHomeExpressGuest from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-express/guest/wcs.json'
import hapiSelectHomeExpressGuest from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-express/guest/hapiMonty.json'

import wcsSelectHomStandardRegistered from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-standard/registered/wcs.json'
import hapiSelectHomeStandardRegistered from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-standard/registered/hapiMonty.json'

import wcsSelectHomStandardGuest from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-standard/guest/wcs.json'
import hapiSelectHomeStandardGuest from 'test/apiResponses/order-summary/update-order/change-home-delivery/select-home-standard/guest/hapiMonty.json'

import HomeDeliverySelector from '../../HomeDeliverySelector'

describe('Functional: HomeDeliverySelector', () => {
  describe('mapResponseBody', () => {
    describe('response from a registered user selecting HOME_EXPRESS delivery', () => {
      it('is mapped correctly', () => {
        const UpdateOrderSummary = new HomeDeliverySelector('', {}, {}, '', {
          cookie: 'authenticated=yes;',
        })
        expect(
          UpdateOrderSummary.mapResponseBody(wcsSelectHomeExpressRegistered)
        ).toEqual(hapiSelectHomeExpressRegistered)
      })
    })

    describe('response from a guest user selecting HOME_EXPRESS delivery', () => {
      it('is mapped correctly', () => {
        const UpdateOrderSummary = new HomeDeliverySelector('', {}, {}, '', {
          cookie: 'authenticated=;',
        })
        expect(
          UpdateOrderSummary.mapResponseBody(wcsSelectHomeExpressGuest)
        ).toEqual(hapiSelectHomeExpressGuest)
      })
    })

    describe('response from a registered user selecting HOME_STANDARD delivery', () => {
      it('is mapped correctly', () => {
        const UpdateOrderSummary = new HomeDeliverySelector('', {}, {}, '', {
          cookie: 'authenticated=yes;',
        })
        expect(
          UpdateOrderSummary.mapResponseBody(wcsSelectHomStandardRegistered)
        ).toEqual(hapiSelectHomeStandardRegistered)
      })
    })

    describe('response from a guest user selecting HOME_STANDARD delivery', () => {
      it('is mapped correctly', () => {
        const UpdateOrderSummary = new HomeDeliverySelector('', {}, {}, '', {
          cookie: 'authenticated=;',
        })
        expect(
          UpdateOrderSummary.mapResponseBody(wcsSelectHomStandardGuest)
        ).toEqual(hapiSelectHomeStandardGuest)
      })
    })
  })
})
