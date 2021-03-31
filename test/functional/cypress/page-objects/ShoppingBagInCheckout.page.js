import { isMobileLayout } from '../lib/helpers'

export default class ShoppingBagInCheckout {
  get ProductsInShoppingBag() {
    return '.CheckoutContainer .CheckoutBagSide .OrderProducts-product'
  }
  get removeItemButton() {
    return isMobileLayout()
      ? '.CheckoutMiniBag .OrderProducts-deleteText'
      : '.CheckoutContainer .CheckoutBagSide .OrderProducts-deleteText'
  }
  get removeItemModalConfirm() {
    return '.Modal .OrderProducts-deleteButton'
  }

  removeItemAtIndex(index) {
    return cy
      .get(this.removeItemButton)
      .eq(index)
      .click()
      .get(this.removeItemModalConfirm)
      .click()
  }

  assertNumberOfProductsInBag(count) {
    return cy.get(this.ProductsInShoppingBag).should('have.length', count)
  }
}
