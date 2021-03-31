import checkoutProfileNewUser from '../../../fixtures/checkout/account--newUserEmpty.json'
import orderSummaryNewUser from '../../../fixtures/checkout/testOrderSummary.json'
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'
import { clickEvent, formValidation } from '../../../lib/filters'
import { setFeature, isMobileLayout } from '../../../lib/helpers'

const deliveryPaymentPage = new DeliveryPaymentPage()
const deliveryPage = new DeliveryPage()

if (isMobileLayout()) {
  describe('A new user lands on the delivery page', () => {
    beforeEach(() => {
      deliveryPage.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        getOrderSummary: orderSummaryNewUser,
        getAccount: checkoutProfileNewUser,
      })
      cy.visit('checkout/delivery')
      setFeature('FEATURE_CFS')
    })

    it('should display all the user input fields', () => {
      deliveryPage
        .assertDeliveryOptions('be.visible')
        .assertYourDetails()
        .assertDeliveryAddress()
        .assertDeliveryNotification()
    })

    it('should trigger errors and formValidation "failure" event for empty input mandatory fields', () => {
      deliveryPage.assertMandotoryInputs()
      const inputMandatoryFields = [
        'firstName-text',
        'lastName-text',
        'telephone-tel',
        'address1-text',
        'postcode-text',
        'city-text',
      ]
      inputMandatoryFields.forEach((fieldId) => {
        cy.filterGtmEvents({
          filter: formValidation(fieldId),
        }).then((event) => {
          expect(event.event).to.equal('formValidation')
          expect(event.validationStatus).to.equal('failure')
        })
      })
    })

    it('should trigger error if first name is over 60 characters', () => {
      const validationMessage = 'Maximum characters is 60'
      const firstName60Chars =
        'Hello my name is micky tan and i think we should not type in long surnames into the database'
      deliveryPage
        .typeDeliveryFirstName(firstName60Chars)
        .clickOutSide()
        .assertFirstNameFailedValidation(validationMessage)
    })

    it('should trigger error if surname is over 60 characters', () => {
      const validationMessage = 'Maximum characters is 60'
      const lastName60Chars =
        'Hello my name is micky tan and i think we should not type in long surnames into the database'
      deliveryPage
        .typeDeliveryLastName(lastName60Chars)
        .clickOutSide()
        .assertLastNameFailedValidation(validationMessage)
    })

    it('should trigger an error if fields contain special characters', () => {
      const validationMessage = 'Please remove special characters'
      deliveryPage
        .enterDeliveryDetailsSpecialChar()
        .clickOutSide()
        .assertSpecialCharacterValidation('be.visible', validationMessage)
    })

    it('should create formValidation "success" event and be able to proceed to payment page', () => {
      deliveryPage.enterDeliveryDetailsManually()
      cy.filterGtmEvents({
        filter: formValidation('firstName-text'),
      }).then((event) => {
        expect(event.event).to.equal('formValidation')
        expect(event.validationStatus).to.equal('success')
      })
      cy.get(deliveryPaymentPage.orderAndPayButton).should('be.visible')
    })

    //  gtm event needs to be reviewed ADP-3203
    describe.skip('Event for continue shopping button', () => {
      it('should create a "continue shopping" clickEvent', () => {
        cy.get(deliveryPage.continueShoppingButton).click()

        cy.filterGtmEvents({
          filter: clickEvent,
          timeout: 15000,
        }).then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ec).to.equal('checkout')
          expect(event.ea).to.equal('continue shopping')
          expect(event.el).to.equal('delivery')
        })
      })
    })
  })
}
