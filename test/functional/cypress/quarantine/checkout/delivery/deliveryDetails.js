import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import orderSummaryNewUser from '../../../fixtures/checkout/order_summary---newUserSingleSizeProd.json'
import checkoutProfileNewUserEmpty from '../../../fixtures/checkout/account--newUserEmpty.json'
import bagTransfer from '../../../fixtures/checkout/shopping_bag---transfer.json'
import orderSummaryTransfer from '../../../fixtures/checkout/order_summary---bagTransferUS.json'
import getLastGtmEventOfType from '../../../lib/getLastGtmEventOfType'
import { isMobileLayout } from '../../../lib/helpers'

const deliveryPage = new DeliveryPage()

if (isMobileLayout()) {
  describe('Delivery Details Form', () => {
    it('should return an error message if the postcode is invalid for the selected Delivery Country', () => {
      const deliveryAddress = {
        ...orderSummaryNewUser,
        shippingCountry: 'India',
      }
      deliveryPage.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        getAccount: checkoutProfileNewUserEmpty,
        getOrderSummary: orderSummaryNewUser,
        putOrderSummary: deliveryAddress,
        searchAddressByCountryCode: '[]',
        countryCode: 'IND**',
      })
      cy.visit('checkout/delivery')

      deliveryPage.enterDeliveryDetailsFindAddress('India')
      cy.wait('@put-order-summary')
      cy.get(deliveryPage.findAddressButton)
        .click()
        .wait('@find-address-cnty')

      const errorMessage = deliveryPage.getFindAddressErrorMessage()
      errorMessage
        .should('exist')
        .and(
          'have.text',
          'We are unable to find your address at the moment. Please enter your address manually.'
        )
    })
  })

  describe('Delivery country redirections', () => {
    beforeEach(() => {
      deliveryPage.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        getAccount: checkoutProfileNewUserEmpty,
        getOrderSummary: orderSummaryNewUser,
        putOrderSummary: orderSummaryNewUser,
      })
      deliveryPage.mocksForShoppingBag({
        postBagTransfer: bagTransfer,
        getItems: orderSummaryTransfer,
      })
      cy.visit('checkout/delivery')
    })

    it('should not redirect when user selects a valid delivery country from the current site', () => {
      deliveryPage.selectDeliveryCountry('United Kingdom')
      cy.get(deliveryPage.shippingRedirectModal).should('not.be.visible')
    })

    it('should only offer the user one redirection option if the country they have selected is a single language country', () => {
      deliveryPage
        .selectDeliveryCountry('United States')
        .assertLanquageOptions(1)
        .clickRedirectModalContinueButton()
      // TODO the following assertion is not possible as we have no non-UK site built in Jenkins
      // See https://arcadiagroup.atlassian.net/browse/OE-2039
      // cy.location('hostname').should('contain', 'm.us.topshop.com')
    })

    it('should offer the user three redirection options if the country they have selected is a multi language country', () => {
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
