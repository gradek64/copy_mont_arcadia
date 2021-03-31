import { setFeature, isMobileLayout } from '../../../lib/helpers'
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'

// order summaries
import orderSummaryDeliveryOptionNoDDP from '../../../fixtures/checkout/order_summary---deliveryOptionNoDDP.json'
import orderSummaryDeliveryOption from '../../../fixtures/checkout/order_summary---deliveryOption.json'

// Users
import activeUser from '../../../fixtures/ddp/ddp--activeUserGt30.json'
import activeRenew30lt5 from '../../../fixtures/ddp/ddp--activeRenew30lt5.json'
import activeRenew30gt5 from '../../../fixtures/ddp/ddp--activeRenew30gt5.json'
import expiredlt30lt5 from '../../../fixtures/ddp/ddp--expiredlt30lt5.json'
import expiredlt30gt5 from '../../../fixtures/ddp/ddp--expiredlt30gt5.json'

const deliveryPage = new DeliveryPage()

if (isMobileLayout()) {
  describe('New user adding DDP and switch delivery option', () => {
    const setUp = (user, orderSummary) => {
      const date = new Date(2020, 4, 15, 8).getTime()
      cy.clock(date)
      cy.clearCookies()
      deliveryPage.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        getOrderSummary: orderSummary,
        getAccount: user,
      })

      cy.visit('checkout/delivery')
      setFeature('FEATURE_DDP')
      setFeature('FEATURE_PUDO')
      setFeature('FEATURE_DISPLAY_DDP_PROMOTION')
      setFeature('FEATURE_CFS')
      setFeature('FEATURE_IS_DDP_RENEWABLE')
    }

    describe('active dpp user not in window', () => {
      it('should not display renewal component', () => {
        setUp(activeUser, orderSummaryDeliveryOptionNoDDP)
        deliveryPage.assertNoRenewalComponent()
      })
    })

    describe('active ddp user with renewal and less than £5 savings', () => {
      it('should display appropriate component with extend messaging and express pricing', () => {
        setUp(activeRenew30lt5, orderSummaryDeliveryOptionNoDDP)
        deliveryPage.assertDDPRenewalComponent(false, false)
      })
    })

    describe('active ddp user with renewal and more than £5 savings', () => {
      it('should display appropriate component with extend messaging and ddp saving', () => {
        setUp(activeRenew30gt5, orderSummaryDeliveryOptionNoDDP)
        deliveryPage.assertDDPRenewalComponent(false, true)
      })
    })

    describe('expired ddp user with renewal and less than £5 savings', () => {
      it('should display appropriate component with renew messaging and express pricing', () => {
        setUp(expiredlt30lt5, orderSummaryDeliveryOptionNoDDP)
        deliveryPage.assertDDPRenewalComponent(true, false)
      })
    })

    describe('expired ddp user with renewal and more than £5 savings', () => {
      it('should display appropriate component with renew messaging and ddp saving', () => {
        setUp(expiredlt30gt5, orderSummaryDeliveryOptionNoDDP)
        deliveryPage.assertDDPRenewalComponent(true, true)
      })
    })

    describe('Has added renewal to bag', () => {
      it('should display ddp added to bag component', () => {
        setUp(activeRenew30gt5, orderSummaryDeliveryOption)
        deliveryPage.assertDDPAddedComponent()
      })
    })
  })
}
