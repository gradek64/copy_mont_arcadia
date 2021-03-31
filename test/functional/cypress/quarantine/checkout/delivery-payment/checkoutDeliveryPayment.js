import orderSummary from '../../../fixtures/checkout/order_summary---returningUserSingleSizeProd.json'
import checkoutProfile from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import checkoutProfileWithExpiredCard from '../../../fixtures/checkout/account--returningUserExpiredCard.json'
import { checkout } from '../../../fixtures'
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'
import {
  setFeature,
  isMobileLayout,
  isDesktopLayout,
} from '../../../lib/helpers'
import { formValidation, pageViewEvent, clickEvent } from '../../../lib/filters'

const deliveryPaymentPage = new DeliveryPaymentPage()
const deliveryPage = new DeliveryPage()

const delAddress = checkoutProfile.deliveryDetails.address.address1

if (isMobileLayout()) {
  describe('A returning user lands on the delivery payment page', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfile,
        postOrder422: checkout.order422Error,
      })
      cy.visit('checkout/delivery-payment')
      setFeature('FEATURE_CFS')
    })
    it('should pre-populate delivery information and contain page view event in the dataLayer', () => {
      deliveryPaymentPage
        .assertDeliveryDetails(delAddress)
        .assertDeliveryMethodSelectedIndex(0)
      deliveryPage.assertDeliveryNotification()
      cy.filterGtmEvents({
        filter: pageViewEvent,
      }).then((event) => {
        expect(event.pageCategory).to.equal('TS:Delivery Payment Form')
        expect(event.pageType).to.equal('TS:Delivery Payment')
      })
    })

    it('should display payment, promotions & gift card fields', () => {
      deliveryPaymentPage.assertTenderTypes()
    })
    //  flaky test needs to be reviewed
    it.skip('should contain "formValidation" & "errorMessage" events when confirm and pay button fails', () => {
      deliveryPaymentPage.payAsReturningUser().wait('@order-complete-422')

      cy.filterGtmEvents({
        filter: formValidation('cvv-tel'),
        timeout: 8000,
      }).then((event) => {
        expect(event.platform).to.equal('monty')
        expect(event.validationStatus).to.equal('success')
      })

      deliveryPaymentPage.assertPaymentErrorMessage()

      cy.filterGtmEvents({
        filter: (dlItem) => dlItem.event === 'errorMessage',
        timeout: 3000,
      }).then((event) => {
        expect(event.errorMessage).to.equal('Error paying order')
        expect(event.event).to.equal('errorMessage')
      })
    })
  })

  describe('A returning user with valid Account / Debit or Credit Card lands on the delivery payment page', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfile,
      })
      cy.visit('checkout/delivery-payment')
    })

    describe('The user clicks change', () => {
      it('expiryMonth and expiryYear should default to empty values', () => {
        deliveryPaymentPage.clickChangeCardDetails()
        deliveryPaymentPage.assertEmptyExpiryMonthAndYear()
      })
    })
  })

  describe('A returning user with expired Account / Debit or Credit Card lands on the delivery payment page', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfileWithExpiredCard,
      })
      cy.visit('checkout/delivery-payment')
    })

    it('should display the credit card expiry error message', () => {
      deliveryPaymentPage.assertExpiryCardErrorMessage()
    })

    it('should not display CVV field', () => {
      deliveryPaymentPage.assertCVVField()
    })

    it('order and pay button should be disabled', () => {
      deliveryPaymentPage.assertOrderAndPayButton('disabled')
    })

    describe('The user clicks change', () => {
      it('expiryMonth and expiryYear should default to empty values', () => {
        deliveryPaymentPage.clickChangeCardDetails()
        deliveryPaymentPage.assertEmptyExpiryMonthAndYear()
      })

      it('should able Order and pay button', () => {
        deliveryPaymentPage.clickChangeCardDetails()
        deliveryPaymentPage.assertOrderAndPayButton()
      })
    })
  })

  describe('A returning user can delete additional delivery address', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfile,
        deleteDeliveryAddress: '{}',
      })
      cy.visit('checkout/delivery-payment')
    })

    it('should remove additional delivery address', () => {
      deliveryPaymentPage
        .removeDeliveryAddress()
        .wait('@delete-delivery-address')
        .assertDeliveryAddressRemoved()
    })
  })

  describe('A returning user adds a new Address', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfile,
      })
      cy.visit('checkout/delivery-payment')
    })

    it('addressForm should contain `AddressForm--multiColumn` class', () => {
      deliveryPaymentPage.clickAddNewAddress()
      cy.get('.AddressForm--multiColumn').should('be.visible')
    })

    it('should stop user from submiting payment if no address selected', () => {
      deliveryPaymentPage.clickAddNewAddress()
      deliveryPaymentPage.payAsReturningUser()

      // expect to have field errors
      deliveryPaymentPage.validateFirstFormField()
    })
  })
}

//  gtm event needs to be reviewed ADP-3203
if (isDesktopLayout()) {
  describe('A returning user leaves checkout/delivery-payment', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfile,
      })
      cy.visit('checkout/delivery-payment')
    })
    it('continue shopping should create new GA event and reset CVV field to empty', () => {
      deliveryPaymentPage.clickChangeCardDetails()
      cy.get(deliveryPaymentPage.cvvInput).type('788')
      deliveryPaymentPage.clickContinueShopping()

      // continue shopping should create new GA event
      // if (isDesktopLayout()) {
      cy.filterGtmEvents({
        filter: clickEvent,
        timeout: 8000,
      }).then((event) => {
        expect(event.ec).to.equal('checkout')
        expect(event.ea).to.equal('continue shopping')
        expect(event.el).to.equal('delivery-payment')
      })
      // }

      // return to checkout-delivery shortcut
      cy.visit('checkout/delivery-payment')
      cy.window().then((window) => {
        const reduxStoreFormCVVField = window.__qubitStore.getState().forms
          .checkout.billingCardDetails.fields.cvv
        expect(reduxStoreFormCVVField.value).to.be.equal('')
      })
    })
  })
}
