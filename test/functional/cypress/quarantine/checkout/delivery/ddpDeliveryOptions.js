import { setFeature, isMobileLayout } from '../../../lib/helpers'
import orderSummaryDeliveryOption from '../../../fixtures/checkout/order_summary---deliveryOption.json'
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import checkoutProfileNewUserEmpty from '../../../fixtures/checkout/account--newUserEmpty.json'
import StoreLocatorPage from '../../../page-objects/StoreLocator.page'
import deliveryOptionStoreLocator from '../../../fixtures/general/storeLocator.json'
import deliveryOptionParcelLocator from '../../../fixtures/general/storeLocator--parcelShopList.json'

const deliveryPage = new DeliveryPage()
const storeLocatorPage = new StoreLocatorPage()

if (isMobileLayout()) {
  describe('New user adding DDP and switch delivery option', () => {
    beforeEach(() => {
      cy.clearCookies()
      deliveryPage.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        getOrderSummary: orderSummaryDeliveryOption,
        getAccount: checkoutProfileNewUserEmpty,
      })

      cy.visit('checkout/delivery')
      setFeature('FEATURE_DDP')
      setFeature('FEATURE_PUDO')
      setFeature('FEATURE_DISPLAY_DDP_PROMOTION')
      setFeature('FEATURE_CFS')
    })

    it('DDP added to bag should display CFS delivery option as Free delivery', () => {
      storeLocatorPage.mocksForStoreLocator(deliveryOptionStoreLocator)
      deliveryPage.selectDeliveryOption('store')
      storeLocatorPage.selectAndAssertDeliverySelection('London', 'Topshop')
    })

    it('DDP added to bag should display CFP delivery option as Free delivery', () => {
      storeLocatorPage.mocksForStoreLocator(deliveryOptionParcelLocator)
      deliveryPage.selectDeliveryOption('parcelshop')
      storeLocatorPage.selectAndAssertDeliverySelection('London', 'Hermes')
    })
  })
}
