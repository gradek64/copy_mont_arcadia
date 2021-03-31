import { setFeature, isMobileLayout } from '../../../lib/helpers'
import orderSummaryNewUserDdpProd from '../../../fixtures/checkout/order_summary---returningUserDdpProd.json'
import checkoutProfileNewUserEmpty from '../../../fixtures/checkout/account--newUserEmpty.json'
import orderSummaryNewUserSingleSizeAndDdp from '../../../fixtures/checkout/order_summary---newUserSingleSizeProdAndDdp.json'
import MiniBag from '../../../page-objects/MiniBag.page'
import ShoppingBag from '../../../page-objects/ShoppingBagInCheckout.page'
import DdpPage from '../../../page-objects/ddp.page'
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'

const deliveryPaymentPage = new DeliveryPaymentPage()
const deliveryPage = new DeliveryPage()
const ddpPage = new DdpPage()
const miniBag = new MiniBag()
const shoppingBag = new ShoppingBag()

if (isMobileLayout()) {
  describe('DDP Product in Checkout Delivery Page', () => {
    describe('a new user buys DDP as a standalone item', () => {
      beforeEach(() => {
        deliveryPage.mocksForCheckout({
          setAuthStateCookie: 'yes',
          bagCountCookie: '1',
          getOrderSummary: orderSummaryNewUserDdpProd,
          getAccount: checkoutProfileNewUserEmpty,
        })
        cy.visit('checkout/delivery')
        setFeature('FEATURE_DDP')
        setFeature('FEATURE_DISPLAY_DDP_PROMOTION')
      })

      it('should not display standard UI for shipped products', () => {
        miniBag.assertDDPinBag()
        ddpPage.assertDDPInlineNotification().assertWhyWeNeedThisLink()
        deliveryPage
          .assertDeliveryOptions('be.not.visible')
          .assertDeliveryNotification('be.not.visible')
          .assertDeliveryAddress()
          .assertYourDetails()
          .assertProceedButton()
      })

      it('should be able to proceed to the payment page', () => {
        deliveryPage.enterDeliveryDetailsManually()
        cy.get(deliveryPaymentPage.orderAndPayButton).should('be.visible')
      })
    })

    describe('a new user buys DDP with mixed items in the bag', () => {
      beforeEach(() => {
        deliveryPage.mocksForCheckout({
          setAuthStateCookie: 'yes',
          bagCountCookie: '1',
          getOrderSummary: orderSummaryNewUserSingleSizeAndDdp,
          getAccount: checkoutProfileNewUserEmpty,
        })
        cy.visit('checkout/delivery')

        setFeature('FEATURE_PUDO')
        setFeature('FEATURE_DDP')
        setFeature('FEATURE_DISPLAY_DDP_PROMOTION')
        setFeature('FEATURE_CFS')
      })

      it('should display standard UI for mixed products with DDP', () => {
        cy.get(shoppingBag.ProductsInShoppingBag)
          .eq(0)
          .within(() => {
            miniBag.assertDDPinBag()
          })
        ddpPage
          .assertDDPInlineNotification()
          .assertWhyWeNeedThisLink('not.be.visible')
        deliveryPage
          .assertDeliveryOptions()
          .assertDeliveryNotification()
          .assertDeliveryAddress()
          .assertYourDetails()
          .assertProceedButton()
      })

      it('should be able to proceed to the payment page', () => {
        deliveryPage.enterDeliveryDetailsManually()
        cy.get(deliveryPaymentPage.orderAndPayButton).should('be.visible')
      })
    })
  })
}
