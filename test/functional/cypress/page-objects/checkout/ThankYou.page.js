export default class ThankYou {
  get continueShoppingButton() {
    return 'button.OrderCompleteButton-button'
  }

  get ProductsInShoppingBag() {
    return '.OrderProducts-product'
  }
  get SizeLabelInShoppingBag() {
    return '.CheckoutContainer p.OrderProducts-productSize'
  }

  assertContinueShoppingOnThankYouPage() {
    cy.get(this.continueShoppingButton)
      .should('be.visible')
      .should('have.text', 'Continue Shopping')
  }

  get ddpOrderCompleteConfirmationMessage() {
    return '.OrderCompleteDelivery-ddpSubscription'
  }

  get myAccountLink() {
    return '.OrderCompleteDelivery-ddpSubscription > a'
  }
}
