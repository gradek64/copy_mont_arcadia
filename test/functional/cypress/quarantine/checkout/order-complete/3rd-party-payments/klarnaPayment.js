import order_summary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProd.json'
import order from '../../../../fixtures/checkout/order--returningUserSingleSizeProdAndDdpProd-visa.json'
import checkout_profile from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import checkoutProfileNewUser from '../../../../fixtures/checkout/account--newUserEmpty.json'
import DeliveryPaymentPage from '../../../../page-objects/checkout/DeliveryPayment.page'
import ThankyouPage from '../../../../page-objects/checkout/ThankYou.page'
import klarnaSession from '../../../../fixtures/checkout/klarna--sessionID.json'
import DeliveryPage from '../../../../page-objects/checkout/Delivery.page'

const deliveryPayment = new DeliveryPaymentPage()
const thankyouPage = new ThankyouPage()
const deliveryPage = new DeliveryPage()

/* below skipped due to ADP-1532
 The tests will need to be removed once the new e2e are up and running OE-2648
*/
describe.skip('Klarna payment', () => {
  describe('New user', () => {
    // additional new users scenarios in ADP-1481
    it('should trigger the klarna form for both pay later and pay later in 3 instalments', () => {
      deliveryPage.mocksForCheckout({
        setAuthStateCookie: 'yes',
        getOrderSummary: order_summary,
        getAccount: checkoutProfileNewUser,
        postKlarnaSession: klarnaSession,
      })
      cy.visit('checkout/delivery')
      deliveryPage.enterDeliveryDetailsManually()
      deliveryPayment.payWithKlarnaNewUser()
      cy.wait(3000)
      cy.get(deliveryPayment.klarnaForm).should('be.visible')
    })

    describe('Klarna succesful order', () => {
      beforeEach(() => {
        deliveryPage.mocksForCheckout({
          setAuthStateCookie: 'yes',
          getOrderSummary: order_summary,
          getAccount: checkoutProfileNewUser,
          postOrder: order,
          postKlarnaSession: klarnaSession,
          putKlarnaSession: '{}',
        })
        cy.visit('checkout/delivery')
        deliveryPage.enterDeliveryDetailsManually()
      })

      it('should allow the new user to pay with Klarna', () => {
        deliveryPayment.payWithKlarnaNewUser()
        cy.wait(3000)
        deliveryPayment.pay()
        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })

      it('change payment method and reselect klarna loads the klarna form without errors', () => {
        deliveryPayment.payWithKlarnaNewUser()
        cy.wait(3000)
        cy.get(deliveryPayment.klarnaForm).should('be.visible')
        deliveryPayment.changePaymentMethodFromKlarna()
        deliveryPayment.payWithKlarnaNewUser()
        cy.wait(3000)
        cy.get(deliveryPayment.klarnaForm).should('be.visible')
      })
    })
  })
  describe('Returning user', () => {
    // additional new users scenarios in ADP-1482
    describe('should trigger the klarna form for both pay later and pay later in 3 instalments', () => {
      it('should trigger the klarna form for both pay later and pay later in 3 instalments', () => {
        deliveryPage.mocksForCheckout({
          bagCountCookie: '1',
          setAuthStateCookie: 'yes',
          getOrderSummary: order_summary,
          getAccount: checkout_profile,
          postKlarnaSession: klarnaSession,
        })
        cy.visit('checkout/delivery-payment')
        deliveryPayment.changePaymentMethod()
        deliveryPayment.payWithKlarna()
        cy.wait(3000)
        cy.get(deliveryPayment.klarnaForm).should('be.visible')
      })
    })

    describe('Klarna successful order', () => {
      beforeEach(() => {
        deliveryPage.mocksForCheckout({
          bagCountCookie: '1',
          setAuthStateCookie: 'yes',
          getOrderSummary: order_summary,
          getAccount: checkout_profile,
          postKlarnaSession: klarnaSession,
          postOrder: order,
        })
        cy.visit('checkout/delivery-payment')
      })
      it('should allow the returning user to pay with Klarna', () => {
        deliveryPayment.changePaymentMethod()
        deliveryPayment.payWithKlarna()
        cy.wait(3000)
        deliveryPayment.pay()
        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })
      it('change payment method and reselect klarna loads the klarna form without errors', () => {
        deliveryPayment.changePaymentMethod()
        deliveryPayment.payWithKlarna()
        cy.wait(3000)
        cy.get(deliveryPayment.klarnaForm).should('be.visible')
        deliveryPayment.changePaymentMethodFromKlarna()
        deliveryPayment.payWithKlarna()
        cy.wait(3000)
        cy.get(deliveryPayment.klarnaForm).should('be.visible')
      })
      it('refreshing the page should allow to complete a klarna payment', () => {
        deliveryPayment.changePaymentMethod()
        deliveryPayment.payWithKlarna()
        cy.wait(3000)
        cy.get(deliveryPayment.klarnaForm).should('be.visible')
        cy.reload()
        deliveryPayment.changePaymentMethod()
        deliveryPayment.payWithKlarna()
        cy.wait(3000)
        cy.get(deliveryPayment.klarnaForm).should('be.visible')
        deliveryPayment.pay()
        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })
    })
  })
})
