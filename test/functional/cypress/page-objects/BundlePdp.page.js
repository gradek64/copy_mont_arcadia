import Pdp from './Pdp.page'

export default class flexibleBundle extends Pdp {
  get miniproduct() {
    return '.MiniProduct-details'
  }
  get miniproductErrorMessage() {
    return '.BundlesSizes-error'
  }

  get bundleItemWasPrice() {
    return '.HistoricalPrice-old .Price'
  }

  get bundleItemNowPrice() {
    return '.HistoricalPrice-promotion .Price'
  }

  get bundleTotalPrice() {
    return '.Bundles-price .Price'
  }

  wait(wait) {
    cy.wait(wait)
    return this
  }

  /**
   * USER ACTIONS **************************************************************
   */
  assertNumberOfProducts(numberExpected) {
    cy.get(this.miniproduct).should('have.length', numberExpected)
    return this
  }

  assertNumberOfAddToBagButtons(numberExpected) {
    cy.get(this.addToBagButton).should('have.length', numberExpected)
    return this
  }

  selectAvailableSizeForBundleItem(number, text) {
    cy.get(this.sizeSelectionDropdown)
      .eq(number - 1)
      .select(text)
    return this
  }

  expectErrorToAlsoSelectProduct(number) {
    cy.get(this.miniproduct)
      .eq(number - 1)
      .get(this.miniproductErrorMessage)
    return this
  }

  assertBundleItemWasNowPrices(item, was, now) {
    cy.contains(this.miniproduct, item)
      .find(this.bundleItemWasPrice)
      .should('contain', was)
    cy.contains(this.miniproduct, item)
      .find(this.bundleItemNowPrice)
      .should('contain', now)
    return this
  }

  assertBundleTotalPrice(price) {
    cy.get(this.bundleTotalPrice).should('contain', price)
    return this
  }
}
