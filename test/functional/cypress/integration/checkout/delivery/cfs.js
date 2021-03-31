import { isMobileLayout, setFeature } from '../../../lib/helpers'
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import StoreLocator from '../../../page-objects/StoreLocator.page'
import activeUser from '../../../fixtures/ddp/ddp--activeUserGt30.json'
import orderSummaryDeliveryOption from '../../../fixtures/checkout/order_summary---deliveryOption.json'
import { getFakeGPSLocation } from '../../../mock-helpers/storeLocatorMockSetup'

describe('Collect From Store (CFS)', () => {
  if (isMobileLayout()) {
    const deliveryPage = new DeliveryPage()
    const storeLocator = new StoreLocator()
    describe('mobile device', () => {
      beforeEach(() => {
        storeLocator.mocksForStoreLocator('fixture:general/storeLocator')
        deliveryPage.mocksForCheckout({
          setAuthStateCookie: 'yes',
          bagCountCookie: '1',
          getOrderSummary: orderSummaryDeliveryOption,
          getAccount: activeUser,
        })
      })

      it('something', () => {
        cy.visit(
          'checkout/delivery',
          getFakeGPSLocation({ latitude: 25, longitude: 45 })
        )
        setFeature('FEATURE_CFS')

        deliveryPage
          .collectFromStore(storeLocator)
          .useCurrentLocation(storeLocator)
          .searchForLocations(storeLocator)
          .assertStoreMapVisibility('to.exist')
        cy.get(deliveryPage.googleMaps)
          .find('> img')
          .and((img) => {
            expect(img[0].naturalHeight).to.be.closeTo(359, 50)
            expect(img[0].naturalWidth).to.be.closeTo(414, 50)
          })
      })
    })
  }
})
