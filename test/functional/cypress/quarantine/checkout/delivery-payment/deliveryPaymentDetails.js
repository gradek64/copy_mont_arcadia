import orderSummary from '../../../fixtures/checkout/order_summary---returningUserSingleSizeProd.json'
import checkoutProfile from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'
import bagTransfer from '../../../fixtures/checkout/shopping_bag---transfer.json'
import orderSummaryTransfer from '../../../fixtures/checkout/order_summary---bagTransferUS.json'
import getLastGtmEventOfType from '../../../lib/getLastGtmEventOfType'
import { isMobileLayout } from '../../../lib/helpers'

const deliveryPaymentPage = new DeliveryPaymentPage()
const deliveryPage = new DeliveryPage()

if (isMobileLayout()) {
  describe('Delivery country redirections', () => {
    beforeEach(() => {
      deliveryPage.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        getAccount: checkoutProfile,
        getOrderSummary: orderSummary,
        putOrderSummary: orderSummary,
      })
      deliveryPage.mocksForShoppingBag({
        postBagTransfer: bagTransfer,
        getItems: orderSummaryTransfer,
      })
      cy.visit('checkout/delivery-payment')
    })

    it('should not redirect when user selects a valid delivery country from the current site', () => {
      deliveryPaymentPage.clickAddNewAddress()
      deliveryPage.selectDeliveryCountry('United Kingdom')
      cy.get(deliveryPage.shippingRedirectModal).should('not.be.visible')
    })

    it('should only offer the user one redirection option if the country they have selected is a single language country', () => {
      deliveryPaymentPage.clickAddNewAddress()
      deliveryPage
        .selectDeliveryCountry('United States')
        .assertLanquageOptions(1)
        .clickRedirectModalContinueButton()
      // TODO the following assertion is not possible as we have no non-UK site built in Jenkins
      // See https://arcadiagroup.atlassian.net/browse/OE-2039
      // cy.location('hostname').should('contain', 'm.us.topshop.com')
    })

    it('should offer the user three redirection options if the country they have selected is a multi language country', () => {
      deliveryPaymentPage.clickAddNewAddress()
      deliveryPage
        .selectDeliveryCountry('France')
        .assertLanquageSelectOptions(3)

      cy.get(deliveryPage.languageOptionSelect).select('German')

      getLastGtmEventOfType('shippingCountry').then((event) => {
        expect(event.shippableCountry).to.equal(false)
        expect(event.shippingCountry).to.equal('France')
        expect(event.platform).to.equal('monty')
      })

      deliveryPage.clickRedirectModalContinueButton()

      cy.location('hostname').should('contain', 'm.de.topshop.com')
      // TODO the following assertion is not possible as we have no non-UK site built in Jenkins
      // See https://arcadiagroup.atlassian.net/browse/OE-2039
      // cy.location('hostname').should('contain', 'm.fr.topshop.com')
    })

    it('should give the user the option to close modal and cancel their selection', () => {
      deliveryPaymentPage.clickAddNewAddress()
      deliveryPage
        .selectDeliveryCountry('France')
        .clickRedirectModalCancelButton()
      cy.url().should('contain', 'm.topshop.com')
      cy.get(deliveryPage.selectedCountryOption).should(
        'have.text',
        'United Kingdom'
      )
    })
  })
}
