import { setFeature, isMobileLayout } from '../../../lib/helpers'
import orderSummaryWithDdpInBag from '../../../fixtures/ddp/ddp--checkoutDdpStandalone.json'
import orderSummaryNoDdpInBag from '../../../fixtures/checkout/order_summary---returningUserSingleSizeProd.json'
import checkoutProfile from '../../../fixtures/ddp/ddp--returningUser.json'
import second from '../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'
import DdpPage from '../../../page-objects/ddp.page'

const deliveryPaymentPage = new DeliveryPaymentPage()
const ddpPage = new DdpPage()

if (isMobileLayout()) {
  describe('DDP Product in Checkout Delivery-Payment Page', () => {
    describe('a returning user buys DDP as a standalone item', () => {
      const delAddress = checkoutProfile.deliveryDetails.address.address1
      beforeEach(() => {
        deliveryPaymentPage.mocksForCheckout({
          bagCountCookie: '1',
          setAuthStateCookie: 'yes',
          getOrderSummary: orderSummaryWithDdpInBag,
          getAccount: checkoutProfile,
        })
        cy.visit('checkout/delivery-payment')
        setFeature('FEATURE_DDP')
      })

      it('should display standard UI for DDP product', () => {
        ddpPage.assertDDPInlineNotification()
        deliveryPaymentPage
          .assertDeliveryDetails(delAddress)
          .assertTenderTypes()
      })
    })
  })
  describe('A DDP user tries to rebuy DDP', () => {
    it('should not display the buy DDP options', () => {
      const userHasAlreadyBoughtDDP = {
        ...checkoutProfile,
        isDDPUser: true,
        isDDPRenewable: false,
      }
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummaryNoDdpInBag,
        getAccount: userHasAlreadyBoughtDDP,
      })

      cy.visit('checkout/delivery-payment')
      setFeature('FEATURE_DDP')
      ddpPage.assertDDPoptions('not.be.visible')
      ddpPage.assertDDPInlineNotification('not.be.visible', 'not.have.text')
    })
  })

  describe('should display standard UI for mixed products with DDP', () => {
    const delAddress = second.deliveryDetails.address.address1
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: second,
        getAccount: checkoutProfile,
      })

      cy.visit('checkout/delivery-payment')
      setFeature('FEATURE_PUDO')
      setFeature('FEATURE_DDP')
    })
    it('should display standard UI for mixed products with DDP', () => {
      ddpPage.assertDDPInlineNotification()
      deliveryPaymentPage.assertDeliveryDetails(delAddress).assertTenderTypes()
    })
  })
}
