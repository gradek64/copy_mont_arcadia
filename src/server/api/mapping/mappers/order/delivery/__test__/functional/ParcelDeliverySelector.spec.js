//
// Registered
//

// Short Profile
import wcsSelectParcelshopRegisteredShortProfile from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/shortProfile/wcs.json'
import hapiSelectParcelShopRegisteredShortProfile from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/shortProfile/hapiMonty.json'

// Full Profile - home in first checkout completed -> Parcel in second checkout
import wcsSelectParcelshopRegisteredFullProfileHomeToParcel from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/wcs_home-to-parcel.json'
import hapiSelectParcelShopRegisteredFullProfileHometoParcel from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/hapiMonty_home-to-parcel.json'

// Full Profile - Parcel1 in first checkout completed -> Parcel2 in second checkout

import wcsSelectParcelshopRegisteredFullProfileParcel1ToParcel2 from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/wcs_parcel1-to-parcel2.json'
import hapiSelectParcelShopRegisteredFullProfileParcel1ToParcel2s from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/hapiMonty_parcel1-to-parcel2.json'

// Full Profile - Store in first checkout completed -> Parcelshop during second checkout

import wcsSelectParcelshopRegisteredFullProfileStoreToParcel from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/wcs_store-to-parcel.json'
import hapiSelectParcelShopRegisteredFullProfileStoreToParcel from 'test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/hapiMonty_store-to-parcel.json'

//
// Guest
//

import wcsSelectParcelshopGuestUser from 'test/apiResponses/order-summary/update-order/select-parcelshop/guest/wcs.json'
import hapiSelectParcelShopGuestUser from 'test/apiResponses/order-summary/update-order/select-parcelshop/guest/hapi.json'

import ParcelDeliverySelector from '../../ParcelDeliverySelector'

describe('Functional: ParcelDeliverySelector', () => {
  describe('mapResponseBody', () => {
    describe('Registered User', () => {
      describe('Short Profile', () => {
        describe('response from a registered user selecting PARCELSHOP_COLLECTION delivery', () => {
          it('is mapped correctly', () => {
            const parcelDeliverySelector = new ParcelDeliverySelector(
              '',
              {},
              {},
              '',
              { cookie: 'authenticated=yes;' }
            )
            expect(
              parcelDeliverySelector.mapResponseBody(
                wcsSelectParcelshopRegisteredShortProfile
              )
            ).toEqual(hapiSelectParcelShopRegisteredShortProfile)
          })
        })
      })
      describe('Full Profile', () => {
        describe('response from a registered user selecting PARCELSHOP_COLLECTION delivery after completing a checkout with home delivery', () => {
          it('is mapped correctly', () => {
            const parcelDeliverySelector = new ParcelDeliverySelector(
              '',
              {},
              {},
              '',
              { cookie: 'authenticated=yes;' }
            )
            expect(
              parcelDeliverySelector.mapResponseBody(
                wcsSelectParcelshopRegisteredFullProfileHomeToParcel
              )
            ).toEqual(hapiSelectParcelShopRegisteredFullProfileHometoParcel)
          })
        })
        describe('response from a registered user selecting a different Parcelshop than the one used as delivery option during the first checkout', () => {
          it('is mapped correctly', () => {
            const parcelDeliverySelector = new ParcelDeliverySelector(
              '',
              {},
              {},
              '',
              { cookie: 'authenticated=yes;' }
            )
            expect(
              parcelDeliverySelector.mapResponseBody(
                wcsSelectParcelshopRegisteredFullProfileParcel1ToParcel2
              )
            ).toEqual(
              hapiSelectParcelShopRegisteredFullProfileParcel1ToParcel2s
            )
          })
        })
        describe('response from a registered user selecting a Parcelshop store after completing a checkout with store delivery', () => {
          it('is mapped correctly', () => {
            const parcelDeliverySelector = new ParcelDeliverySelector(
              '',
              {},
              {},
              '',
              { cookie: 'authenticated=yes;' }
            )
            expect(
              parcelDeliverySelector.mapResponseBody(
                wcsSelectParcelshopRegisteredFullProfileStoreToParcel
              )
            ).toEqual(hapiSelectParcelShopRegisteredFullProfileStoreToParcel)
          })
        })
      })
    })

    describe('Guest User', () => {
      describe('response for a guest user selecting a Parcelshop store', () => {
        it('is mapped correctly', () => {
          const parcelDeliverySelector = new ParcelDeliverySelector(
            '',
            {},
            {},
            '',
            { cookie: 'authenticated=;' }
          )
          expect(
            parcelDeliverySelector.mapResponseBody(wcsSelectParcelshopGuestUser)
          ).toEqual(hapiSelectParcelShopGuestUser)
        })
      })
    })
  })
})
