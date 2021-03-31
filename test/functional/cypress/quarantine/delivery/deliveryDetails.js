import { setupMocksForCheckout } from '../../lib/helpers'
import DeliveryPage from '../../page-objects/checkout/Delivery.page'
import checkoutProfileNewUser from '../../fixtures/checkout/account--newUser.json'
import orderSummaryNewUser from '../../fixtures/checkout/order_summary---newUserSingleSizeProd.json'
import routes from '../../constants/routes'

const deliveryPage = new DeliveryPage()

describe('Delivery Details Form', () => {
  it('should return an error message if the postcode is invalid for the selected Delivery Country', () => {
    const deliveryAddress = {
      ...orderSummaryNewUser,
      shippingCountry: 'India',
    }
    setupMocksForCheckout(orderSummaryNewUser, checkoutProfileNewUser)
    cy.visit('checkout/delivery')
    cy.route('PUT', routes.checkout.orderSummary, deliveryAddress).as(
      'orderSummaryCheckout'
    )
    deliveryPage.enterDeliveryDetailsFindAddress('India')
    cy.wait('@orderSummaryCheckout').then(() => {
      cy.wait(600)
      const errorMessage = deliveryPage.getFindAddressErrorMessage()
      errorMessage
        .should('be.visible')
        .and(
          'have.text',
          'We are unable to find your address at the moment. Please enter your address manually.'
        )
    })
  })

  // NOTE: the list of configured countries is configurable by the brands and so may change
  // The following code relies on tsuk having the UK set up for delivery but NOT France or Ireland

  describe('when the user selects a country which is valid for delivery from the current site', () => {
    it('should not redirect user', () => {
      setupMocksForCheckout(orderSummaryNewUser, checkoutProfileNewUser)
      cy.visit('checkout/delivery')
      cy.route('PUT', routes.checkout.orderSummary, orderSummaryNewUser).as(
        'orderSummaryCheckout'
      )
      deliveryPage.selectDeliveryCountry('United Kingdom')
      cy.get(deliveryPage.shippingRedirectModal).should('not.be.visible')
    })
  })

  describe('when the user selects a country which is NOT valid for delivery from the current site', () => {
    it('should only offer the user one redirection option if the country they have selected is a single language country', () => {
      setupMocksForCheckout(orderSummaryNewUser, checkoutProfileNewUser)
      cy.visit('checkout/delivery')
      cy.route('PUT', routes.checkout.orderSummary, orderSummaryNewUser).as(
        'orderSummaryCheckout'
      )
      deliveryPage.selectDeliveryCountry('United States')
      cy.get(deliveryPage.languageOptionButtons)
        .should('have.length', 1)
        .and('have.text', 'Continue')
      deliveryPage.clickRedirectModalContinueButton()
      cy.location('hostname').should('contain', 'm.us.topshop.com')
    })

    it('should offer the user three redirection options if the country they have selected is a multi language country', () => {
      setupMocksForCheckout(orderSummaryNewUser, checkoutProfileNewUser)
      cy.visit('checkout/delivery')
      cy.route('PUT', routes.checkout.orderSummary, orderSummaryNewUser).as(
        'orderSummaryCheckout'
      )
      deliveryPage.selectDeliveryCountry('France')
      cy.get(deliveryPage.languageOptionButtons).should('have.length', 3)
      deliveryPage.clickRedirectModalFrenchButton()
      cy.location('hostname').should('contain', 'm.fr.topshop.com')
    })

    it('should give the user the option to close modal and undo their invalid selection', () => {
      setupMocksForCheckout(orderSummaryNewUser, checkoutProfileNewUser)
      cy.visit('checkout/delivery')
      cy.route('PUT', routes.checkout.orderSummary, orderSummaryNewUser).as(
        'orderSummaryCheckout'
      )
      deliveryPage.selectDeliveryCountry('France')
      deliveryPage.clickRedirectModalCancelButton()
      cy.url().should('contain', 'm.topshop.com')
      cy.get(deliveryPage.selectedCountryOption).should(
        'have.text',
        'United Kingdom'
      )
    })
  })
})
