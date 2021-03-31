export default class QuickView {
  get modal() {
    return '.ProduckQuickview'
  }

  get swatches() {
    return '.ProductQuickview .SwatchList-cell'
  }

  get closingButton() {
    return 'button.Modal-closeIcon'
  }

  get loadingSpinner() {
    return '.Modal .Loader'
  }

  get addToBagBtn() {
    return '.ProductQuickview .AddToBag > button'
  }

  get inlineConfirm() {
    return '.InlineConfirm'
  }

  get quantitySelector() {
    return 'div.ProductQuickview-sizeAndQuantity > div.ProductQuantity'
  }

  selectTile(position) {
    cy.get(
      `div.ProductSizes.ProductSizes--pdp.ProductSizes--sizeGuideBox > div > button:nth-child(${position}) > span`
    ).click()
    return this
  }

  selectSwatch(index) {
    cy.get(this.swatches)
      .eq(index)
      .click()

    return this
  }

  clickAddToBag() {
    cy.get(this.addToBagBtn)
      .click()
      .wait(2000)
    return this
  }

  selectClosingButton(index) {
    cy.get(this.closingButton)
      .eq(index)
      .click()

    return this
  }

  inlineConfirmIsVisible() {
    cy.get(this.inlineConfirm)

    return this
  }

  expectToNotBeLoading() {
    cy.get(this.loadingSpinner).should('not.be.visible')

    return this
  }

  expectQuantitySelectorNotToBeVisible() {
    cy.get(this.quantitySelector).should('not.be.visible')
  }
}
